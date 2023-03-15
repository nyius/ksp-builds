// require('babel-register');
// import {} from 'babel-register';

// const router = require('../routes/SiteMapRoutes');
// const Sitemap = require('react-router-sitemap');
// // import Sitemap from 'react-router-sitemap';

// function generateSitemap() {
// 	return new Sitemap(router).build('https://www.kspbuilds.com').save('../../public/sitemap.xml');
// }

// generateSitemap();
const buildSitemap = require('react-sitemap-stevedevops');
const path = require('path');

const currentPath = path.resolve(__dirname);
const siteDomain = 'https://www.kspbuilds.com';
console.log(currentPath);

buildSitemap(`${currentPath}/routes/SiteMapRoutes.js`, 'public', siteDomain);
