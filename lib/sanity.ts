const sanityClient = require('@sanity/client');
export const client = sanityClient({
    projectId:'rxbqzvm2',
    dataset:'production',
    apiVersion:'2022-03-12',
    token:process.env.SANITY_TOKEN,
    useCdn:false
});