define('wp/mediavoice',['jQuery', 'utils' ], function($, utils){


// This file is ignored completely by JSHint when running grunt.
// If you run into issues, make sure your linter is validating locally
// before getting too mad about stuff.

  return {

    loaded: false,

    secondaryPage: !!(/sf\/brand-connect/.test(window.location.pathname)),

    load: function(){

      if (/test_ads=bcforever/i.test(top.location.href)) {
        return false;
      }

      var pos = 'brandconnect_module';
      var cn = window.commercialNode || 'politics';
      var selector = '#slug_' + pos;
      var test_kw = window.wpAd && window.wpAd.flags && window.wpAd.flags.test_ads;

      //kw targetting:
      var targets = {
        "pos": "brandconnect"
      };

      //add test kw if applicable
      if(test_kw){
        targets.kw = 'test_' + test_kw;
      }

      window.NATIVEADS = window.NATIVEADS || {};
      window.NATIVEADS.injectedAt = new Date().getTime();
      window.NATIVEADS.onReady = function(ads) {

        ads.setPropertyID("NA-WASHPOST-11235836");
        // ads.enableMOAT(true, true);
        ads.setSecondaryPageURL("/sf/brand-connect/");

        // ---- this was old non-responsive homepage, now it's old non-responsive sectionfronts (opinions) ---
        ads.insertPreview({
          label: "Old sectionfronts",
          unit: {"server":"dfp","id":"/701/wpni." + cn,"size":"1x8","targets":targets},
          location: selector,
          infoText: "This content is sponsored and made possible by the brand, who paid us to place this story or link. It was not written by our editorial staff and does not necessarily reflect our views. Our staff has reviewed it to ensure the highest quality content.",
          infoButtonText: "?",
          template: compiledTemplate0,
          onRender: function($element) {
            if(window.commercialNode === 'opinions/front'){
              utils.log('mediavoice on opinions');
              $element.parent().css('display','block');
              $(selector).hide();
            }
          },
          onFill: function(data) {
            console.log(data);
          },
          onError: function(error) {
            console.log("Mediavoice Render Error: " + error);
            $(selector).parents('.brand-connect-stream').hide();
            $(selector).parents('.module.brand-connect').hide();
          }
        });

        ads.insertPreview({
          label: "Homepage PB",
          unit: {"server":"dfp","id":"/701/wpni." + cn,"size":"1x8","targets":targets},
          location: '#slug_bc_pb_homepage',
          // infoText: "This content is sponsored and made possible by the brand, who paid us to place this story or link. It was not written by our editorial staff and does not necessarily reflect our views. Our staff has reviewed it to ensure the highest quality content.",
          // infoButtonText: "?",
          template: pbHomepageTemplate,
          onRender: function($element) {
            $('#brandconnect-pb-homepage').parent().addClass('brandconnect-pb-divider');

          },
          onFill: function(data) {
            if(window.commercialNode === 'readlater') {
              return false;
            }
            console.log(data.custom);
            if(data.custom.has_video === "false") {
              delete data.custom.has_video;
            }
            console.log(data);
          },
          onError: function(error) {
            console.log("Mediavoice Render Error: " + error);
            $(selector).parents('.brand-connect-stream').hide();
            $(selector).parents('.module.brand-connect').hide();
          }
        });

        ads.insertPreview({
          label: "Article Page 300x250 Unit",
          unit: {
            "server":"dfp-gpt",
            "elementID": 'slug_inline_bb'
          },
          location: "#slug_inline_bb",
          template: inlineBB,
          onRender: function($element) { 
            $('#slug_inline_bb').remove();
            var imgSrc = $element.find(".bc-image img").attr("src");
            $element.find(".bc-image").attr("style", "background-image: url(" + imgSrc + ")");
            $element.wrap('<div class="brandconnect-inline-wrapper"></div>');
          },
          onFill: function(data) { 
            $('#slug_inline_bb').css({'color':'#fff'});
            $('#slug_inline_bb').hide();

          },
          onError: function(error) {}
        });
        
        var magnet_targets = {
          "pos": "brandconnect_magnet"
        }
        if (!!($('.pb-module-area').length)) {
          magnet_targets.mag = $('.pb-module-area').data().formattedTag
        }
        if(test_kw){
          magnet_targets.kw = 'test_' + test_kw;
        }
        
        ads.insertPreview({
          label: "Magnet Unit",
          unit: {
            "server":"dfp",
            "id":"/701/wpni." + cn,
            "size":"1x8",
            "targets": magnet_targets
          },
          location: '.pb-local-content.pb-magnet-item:nth-of-type(6)',
          infoText: "This content is sponsored and made possible by the brand, who paid us to place this story or link. It was not written by our editorial staff and does not necessarily reflect our views. Our staff has reviewed it to ensure the highest quality content.",
          infoButtonText: "?",
          template: pbMagnetAd,
          onRender: function($element) {},
          onFill: function(data) {},
          onError: function(error) {
            console.log("Mediavoice Render Error: " + error);
          }
        });
        
        ads.insertPreview({
          label: "Article Page Trending Unit",
          unit: {
            "server":"dfp-gpt",
            "elementID": 'slug_trending_module'
          },
          location: "#slug_trending_module",
          template: compiledTemplate3,
          onRender: function($element) {
            $('#slug_trending_module').hide()
          },
          onFill: function(data) { },
          onError: function(error) {
            console.log("Mediavoice Render Error: " + error);
          }
        });

        //promo on sectionfronts
        ads.insertPreview({
          label: "PB Front Promo Unit",
          unit: {
            "server":"dfp",
            "id":"/701/wpni." + cn,
            "size":"1x8",
            // "elementID" : 'slug_brandconnect_front',
            "targets":targets
          },
          location: "#slug_brandconnect_front",
          template: pbFrontTemplate,
          onRender: function($element) {
            $('#brandconnect-pb-front').after('<div class="divider"></div>');
          },
          onFill: function(data) {
          },
          onError: function(error) {
          }
        });


        ads.insertPreview({
          label: "Flex desktop & mobile 300x600",
          unit: {
            "server":"dfp-gpt",
            "id":"/701/wpni." + cn,
            "size":"300x600",
            "elementID" : 'slug_flex_ss_bb_hp',
            // "targets":targets
          },
          location: "#slug_flex_ss_bb_hp",
          template: flexAd,
          onRender: function($element) {
          },
          onFill: function(data) {
          },
          onError: function(error) {
          }
        });

        ads.configureSecondaryPage({
          track: function () {
            if (!!(/sf\/brand-connect/.test(window.location.pathname))) {
              return "inbound";
            }
          },
          binding: {
            sponsor: {
              link: "#sponsor-link",
              logo: "#sponsor-logo",
              name: "#sponsor-name"
            },
            title: "#title",
            summary: "#summary",
            content: "#content",
            author: "#author",
            pubDate: "#pub-date",
            image: {
              href: "#media",
              caption: "#media-caption",
              credits: "#media-credits"
            }
          },
          onRender: function() { },
          onError: function(error) { }

        });

      };

/* jshint ignore:start */

        compiledTemplate0 = function (Handlebars,depth0,helpers,partials,data) {
          this.compilerInfo = [4,'>= 1.0.0'];
          helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
          var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

          function program1(depth0,data) {
            
            var buffer = "", stack1;
            buffer += "<img src=\""
            + escapeExpression(((stack1 = ((stack1 = depth0.image),stack1 == null || stack1 === false ? stack1 : stack1.href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
            + "\" height=\"60\" width=\"90\" class=\"bc-image\"/>";
            return buffer;
          }

          buffer += "<div class=\"brand-connect-container bc-homepage\">\n    <div class=\"bc-homepage-container\">\n      <span class=\"bc-heading\">Sponsor-Generated Content</span>\n      <a href=\"";
          if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
          else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
          buffer += escapeExpression(stack1)
          + "\">\n        <span class=\"bc-title\">";
          if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
          else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
          buffer += escapeExpression(stack1)
          + "</span>\n        <div>\n          ";
          stack2 = helpers['if'].call(depth0, ((stack1 = depth0.image),stack1 == null || stack1 === false ? stack1 : stack1.href), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
          if(stack2 || stack2 === 0) { buffer += stack2; }
          buffer += "\n          <span class=\"bc-byline\">by "
          + escapeExpression(((stack1 = ((stack1 = depth0.sponsor),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
          + "</span>\n          <span class=\"bc-blurb\">";
          if (stack2 = helpers.summary) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
          else { stack2 = depth0.summary; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
          buffer += escapeExpression(stack2)
          + "</span>\n        </div>  \n      </a>\n      <i class=\"info-icon\"></i>\n      <span class=\"bc-info-popup\">BrandConnect» is content provided by our advertisers. <a href=\"http://www.washingtonpost.com/sf/brand-connect/\" rel=\"nofollow\">Learn more.</a></span>\n    </div>\n  </div>";
          return buffer;
        };


        /** inlineBB source

        <div class="brandconnect-inline-wrapper">
        <div class="brand-connect-container bc-inline desktop">
          <div class="bc-image" style="background-image: url({{getThumbHref width=900 height=800}})"><img src="{{getThumbHref width=900 height=800}}" style="display:none" height="600" width="900">
            <a href="{{link}}" rel="nofollow"></a>
          </div>
          <div class="bc-inline-container">
            <span class="bc-heading">CONTENT FROM {{sponsor.name}}</span>
            <a href="{{link}}" rel="nofollow">
              <span class="bc-title">{{title}}</span>
              <div>
                <span class="bc-blurb">{{summary}}</span>
              </div>  
            </a>
            <i class="info-icon"></i>
            <span class="bc-info-popup">BrandConnect» is content provided by our advertisers. <a href="http://www.washingtonpost.com/sf/brand-connect/" rel="nofollow">Learn more.</a></span>
          </div>
        </div>
        </div>

        **/

        inlineBB = function (Handlebars,depth0,helpers,partials,data) {  this.compilerInfo = [4,'>= 1.0.0'];helpers = this.merge(helpers, Handlebars.helpers); data = data || {};  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";  buffer += "<div class=\"brandconnect-inline-wrapper\">\n        <div class=\"brand-connect-container bc-inline desktop\">\n          <div class=\"bc-image\" style=\"background-image: url(";  options = {hash:{    'width': (900),    'height': (800)  },data:data};  buffer += escapeExpression(((stack1 = helpers.getThumbHref || depth0.getThumbHref),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "getThumbHref", options)))    + ")\"><img src=\"";  options = {hash:{    'width': (900),    'height': (800)  },data:data};  buffer += escapeExpression(((stack1 = helpers.getThumbHref || depth0.getThumbHref),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "getThumbHref", options)))    + "\" style=\"display:none\" height=\"600\" width=\"900\">\n            <a href=\"";  if (stack2 = helpers.link) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.link; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "\" rel=\"nofollow\"></a>\n          </div>\n          <div class=\"bc-inline-container\">\n            <span class=\"bc-heading\">CONTENT FROM "    + escapeExpression(((stack1 = ((stack1 = depth0.sponsor),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))    + "</span>\n            <a href=\"";  if (stack2 = helpers.link) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.link; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "\" rel=\"nofollow\">\n              <span class=\"bc-title\">";  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</span>\n              <div>\n                <span class=\"bc-blurb\">";  if (stack2 = helpers.summary) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.summary; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</span>\n              </div>  \n            </a>\n            <i class=\"info-icon\"></i>\n            <span class=\"bc-info-popup\">BrandConnect» is content provided by our advertisers. <a href=\"http://www.washingtonpost.com/sf/brand-connect/\" rel=\"nofollow\">Learn more.</a></span>\n          </div>\n        </div>\n        </div>";  return buffer;  };



        //pb-magnet

        /*



        <div class="pb-local-content pb-magnet-item pb-magnet-article_story pb-magnet-sponsored" data-pb-magnet-first="false">
          <a class="pb-magnet-imglink" href="{{link}}" rel="nofollow">
            <img src="{{getThumbHref width=70 height=70}}" class="pb-magnet-article-image">
          </a>
          <div class="pb-magnet-headline" data-pb-local-content-field="title">
            <div class="sponsor-label">SPONSOR-GENERATED CONTENT</div>
            <a href="{{link}}" rel="nofollow">{{title}}</a>
          </div>
        </div>
        */
        
        pbMagnetAd = function (Handlebars,depth0,helpers,partials,data) {  this.compilerInfo = [4,'>= 1.0.0'];helpers = this.merge(helpers, Handlebars.helpers); data = data || {};  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;  buffer += "<div class=\"pb-local-content pb-magnet-item pb-magnet-article_story pb-magnet-sponsored\" data-pb-magnet-first=\"false\">\n  <a class=\"pb-magnet-imglink\" href=\"";  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }  buffer += escapeExpression(stack1)    + "\" rel=\"nofollow\">\n    <img src=\"";  options = {hash:{    'width': (70),    'height': (70)  },data:data};  buffer += escapeExpression(((stack1 = helpers.getThumbHref || depth0.getThumbHref),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "getThumbHref", options)))    + "\" class=\"pb-magnet-article-image\">\n  </a>\n  <div class=\"pb-magnet-headline\" data-pb-local-content-field=\"title\">\n    <div class=\"sponsor-label\">SPONSOR-GENERATED CONTENT</div>\n    <a href=\"";  if (stack2 = helpers.link) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.link; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "\" rel=\"nofollow\">";  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</a>\n  </div>\n</div>";  return buffer;  };
        
        compiledTemplate3 = function (Handlebars,depth0,helpers,partials,data) {
          this.compilerInfo = [4,'>= 1.0.0'];
        helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
          var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


          buffer += "<a href=\"";
          if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
          else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
          buffer += escapeExpression(stack1)
            + "\" target=\"_blank\" rel=\"nofollow\">\n  <div style=\"width: 192px; height: 128px; margin-bottom: 6px; overflow: hidden;\">\n    <img class=\"main-art unprocessed\" src=\""
            + escapeExpression(((stack1 = ((stack1 = depth0.image),stack1 == null || stack1 === false ? stack1 : stack1.href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
            + "\" data-low-res-src=\""
            + escapeExpression(((stack1 = ((stack1 = depth0.image),stack1 == null || stack1 === false ? stack1 : stack1.href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
            + "\" data-hi-res-src=\""
            + escapeExpression(((stack1 = ((stack1 = depth0.image),stack1 == null || stack1 === false ? stack1 : stack1.href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
            + "\" style=\"height:100%;width:100%;\">\n  </div>\n</a>\n<a href=\"";
          if (stack2 = helpers.link) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
          else { stack2 = depth0.link; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
          buffer += escapeExpression(stack2)
            + "\" target=\"_blank\">\n  <p class=\"heading heading3\">";
          if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
          else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
          buffer += escapeExpression(stack2)
            + "</p>\n</a>";
          return buffer;
        };

        /*** SOURCE FOR THIS TEMPLATE ****


        <div id="brandconnect-pb-front" class="desktop">
          <a href="{{link}}" target="_blank">
            <i class="info-icon"></i>
            <div class="bc-pb-text-wrapper">
              <h3 class="bc-heading">CONTENT FROM {{sponsor.name}}</h3>
              <h2 class="bc-pb-title" href="{{link}}">{{title}}</h2>
              <p class="bc-pb-summary">{{summary}}</p>
            </div>
            <div class="bc-pb-img-wrapper" style="background-image: url('{{getThumbHref width=800 height=800}}');"></div>
            <div class="bc-info">
              <span class="bc-info-popup">BrandConnect is content provided by our advertisers. Learn More.</span>
            </div>
          </a>
        </div>
      

        -- pb homepage --   
        <div id="brandconnect-pb-homepage" class="desktop">
          <a href="{{link}}">
            <div class="bc-info">
            <i class="info-icon"></i>
            <div class="bc-pb-img-wrapper">
              <img class="bc-pb-img" src="{{getThumbHref width=400 height=300}}">
              {{#if custom.has_video}}
              <div class="bc-playbutton-circle"></div>
              <div class="bc-playbutton-triangle"></div>
              {{/if}}
            </div>
            <div class="bc-pb-text-wrapper">
              <h3 class="bc-heading">CONTENT FROM {{sponsor.name}}</h3>
              <h2 class="bc-pb-title" href="{{link}}">{{title}}</h2>
              <p class="bc-pb-summary">{{summary}}</p>
            </div>
              <span class="bc-info-popup">BrandConnect is content provided by our advertisers.</span>
          </div>
          </a>
        </div>

        ***/


      pbFrontTemplate = function (Handlebars,depth0,helpers,partials,data) {  this.compilerInfo = [4,'>= 1.0.0'];helpers = this.merge(helpers, Handlebars.helpers); data = data || {};  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;  buffer += "<div id=\"brandconnect-pb-front\" class=\"desktop\">\n          <a href=\"";  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }  buffer += escapeExpression(stack1)    + "\" target=\"_blank\">\n            <i class=\"info-icon\"></i>\n            <div class=\"bc-pb-text-wrapper\">\n              <h3 class=\"bc-heading\">CONTENT FROM "    + escapeExpression(((stack1 = ((stack1 = depth0.sponsor),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))    + "</h3>\n              <h2 class=\"bc-pb-title\" href=\"";  if (stack2 = helpers.link) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.link; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "\">";  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</h2>\n              <p class=\"bc-pb-summary\">";  if (stack2 = helpers.summary) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.summary; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</p>\n            </div>\n            <div class=\"bc-pb-img-wrapper\" style=\"background-image: url('";  options = {hash:{    'width': (800),    'height': (800)  },data:data};  buffer += escapeExpression(((stack1 = helpers.getThumbHref || depth0.getThumbHref),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "getThumbHref", options)))    + "');\"></div>\n            <div class=\"bc-info\">\n              <span class=\"bc-info-popup\">BrandConnect is content provided by our advertisers. Learn More.</span>\n            </div>\n          </a>\n        </div>";  return buffer;  };

      pbHomepageTemplate = function (Handlebars,depth0,helpers,partials,data) {  this.compilerInfo = [4,'>= 1.0.0'];helpers = this.merge(helpers, Handlebars.helpers); data = data || {};  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;function program1(depth0,data) {      return "\n              <div class=\"bc-playbutton-circle\"></div>\n              <div class=\"bc-playbutton-triangle\"></div>\n              ";  }  buffer += "<div id=\"brandconnect-pb-homepage\" class=\"desktop\">\n          <a href=\"";  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }  buffer += escapeExpression(stack1)    + "\">\n            <div class=\"bc-info\">\n            <i class=\"info-icon\"></i>\n            <div class=\"bc-pb-img-wrapper\">\n              <img class=\"bc-pb-img\" src=\"";  options = {hash:{    'width': (400),    'height': (300)  },data:data};  buffer += escapeExpression(((stack1 = helpers.getThumbHref || depth0.getThumbHref),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "getThumbHref", options)))    + "\">\n              ";  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.custom),stack1 == null || stack1 === false ? stack1 : stack1.has_video), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});  if(stack2 || stack2 === 0) { buffer += stack2; }  buffer += "\n            </div>\n            <div class=\"bc-pb-text-wrapper\">\n              <h3 class=\"bc-heading\">CONTENT FROM "    + escapeExpression(((stack1 = ((stack1 = depth0.sponsor),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))    + "</h3>\n              <h2 class=\"bc-pb-title\" href=\"";  if (stack2 = helpers.link) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.link; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "\">";  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</h2>\n              <p class=\"bc-pb-summary\">";  if (stack2 = helpers.summary) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.summary; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</p>\n            </div>\n              <span class=\"bc-info-popup\">BrandConnect is content provided by our advertisers.</span>\n          </div>\n          </a>\n        </div>";  return buffer;  };


      /*** template for this in desktop mediavoice.js ***/
      // this so far has never been run. so don't worry about it.
      flexAd = function (Handlebars,depth0,helpers,partials,data) {  this.compilerInfo = [4,'>= 1.0.0'];helpers = this.merge(helpers, Handlebars.helpers); data = data || {};  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;  buffer += "<div class=\"brand-connect-container desktop mobile flexad\">\n  <a href=\"";  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }  buffer += escapeExpression(stack1)    + "\" target=\"_blank\">\n  <div class=\"bc-bg-img\" style=\"background-image: url(";  options = {hash:{    'height': (400)  },data:data};  buffer += escapeExpression(((stack1 = helpers.getThumbHref || depth0.getThumbHref),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "getThumbHref", options)))    + ")\"></div>\n   <div class=\"bc-text-wrapper\">\n     <p class=\"bc-heading\">SPONSOR-GENERATED CONTENT</p>\n     <p class=\"bc-title\">";  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</p>\n     <p class=\"bc-byline\">By "    + escapeExpression(((stack1 = ((stack1 = depth0.sponsor),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))    + "</p>\n     <p class=\"bc-blurb\">";  if (stack2 = helpers.summary) { stack2 = stack2.call(depth0, {hash:{},data:data}); }  else { stack2 = depth0.summary; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }  buffer += escapeExpression(stack2)    + "</p>\n     <p class=\"bc-cta\">READ MORE</p>\n   </div>\n  </a>\n</div>";  return buffer;  };



/* jshint ignore:end */

        if($){
          $(selector).closest('.module.brand-connect, .brand-connect-stream').show(0);
        }

        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s);
          js.id = id; js.type = "text/javascript"; js.async = true;
          js.src = "//plugin.mediavoice.com/plugin.js";
          fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "nativeads-plugin");

      }

  };

});
