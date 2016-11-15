const seeds = require('./seed_data');

module.exports = {
  public: {
    published: seeds.find(seed => !seed.private && seed.published).id,
    draft: seeds.find(seed => !seed.private && !seed.published).id
  },
  private: {
    published: seeds.find(seed => seed.private && seed.published).id,
    draft: seeds.find(seed => seed.private && !seed.published).id
  },
  notFound: 'e65da3b0-0e8c-43da-91ad-5676e02fe77d',
  delete: '344ec277-466f-4657-8656-df159ede37ab'
};
