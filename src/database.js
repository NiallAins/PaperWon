let db;

async function dbInit() {
  let client = stitch.Stitch.initializeDefaultAppClient('paperwon-oldrd');
  db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('paperwon');
  await client.auth.loginWithCredential(new stitch.AnonymousCredential());
  return;
};

export default {
  getPaper: async (year, paper) => {
    if (!db) {
      await dbInit();
    }
    return db.collection('paperdata').find({
      year: year,
      paper: paper
    }).asArray();
  },
  getQuestion: async (year, paper, part) => {
    if (!db) {
      await dbInit();
    }
    return db.collecton('questions').find({
      year: year,
      paper: paper,
      part: part
    }).asArray();
  },
  getGraph: async (year, paper, part) => {
    return db.collecton('questions').find({
      year: year,
      paper: paper,
      part: part
    }).asArray();
  }
}