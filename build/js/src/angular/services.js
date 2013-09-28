app.service("searchService",["$http","$q","ptStorageService","ptSearchHelpers",function(a,b,c,d){var e=d,f=function(a){var d=b.defer(),f=a.title,g=parseInt(a.year)||null,h=c.options.cacheOptions,i=function(){e.getMovieNameRequest(f,g,function(b,c){if(b)return d.reject(b);var g={};return g[f]=c,e.getRatingOfMovie({selectedMovie:g,indexArr:a.indexArr,deferred:d,originalSearchString:f,cacheOptions:h})})};return h.cacheNames?c.get(f,!1,function(b){return b&&b[f]&&b[f].id?(b[f].origin="storage",e.getRatingOfMovie({selectedMovie:b,indexArr:a.indexArr,deferred:d,originalSearchString:f,cacheOptions:h})):i()}):i(),d.promise};return{searchIMDB:f}}]).service("ptSearchHelpers",["$http","ptStorageService","$rootScope",function(a,b,c){return{baseQueries:{getTitleURI:"http://www.imdb.com/xml/find?json=1&nr=1&tt=on&mx=1&q=",getRatingURI:"http://p.media-imdb.com/static-content/documents/v1/title/AAA/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json"},fillDbWithData:function(a,b,c){var d=["title_popular","title_substring","title_exact"];angular.forEach(d,function(b){a[b]=[]});for(var e=0;e<d.length;++e){var f=d[e];if(b[f]&&b[f].length)for(var g=0;g<b[f].length&&3>g;++g){var h=parseInt(b[f][g].description.substring(0,4));angular.isNumber(c)&&angular.isNumber(h)&&Math.abs(c-h)>1||a[f].push({id:b[f][g].id,title:b[f][g].title})}}},getMovieFromDbLogic:function(a){var b=a.title_popular&&a.title_popular[0];return b||(b=a.title_substring&&a.title_substring[0]),b||(b=a.title_exact&&a.title_exact[0]),b},getRatingOfMovie:function(a){var b=a.selectedMovie,c=a.originalSearchString,d=a.indexArr;angular.extend(b[c],{indexArr:d}),this.getRating(a)},getRating:function(d){var e=d.originalSearchString,f=d.deferred,g=d.selectedMovie[e],h=this.baseQueries.getRatingURI.replace("AAA",g.id),i="fresh"===g.origin;if(_.defer(function(){c.$apply()}),d.cacheOptions.cacheRatings&&g.ratingData&&g.ratingData.rating)return f.resolve(g);var j=function(a){if(a){var c=angular.copy(d.selectedMovie);c[e].origin="storage",c[e].indexArr=void 0,b.set(c,!1)}};return a.get(h).success(function(a){var b=JSON.parse(a.substring("imdb.rating.run(".length,a.length-1));b.resource?(g.ratingData={rating:b.resource.rating,year:b.resource.year,titleType:b.resource.titleType,ratingCount:b.resource.ratingCount,topRank:b.resource.topRank,updatedAt:Date.now()},j(!0),f.resolve(g)):(j(i),f.reject())}).error(function(a){j(i),f.reject(a)})},getMovieNameRequest:function(b,d,e){var f=this;_.defer(function(){c.$apply()}),a.get(f.baseQueries.getTitleURI+encodeURI(b)).success(function(a){var b={};f.fillDbWithData(b,a,d);var c=f.getMovieFromDbLogic(b);return c?(c.origin="fresh",c.updatedAt=Date.now(),e(null,c)):e("Failed to find a relevant movie name from response")}).error(function(a){e(a)})}}}]).service("ptStorageService",function(){var a={cacheOptions:{cacheNames:!0,cacheRatings:!1}},b=function(b){b=parseInt(b);var d=a.cacheOptions;b!==c()&&(2===b?d.cacheNames=d.cacheRatings=!0:1===b?(d.cacheNames=!0,d.cacheRatings=!1):d.cacheNames=d.cacheRatings=!1,_gaq.push(["_trackEvent","settingsChange","cacheOptions",b.toString()]),g(a,!0))},c=function(){var b=a.cacheOptions;return b.cacheNames&&b.cacheRatings?2:b.cacheNames?1:0},d=function(a){return a?chrome.storage.sync:chrome.storage.local},e=function(b){f("cacheOptions",!0,function(c){var d=a.cacheOptions;c&&c.cacheOptions?(d.cacheNames=c.cacheOptions.cacheNames||!1,d.cacheRatings=c.cacheOptions.cacheRatings||!1):g(a,!0),b(d)})},f=function(a,b,c){return angular.isFunction(c)||(c=angular.noop()),a&&a.length?(angular.isDefined(b)||(b=!1),d(b).get(a,c)):c()},g=function(a,b,c){return angular.isFunction(c)||(c=angular.noop()),a?(angular.isDefined(b)||(b=!1),d(b).set(a,c)):c()};return{get:f,set:g,getCacheOptionsFromStorage:e,getCacheOptionsAsValue:c,setCacheOptionsByValue:b,options:a}});