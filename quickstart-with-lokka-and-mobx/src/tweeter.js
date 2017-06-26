(function (exports) {
    'use strict';

    // Class
    let tweetParser,

    // functions
        extend,
        generateLink;

    extend = function (out) {
        out = out || {};

        for (let i = 1; i < arguments.length; i += 1) {
            if (arguments[i]) {
                for (let key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }
        }
        return out;
    };

    generateLink = function (url, className, target, text) {
        let link = document.createElement('a');
        link.href = url;
        link.classList.add(className);
        link.target = target;
        link.textContent = text;

        return link;
    };

    tweetParser = function (element, args) {
        let elt = document.querySelectorAll(element),
            parameters = extend({
                urlClass: 'tweet_link',
                userClass: 'tweet_user',
                hashtagClass: 'hashtag',
                target: '_blank',
                searchWithHashtags: true,
                parseUsers: true,
                parseHashtags: true,
                parseUrls: true
            }, args);

        Array.prototype.forEach.call(elt, el => {

            const REGEX_HASHTAG = /\B(#[á-úÁ-Úä-üÄ-Üa-zA-Z0-9_]+)/g; //regex for #hashtags

            let tweet = el.innerHTML,
                searchlink; //search link for hashtags

            //Hashtag Search link
            if (parameters.searchWithHashtags) {
                //this is the search with hashtag
                searchlink = "https://twitter.com/hashtag/";
            } else {
                //this is a more global search including hashtags and the word itself
                searchlink = "https://twitter.com/search?q=";
            }


            //turn #hashtags in the tweet into... working urls
            if (parameters.parseHashtags) {
                tweet = tweet.replace(REGEX_HASHTAG, function (hashtag) {
                    let hashtagOnly = hashtag.slice(1),
                        url = searchlink + hashtagOnly,
                        link = generateLink(url, parameters.hashtagClass, parameters.target, hashtag);

                    return hashtag.replace(hashtag, link.outerHTML);
                });
            }

            //then, it inject the last var into the element containing the tweet
            el.innerHTML = tweet;
        });
    };

    exports.tweetParser = tweetParser;
}(window));

/*global $, jQuery, tweetParser*/
if (window.jQuery) {
    (function ($, tweetParser) {
        'use strict';

        function tweetParserify(el, options) {
            tweetParser(el, options);
        }

        $.fn.tweetParser = function (options) {
            return tweetParserify(this.selector, options);
        };
    }(jQuery, tweetParser));
}
