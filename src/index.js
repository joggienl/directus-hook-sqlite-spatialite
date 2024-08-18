import { promisify } from 'node:util'

/** @typedef {import('knex').Knex} Knex */

/**
 * Sets pragma statements on a database connection.
 * @param {Knex} connection - Database connection.
 * @param {Object} logger - Logger instance.
 * @returns {Promise<void>}
 */
async function loadSpatialite(connection, logger) {
	const loadExtensionAsync = promisify(
		connection.loadExtension.bind(connection),
	)

	try {
		await loadExtensionAsync('mod_spatialite')
	} catch (error) {
		logger.error(error)
		throw error
	}
}

/**
 * Main function for setting up Spatialite extension for SQLite.
 * @param {Object} _ - Unused first argument.
 * @param {Object} params - Parameters.
 * @param {Object} params.database - Database object.
 * @param {Object} params.logger - Logger object.
 * @returns {Promise<void>}
 */
export default async function (_, { database, logger }) {
	// Skip if we are not using sqlite3;
	if (database.client.config.client !== 'sqlite3') return

	// Acquire our database pool
	const pool = database.client.pool
	const connections = []

	// Add event handler for new connections.
	pool.on('createSuccess', async (eventId, resource) => {
		logger.debug(`loading spatialite on new connection: ${eventId}`)
		try {
			await loadSpatialite(resource, logger)
			logger.debug('🔥 Spatialite loaded!')
		} catch (error) {
			logger.error(error)
		}
	})

	try {
		logger.debug(
			`Spatialite: try to acquire ${database.client.pool.max} connections!`,
		)
		for (let count = 0; count < database.client.pool.max; count += 1) {
			const acquire = pool.acquire()
			const conn = await acquire.promise
			connections.push(conn)
		}

		// Load extension!
		for (const conn of connections) {
			await loadSpatialite(conn, logger)
		}
		logger.debug('🔥 Spatialite loaded!')
		logger.info('Spatialite successfully loaded.')
	} catch (error) {
		// Handle the error.
		logger.error('Failed to load mod_spatialite.')
		logger.error(error instanceof Error ? error.message : error)
	} finally {
		// Release connections.
		for (const conn of connections) {
			pool.release(conn)
		}
	}
}
