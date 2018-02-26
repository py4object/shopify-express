const fetch = require('node-fetch');
let ShopifyApi = require('shopify-api-node');

module.exports = function withShop({ redirect } = { redirect: true }) {
  return async function verifyRequest(request, response, next) {
    const { query: { shop }, session } = request;
   
    if (session && session.accessToken) {
      try{
      const api =new ShopifyApi({
        shopName: session.shop,
        accessToken :session.accessToken
      });
      
        await api.shop.get();
        return next();
      }catch(err){
        session.accessToken = null;
        
        //the token is not valid, the store has been deleted;
      }
      
    }

    if (shop && redirect) {
      return response.redirect(`/auth/shopify?shop=${shop}`);
    }

    if (redirect) {
      return response.redirect('/auth/shopify');
    }

    return response.status(401).json('Unauthorized');
  };
};
