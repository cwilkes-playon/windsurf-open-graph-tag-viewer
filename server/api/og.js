import ogs from 'open-graph-scraper';

export default defineEventHandler(async (event) => {
  const url = getQuery(event).url;
  
  if (!url) {
    return { error: 'URL parameter is required' };
  }

  try {
    const options = {
      url,
      timeout: 5000,
    };

    const { error: ogsError, result } = await ogs(options);

    if (ogsError) {
      throw new Error(ogsError.message);
    }

    return result;
  } catch (err) {
    return { error: err.message };
  }
});
