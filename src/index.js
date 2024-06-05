export default ({ /* init */ }, { database, logger }) => {
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
