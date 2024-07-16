export default (_, { database, logger }) => {
	// Skip we are not using sqlite3;
	if (database.client.config.client !== 'sqlite3') return

	const pool = database.client.pool
	pool.acquire().promise.then(async (conn)=>{
		conn.loadExtension('mod_spatialite', (err) => {
			if (err) {
				logger.error(err.message)
			} else {
				logger.info('Spatialite successfully loaded.')
			}
		})
		pool.release(conn)
	})
};
