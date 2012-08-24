(function($){
    /**
     * @page jQuery.toJSON jQuery.toJSON
     * @parent jquerymx.lang
     * 
     *     jQuery.toJSON( json-serializble )
     * 
     * Converts the given argument into a JSON respresentation.
     * 
     * If an object has a "toJSON" function, that will 
     * be used to get the representation.
     * Non-integer/string keys are skipped in the 
     * object, as are keys that point to a function.
     * 
     * json-serializble:
     * The *thing* to be converted.
     */
    $.toJSON = function(o, replacer, space, recurse)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o, replacer, space);

        if (!recurse && $.isFunction(replacer))
            o = replacer("", o);

        if (typeof space == "number")
            space = "          ".substring(0, space);
        space = (typeof space == "string") ? space.substring(0, 10) : "";
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined" || type == "function")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON(), replacer, space, true );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            var process = ($.isFunction(replacer)) ?
                function (k, v) { return replacer(k, v); } :
                function (k, v) { return v; },
                nl = (space) ? "\n" : "",
                sp = (space) ? " " : "";

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push(( $.toJSON( process(i, o[i]), replacer, space, true ) || "null" ).replace(/^/gm, space));

                return "[" + nl + ret.join("," + nl) + nl + "]";
            }
        
            var pairs = [], proplist;
            if ($.isArray(replacer)) {
                proplist = $.map(replacer, function (v) {
                    return (typeof v == "string" || typeof v == "number") ?
                        v + "" :
                        null;
                });
            }
            for (var k in o) {
                var name, val, type = typeof k;

                if (proplist && $.inArray(k + "", proplist) == -1)
                    continue;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                val = $.toJSON( process(k, o[k]), replacer, space, true );
            
                if (typeof val == "undefined")
                    continue;  //skip pairs where the value is a function.
            
                pairs.push((name + ":" + sp + val).replace(/^/gm, space));
            }

            return "{" + nl + pairs.join("," + nl) + nl + "}";
        }
    };

    /** 
     * @function jQuery.evalJSON
     * Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** 
     * @function jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** 
     * @function jQuery.quoteString
     * 
     * Returns a string-repr of a string, escaping quotes intelligently.  
     * Mostly a support function for toJSON.
     * 
     * Examples:
     * 
     *      jQuery.quoteString("apple") //-> "apple"
     * 
     *      jQuery.quoteString('"Where are we going?", she asked.')
     *        // -> "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);
(function() {
    /**
     * @function jQuery.cookie
     * @parent jquerypp
     * @plugin jquery/dom/cookie
     * @author Klaus Hartl/klaus.hartl@stilbuero.de
     *
     * `jQuery.cookie(name, [value], [options])` lets you create, read and remove cookies. It is the
     * [jQuery cookie plugin](https://github.com/carhartl/jquery-cookie) written by [Klaus Hartl](stilbuero.de)
     * and dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php)
     * and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.
     *
	 * ## Examples
	 * 
	 * Set the value of a cookie.
	 *  
	 *      $.cookie('the_cookie', 'the_value');
	 * 
	 * Create a cookie with all available options.
	 *
     *      $.cookie('the_cookie', 'the_value', {
     *          expires: 7,
     *          path: '/',
     *          domain: 'jquery.com',
     *          secure: true
     *      });
	 *
	 * Create a session cookie.
	 *
     *      $.cookie('the_cookie', 'the_value');
	 *
	 * Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
	 * used when the cookie was set.
	 *
     *      $.cookie('the_cookie', null);
	 *
	 * Get the value of a cookie.
     *
	 *      $.cookie('the_cookie');
     *
     * @param {String} [name] The name of the cookie.
     * @param {String} [value] The value of the cookie.
     * @param {Object} [options] An object literal containing key/value pairs to provide optional cookie attributes. Values can be:
     *
     * - `expires` - Either an integer specifying the expiration date from now on in days or a Date object. If a negative value is specified (e.g. a date in the past), the cookie will be deleted. If set to null or omitted, the cookie will be a session cookie and will not be retained when the the browser exits.
     * - `domain` - The domain name
     * - `path` - The value of the path atribute of the cookie (default: path of page that created the cookie).
     * - `secure` - If true, the secure attribute of the cookie will be set and the cookie transmission will require a secure protocol (like HTTPS).
     *
     * @return {String} the value of the cookie or {undefined} when setting the cookie.
     */
    jQuery.cookie = function(name, value, options) {
        if (typeof value != 'undefined') {
            // name and value given, set cookie
            options = options ||
            {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
	        // convert value to JSON string
            if (typeof value == 'object' && jQuery.toJSON) {
                value = jQuery.toJSON(value);
            }
            var expires = '';
	        // Set expiry
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
	        // Set the cookie name=value;expires=;path=;domain=;secure-
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    // Get the cookie value
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
	        // Parse JSON from the cookie into an object
            if (jQuery.evalJSON && cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = jQuery.evalJSON(cookieValue);
                }
                catch (e) {
                }
            }
            return cookieValue;
        }
    };

})(jQuery);
(function( $ ) {
	var
		// use to parse bracket notation like my[name][attribute]
		keyBreaker = /[^\[\]]+/g,
		// converts values that look like numbers and booleans and removes empty strings
		convertValue = function( value ) {
			if ( $.isNumeric( value )) {
				return parseFloat( value );
			} else if ( value === 'true') {
				return true;
			} else if ( value === 'false' ) {
				return false;
			} else if ( value === '' ) {
				return undefined;
			}
			return value;
		},
		// Access nested data
		nestData = function( elem, type, data, parts, value, seen, fullName ) {
			var name = parts.shift();
			// Keep track of the dot separated fullname. Used to uniquely track seen values
			// and if they should be converted to an array or not
			fullName = fullName ? fullName + '.' + name : name;

			if (parts.length ) {
				if ( ! data[ name ] ) {
					data[ name ] = {};
				}

				// Recursive call
				nestData( elem, type, data[ name ], parts, value, seen, fullName);
			} else {

				// Handle same name case, as well as "last checkbox checked"
				// case
				if ( fullName in seen && type != "radio" && ! $.isArray( data[ name ] )) {
					if ( name in data ) {
						data[ name ] = [ data[name] ];
					} else {
						data[ name ] = [];
					}
				} else {
					seen[ fullName ] = true;
				}

				// Finally, assign data
				if ( ( type == "radio" || type == "checkbox" ) && ! elem.is(":checked") ) {
					return
				}

				if ( ! data[ name ] ) {
					data[ name ] = value;
				} else {
					data[ name ].push( value );
				}
				

			}

		};

	/**
	 * @function jQuery.fn.formParams
	 * @parent jQuery.formParams
	 * @plugin jquery/dom/form_params
	 * @test jquery/dom/form_params/qunit.html
	 *
	 * Returns a JavaScript object for values in a form.
	 * It creates nested objects by using bracket notation in the form element name.
	 *
	 * @param {Object} [params] If an object is passed, the form will be repopulated
	 * with the values of the object based on the name of the inputs within
	 * the form
	 * @param {Boolean} [convert=false] True if strings that look like numbers
	 * and booleans should be converted and if empty string should not be added
	 * to the result.
	 * @return {Object} An object of name-value pairs.
	 */
	$.fn.extend({
		formParams: function( params ) {

			var convert;

			// Quick way to determine if something is a boolean
			if ( !! params === params ) {
				convert = params;
				params = null;
			}

			if ( params ) {
				return this.setParams( params );
			} else {
				return this.getParams( convert );
			}
		},
		setParams: function( params ) {

			// Find all the inputs
			this.find("[name]").each(function() {
				
				var value = params[ $(this).attr("name") ],
					$this;
				
				// Don't do all this work if there's no value
				if ( value !== undefined ) {
					$this = $(this);
					
					// Nested these if statements for performance
					if ( $this.is(":radio") ) {
						if ( $this.val() == value ) {
							$this.attr("checked", true);
						}
					} else if ( $this.is(":checkbox") ) {
						// Convert single value to an array to reduce
						// complexity
						value = $.isArray( value ) ? value : [value];
						if ( $.inArray( $this.val(), value ) > -1) {
							$this.attr("checked", true);
						}
					} else {
						$this.val( value );
					}
				}
			});
		},
		getParams: function( convert ) {
			var data = {},
				// This is used to keep track of the checkbox names that we've
				// already seen, so we know that we should return an array if
				// we see it multiple times. Fixes last checkbox checked bug.
				seen = {},
				current;

			this.find("[name]:not(:disabled)").each(function() {
				var $this    = $(this),
					type     = $this.attr("type"),
					name     = $this.attr("name"),
					value    = $this.val(),
					parts;

				// Don't accumulate submit buttons and nameless elements
				if ( type == "submit" || ! name ) {
					return;
				}

				// Figure out name parts
				parts = name.match( keyBreaker );
				if ( ! parts.length ) {
					parts = [name];
				}

				// Convert the value
				if ( convert ) {
					value = convertValue( value );
				}

				// Assign data recursively
				nestData( $this, type, data, parts, value, seen );

			});

			return data;
		}
	});

})(jQuery);
(function($){
	var keymap = {},
		reverseKeyMap = {},
		currentBrowser = jQuery.uaMatch(navigator.userAgent).browser;
		
	/**
	 * @hide
	 * @parent jQuery.Event.prototype.key
	 * 
	 * Allows you to set alternate key maps or overwrite existing key codes.
	 * For example::
	 * 
	 *     $.event.key({"~" : 177});
	 * 
	 * @param {Object} map A map of character - keycode pairs.
	 */
	$.event.key = function(browser, map){
		if(browser === undefined) {
			return keymap;
		}

		if(map === undefined) {
			map = browser;
			browser = currentBrowser;
		}

		// extend the keymap
		if(!keymap[browser]) {
			keymap[browser] = {};
		}
		$.extend(keymap[browser], map);
		// and also update the reverse keymap
		if(!reverseKeyMap[browser]) {
			reverseKeyMap[browser] = {};
		}
		for(var name in map){
			reverseKeyMap[browser][map[name]] = name;
		}
	};
	
	$.event.key({
		// backspace
		'\b':'8',
		
		// tab
		'\t':'9',
		
		// enter
		'\r':'13',
		
		// special
		'shift':'16','ctrl':'17','alt':'18',
		
		// others
		'pause-break':'19',
		'caps':'20',
		'escape':'27',
		'num-lock':'144',
		'scroll-lock':'145',
		'print' : '44',
		
		// navigation
		'page-up':'33','page-down':'34','end':'35','home':'36',
		'left':'37','up':'38','right':'39','down':'40','insert':'45','delete':'46',
		
		// normal characters
		' ':'32',
		'0':'48','1':'49','2':'50','3':'51','4':'52','5':'53','6':'54','7':'55','8':'56','9':'57',
		'a':'65','b':'66','c':'67','d':'68','e':'69','f':'70','g':'71','h':'72','i':'73','j':'74','k':'75','l':'76','m':'77',
		'n':'78','o':'79','p':'80','q':'81','r':'82','s':'83','t':'84','u':'85','v':'86','w':'87','x':'88','y':'89','z':'90',
		// normal-characters, numpad
		'num0':'96','num1':'97','num2':'98','num3':'99','num4':'100','num5':'101','num6':'102','num7':'103','num8':'104','num9':'105',
		'*':'106','+':'107','-':'109','.':'110',
		// normal-characters, others
		'/':'111',
		';':'186',
		'=':'187',
		',':'188',
		'-':'189',
		'.':'190',
		'/':'191',
		'`':'192',
		'[':'219',
		'\\':'220',
		']':'221',
		"'":'222',
		
		// ignore these, you shouldn't use them
		'left window key':'91','right window key':'92','select key':'93',
		
		
		'f1':'112','f2':'113','f3':'114','f4':'115','f5':'116','f6':'117',
		'f7':'118','f8':'119','f9':'120','f10':'121','f11':'122','f12':'123'
	});
	
	/**
	 * @parent jQuery.event.key
	 * @plugin jquery/event/key
	 * @function jQuery.Event.prototype.keyName
	 *
	 * Returns a string representation of the key pressed:
	 *
	 *      $("input").on('keypress', function(ev){
	 *          if(ev.keyName() == 'ctrl') {
	 *              $(this).addClass('highlight');
	 *          }
	 *      });
	 *
	 * The key names mapped by default can be found in the [jQuery.event.key jQuery.event.key overview].
	 *
	 * @return {String} The string representation of of the key pressed.
	 */
	jQuery.Event.prototype.keyName  = function(){
		var event = this,
			test = /\w/,
			// It can be either keyCode or charCode.
			// Look both cases up in the reverse key map and converted to a string
			key_Key =  reverseKeyMap[currentBrowser][(event.keyCode || event.which)+""],
			char_Key =  String.fromCharCode(event.keyCode || event.which),
			key_Char =  event.charCode && reverseKeyMap[currentBrowser][event.charCode+""],
			char_Char = event.charCode && String.fromCharCode(event.charCode);
		
		if( char_Char && test.test(char_Char) ) {
			// string representation of event.charCode
			return char_Char.toLowerCase()
		}
		if( key_Char && test.test(key_Char) ) {
			// reverseKeyMap representation of event.charCode
			return char_Char.toLowerCase()
		}
		if( char_Key && test.test(char_Key) ) {
			// string representation of event.keyCode
			return char_Key.toLowerCase()
		}
		if( key_Key && test.test(key_Key) ) {
			// reverseKeyMap representation of event.keyCode
			return key_Key.toLowerCase()
		}

		if (event.type == 'keypress'){
			// keypress doesn't capture everything
			return event.keyCode ? String.fromCharCode(event.keyCode) : String.fromCharCode(event.which)
		}

		if (!event.keyCode && event.which) {
			// event.which
			return String.fromCharCode(event.which)
		}

		// default
		return reverseKeyMap[currentBrowser][event.keyCode+""]
	}
	
	
})(jQuery)