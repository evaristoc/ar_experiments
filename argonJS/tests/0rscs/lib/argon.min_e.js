! function (e)
{
	console.log(e);
	function t(e, t, r)
	{
		return 4 === arguments.length ? n.apply(this, arguments) : void i(e,
		{
			declarative: !0,
			deps: t,
			declare: r
		})
	}

	function n(e, t, n, r)
	{
		i(e,
		{
			declarative: !1,
			deps: t,
			executingRequire: n,
			execute: r
		})
	}

	function i(e, t)
	{
		t.name = e, e in p || (p[e] = t), t.normalizedDeps = t.deps
	}

	function r(e, t)
	{
		if (t[e.groupIndex] = t[e.groupIndex] || [], -1 == g.call(t[e.groupIndex], e))
		{
			t[e.groupIndex].push(e);
			for (var n = 0, i = e.normalizedDeps.length; i > n; n++)
			{
				var o = e.normalizedDeps[n],
					s = p[o];
				if (s && !s.evaluated)
				{
					var a = e.groupIndex + (s.declarative != e.declarative);
					if (void 0 === s.groupIndex || s.groupIndex < a)
					{
						if (void 0 !== s.groupIndex && (t[s.groupIndex].splice(g.call(t[s.groupIndex], s), 1), 0 == t[s.groupIndex].length)) throw new TypeError("Mixed dependency cycle detected");
						s.groupIndex = a
					}
					r(s, t)
				}
			}
		}
	}

	function o(e)
	{
		var t = p[e];
		t.groupIndex = 0;
		var n = [];
		r(t, n);
		for (var i = !!t.declarative == n.length % 2, o = n.length - 1; o >= 0; o--)
		{
			for (var s = n[o], u = 0; u < s.length; u++)
			{
				var l = s[u];
				i ? a(l) : c(l)
			}
			i = !i
		}
	}

	function s(e)
	{
		return v[e] || (v[e] = {
			name: e,
			dependencies: [],
			exports:
			{},
			importers: []
		})
	}

	function a(t)
	{
		if (!t.module)
		{
			var n = t.module = s(t.name),
				i = t.module.exports,
				r = t.declare.call(e, function (e, t)
				{
					if (n.locked = !0, "object" == typeof e)
						for (var r in e) i[r] = e[r];
					else i[e] = t;
					for (var o = 0, s = n.importers.length; s > o; o++)
					{
						var a = n.importers[o];
						if (!a.locked)
							for (var u = 0; u < a.dependencies.length; ++u) a.dependencies[u] === n && a.setters[u](i)
					}
					return n.locked = !1, t
				},
				{
					id: t.name
				});
			n.setters = r.setters, n.execute = r.execute;
			for (var o = 0, u = t.normalizedDeps.length; u > o; o++)
			{
				var c, l = t.normalizedDeps[o],
					h = p[l],
					d = v[l];
				d ? c = d.exports : h && !h.declarative ? c = h.esModule : h ? (a(h), d = h.module, c = d.exports) : c = f(l), d && d.importers ? (d.importers.push(n), n.dependencies.push(d)) : n.dependencies.push(null), n.setters[o] && n.setters[o](c)
			}
		}
	}

	function u(e)
	{
		var t, n = p[e];
		if (n) n.declarative ? d(e, []) : n.evaluated || c(n), t = n.module.exports;
		else if (!(t = f(e))) throw new Error("Unable to load dependency " + e + ".");
		return (!n || n.declarative) && t && t.__useDefault ? t.default : t
	}

	function c(t)
	{
		if (!t.module)
		{
			var n = {},
				i = t.module = {
					exports: n,
					id: t.name
				};
			if (!t.executingRequire)
				for (var r = 0, o = t.normalizedDeps.length; o > r; r++)
				{
					var s = t.normalizedDeps[r],
						a = p[s];
					a && c(a)
				}
			t.evaluated = !0;
			var h = t.execute.call(e, function (e)
			{
				for (var n = 0, i = t.deps.length; i > n; n++)
					if (t.deps[n] == e) return u(t.normalizedDeps[n]);
				throw new TypeError("Module " + e + " not declared as a dependency.")
			}, n, i);
			void 0 !== typeof h && (i.exports = h), (n = i.exports) && n.__esModule ? t.esModule = n : t.esModule = l(n)
		}
	}

	function l(t)
	{
		var n = {};
		if (("object" == typeof t || "function" == typeof t) && t !== e)
			if (y)
				for (var i in t) "default" !== i && h(n, t, i);
			else
			{
				var r = t && t.hasOwnProperty;
				for (var i in t) "default" === i || r && !t.hasOwnProperty(i) || (n[i] = t[i])
			}
		return n.default = t, M(n, "__useDefault",
		{
			value: !0
		}), n
	}

	function h(e, t, n)
	{
		try
		{
			var i;
			(i = Object.getOwnPropertyDescriptor(t, n)) && M(e, n, i)
		}
		catch (i)
		{
			return e[n] = t[n], !1
		}
	}

	function d(t, n)
	{
		var i = p[t];
		if (i && !i.evaluated && i.declarative)
		{
			n.push(t);
			for (var r = 0, o = i.normalizedDeps.length; o > r; r++)
			{
				var s = i.normalizedDeps[r]; - 1 == g.call(n, s) && (p[s] ? d(s, n) : f(s))
			}
			i.evaluated || (i.evaluated = !0, i.module.execute.call(e))
		}
	}

	function f(e)
	{
		if (E[e]) return E[e];
		if ("@node/" == e.substr(0, 6)) return E[e] = l(A(e.substr(6)));
		var t = p[e];
		if (!t) throw "Module " + e + " not present.";
		return o(e), d(e, []), p[e] = void 0, t.declarative && M(t.module.exports, "__esModule",
		{
			value: !0
		}), E[e] = t.declarative ? t.module.exports : t.esModule
	}
	var p = {},
		g = Array.prototype.indexOf || function (e)
		{
			for (var t = 0, n = this.length; n > t; t++)
				if (this[t] === e) return t;
			return -1
		},
		y = !0;
	try
	{
		Object.getOwnPropertyDescriptor(
		{
			a: 0
		}, "a")
	}
	catch (e)
	{
		y = !1
	}
	var M;
	! function ()
	{
		try
		{
			Object.defineProperty(
			{}, "a",
			{}) && (M = Object.defineProperty)
		}
		catch (e)
		{
			M = function (e, t, n)
			{
				try
				{
					e[t] = n.value || n.get.call(e)
				}
				catch (e)
				{}
			}
		}
	}();
	var v = {},
		A = "undefined" != typeof System && System._nodeRequire || "undefined" != typeof require && require.resolve && "undefined" != typeof process && require,
		E = {
			"@empty":
			{}
		};
	return function (e, i, r, o)
	{
		return function (s)
		{
			s(function (s)
			{
				for (var a = {
						_nodeRequire: A,
						register: t,
						registerDynamic: n,
						get: f,
						set: function (e, t)
						{
							E[e] = t
						},
						newModule: function (e)
						{
							return e
						}
					}, u = 0; u < i.length; u++) ! function (e, t)
				{
					t && t.__esModule ? E[e] = t : E[e] = l(t)
				}(i[u], arguments[u]);
				o(a);
				var c = f(e[0]);
				if (e.length > 1)
					for (u = 1; u < e.length; u++) f(e[u]);
				return r ? c.default : c
			})
		}
	}
}("undefined" != typeof self ? self : global)(["1"], [], !1, function (e)
{
	this.require;
	var t = this.exports,
		n = this.module;
	! function (t)
	{
		function n(e, t)
		{
			var n = ((e = e.replace(a, "")).match(l)[1].split(",")[t] || "require").replace(h, ""),
				i = d[n] || (d[n] = new RegExp(u + n + c, "g"));
			i.lastIndex = 0;
			for (var r, o = []; r = i.exec(e);) o.push(r[2] || r[3]);
			return o
		}

		function i(e, t, n, r)
		{
			if ("object" == typeof e && !(e instanceof Array)) return i.apply(null, Array.prototype.splice.call(arguments, 1, arguments.length - 1));
			if ("string" == typeof e && "function" == typeof t && (e = [e]), !(e instanceof Array))
			{
				if ("string" == typeof e)
				{
					var s = o.get(e);
					return s.__useDefault ? s.default : s
				}
				throw new TypeError("Invalid require")
			}
			for (var a = [], u = 0; u < e.length; u++) a.push(o.import(e[u], r));
			Promise.all(a).then(function (e)
			{
				t && t.apply(null, e)
			}, n)
		}

		function r(e, r, a)
		{
			"string" != typeof e && (a = r, r = e, e = null), r instanceof Array || (a = r, r = ["require", "exports", "module"].splice(0, a.length)), "function" != typeof a && (a = function (e)
			{
				return function ()
				{
					return e
				}
			}(a)), void 0 === r[r.length - 1] && r.pop();
			var u, c, l; - 1 != (u = s.call(r, "require")) && (r.splice(u, 1), e || (r = r.concat(n(a.toString(), u)))), -1 != (c = s.call(r, "exports")) && r.splice(c, 1), -1 != (l = s.call(r, "module")) && r.splice(l, 1);
			var h = {
				name: e,
				deps: r,
				execute: function (e, n, s)
				{
					for (var h = [], d = 0; d < r.length; d++) h.push(e(r[d]));
					s.uri = s.id, s.config = function () {}, -1 != l && h.splice(l, 0, s), -1 != c && h.splice(c, 0, n), -1 != u && h.splice(u, 0, function (t, n, r)
					{
						return "string" == typeof t && "function" != typeof n ? e(t) : i.call(o, t, n, r, s.id)
					});
					var f = a.apply(-1 == c ? t : n, h);
					return void 0 === f && s && (f = s.exports), void 0 !== f ? f : void 0
				}
			};
			if (e) f.anonDefine || f.isBundle ? f.anonDefine && f.anonDefine.name && (f.anonDefine = null) : f.anonDefine = h, f.isBundle = !0, o.registerDynamic(h.name, h.deps, !1, h.execute);
			else
			{
				if (f.anonDefine && !f.anonDefine.name) throw new Error("Multiple anonymous defines in module " + e);
				f.anonDefine = h
			}
		}
		var o = e,
			s = Array.prototype.indexOf || function (e)
			{
				for (var t = 0, n = this.length; n > t; t++)
					if (this[t] === e) return t;
				return -1
			},
			a = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,
			u = "(?:^|[^$_a-zA-Z\\xA0-\\uFFFF.])",
			c = "\\s*\\(\\s*(\"([^\"]+)\"|'([^']+)')\\s*\\)",
			l = /\(([^\)]*)\)/,
			h = /^\s+|\s+$/g,
			d = {};
		r.amd = {};
		var f = {
			isBundle: !1,
			anonDefine: null
		};
		o.amdDefine = r, o.amdRequire = i
	}("undefined" != typeof self ? self : global),
	function ()
	{
		(0, e.amdDefine)("2", ["exports", "3"], function (e, t)
		{
			"use strict";
			Number.isNaN = Number.isNaN || function (e)
				{
					return e !== e
				}, Number.isFinite = Number.isFinite || function (e)
				{
					return "number" == typeof e && isFinite(e)
				}, String.prototype.endsWith || (String.prototype.endsWith = function (e, t)
				{
					var n = this.toString();
					("number" != typeof t || !isFinite(t) || Math.floor(t) !== t || t > n.length) && (t = n.length), t -= e.length;
					var i = n.indexOf(e, t);
					return -1 !== i && i === t
				}), String.prototype.startsWith || (String.prototype.startsWith = function (e, t)
				{
					return t = t || 0, this.substr(t, e.length) === e
				}), Array.from || (Array.from = function ()
				{
					var e = Object.prototype.toString,
						t = function (t)
						{
							return "function" == typeof t || "[object Function]" === e.call(t)
						},
						n = function (e)
						{
							var t = Number(e);
							return isNaN(t) ? 0 : 0 !== t && isFinite(t) ? (t > 0 ? 1 : -1) * Math.floor(Math.abs(t)) : t
						},
						i = Math.pow(2, 53) - 1,
						r = function (e)
						{
							var t = n(e);
							return Math.min(Math.max(t, 0), i)
						};
					return function (e)
					{
						var n = this,
							i = Object(e);
						if (null == e) throw new TypeError("Array.from requires an array-like object - not null or undefined");
						var o, s = arguments.length > 1 ? arguments[1] : void 0;
						if (void 0 !== s)
						{
							if (!t(s)) throw new TypeError("Array.from: when provided, the second argument must be a function");
							arguments.length > 2 && (o = arguments[2])
						}
						for (var a, u = r(i.length), c = t(n) ? Object(new n(u)) : new Array(u), l = 0; l < u;) a = i[l], c[l] = s ? void 0 === o ? s(a, l) : s.call(o, a, l) : a, l += 1;
						return c.length = u, c
					}
				}()), Array.prototype.find || (Array.prototype.find = function (e)
				{
					if (null === this) throw new TypeError("Array.prototype.find called on null or undefined");
					if ("function" != typeof e) throw new TypeError("predicate must be a function");
					for (var t, n = Object(this), i = n.length >>> 0, r = arguments[1], o = 0; o < i; o++)
						if (t = n[o], e.call(r, t, o, n)) return t
				}), Array.prototype.findIndex || (Array.prototype.findIndex = function (e)
				{
					if (null === this) throw new TypeError("Array.prototype.findIndex called on null or undefined");
					if ("function" != typeof e) throw new TypeError("predicate must be a function");
					for (var t, n = Object(this), i = n.length >>> 0, r = arguments[1], o = 0; o < i; o++)
						if (t = n[o], e.call(r, t, o, n)) return o;
					return -1
				}), Array.prototype.includes || (Array.prototype.includes = function (e)
				{
					var t = Object(this),
						n = parseInt(t.length) || 0;
					if (0 === n) return !1;
					var i, r = parseInt(arguments[1]) || 0;
					r >= 0 ? i = r : (i = n + r) < 0 && (i = 0);
					for (var o; i < n;)
					{
						if (o = t[i], e === o || e !== e && o !== o) return !0;
						i++
					}
					return !1
				}), "function" != typeof Object.assign && (Object.assign = function (e)
				{
					if (void 0 === e || null === e) throw new TypeError("Cannot convert undefined or null to object");
					for (var t = Object(e), n = 1; n < arguments.length; n++)
					{
						var i = arguments[n];
						if (void 0 !== i && null !== i)
							for (var r in i) i.hasOwnProperty(r) && (t[r] = i[r])
					}
					return t
				}),
				function (e)
				{
					function t(e, t)
					{
						function i(e)
						{
							if (!this || this.constructor !== i) return new i(e);
							this._keys = [], this._values = [], this._itp = [], this.objectOnly = t, e && n.call(this, e)
						}
						return t || A(e, "size",
						{
							get: y
						}), e.constructor = i, i.prototype = e, i
					}

					function n(e)
					{
						this.add ? e.forEach(this.add, this) : e.forEach(function (e)
						{
							this.set(e[0], e[1])
						}, this)
					}

					function i(e)
					{
						return this.has(e) && (this._keys.splice(v, 1), this._values.splice(v, 1), this._itp.forEach(function (e)
						{
							v < e[0] && e[0]--
						})), -1 < v
					}

					function r(e)
					{
						return this.has(e) ? this._values[v] : void 0
					}

					function o(e, t)
					{
						if (this.objectOnly && t !== Object(t)) throw new TypeError("Invalid value used as weak collection key");
						if (t != t || 0 === t)
							for (v = e.length; v-- && !E(e[v], t););
						else v = e.indexOf(t);
						return -1 < v
					}

					function s(e)
					{
						return o.call(this, this._values, e)
					}

					function a(e)
					{
						return o.call(this, this._keys, e)
					}

					function u(e, t)
					{
						return this.has(e) ? this._values[v] = t : this._values[this._keys.push(e) - 1] = t, this
					}

					function c(e)
					{
						return this.has(e) || this._values.push(e), this
					}

					function l()
					{
						(this._keys || 0).length = this._values.length = 0
					}

					function h()
					{
						return g(this._itp, this._keys)
					}

					function d()
					{
						return g(this._itp, this._values)
					}

					function f()
					{
						return g(this._itp, this._keys, this._values)
					}

					function p()
					{
						return g(this._itp, this._values, this._values)
					}

					function g(e, t, n)
					{
						var i = [0],
							r = !1;
						return e.push(i),
						{
							next: function ()
							{
								var o, s = i[0];
								return !r && s < t.length ? (o = n ? [t[s], n[s]] : t[s], i[0]++) : (r = !0, e.splice(e.indexOf(i), 1)),
								{
									done: r,
									value: o
								}
							}
						}
					}

					function y()
					{
						return this._values.length
					}

					function M(e, t)
					{
						for (var n = this.entries();;)
						{
							var i = n.next();
							if (i.done) break;
							e.call(t, i.value[1], i.value[0], this)
						}
					}
					var v = void 0,
						A = Object.defineProperty,
						E = function (e, t)
						{
							return e === t || e !== e && t !== t
						};
					"undefined" != typeof Map && "function" == typeof (new Map).values && (new Map).values().next || (e.Map = t(
					{
						delete: i,
						has: a,
						get: r,
						set: u,
						keys: h,
						values: d,
						entries: f,
						forEach: M,
						clear: l
					})), "undefined" != typeof Set && "function" == typeof (new Set).values && (new Set).values().next || (e.Set = t(
					{
						has: s,
						add: c,
						delete: i,
						clear: l,
						keys: d,
						values: d,
						entries: p,
						forEach: M
					}))
				}(t.PLATFORM.global);
			var n = Object.freeze(
				{}),
				i = Function.prototype.bind;
			void 0 === t.PLATFORM.global.Reflect && (t.PLATFORM.global.Reflect = {}), "function" != typeof Reflect.getOwnMetadata && (Reflect.getOwnMetadata = function (e, t, i)
			{
				return ((t.__metadata__ || n)[i] || n)[e]
			}), "function" != typeof Reflect.defineMetadata && (Reflect.defineMetadata = function (e, t, n, i)
			{
				var r = n.hasOwnProperty("__metadata__") ? n.__metadata__ : n.__metadata__ = {};
				(r[i] || (r[i] = {}))[e] = t
			}), "function" != typeof Reflect.metadata && (Reflect.metadata = function (e, t)
			{
				return function (n, i)
				{
					Reflect.defineMetadata(e, t, n, i)
				}
			}), "function" != typeof Reflect.construct && (Reflect.construct = function (e, t)
			{
				if (t) switch (t.length)
				{
				case 0:
					return new e;
				case 1:
					return new e(t[0]);
				case 2:
					return new e(t[0], t[1]);
				case 3:
					return new e(t[0], t[1], t[2]);
				case 4:
					return new e(t[0], t[1], t[2], t[3])
				}
				var n = [null];
				return n.push.apply(n, t), new(i.apply(e, n))
			})
		})
	}(), e.register("3", [], function (e, t)
		{
			"use strict";

			function n(e, t, n)
			{
				if (t)
				{
					if (t.innerError && n) return t;
					var i = "\n------------------------------------------------\n";
					e += i + "Inner Error:\n", "string" == typeof t ? e += "Message: " + t : (t.message ? e += "Message: " + t.message : e += "Unknown Inner Error Type. Displaying Inner Error as JSON:\n " + JSON.stringify(t, null, "  "), t.stack && (e += "\nInner Error Stack:\n" + t.stack, e += "\nEnd Inner Error Stack")), e += i
				}
				var r = new Error(e);
				return t && (r.innerError = t), r
			}

			function i(e)
			{
				"function" != typeof Object.getPropertyDescriptor && (Object.getPropertyDescriptor = function (e, t)
				{
					for (var n = Object.getOwnPropertyDescriptor(e, t), i = Object.getPrototypeOf(e); void 0 === n && null !== i;) n = Object.getOwnPropertyDescriptor(i, t), i = Object.getPrototypeOf(i);
					return n
				}), e(o, r, s)
			}
			var r, o, s;
			return {
				setters: [],
				execute: function ()
				{
					e("FEATURE", r = {}), e("PLATFORM", o = {
						noop: function () {},
						eachModule: function () {}
					}), o.global = function ()
					{
						return "undefined" != typeof self ? self : "undefined" != typeof global ? global : new Function("return this")()
					}(), e("DOM", s = {}), e("AggregateError", n), e("FEATURE", r), e("PLATFORM", o), e("DOM", s), e("initializePAL", i)
				}
			}
		}),
		function ()
		{
			(0, e.amdDefine)("4", ["5", "6", "7", "8"], function (e, t, n, i)
			{
				"use strict";

				function r(e, t)
				{
					this._callback = void 0, this._isConstant = void 0, this._definitionChanged = new i, this.setCallback(e, t)
				}
				return t(r.prototype,
				{
					isConstant:
					{
						get: function ()
						{
							return this._isConstant
						}
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					}
				}), r.prototype.getValue = function (e, t)
				{
					return this._callback(e, t)
				}, r.prototype.setCallback = function (t, i)
				{
					if (!e(t)) throw new n("callback is required.");
					if (!e(i)) throw new n("isConstant is required.");
					var r = this._callback !== t || this._isConstant !== i;
					this._callback = t, this._isConstant = i, r && this._definitionChanged.raiseEvent(this)
				}, r.prototype.equals = function (e)
				{
					return this === e || e instanceof r && this._callback === e._callback && this._isConstant === e._isConstant
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("9", ["a", "5", "6", "b", "7", "c", "d", "e", "f", "10"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(e, n)
				{
					var i = e;
					return t(n) && (i += "+" + n), i
				}

				function h(t, n)
				{
					e.clone(t.distance.startPosition, n.distance.startPosition), e.clone(t.distance.endPosition, n.distance.endPosition), e.clone(t.angleAndHeight.startPosition, n.angleAndHeight.startPosition), e.clone(t.angleAndHeight.endPosition, n.angleAndHeight.endPosition)
				}

				function d(n, i, r)
				{
					var o = l(c.PINCH, i),
						s = n._update,
						a = n._isDown,
						d = n._eventStartPosition,
						f = n._pressTime,
						p = n._releaseTime;
					s[o] = !0, a[o] = !1, d[o] = new e;
					var g = n._movement[o];
					t(g) || (g = n._movement[o] = {}), g.distance = {
						startPosition: new e,
						endPosition: new e
					}, g.angleAndHeight = {
						startPosition: new e,
						endPosition: new e
					}, g.prevAngle = 0, n._eventHandler.setInputAction(function (t)
					{
						n._buttonsDown++, a[o] = !0, f[o] = new Date, e.lerp(t.position1, t.position2, .5, d[o])
					}, u.PINCH_START, i), n._eventHandler.setInputAction(function ()
					{
						n._buttonsDown = Math.max(n._buttonsDown - 1, 0), a[o] = !1, p[o] = new Date
					}, u.PINCH_END, i), n._eventHandler.setInputAction(function (t)
					{
						if (a[o])
						{
							s[o] ? (h(t, g), s[o] = !1, g.prevAngle = g.angleAndHeight.startPosition.x) : (e.clone(t.distance.endPosition, g.distance.endPosition), e.clone(t.angleAndHeight.endPosition, g.angleAndHeight.endPosition));
							for (var n = g.angleAndHeight.endPosition.x, i = g.prevAngle, u = 2 * Math.PI; n >= i + Math.PI;) n -= u;
							for (; n < i - Math.PI;) n += u;
							g.angleAndHeight.endPosition.x = -n * r.clientWidth / 12, g.angleAndHeight.startPosition.x = -i * r.clientWidth / 12
						}
					}, u.PINCH_MOVE, i)
				}

				function f(n, i)
				{
					var r = l(c.WHEEL, i),
						o = n._update;
					o[r] = !0;
					var a = n._movement[r];
					t(a) || (a = n._movement[r] = {}), a.startPosition = new e, a.endPosition = new e, n._eventHandler.setInputAction(function (t)
					{
						var n = 15 * s.toRadians(t);
						o[r] ? (e.clone(e.ZERO, a.startPosition), a.endPosition.x = 0, a.endPosition.y = n, o[r] = !1) : a.endPosition.y = a.endPosition.y + n
					}, u.WHEEL, i)
				}

				function p(n, i, r)
				{
					var o = l(r, i),
						s = n._isDown,
						a = n._eventStartPosition,
						h = n._pressTime,
						d = n._releaseTime;
					s[o] = !1, a[o] = new e;
					var f = n._lastMovement[o];
					t(f) || (f = n._lastMovement[o] = {
						startPosition: new e,
						endPosition: new e,
						valid: !1
					});
					var p, g;
					r === c.LEFT_DRAG ? (p = u.LEFT_DOWN, g = u.LEFT_UP) : r === c.RIGHT_DRAG ? (p = u.RIGHT_DOWN, g = u.RIGHT_UP) : r === c.MIDDLE_DRAG && (p = u.MIDDLE_DOWN, g = u.MIDDLE_UP), n._eventHandler.setInputAction(function (t)
					{
						n._buttonsDown++, f.valid = !1, s[o] = !0, h[o] = new Date, e.clone(t.position, a[o])
					}, p, i), n._eventHandler.setInputAction(function ()
					{
						n._buttonsDown = Math.max(n._buttonsDown - 1, 0), s[o] = !1, d[o] = new Date
					}, g, i)
				}

				function g(t, n)
				{
					e.clone(t.startPosition, n.startPosition), e.clone(t.endPosition, n.endPosition)
				}

				function y(n, i)
				{
					var r = n._update,
						o = n._movement,
						s = n._lastMovement,
						a = n._isDown;
					for (var h in c)
						if (c.hasOwnProperty(h))
						{
							var d = c[h];
							if (t(d))
							{
								var f = l(d, i);
								r[f] = !0, t(n._lastMovement[f]) || (n._lastMovement[f] = {
									startPosition: new e,
									endPosition: new e,
									valid: !1
								}), t(n._movement[f]) || (n._movement[f] = {
									startPosition: new e,
									endPosition: new e
								})
							}
						}
					n._eventHandler.setInputAction(function (u)
					{
						for (var h in c)
							if (c.hasOwnProperty(h))
							{
								var d = c[h];
								if (t(d))
								{
									var f = l(d, i);
									a[f] && (r[f] ? (g(o[f], s[f]), s[f].valid = !0, g(u, o[f]), r[f] = !1) : e.clone(u.endPosition, o[f].endPosition))
								}
							}
						e.clone(u.endPosition, n._currentMousePosition)
					}, u.MOUSE_MOVE, i)
				}

				function M(n)
				{
					if (!t(n)) throw new r("canvas is required.");
					this._eventHandler = new a(n, !0), this._update = {}, this._movement = {}, this._lastMovement = {}, this._isDown = {}, this._eventStartPosition = {}, this._pressTime = {}, this._releaseTime = {}, this._buttonsDown = 0, this._currentMousePosition = new e, f(this, void 0), d(this, void 0, n), p(this, void 0, c.LEFT_DRAG), p(this, void 0, c.RIGHT_DRAG), p(this, void 0, c.MIDDLE_DRAG), y(this, void 0);
					for (var i in o)
						if (o.hasOwnProperty(i))
						{
							var s = o[i];
							t(s) && (f(this, s), d(this, s, n), p(this, s, c.LEFT_DRAG), p(this, s, c.RIGHT_DRAG), p(this, s, c.MIDDLE_DRAG), y(this, s))
						}
				}
				return n(M.prototype,
				{
					currentMousePosition:
					{
						get: function ()
						{
							return this._currentMousePosition
						}
					},
					anyButtonDown:
					{
						get: function ()
						{
							var e = !(this._update[l(c.WHEEL)] && this._update[l(c.WHEEL, o.SHIFT)] && this._update[l(c.WHEEL, o.CTRL)] && this._update[l(c.WHEEL, o.ALT)]);
							return this._buttonsDown > 0 || e
						}
					}
				}), M.prototype.isMoving = function (e, n)
				{
					if (!t(e)) throw new r("type is required.");
					var i = l(e, n);
					return !this._update[i]
				}, M.prototype.getMovement = function (e, n)
				{
					if (!t(e)) throw new r("type is required.");
					var i = l(e, n);
					return this._movement[i]
				}, M.prototype.getLastMovement = function (e, n)
				{
					if (!t(e)) throw new r("type is required.");
					var i = l(e, n),
						o = this._lastMovement[i];
					if (o.valid) return o
				}, M.prototype.isButtonDown = function (e, n)
				{
					if (!t(e)) throw new r("type is required.");
					var i = l(e, n);
					return this._isDown[i]
				}, M.prototype.getStartMousePosition = function (e, n)
				{
					if (!t(e)) throw new r("type is required.");
					if (e === c.WHEEL) return this._currentMousePosition;
					var i = l(e, n);
					return this._eventStartPosition[i]
				}, M.prototype.getButtonPressTime = function (e, n)
				{
					if (!t(e)) throw new r("type is required.");
					var i = l(e, n);
					return this._pressTime[i]
				}, M.prototype.getButtonReleaseTime = function (e, n)
				{
					if (!t(e)) throw new r("type is required.");
					var i = l(e, n);
					return this._releaseTime[i]
				}, M.prototype.reset = function ()
				{
					for (var e in this._update) this._update.hasOwnProperty(e) && (this._update[e] = !0)
				}, M.prototype.isDestroyed = function ()
				{
					return !1
				}, M.prototype.destroy = function ()
				{
					return this._eventHandler = this._eventHandler && this._eventHandler.destroy(), i(this)
				}, M
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("10", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					LEFT_DRAG: 0,
					RIGHT_DRAG: 1,
					MIDDLE_DRAG: 2,
					WHEEL: 3,
					PINCH: 4
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("12", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					UNBOUNDED: 0,
					CLAMPED: 1,
					LOOP_STOP: 2
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("13", ["12", "14", "15", "5", "6", "7", "8", "16", "17"], function (e, t, n, i, r, o, s, a, u)
			{
				"use strict";

				function c(r)
				{
					var c = (r = n(r, n.EMPTY_OBJECT)).currentTime,
						l = r.startTime,
						h = r.stopTime;
					if (c = i(c) ? u.clone(c) : i(l) ? u.clone(l) : i(h) ? u.addDays(h, -1, new u) : u.now(), l = i(l) ? u.clone(l) : u.clone(c), h = i(h) ? u.clone(h) : u.addDays(l, 1, new u), u.greaterThan(l, h)) throw new o("startTime must come before stopTime.");
					this.startTime = l, this.stopTime = h, this.clockRange = n(r.clockRange, e.UNBOUNDED), this.canAnimate = n(r.canAnimate, !0), this.onTick = new s, this._currentTime = void 0, this._multiplier = void 0, this._clockStep = void 0, this._shouldAnimate = void 0, this._lastSystemTime = a(), this.currentTime = c, this.multiplier = n(r.multiplier, 1), this.clockStep = n(r.clockStep, t.SYSTEM_CLOCK_MULTIPLIER), this.shouldAnimate = n(r.shouldAnimate, !0)
				}
				return r(c.prototype,
				{
					currentTime:
					{
						get: function ()
						{
							return this._currentTime
						},
						set: function (e)
						{
							u.equals(this._currentTime, e) || (this._clockStep === t.SYSTEM_CLOCK && (this._clockStep = t.SYSTEM_CLOCK_MULTIPLIER), this._currentTime = e)
						}
					},
					multiplier:
					{
						get: function ()
						{
							return this._multiplier
						},
						set: function (e)
						{
							this._multiplier !== e && (this._clockStep === t.SYSTEM_CLOCK && (this._clockStep = t.SYSTEM_CLOCK_MULTIPLIER), this._multiplier = e)
						}
					},
					clockStep:
					{
						get: function ()
						{
							return this._clockStep
						},
						set: function (e)
						{
							e === t.SYSTEM_CLOCK && (this._multiplier = 1, this._shouldAnimate = !0, this._currentTime = u.now()), this._clockStep = e
						}
					},
					shouldAnimate:
					{
						get: function ()
						{
							return this._shouldAnimate
						},
						set: function (e)
						{
							this._shouldAnimate !== e && (this._clockStep === t.SYSTEM_CLOCK && (this._clockStep = t.SYSTEM_CLOCK_MULTIPLIER), this._shouldAnimate = e)
						}
					}
				}), c.prototype.tick = function ()
				{
					var n = a(),
						i = u.clone(this._currentTime);
					if (this.canAnimate && this._shouldAnimate)
					{
						var r = this._clockStep;
						if (r === t.SYSTEM_CLOCK) i = u.now(i);
						else
						{
							var o = this._multiplier;
							if (r === t.TICK_DEPENDENT) i = u.addSeconds(i, o, i);
							else
							{
								var s = n - this._lastSystemTime;
								i = u.addSeconds(i, o * (s / 1e3), i)
							}
							var c = this.clockRange,
								l = this.startTime,
								h = this.stopTime;
							if (c === e.CLAMPED) u.lessThan(i, l) ? i = u.clone(l, i) : u.greaterThan(i, h) && (i = u.clone(h, i));
							else if (c === e.LOOP_STOP)
								for (u.lessThan(i, l) && (i = u.clone(l, i)); u.greaterThan(i, h);) i = u.addSeconds(l, u.secondsDifference(i, h), i)
						}
					}
					return this._currentTime = i, this._lastSystemTime = n, this.onTick.raiseEvent(this), i
				}, c
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("14", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					TICK_DEPENDENT: 0,
					SYSTEM_CLOCK_MULTIPLIER: 1,
					SYSTEM_CLOCK: 2
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("18", ["19", "5", "6", "7", "d", "1a", "1b"], function (e, t, n, i, r, o, s)
			{
				"use strict";

				function a(e)
				{
					for (var t = e.propertyNames, n = t.length, i = 0; i < n; i++) e[t[i]] = void 0
				}

				function u(e, t, n, i)
				{
					g[0] = n, g[1] = i.id, t[JSON.stringify(g)] = i.definitionChanged.addEventListener(h.prototype._onDefinitionChanged, e)
				}

				function c(e, t, n, i)
				{
					g[0] = n, g[1] = i.id;
					var r = JSON.stringify(g);
					t[r](), t[r] = void 0
				}

				function l(e)
				{
					if (e._shouldRecomposite = !0, 0 === e._suspendCount)
					{
						var n, i, r, l, d, f, g = e._collections,
							y = g.length,
							M = e._collectionsCopy,
							v = M.length,
							A = e._composite,
							E = new s(e),
							m = e._eventHash;
						for (n = 0; n < v; n++)
							for ((d = M[n]).collectionChanged.removeEventListener(h.prototype._onCollectionChanged, e), r = d.values, f = d.id, l = r.length - 1; l > -1; l--) c(e, m, f, i = r[l]);
						for (n = y - 1; n >= 0; n--)
							for ((d = g[n]).collectionChanged.addEventListener(h.prototype._onCollectionChanged, e), r = d.values, f = d.id, l = r.length - 1; l > -1; l--)
							{
								u(e, m, f, i = r[l]);
								var w = E.getById(i.id);
								t(w) || (w = A.getById(i.id), t(w) ? a(w) : (p.id = i.id, w = new o(p)), E.add(w)), w.merge(i)
							}
						e._collectionsCopy = g.slice(0), A.suspendEvents(), A.removeAll();
						var N = E.values;
						for (n = 0; n < N.length; n++) A.add(N[n]);
						A.resumeEvents()
					}
				}

				function h(n, i)
				{
					this._owner = i, this._composite = new s(this), this._suspendCount = 0, this._collections = t(n) ? n.slice() : [], this._collectionsCopy = [], this._id = e(), this._eventHash = {}, l(this), this._shouldRecomposite = !1
				}

				function d(e, n)
				{
					if (!t(n)) throw new i("collection is required.");
					var r = e.indexOf(n);
					if (-1 === r) throw new i("collection is not in this composite.");
					return r
				}

				function f(e, t, n)
				{
					var i = e._collections;
					if (t = r.clamp(t, 0, i.length - 1), n = r.clamp(n, 0, i.length - 1), t !== n)
					{
						var o = i[t];
						i[t] = i[n], i[n] = o, l(e)
					}
				}
				var p = {
						id: void 0
					},
					g = new Array(2);
				return n(h.prototype,
				{
					collectionChanged:
					{
						get: function ()
						{
							return this._composite._collectionChanged
						}
					},
					id:
					{
						get: function ()
						{
							return this._id
						}
					},
					values:
					{
						get: function ()
						{
							return this._composite.values
						}
					},
					owner:
					{
						get: function ()
						{
							return this._owner
						}
					}
				}), h.prototype.addCollection = function (e, n)
				{
					var r = t(n);
					if (!t(e)) throw new i("collection is required.");
					if (r)
					{
						if (n < 0) throw new i("index must be greater than or equal to zero.");
						if (n > this._collections.length) throw new i("index must be less than or equal to the number of collections.")
					}
					r ? this._collections.splice(n, 0, e) : (n = this._collections.length, this._collections.push(e)), l(this)
				}, h.prototype.removeCollection = function (e)
				{
					var t = this._collections.indexOf(e);
					return -1 !== t && (this._collections.splice(t, 1), l(this), !0)
				}, h.prototype.removeAllCollections = function ()
				{
					this._collections.length = 0, l(this)
				}, h.prototype.containsCollection = function (e)
				{
					return -1 !== this._collections.indexOf(e)
				}, h.prototype.contains = function (e)
				{
					return this._composite.contains(e)
				}, h.prototype.indexOfCollection = function (e)
				{
					return this._collections.indexOf(e)
				}, h.prototype.getCollection = function (e)
				{
					if (!t(e)) throw new i("index is required.", "index");
					return this._collections[e]
				}, h.prototype.getCollectionsLength = function ()
				{
					return this._collections.length
				}, h.prototype.raiseCollection = function (e)
				{
					var t = d(this._collections, e);
					f(this, t, t + 1)
				}, h.prototype.lowerCollection = function (e)
				{
					var t = d(this._collections, e);
					f(this, t, t - 1)
				}, h.prototype.raiseCollectionToTop = function (e)
				{
					var t = d(this._collections, e);
					t !== this._collections.length - 1 && (this._collections.splice(t, 1), this._collections.push(e), l(this))
				}, h.prototype.lowerCollectionToBottom = function (e)
				{
					var t = d(this._collections, e);
					0 !== t && (this._collections.splice(t, 1), this._collections.splice(0, 0, e), l(this))
				}, h.prototype.suspendEvents = function ()
				{
					this._suspendCount++, this._composite.suspendEvents()
				}, h.prototype.resumeEvents = function ()
				{
					if (0 === this._suspendCount) throw new i("resumeEvents can not be called before suspendEvents.");
					this._suspendCount--, this._shouldRecomposite && 0 === this._suspendCount && (l(this), this._shouldRecomposite = !1), this._composite.resumeEvents()
				}, h.prototype.computeAvailability = function ()
				{
					return this._composite.computeAvailability()
				}, h.prototype.getById = function (e)
				{
					return this._composite.getById(e)
				}, h.prototype._onCollectionChanged = function (e, n, i)
				{
					var r = this._collectionsCopy,
						s = r.length,
						l = this._composite;
					l.suspendEvents();
					var h, d, f, g, y = i.length,
						M = this._eventHash,
						v = e.id;
					for (h = 0; h < y; h++)
					{
						var A = i[h];
						c(this, M, v, A);
						var E = A.id;
						for (d = s - 1; d >= 0; d--) f = r[d].getById(E), t(f) && (t(g) || a(g = l.getById(E)), g.merge(f));
						t(g) || l.removeById(E), g = void 0
					}
					var m = n.length;
					for (h = 0; h < m; h++)
					{
						var w = n[h];
						u(this, M, v, w);
						var N = w.id;
						for (d = s - 1; d >= 0; d--) f = r[d].getById(N), t(f) && (t(g) || (g = l.getById(N), t(g) ? a(g) : (p.id = N, g = new o(p), l.add(g))), g.merge(f));
						g = void 0
					}
					l.resumeEvents()
				}, h.prototype._onDefinitionChanged = function (e, n, i, r)
				{
					for (var o = this._collections, s = this._composite, a = o.length, u = e.id, c = s.getById(u), l = c[n], h = !t(l), d = !0, f = a - 1; f >= 0; f--)
					{
						var p = o[f].getById(e.id);
						if (t(p))
						{
							var g = p[n];
							if (t(g))
							{
								if (d)
								{
									if (d = !1, !t(g.merge) || !t(g.clone))
									{
										l = g;
										break
									}
									l = g.clone(l)
								}
								l.merge(g)
							}
						}
					}
					h && -1 === c.propertyNames.indexOf(n) && c.addProperty(n), c[n] = l
				}, h
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("1c", ["11", "17", "1d"], function (e, t, n)
			{
				"use strict";
				var i = e(t.fromIso8601("0000-01-01T00:00:00Z")),
					r = e(t.fromIso8601("9999-12-31T24:00:00Z"));
				return {
					MINIMUM_VALUE: i,
					MAXIMUM_VALUE: r,
					MAXIMUM_INTERVAL: e(new n(
					{
						start: i,
						stop: r
					}))
				}
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("1d", ["1e", "15", "5", "6", "11", "17"], function (e, t, n, i, r, o)
			{
				"use strict";

				function s(e)
				{
					e = t(e, t.EMPTY_OBJECT), this.start = n(e.start) ? o.clone(e.start) : new o, this.stop = n(e.stop) ? o.clone(e.stop) : new o, this.data = e.data, this.isStartIncluded = t(e.isStartIncluded, !0), this.isStopIncluded = t(e.isStopIncluded, !0)
				}
				i(s.prototype,
				{
					isEmpty:
					{
						get: function ()
						{
							var e = o.compare(this.stop, this.start);
							return e < 0 || 0 === e && (!this.isStartIncluded || !this.isStopIncluded)
						}
					}
				});
				var a = {
					start: void 0,
					stop: void 0,
					isStartIncluded: void 0,
					isStopIncluded: void 0,
					data: void 0
				};
				return s.fromIso8601 = function (i, r)
				{
					e.typeOf.object("options", i), e.typeOf.string("options.iso8601", i.iso8601);
					var u = i.iso8601.split("/"),
						c = o.fromIso8601(u[0]),
						l = o.fromIso8601(u[1]),
						h = t(i.isStartIncluded, !0),
						d = t(i.isStopIncluded, !0),
						f = i.data;
					return n(r) ? (r.start = c, r.stop = l, r.isStartIncluded = h, r.isStopIncluded = d, r.data = f, r) : (a.start = c, a.stop = l, a.isStartIncluded = h, a.isStopIncluded = d, a.data = f, new s(a))
				}, s.toIso8601 = function (t, n)
				{
					return e.typeOf.object("timeInterval", t), o.toIso8601(t.start, n) + "/" + o.toIso8601(t.stop, n)
				}, s.clone = function (e, t)
				{
					if (n(e)) return n(t) ? (t.start = e.start, t.stop = e.stop, t.isStartIncluded = e.isStartIncluded, t.isStopIncluded = e.isStopIncluded, t.data = e.data, t) : new s(e)
				}, s.equals = function (e, t, i)
				{
					return e === t || n(e) && n(t) && (e.isEmpty && t.isEmpty || e.isStartIncluded === t.isStartIncluded && e.isStopIncluded === t.isStopIncluded && o.equals(e.start, t.start) && o.equals(e.stop, t.stop) && (e.data === t.data || n(i) && i(e.data, t.data)))
				}, s.equalsEpsilon = function (t, i, r, s)
				{
					return e.typeOf.number("epsilon", r), t === i || n(t) && n(i) && (t.isEmpty && i.isEmpty || t.isStartIncluded === i.isStartIncluded && t.isStopIncluded === i.isStopIncluded && o.equalsEpsilon(t.start, i.start, r) && o.equalsEpsilon(t.stop, i.stop, r) && (t.data === i.data || n(s) && s(t.data, i.data)))
				}, s.intersect = function (t, i, r, a)
				{
					if (e.typeOf.object("left", t), e.typeOf.object("result", r), !n(i)) return s.clone(s.EMPTY, r);
					var u = t.start,
						c = t.stop,
						l = i.start,
						h = i.stop,
						d = o.greaterThanOrEquals(l, u) && o.greaterThanOrEquals(c, l),
						f = !d && o.lessThanOrEquals(l, u) && o.lessThanOrEquals(u, h);
					if (!d && !f) return s.clone(s.EMPTY, r);
					var p = t.isStartIncluded,
						g = t.isStopIncluded,
						y = i.isStartIncluded,
						M = i.isStopIncluded,
						v = o.lessThan(c, h);
					return r.start = d ? l : u, r.isStartIncluded = p && y || !o.equals(l, u) && (d && y || f && p), r.stop = v ? c : h, r.isStopIncluded = v ? g : g && M || !o.equals(h, c) && M, r.data = n(a) ? a(t.data, i.data) : t.data, r
				}, s.contains = function (t, n)
				{
					if (e.typeOf.object("timeInterval", t), e.typeOf.object("julianDate", n), t.isEmpty) return !1;
					var i = o.compare(t.start, n);
					if (0 === i) return t.isStartIncluded;
					var r = o.compare(n, t.stop);
					return 0 === r ? t.isStopIncluded : i < 0 && r < 0
				}, s.prototype.clone = function (e)
				{
					return s.clone(this, e)
				}, s.prototype.equals = function (e, t)
				{
					return s.equals(this, e, t)
				}, s.prototype.equalsEpsilon = function (e, t, n)
				{
					return s.equalsEpsilon(this, e, t, n)
				}, s.prototype.toString = function ()
				{
					return s.toIso8601(this)
				}, s.EMPTY = r(new s(
				{
					start: new o,
					stop: new o,
					isStartIncluded: !1,
					isStopIncluded: !1
				})), s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("19", [], function ()
			{
				"use strict";

				function e()
				{
					return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e)
					{
						var t = 16 * Math.random() | 0;
						return ("x" === e ? t : 3 & t | 8).toString(16)
					})
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("1f", ["20", "15", "5", "6", "7", "8", "21", "22"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(n, i)
				{
					this._definitionChanged = new o, this._value = e.clone(n), this._referenceFrame = t(i, s.FIXED)
				}
				return i(u.prototype,
				{
					isConstant:
					{
						get: function ()
						{
							return !n(this._value) || this._referenceFrame === s.FIXED
						}
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					},
					referenceFrame:
					{
						get: function ()
						{
							return this._referenceFrame
						}
					}
				}), u.prototype.getValue = function (e, t)
				{
					return this.getValueInReferenceFrame(e, s.FIXED, t)
				}, u.prototype.setValue = function (t, i)
				{
					var r = !1;
					e.equals(this._value, t) || (r = !0, this._value = e.clone(t)), n(i) && this._referenceFrame !== i && (r = !0, this._referenceFrame = i), r && this._definitionChanged.raiseEvent(this)
				}, u.prototype.getValueInReferenceFrame = function (e, t, i)
				{
					if (!n(e)) throw new r("time is required.");
					if (!n(t)) throw new r("referenceFrame is required.");
					return a.convertToReferenceFrame(e, this._value, this._referenceFrame, t, i)
				}, u.prototype.equals = function (t)
				{
					return this === t || t instanceof u && e.equals(this._value, t._value) && this._referenceFrame === t._referenceFrame
				}, u
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("23", ["24"], function (e)
			{
				"use strict";

				function t(e)
				{
					return e
				}

				function n(n, i)
				{
					return e(n, i, t)
				}
				return n
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("25", ["5", "6", "8"], function (e, t, n)
			{
				"use strict";

				function i(e)
				{
					this._value = void 0, this._hasClone = !1, this._hasEquals = !1, this._definitionChanged = new n, this.setValue(e)
				}
				return t(i.prototype,
				{
					isConstant:
					{
						value: !0
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					}
				}), i.prototype.getValue = function (e, t)
				{
					return this._hasClone ? this._value.clone(t) : this._value
				}, i.prototype.setValue = function (t)
				{
					var n = this._value;
					if (n !== t)
					{
						var i = e(t),
							r = i && "function" == typeof t.clone,
							o = i && "function" == typeof t.equals;
						(!o || !t.equals(n)) && (this._hasClone = r, this._hasEquals = o, this._value = r ? t.clone(this._value) : t, this._definitionChanged.raiseEvent(this))
					}
				}, i.prototype.equals = function (e)
				{
					return this === e || e instanceof i && (!this._hasEquals && this._value === e._value || this._hasEquals && this._value.equals(e._value))
				}, i.prototype.valueOf = function ()
				{
					return this._value
				}, i.prototype.toString = function ()
				{
					return String(this._value)
				}, i
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("24", ["15", "5", "25"], function (e, t, n)
			{
				"use strict";

				function i(e, n, i, r, o)
				{
					return {
						configurable: r,
						get: function ()
						{
							return this[n]
						},
						set: function (r)
						{
							var s = this[n],
								a = this[i];
							t(a) && (a(), this[i] = void 0), !(void 0 !== r) || t(r) && t(r.getValue) || !t(o) || (r = o(r)), s !== r && (this[n] = r, this._definitionChanged.raiseEvent(this, e, r, s)), t(r) && t(r.definitionChanged) && (this[i] = r.definitionChanged.addEventListener(function ()
							{
								this._definitionChanged.raiseEvent(this, e, r, r)
							}, this))
						}
					}
				}

				function r(e)
				{
					return new n(e)
				}

				function o(t, n, o)
				{
					return i(t, "_" + t.toString(), "_" + t.toString() + "Subscription", e(n, !1), e(o, r))
				}
				return o
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("26", ["15", "5", "6", "7", "8", "25", "24", "27"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e)
				{
					return new o(e)
				}

				function c(e, t)
				{
					var n = e._propertyNames,
						i = t._propertyNames,
						r = n.length;
					if (r !== i.length) return !1;
					for (var o = 0; o < r; ++o)
					{
						var s = n[o];
						if (-1 === i.indexOf(s)) return !1;
						if (!a.equals(e[s], t[s])) return !1
					}
					return !0
				}
				var l = function (e, n)
				{
					this._propertyNames = [], this._definitionChanged = new r, t(e) && this.merge(e, n)
				};
				return n(l.prototype,
				{
					propertyNames:
					{
						get: function ()
						{
							return this._propertyNames
						}
					},
					isConstant:
					{
						get: function ()
						{
							for (var e = this._propertyNames, t = 0, n = e.length; t < n; t++)
								if (!a.isConstant(this[e[t]])) return !1;
							return !0
						}
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					}
				}), l.prototype.hasProperty = function (e)
				{
					return -1 !== this._propertyNames.indexOf(e)
				}, l.prototype.addProperty = function (n, r, o)
				{
					var a = this._propertyNames;
					if (!t(n)) throw new i("propertyName is required.");
					if (-1 !== a.indexOf(n)) throw new i(n + " is already a registered property.");
					a.push(n), Object.defineProperty(this, n, s(n, !0, e(o, u))), t(r) && (this[n] = r), this._definitionChanged.raiseEvent(this)
				}, l.prototype.removeProperty = function (e)
				{
					var n = this._propertyNames.indexOf(e);
					if (!t(e)) throw new i("propertyName is required.");
					if (-1 === n) throw new i(e + " is not a registered property.");
					this._propertyNames.splice(n, 1), delete this[e], this._definitionChanged.raiseEvent(this)
				}, l.prototype.getValue = function (e, n)
				{
					if (!t(e)) throw new i("time is required.");
					t(n) || (n = {});
					for (var r = this._propertyNames, o = 0, s = r.length; o < s; o++)
					{
						var u = r[o];
						n[u] = a.getValueOrUndefined(this[u], e, n[u])
					}
					return n
				}, l.prototype.merge = function (e, n)
				{
					if (!t(e)) throw new i("source is required.");
					for (var r = this._propertyNames, o = t(e._propertyNames) ? e._propertyNames : Object.keys(e), s = 0, a = o.length; s < a; s++)
					{
						var u = o[s],
							c = this[u],
							l = e[u];
						void 0 === c && -1 === r.indexOf(u) && this.addProperty(u, void 0, n), void 0 !== l && (void 0 !== c ? t(c) && t(c.merge) && c.merge(l) : t(l) && t(l.merge) && t(l.clone) ? this[u] = l.clone() : this[u] = l)
					}
				}, l.prototype.equals = function (e)
				{
					return this === e || e instanceof l && c(this, e)
				}, l
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("1a", ["20", "1e", "19", "15", "5", "6", "7", "8", "28", "29", "2a", "2b", "@empty", "@empty", "1f", "@empty", "24", "23", "@empty", "@empty", "@empty", "@empty", "@empty", "@empty", "@empty", "@empty", "@empty", "@empty", "27", "26", "@empty", "@empty"], function (e, t, n, i, r, o, s, a, u, c, l, h, d, f, p, g, y, M, v, A, E, m, w, N, D, T, I, O, S, _, L, j)
			{
				"use strict";

				function x(e)
				{
					return new p(e)
				}

				function b(e, t)
				{
					return y(e, void 0, function (e)
					{
						return e instanceof t ? e : new t(e)
					})
				}

				function C(e)
				{
					var t = (e = i(e, i.EMPTY_OBJECT)).id;
					r(t) || (t = n()), this._availability = void 0, this._id = t, this._definitionChanged = new a, this._name = e.name, this._show = i(e.show, !0), this._parent = void 0, this._propertyNames = ["billboard", "box", "corridor", "cylinder", "description", "ellipse", "ellipsoid", "label", "model", "orientation", "path", "point", "polygon", "polyline", "polylineVolume", "position", "properties", "rectangle", "viewFrom", "wall"], this._billboard = void 0, this._billboardSubscription = void 0, this._box = void 0, this._boxSubscription = void 0, this._corridor = void 0, this._corridorSubscription = void 0, this._cylinder = void 0, this._cylinderSubscription = void 0, this._description = void 0, this._descriptionSubscription = void 0, this._ellipse = void 0, this._ellipseSubscription = void 0, this._ellipsoid = void 0, this._ellipsoidSubscription = void 0, this._label = void 0, this._labelSubscription = void 0, this._model = void 0, this._modelSubscription = void 0, this._orientation = void 0, this._orientationSubscription = void 0, this._path = void 0, this._pathSubscription = void 0, this._point = void 0, this._pointSubscription = void 0, this._polygon = void 0, this._polygonSubscription = void 0, this._polyline = void 0, this._polylineSubscription = void 0, this._polylineVolume = void 0, this._polylineVolumeSubscription = void 0, this._position = void 0, this._positionSubscription = void 0, this._properties = void 0, this._propertiesSubscription = void 0, this._rectangle = void 0, this._rectangleSubscription = void 0, this._viewFrom = void 0, this._viewFromSubscription = void 0, this._wall = void 0, this._wallSubscription = void 0, this._children = [], this.entityCollection = void 0, this.parent = e.parent, this.merge(e)
				}

				function R(e, t, n)
				{
					for (var i = t.length, r = 0; r < i; r++)
					{
						var o = t[r],
							s = o._show;
						(!n && s) !== (n && s) && R(o, o._children, n)
					}
					e._definitionChanged.raiseEvent(e, "isShowing", n, !n)
				}
				o(C.prototype,
				{
					availability: M("availability"),
					id:
					{
						get: function ()
						{
							return this._id
						}
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					},
					name: M("name"),
					show:
					{
						get: function ()
						{
							return this._show
						},
						set: function (e)
						{
							if (!r(e)) throw new s("value is required.");
							if (e !== this._show)
							{
								var t = this.isShowing;
								this._show = e;
								var n = this.isShowing;
								t !== n && R(this, this._children, n), this._definitionChanged.raiseEvent(this, "show", e, !e)
							}
						}
					},
					isShowing:
					{
						get: function ()
						{
							return this._show && (!r(this.entityCollection) || this.entityCollection.show) && (!r(this._parent) || this._parent.isShowing)
						}
					},
					parent:
					{
						get: function ()
						{
							return this._parent
						},
						set: function (e)
						{
							var t = this._parent;
							if (t !== e)
							{
								var n = this.isShowing;
								if (r(t))
								{
									var i = t._children.indexOf(this);
									t._children.splice(i, 1)
								}
								this._parent = e, r(e) && e._children.push(this);
								var o = this.isShowing;
								n !== o && R(this, this._children, o), this._definitionChanged.raiseEvent(this, "parent", e, t)
							}
						}
					},
					propertyNames:
					{
						get: function ()
						{
							return this._propertyNames
						}
					},
					billboard: b("billboard", d),
					box: b("box", f),
					corridor: b("corridor", g),
					cylinder: b("cylinder", v),
					description: y("description"),
					ellipse: b("ellipse", A),
					ellipsoid: b("ellipsoid", E),
					label: b("label", m),
					model: b("model", w),
					orientation: y("orientation"),
					path: b("path", N),
					point: b("point", D),
					polygon: b("polygon", T),
					polyline: b("polyline", I),
					polylineVolume: b("polylineVolume", O),
					properties: b("properties", _),
					position: function (e)
					{
						return y(e, void 0, x)
					}("position"),
					rectangle: b("rectangle", L),
					viewFrom: y("viewFrom"),
					wall: b("wall", j)
				}), C.prototype.isAvailable = function (e)
				{
					if (!r(e)) throw new s("time is required.");
					var t = this._availability;
					return !r(t) || t.contains(e)
				}, C.prototype.addProperty = function (e)
				{
					var t = this._propertyNames;
					if (!r(e)) throw new s("propertyName is required.");
					if (-1 !== t.indexOf(e)) throw new s(e + " is already a registered property.");
					if (e in this) throw new s(e + " is a reserved property name.");
					t.push(e), Object.defineProperty(this, e, M(e, !0))
				}, C.prototype.removeProperty = function (e)
				{
					var t = this._propertyNames.indexOf(e);
					if (!r(e)) throw new s("propertyName is required.");
					if (-1 === t) throw new s(e + " is not a registered property.");
					this._propertyNames.splice(t, 1), delete this[e]
				}, C.prototype.merge = function (e)
				{
					if (!r(e)) throw new s("source is required.");
					this.name = i(this.name, e.name), this.availability = i(e.availability, this.availability);
					for (var t = this._propertyNames, n = r(e._propertyNames) ? e._propertyNames : Object.keys(e), o = n.length, a = 0; a < o; a++)
					{
						var u = n[a];
						if ("parent" !== u)
						{
							var c = this[u],
								l = e[u];
							r(c) || -1 !== t.indexOf(u) || this.addProperty(u), r(l) && (r(c) ? r(c.merge) && c.merge(l) : r(l.merge) && r(l.clone) ? this[u] = l.clone() : this[u] = l)
						}
					}
				};
				var z = new u,
					P = new e,
					U = new l;
				return C.prototype.computeModelMatrix = function (e, n)
				{
					t.typeOf.object("time", e);
					var i = S.getValueOrUndefined(this._position, e, P);
					if (r(i))
					{
						var o = S.getValueOrUndefined(this._orientation, e, U);
						return n = r(o) ? c.fromRotationTranslation(u.fromQuaternion(o, z), i, n) : h.eastNorthUpToFixedFrame(i, void 0, n)
					}
				}, C
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("1b", ["2c", "19", "5", "6", "7", "8", "1c", "17", "2d", "1d", "1a"], function (e, t, n, i, r, o, s, a, u, c, l)
			{
				"use strict";

				function h(e)
				{
					if (e._firing) e._refire = !0;
					else if (0 === e._suspendCount)
					{
						var t = e._addedEntities,
							n = e._removedEntities,
							i = e._changedEntities;
						if (0 !== i.length || 0 !== t.length || 0 !== n.length)
						{
							e._firing = !0;
							do {
								e._refire = !1;
								var r = t.values.slice(0),
									o = n.values.slice(0),
									s = i.values.slice(0);
								t.removeAll(), n.removeAll(), i.removeAll(), e._collectionChanged.raiseEvent(e, r, o, s)
							} while (e._refire);
							e._firing = !1
						}
					}
				}

				function d(n)
				{
					this._owner = n, this._entities = new e, this._addedEntities = new e, this._removedEntities = new e, this._changedEntities = new e, this._suspendCount = 0, this._collectionChanged = new o, this._id = t(), this._show = !0, this._firing = !1, this._refire = !1
				}
				var f = {
					id: void 0
				};
				return d.prototype.suspendEvents = function ()
				{
					this._suspendCount++
				}, d.prototype.resumeEvents = function ()
				{
					if (0 === this._suspendCount) throw new r("resumeEvents can not be called before suspendEvents.");
					this._suspendCount--, h(this)
				}, d.collectionChangedEventCallback = void 0, i(d.prototype,
				{
					collectionChanged:
					{
						get: function ()
						{
							return this._collectionChanged
						}
					},
					id:
					{
						get: function ()
						{
							return this._id
						}
					},
					values:
					{
						get: function ()
						{
							return this._entities.values
						}
					},
					show:
					{
						get: function ()
						{
							return this._show
						},
						set: function (e)
						{
							if (!n(e)) throw new r("value is required.");
							if (e !== this._show)
							{
								this.suspendEvents();
								var t, i = [],
									o = this._entities.values,
									s = o.length;
								for (t = 0; t < s; t++) i.push(o[t].isShowing);
								for (this._show = e, t = 0; t < s; t++)
								{
									var a = i[t],
										u = o[t];
									a !== u.isShowing && u.definitionChanged.raiseEvent(u, "isShowing", u.isShowing, a)
								}
								this.resumeEvents()
							}
						}
					},
					owner:
					{
						get: function ()
						{
							return this._owner
						}
					}
				}), d.prototype.computeAvailability = function ()
				{
					for (var e = s.MAXIMUM_VALUE, t = s.MINIMUM_VALUE, i = this._entities.values, r = 0, o = i.length; r < o; r++)
					{
						var u = i[r].availability;
						if (n(u))
						{
							var l = u.start,
								h = u.stop;
							a.lessThan(l, e) && !l.equals(s.MINIMUM_VALUE) && (e = l), a.greaterThan(h, t) && !h.equals(s.MAXIMUM_VALUE) && (t = h)
						}
					}
					return s.MAXIMUM_VALUE.equals(e) && (e = s.MINIMUM_VALUE), s.MINIMUM_VALUE.equals(t) && (t = s.MAXIMUM_VALUE), new c(
					{
						start: e,
						stop: t
					})
				}, d.prototype.add = function (e)
				{
					if (!n(e)) throw new r("entity is required.");
					e instanceof l || (e = new l(e));
					var t = e.id,
						i = this._entities;
					if (i.contains(t)) throw new u("An entity with id " + t + " already exists in this collection.");
					return e.entityCollection = this, i.set(t, e), this._removedEntities.remove(t) || this._addedEntities.set(t, e), e.definitionChanged.addEventListener(d.prototype._onEntityDefinitionChanged, this), h(this), e
				}, d.prototype.remove = function (e)
				{
					return !!n(e) && this.removeById(e.id)
				}, d.prototype.contains = function (e)
				{
					if (!n(e)) throw new r("entity is required");
					return this._entities.get(e.id) === e
				}, d.prototype.removeById = function (e)
				{
					if (!n(e)) return !1;
					var t = this._entities.get(e);
					return !!this._entities.remove(e) && (this._addedEntities.remove(e) || (this._removedEntities.set(e, t), this._changedEntities.remove(e)), this._entities.remove(e), t.definitionChanged.removeEventListener(d.prototype._onEntityDefinitionChanged, this), h(this), !0)
				}, d.prototype.removeAll = function ()
				{
					for (var e = this._entities, t = e.length, i = e.values, r = this._addedEntities, o = this._removedEntities, s = 0; s < t; s++)
					{
						var a = i[s],
							u = a.id,
							c = r.get(u);
						n(c) || (a.definitionChanged.removeEventListener(d.prototype._onEntityDefinitionChanged, this), o.set(u, a))
					}
					e.removeAll(), r.removeAll(), this._changedEntities.removeAll(), h(this)
				}, d.prototype.getById = function (e)
				{
					if (!n(e)) throw new r("id is required.");
					return this._entities.get(e)
				}, d.prototype.getOrCreateEntity = function (e)
				{
					if (!n(e)) throw new r("id is required.");
					var t = this._entities.get(e);
					return n(t) || (f.id = e, t = new l(f), this.add(t)), t
				}, d.prototype._onEntityDefinitionChanged = function (e)
				{
					var t = e.id;
					this._addedEntities.contains(t) || this._changedEntities.set(t, e), h(this)
				}, d
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("2e", ["15", "5", "7", "d"], function (e, t, n, i)
			{
				"use strict";

				function r(e, t, n, i, o, s)
				{
					var a, u, c, l = 0;
					if (i > 0)
					{
						for (u = 0; u < o; u++)
						{
							for (a = !1, c = 0; c < s.length && !a; c++) u === s[c] && (a = !0);
							a || (s.push(u), l += r(e, t, n, i - 1, o, s), s.splice(s.length - 1, 1))
						}
						return l
					}
					for (l = 1, u = 0; u < o; u++)
					{
						for (a = !1, c = 0; c < s.length && !a; c++) u === s[c] && (a = !0);
						a || (l *= e - n[t[u]])
					}
					return l
				}

				function o(e, t, n, r, o, s)
				{
					for (var a, u, c = -1, l = t.length, h = l * (l + 1) / 2, d = 0; d < o; d++)
					{
						var f = Math.floor(d * h);
						for (a = 0; a < l; a++) u = t[a] * o * (s + 1) + d, e[f + a] = r[u];
						for (var p = 1; p < l; p++)
						{
							var g = 0,
								y = Math.floor(p * (1 - p) / 2) + l * p,
								M = !1;
							for (a = 0; a < l - p; a++)
							{
								var v, A, E = n[t[a]],
									m = n[t[a + p]];
								if (m - E <= 0) A = (v = r[u = t[a] * o * (s + 1) + o * p + d]) / i.factorial(p), e[f + y + g] = A, g++;
								else
								{
									var w = Math.floor((p - 1) * (2 - p) / 2) + l * (p - 1);
									A = (v = e[f + w + a + 1] - e[f + w + a]) / (m - E), e[f + y + g] = A, g++
								}
								M = M || 0 !== v
							}
							M && (c = Math.max(c, p))
						}
					}
					return c
				}
				var s = i.factorial,
					a = {
						type: "Hermite"
					};
				a.getRequiredDataPoints = function (i, r)
				{
					if (r = e(r, 0), !t(i)) throw new n("degree is required.");
					if (i < 0) throw new n("degree must be 0 or greater.");
					if (r < 0) throw new n("inputOrder must be 0 or greater.");
					return Math.max(Math.floor((i + 1) / (r + 1)), 2)
				}, a.interpolateOrderZero = function (e, n, i, o, a)
				{
					t(a) || (a = new Array(o));
					var u, c, l, h, d, f = n.length,
						p = new Array(o);
					for (u = 0; u < o; u++)
					{
						a[u] = 0;
						var g = new Array(f);
						for (p[u] = g, c = 0; c < f; c++) g[c] = []
					}
					var y = f,
						M = new Array(y);
					for (u = 0; u < y; u++) M[u] = u;
					var v = f - 1;
					for (h = 0; h < o; h++)
					{
						for (c = 0; c < y; c++) d = M[c] * o + h, p[h][0].push(i[d]);
						for (u = 1; u < y; u++)
						{
							var A = !1;
							for (c = 0; c < y - u; c++)
							{
								var E, m = n[M[c]],
									w = n[M[c + u]];
								w - m <= 0 ? (E = i[d = M[c] * o + o * u + h], p[h][u].push(E / s(u))) : (E = p[h][u - 1][c + 1] - p[h][u - 1][c], p[h][u].push(E / (w - m))), A = A || 0 !== E
							}
							A || (v = u - 1)
						}
					}
					for (l = 0, 0; l <= 0; l++)
						for (u = l; u <= v; u++)
						{
							var N = r(e, M, n, l, u, []);
							for (h = 0; h < o; h++)
							{
								var D = p[h][u][0];
								a[h + l * o] += D * N
							}
						}
					return a
				};
				var u = [];
				return a.interpolate = function (e, n, i, s, a, c, l)
				{
					var h = s * (c + 1);
					t(l) || (l = new Array(h));
					for (var d = 0; d < h; d++) l[d] = 0;
					var f, p = n.length,
						g = new Array(p * (a + 1));
					for (f = 0; f < p; f++)
						for (var y = 0; y < a + 1; y++) g[f * (a + 1) + y] = f;
					for (var M = g.length, v = u, A = o(v, g, n, i, s, a), E = [], m = M * (M + 1) / 2, w = Math.min(A, c), N = 0; N <= w; N++)
						for (f = N; f <= A; f++)
						{
							E.length = 0;
							for (var D = r(e, g, n, N, f, E), T = Math.floor(f * (1 - f) / 2) + M * f, I = 0; I < s; I++)
							{
								var O = v[Math.floor(I * m) + T];
								l[I + N * s] += O * D
							}
						}
					return l
				}, a
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("2f", ["5", "6", "7", "28", "2a", "21", "2b"], function (e, t, n, i, r, o, s)
			{
				"use strict";

				function a(e, t)
				{
					return e && e.id ? e.id === (t && t.id) : e === t
				}

				function u(t, n)
				{
					var i = n;
					for (i.length = 0; e(t);) i.unshift(t), t = t.position && t.position.referenceFrame;
					return i
				}

				function c(e, t)
				{
					if (!a(e[0], t[0])) return -1;
					for (var n = Math.min(e.length, t.length), i = 0; i <= n; i++)
						if (!a(e[i], t[i])) return i - 1;
					return -1
				}

				function l(t)
				{
					var n = s.computeIcrfToFixedMatrix(t, M);
					return e(n) || (n = s.computeTemeToPseudoFixedMatrix(t, M)), r.fromRotationMatrix(n, v)
				}

				function h(t, n)
				{
					if (!e(t)) return t;
					var i = n.orientation;
					if (e(i))
					{
						var o = i.getValue(y, A);
						if (e(o)) return r.multiply(o, t, t)
					}
				}

				function d(t, n)
				{
					if (!e(t)) return t;
					var i = n.orientation;
					if (e(i))
					{
						var o = i.getValue(y, A);
						if (e(o)) return r.conjugate(o, o), r.multiply(o, t, t)
					}
				}

				function f(e, t, n)
				{
					for (var i = n, r = 0; r < e.length; r++) i = t(i, e[r]);
					return i
				}

				function p(e, t, n)
				{
					for (var i = n, r = e.length - 1; r > -1; r--) i = t(i, e[r]);
					return i
				}
				var g = function ()
				{
					n.throwInstantiationError()
				};
				t(g.prototype,
				{
					isConstant:
					{
						get: n.throwInstantiationError
					},
					definitionChanged:
					{
						get: n.throwInstantiationError
					}
				}), g.prototype.getValue = n.throwInstantiationError, g.prototype.equals = n.throwInstantiationError;
				var y, M = new i,
					v = new r,
					A = new r,
					E = [],
					m = [];
				return g.convertToReferenceFrame = function (t, n, i, s, a)
				{
					if (!e(n)) return n;
					if (e(a) || (a = new r), i === s) return r.clone(n, a);
					if (e(i) && e(s))
					{
						y = t;
						var g = u(i, E),
							M = u(s, m),
							v = c(g, M),
							w = g[v];
						if (e(w))
						{
							for (var N = 0; N < v + 1; N++) g.shift(), M.shift();
							var D = p(g, h, r.clone(n, a));
							if (!e(D)) return;
							return f(M, d, D)
						}
						var T, I, O = g.shift(),
							S = M.shift();
						if (O === o.INERTIAL && S === o.FIXED)
						{
							if (I = p(g, h, r.clone(n, a)), !e(I)) return;
							return T = r.multiply(l(t), I, a), f(M, d, T)
						}
						if (O === o.FIXED && S === o.INERTIAL)
						{
							if (T = p(g, h, r.clone(n, a)), !e(T)) return;
							var _ = r.conjugate(l(t), A);
							return I = r.multiply(_, T, a), f(M, d, I)
						}
					}
				}, g
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("30", ["1e", "15", "5", "6", "7", "31"], function (e, t, n, i, r, o)
			{
				"use strict";

				function s(e)
				{
					e = t(e, t.EMPTY_OBJECT), this._offCenterFrustum = new o, this.fov = e.fov, this._fov = void 0, this._fovy = void 0, this._sseDenominator = void 0, this.aspectRatio = e.aspectRatio, this._aspectRatio = void 0, this.near = t(e.near, 1), this._near = this.near, this.far = t(e.far, 5e8), this._far = this.far, this.xOffset = t(e.xOffset, 0), this._xOffset = this.xOffset, this.yOffset = t(e.yOffset, 0), this._yOffset = this.yOffset
				}

				function a(e)
				{
					if (!(n(e.fov) && n(e.aspectRatio) && n(e.near) && n(e.far))) throw new r("fov, aspectRatio, near, or far parameters are not set.");
					var t = e._offCenterFrustum;
					if (e.fov !== e._fov || e.aspectRatio !== e._aspectRatio || e.near !== e._near || e.far !== e._far || e.xOffset !== e._xOffset || e.yOffset !== e._yOffset)
					{
						if (e.fov < 0 || e.fov >= Math.PI) throw new r("fov must be in the range [0, PI).");
						if (e.aspectRatio < 0) throw new r("aspectRatio must be positive.");
						if (e.near < 0 || e.near > e.far) throw new r("near must be greater than zero and less than far.");
						e._aspectRatio = e.aspectRatio, e._fov = e.fov, e._fovy = e.aspectRatio <= 1 ? e.fov : 2 * Math.atan(Math.tan(.5 * e.fov) / e.aspectRatio), e._near = e.near, e._far = e.far, e._sseDenominator = 2 * Math.tan(.5 * e._fovy), e._xOffset = e.xOffset, e._yOffset = e.yOffset, t.top = e.near * Math.tan(.5 * e._fovy), t.bottom = -t.top, t.right = e.aspectRatio * t.top, t.left = -t.right, t.near = e.near, t.far = e.far, t.right += e.xOffset, t.left += e.xOffset, t.top += e.yOffset, t.bottom += e.yOffset
					}
				}
				return s.packedLength = 6, s.pack = function (n, i, r)
				{
					return e.typeOf.object("value", n), e.defined("array", i), r = t(r, 0), i[r++] = n.fov, i[r++] = n.aspectRatio, i[r++] = n.near, i[r++] = n.far, i[r++] = n.xOffset, i[r] = n.yOffset, i
				}, s.unpack = function (i, r, o)
				{
					return e.defined("array", i), r = t(r, 0), n(o) || (o = new s), o.fov = i[r++], o.aspectRatio = i[r++], o.near = i[r++], o.far = i[r++], o.xOffset = i[r++], o.yOffset = i[r], o
				}, i(s.prototype,
				{
					projectionMatrix:
					{
						get: function ()
						{
							return a(this), this._offCenterFrustum.projectionMatrix
						}
					},
					infiniteProjectionMatrix:
					{
						get: function ()
						{
							return a(this), this._offCenterFrustum.infiniteProjectionMatrix
						}
					},
					fovy:
					{
						get: function ()
						{
							return a(this), this._fovy
						}
					},
					sseDenominator:
					{
						get: function ()
						{
							return a(this), this._sseDenominator
						}
					}
				}), s.prototype.computeCullingVolume = function (e, t, n)
				{
					return a(this), this._offCenterFrustum.computeCullingVolume(e, t, n)
				}, s.prototype.getPixelDimensions = function (e, t, n, i)
				{
					return a(this), this._offCenterFrustum.getPixelDimensions(e, t, n, i)
				}, s.prototype.clone = function (e)
				{
					return n(e) || (e = new s), e.aspectRatio = this.aspectRatio, e.fov = this.fov, e.near = this.near, e.far = this.far, e._aspectRatio = void 0, e._fov = void 0, e._near = void 0, e._far = void 0, this._offCenterFrustum.clone(e._offCenterFrustum), e
				}, s.prototype.equals = function (e)
				{
					return !!n(e) && (a(this), a(e), this.fov === e.fov && this.aspectRatio === e.aspectRatio && this.near === e.near && this.far === e.far && this._offCenterFrustum.equals(e._offCenterFrustum))
				}, s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("32", ["20", "33", "15", "5", "7", "34", "35"], function (e, t, n, i, r, o, s)
			{
				"use strict";

				function a(e)
				{
					this.planes = n(e, [])
				}
				var u = [new e, new e, new e];
				e.clone(e.UNIT_X, u[0]), e.clone(e.UNIT_Y, u[1]), e.clone(e.UNIT_Z, u[2]);
				var c = new e,
					l = new e,
					h = new s(new e(1, 0, 0), 0);
				return a.fromBoundingSphere = function (n, o)
				{
					if (!i(n)) throw new r("boundingSphere is required.");
					i(o) || (o = new a);
					var s = u.length,
						h = o.planes;
					h.length = 2 * s;
					for (var d = n.center, f = n.radius, p = 0, g = 0; g < s; ++g)
					{
						var y = u[g],
							M = h[p],
							v = h[p + 1];
						i(M) || (M = h[p] = new t), i(v) || (v = h[p + 1] = new t), e.multiplyByScalar(y, -f, c), e.add(d, c, c), M.x = y.x, M.y = y.y, M.z = y.z, M.w = -e.dot(y, c), e.multiplyByScalar(y, f, c), e.add(d, c, c), v.x = -y.x, v.y = -y.y, v.z = -y.z, v.w = -e.dot(e.negate(y, l), c), p += 2
					}
					return o
				}, a.prototype.computeVisibility = function (e)
				{
					if (!i(e)) throw new r("boundingVolume is required.");
					for (var t = this.planes, n = !1, a = 0, u = t.length; a < u; ++a)
					{
						var c = e.intersectPlane(s.fromCartesian4(t[a], h));
						if (c === o.OUTSIDE) return o.OUTSIDE;
						c === o.INTERSECTING && (n = !0)
					}
					return n ? o.INTERSECTING : o.INSIDE
				}, a.prototype.computeVisibilityWithPlaneMask = function (e, t)
				{
					if (!i(e)) throw new r("boundingVolume is required.");
					if (!i(t)) throw new r("parentPlaneMask is required.");
					if (t === a.MASK_OUTSIDE || t === a.MASK_INSIDE) return t;
					for (var n = a.MASK_INSIDE, u = this.planes, c = 0, l = u.length; c < l; ++c)
					{
						var d = c < 31 ? 1 << c : 0;
						if (!(c < 31 && 0 == (t & d)))
						{
							var f = e.intersectPlane(s.fromCartesian4(u[c], h));
							if (f === o.OUTSIDE) return a.MASK_OUTSIDE;
							f === o.INTERSECTING && (n |= d)
						}
					}
					return n
				}, a.MASK_OUTSIDE = 4294967295, a.MASK_INSIDE = 0, a.MASK_INDETERMINATE = 2147483647, a
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("31", ["20", "33", "32", "15", "5", "6", "7", "29"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e)
				{
					e = i(e, i.EMPTY_OBJECT), this.left = e.left, this._left = void 0, this.right = e.right, this._right = void 0, this.top = e.top, this._top = void 0, this.bottom = e.bottom, this._bottom = void 0, this.near = i(e.near, 1), this._near = this.near, this.far = i(e.far, 5e8), this._far = this.far, this._cullingVolume = new n, this._perspectiveMatrix = new a, this._infinitePerspective = new a
				}

				function c(e)
				{
					if (!(r(e.right) && r(e.left) && r(e.top) && r(e.bottom) && r(e.near) && r(e.far))) throw new s("right, left, top, bottom, near, or far parameters are not set.");
					var t = e.top,
						n = e.bottom,
						i = e.right,
						o = e.left,
						u = e.near,
						c = e.far;
					if (t !== e._top || n !== e._bottom || o !== e._left || i !== e._right || u !== e._near || c !== e._far)
					{
						if (e.near <= 0 || e.near > e.far) throw new s("near must be greater than zero and less than far.");
						e._left = o, e._right = i, e._top = t, e._bottom = n, e._near = u, e._far = c, e._perspectiveMatrix = a.computePerspectiveOffCenter(o, i, n, t, u, c, e._perspectiveMatrix), e._infinitePerspective = a.computeInfinitePerspectiveOffCenter(o, i, n, t, u, e._infinitePerspective)
					}
				}
				o(u.prototype,
				{
					projectionMatrix:
					{
						get: function ()
						{
							return c(this), this._perspectiveMatrix
						}
					},
					infiniteProjectionMatrix:
					{
						get: function ()
						{
							return c(this), this._infinitePerspective
						}
					}
				});
				var l = new e,
					h = new e,
					d = new e,
					f = new e;
				return u.prototype.computeCullingVolume = function (n, i, o)
				{
					if (!r(n)) throw new s("position is required.");
					if (!r(i)) throw new s("direction is required.");
					if (!r(o)) throw new s("up is required.");
					var a = this._cullingVolume.planes,
						u = this.top,
						c = this.bottom,
						p = this.right,
						g = this.left,
						y = this.near,
						M = this.far,
						v = e.cross(i, o, l),
						A = h;
					e.multiplyByScalar(i, y, A), e.add(n, A, A);
					var E = d;
					e.multiplyByScalar(i, M, E), e.add(n, E, E);
					var m = f;
					e.multiplyByScalar(v, g, m), e.add(A, m, m), e.subtract(m, n, m), e.normalize(m, m), e.cross(m, o, m), e.normalize(m, m);
					var w = a[0];
					return r(w) || (w = a[0] = new t), w.x = m.x, w.y = m.y, w.z = m.z, w.w = -e.dot(m, n), e.multiplyByScalar(v, p, m), e.add(A, m, m), e.subtract(m, n, m), e.cross(o, m, m), e.normalize(m, m), w = a[1], r(w) || (w = a[1] = new t), w.x = m.x, w.y = m.y, w.z = m.z, w.w = -e.dot(m, n), e.multiplyByScalar(o, c, m), e.add(A, m, m), e.subtract(m, n, m), e.cross(v, m, m), e.normalize(m, m), w = a[2], r(w) || (w = a[2] = new t), w.x = m.x, w.y = m.y, w.z = m.z, w.w = -e.dot(m, n), e.multiplyByScalar(o, u, m), e.add(A, m, m), e.subtract(m, n, m), e.cross(m, v, m), e.normalize(m, m), w = a[3], r(w) || (w = a[3] = new t), w.x = m.x, w.y = m.y, w.z = m.z, w.w = -e.dot(m, n), w = a[4], r(w) || (w = a[4] = new t), w.x = i.x, w.y = i.y, w.z = i.z, w.w = -e.dot(i, A), e.negate(i, m), w = a[5], r(w) || (w = a[5] = new t), w.x = m.x, w.y = m.y, w.z = m.z, w.w = -e.dot(m, E), this._cullingVolume
				}, u.prototype.getPixelDimensions = function (e, t, n, i)
				{
					if (c(this), !r(e) || !r(t)) throw new s("Both drawingBufferWidth and drawingBufferHeight are required.");
					if (e <= 0) throw new s("drawingBufferWidth must be greater than zero.");
					if (t <= 0) throw new s("drawingBufferHeight must be greater than zero.");
					if (!r(n)) throw new s("distance is required.");
					if (!r(i)) throw new s("A result object is required.");
					var o = 1 / this.near,
						a = this.top * o,
						u = 2 * n * a / t,
						l = 2 * n * (a = this.right * o) / e;
					return i.x = l, i.y = u, i
				}, u.prototype.clone = function (e)
				{
					return r(e) || (e = new u), e.right = this.right, e.left = this.left, e.top = this.top, e.bottom = this.bottom, e.near = this.near, e.far = this.far, e._left = void 0, e._right = void 0, e._top = void 0, e._bottom = void 0, e._near = void 0, e._far = void 0, e
				}, u.prototype.equals = function (e)
				{
					return r(e) && this.right === e.right && this.left === e.left && this.top === e.top && this.bottom === e.bottom && this.near === e.near && this.far === e.far
				}, u
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("36", ["5", "6", "7", "8", "27"], function (e, t, n, i, r)
			{
				"use strict";

				function o(t)
				{
					var n = t._targetEntity;
					return t._resolveEntity && (n = t._targetCollection.getById(t._targetId), e(n) && (t._targetEntity = n, t._resolveEntity = !1)), n
				}
				var s = function (t, r)
				{
					if (!e(t)) throw new n("targetCollection is required.");
					if (!e(r) || "" === r) throw new n("targetId is required.");
					this._targetCollection = t, this._targetId = r, this._targetEntity = void 0, this._definitionChanged = new i, this._resolveEntity = !0, t.collectionChanged.addEventListener(s.prototype._onCollectionChanged, this)
				};
				return t(s.prototype,
				{
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					},
					id:
					{
						get: function ()
						{
							return this._targetId
						}
					},
					position:
					{
						get: function ()
						{
							var t = o(this);
							return e(t) ? t.position : void 0
						}
					},
					orientation:
					{
						get: function ()
						{
							var t = o(this);
							return e(t) ? t.orientation : void 0
						}
					},
					targetId:
					{
						get: function ()
						{
							return this._targetId
						}
					},
					targetCollection:
					{
						get: function ()
						{
							return this._targetCollection
						}
					},
					resolvedEntity:
					{
						get: function ()
						{
							return o(this)
						}
					}
				}), s.prototype._onCollectionChanged = function (t, n, i)
				{
					var r = this._targetEntity;
					e(r) && (-1 !== i.indexOf(r) ? this._resolveEntity = !0 : this._resolveEntity && (o(this), this._resolveEntity || this._definitionChanged.raiseEvent(this)))
				}, s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("37", ["5", "6", "7", "8", "2d", "27"], function (e, t, n, i, r, o)
			{
				"use strict";

				function s(t)
				{
					var n = !0;
					if (t._resolveEntity)
					{
						var i = t._targetCollection.getById(t._targetId);
						if (e(i) ? (i.definitionChanged.addEventListener(u.prototype._onTargetEntityDefinitionChanged, t), t._targetEntity = i, t._resolveEntity = !1) : (i = t._targetEntity, n = !1), !e(i)) throw new r('target entity "' + t._targetId + '" could not be resolved.')
					}
					return n
				}

				function a(t)
				{
					var n = t._targetProperty;
					if (t._resolveProperty)
					{
						var i = s(t),
							o = t._targetPropertyNames;
						n = t._targetEntity;
						for (var a = o.length, u = 0; u < a && e(n); u++) n = n[o[u]];
						if (e(n)) t._targetProperty = n, t._resolveProperty = !i;
						else if (!e(t._targetProperty)) throw new r('targetProperty "' + t._targetId + "." + o.join(".") + '" could not be resolved.')
					}
					return n
				}

				function u(t, r, o)
				{
					if (!e(t)) throw new n("targetCollection is required.");
					if (!e(r) || "" === r) throw new n("targetId is required.");
					if (!e(o) || 0 === o.length) throw new n("targetPropertyNames is required.");
					for (var s = 0; s < o.length; s++)
					{
						var a = o[s];
						if (!e(a) || "" === a) throw new n("reference contains invalid properties.")
					}
					this._targetCollection = t, this._targetId = r, this._targetPropertyNames = o, this._targetProperty = void 0, this._targetEntity = void 0, this._definitionChanged = new i, this._resolveEntity = !0, this._resolveProperty = !0, t.collectionChanged.addEventListener(u.prototype._onCollectionChanged, this)
				}
				return t(u.prototype,
				{
					isConstant:
					{
						get: function ()
						{
							return o.isConstant(a(this))
						}
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					},
					referenceFrame:
					{
						get: function ()
						{
							return a(this).referenceFrame
						}
					},
					targetId:
					{
						get: function ()
						{
							return this._targetId
						}
					},
					targetCollection:
					{
						get: function ()
						{
							return this._targetCollection
						}
					},
					targetPropertyNames:
					{
						get: function ()
						{
							return this._targetPropertyNames
						}
					},
					resolvedProperty:
					{
						get: function ()
						{
							return a(this)
						}
					}
				}), u.fromString = function (t, i)
				{
					if (!e(t)) throw new n("targetCollection is required.");
					if (!e(i)) throw new n("referenceString is required.");
					for (var r, o = [], s = !0, a = !1, c = "", l = 0; l < i.length; ++l)
					{
						var h = i.charAt(l);
						a ? (c += h, a = !1) : "\\" === h ? a = !0 : s && "#" === h ? (r = c, s = !1, c = "") : s || "." !== h ? c += h : (o.push(c), c = "")
					}
					return o.push(c), new u(t, r, o)
				}, u.prototype.getValue = function (e, t)
				{
					return a(this).getValue(e, t)
				}, u.prototype.getValueInReferenceFrame = function (e, t, n)
				{
					return a(this).getValueInReferenceFrame(e, t, n)
				}, u.prototype.getType = function (e)
				{
					return a(this).getType(e)
				}, u.prototype.equals = function (e)
				{
					if (this === e) return !0;
					var t = this._targetPropertyNames,
						n = e._targetPropertyNames;
					if (this._targetCollection !== e._targetCollection || this._targetId !== e._targetId || t.length !== n.length) return !1;
					for (var i = this._targetPropertyNames.length, r = 0; r < i; r++)
						if (t[r] !== n[r]) return !1;
					return !0
				}, u.prototype._onTargetEntityDefinitionChanged = function (e, t, n, i)
				{
					this._targetPropertyNames[0] === t && (this._resolveProperty = !0, this._definitionChanged.raiseEvent(this))
				}, u.prototype._onCollectionChanged = function (t, n, i)
				{
					var r = this._targetEntity;
					e(r) && (-1 !== i.indexOf(r) ? (r.definitionChanged.removeEventListener(u.prototype._onTargetEntityDefinitionChanged, this), this._resolveEntity = !0, this._resolveProperty = !0) : this._resolveEntity && (a(this), this._resolveEntity || this._definitionChanged.raiseEvent(this)))
				}, u
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("21", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					FIXED: 0,
					INERTIAL: 1
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("22", ["20", "5", "6", "7", "28", "29", "2a", "21", "2b"], function (e, t, n, i, r, o, s, a, u)
			{
				"use strict";

				function c()
				{
					i.throwInstantiationError()
				}

				function l(e, t)
				{
					return e && e.id ? e.id === (t && t.id) : e === t
				}

				function h(e, n)
				{
					var i = n;
					for (i.length = 0; t(e);) i.unshift(e), e = e.position && e.position.referenceFrame;
					return i
				}

				function d(e, t)
				{
					if (!l(e[0], t[0])) return -1;
					for (var n = Math.min(e.length, t.length), i = 0; i <= n; i++)
						if (!l(e[i], t[i])) return i - 1;
					return -1
				}

				function f(e)
				{
					var n = u.computeIcrfToFixedMatrix(e, A);
					return t(n) || (n = u.computeTemeToPseudoFixedMatrix(e, A)), n
				}

				function p(n, i)
				{
					if (!t(n)) return n;
					var o = i.position;
					if (t(o))
					{
						var s = o.referenceFrame,
							a = o.getValueInReferenceFrame(v, s, m);
						if (t(a))
						{
							var u = i.orientation;
							if (t(u))
							{
								var c = u.getValue(v, w);
								if (!t(c)) return;
								return r.fromQuaternion(c, E), r.multiplyByVector(E, n, n), e.add(a, n, n)
							}
							return e.add(a, n, n)
						}
					}
				}

				function g(n, i)
				{
					if (!t(n)) return n;
					var o = i.position;
					if (t(o))
					{
						var a = o.referenceFrame,
							u = o.getValueInReferenceFrame(v, a, m);
						if (t(u))
						{
							n = e.subtract(n, u, n);
							var c = i.orientation;
							if (t(c))
							{
								var l = c.getValue(v, w);
								if (!t(l)) return;
								s.conjugate(l, l), r.fromQuaternion(l, E), r.multiplyByVector(E, n, n)
							}
							return n
						}
					}
				}

				function y(e, t, n)
				{
					for (var i = n, r = 0; r < e.length; r++) i = t(i, e[r]);
					return i
				}

				function M(e, t, n)
				{
					for (var i = n, r = e.length - 1; r > -1; r--) i = t(i, e[r]);
					return i
				}
				n(c.prototype,
				{
					isConstant:
					{
						get: i.throwInstantiationError
					},
					definitionChanged:
					{
						get: i.throwInstantiationError
					},
					referenceFrame:
					{
						get: i.throwInstantiationError
					}
				}), c.prototype.getValue = i.throwInstantiationError, c.prototype.getValueInReferenceFrame = i.throwInstantiationError, c.prototype.equals = i.throwInstantiationError;
				var v, A = new r,
					E = new r,
					m = new e,
					w = new s,
					N = [],
					D = [];
				return c.convertToReferenceFrame = function (n, i, o, s, u)
				{
					if (!t(i)) return i;
					if (t(u) || (u = new e), o === s) return e.clone(i, u);
					if (t(o) && t(s))
					{
						v = n;
						var c = h(o, N),
							l = h(s, D),
							A = d(c, l),
							m = c[A];
						if (t(m))
						{
							for (var w = 0; w < A + 1; w++) c.shift(), l.shift();
							var T = M(c, p, e.clone(i, u));
							if (!t(T)) return;
							return y(l, g, T)
						}
						var I, O, S = c.shift(),
							_ = l.shift();
						if (S === a.INERTIAL && _ === a.FIXED)
						{
							if (O = M(c, p, e.clone(i, u)), !t(O)) return;
							return I = r.multiplyByVector(f(n), O, u), y(l, g, I)
						}
						if (S === a.FIXED && _ === a.INERTIAL)
						{
							if (I = M(c, p, e.clone(i, u)), !t(I)) return;
							var L = r.transpose(f(n), E);
							return O = r.multiplyByVector(L, I, u), y(l, g, O)
						}
					}
				}, c
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("27", ["15", "5", "6", "7"], function (e, t, n, i)
			{
				"use strict";

				function r()
				{
					i.throwInstantiationError()
				}
				return n(r.prototype,
				{
					isConstant:
					{
						get: i.throwInstantiationError
					},
					definitionChanged:
					{
						get: i.throwInstantiationError
					}
				}), r.prototype.getValue = i.throwInstantiationError, r.prototype.equals = i.throwInstantiationError, r.equals = function (e, n)
				{
					return e === n || t(e) && e.equals(n)
				}, r.arrayEquals = function (e, n)
				{
					if (e === n) return !0;
					if (!t(e) || !t(n) || e.length !== n.length) return !1;
					for (var i = e.length, o = 0; o < i; o++)
						if (!r.equals(e[o], n[o])) return !1;
					return !0
				}, r.isConstant = function (e)
				{
					return !t(e) || e.isConstant
				}, r.getValueOrUndefined = function (e, n, i)
				{
					return t(e) ? e.getValue(n, i) : void 0
				}, r.getValueOrDefault = function (n, i, r, o)
				{
					return t(n) ? e(n.getValue(i, o), r) : r
				}, r.getValueOrClonedDefault = function (e, n, i, r)
				{
					var o;
					return t(e) && (o = e.getValue(n, r)), t(o) || (o = i.clone(o)), o
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("38", ["20", "15", "5", "6", "7", "8", "21", "22", "27", "39"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(n, i)
				{
					var r;
					if ((i = t(i, 0)) > 0)
					{
						r = new Array(i);
						for (var a = 0; a < i; a++) r[a] = e
					}
					this._numberOfDerivatives = i, this._property = new c(e, r), this._definitionChanged = new o, this._referenceFrame = t(n, s.FIXED), this._property._definitionChanged.addEventListener(function ()
					{
						this._definitionChanged.raiseEvent(this)
					}, this)
				}
				return i(l.prototype,
				{
					isConstant:
					{
						get: function ()
						{
							return this._property.isConstant
						}
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					},
					referenceFrame:
					{
						get: function ()
						{
							return this._referenceFrame
						}
					},
					interpolationDegree:
					{
						get: function ()
						{
							return this._property.interpolationDegree
						}
					},
					interpolationAlgorithm:
					{
						get: function ()
						{
							return this._property.interpolationAlgorithm
						}
					},
					numberOfDerivatives:
					{
						get: function ()
						{
							return this._numberOfDerivatives
						}
					},
					forwardExtrapolationType:
					{
						get: function ()
						{
							return this._property.forwardExtrapolationType
						},
						set: function (e)
						{
							this._property.forwardExtrapolationType = e
						}
					},
					forwardExtrapolationDuration:
					{
						get: function ()
						{
							return this._property.forwardExtrapolationDuration
						},
						set: function (e)
						{
							this._property.forwardExtrapolationDuration = e
						}
					},
					backwardExtrapolationType:
					{
						get: function ()
						{
							return this._property.backwardExtrapolationType
						},
						set: function (e)
						{
							this._property.backwardExtrapolationType = e
						}
					},
					backwardExtrapolationDuration:
					{
						get: function ()
						{
							return this._property.backwardExtrapolationDuration
						},
						set: function (e)
						{
							this._property.backwardExtrapolationDuration = e
						}
					}
				}), l.prototype.getValue = function (e, t)
				{
					return this.getValueInReferenceFrame(e, s.FIXED, t)
				}, l.prototype.getValueInReferenceFrame = function (e, t, i)
				{
					if (!n(e)) throw new r("time is required.");
					if (!n(t)) throw new r("referenceFrame is required.");
					if (i = this._property.getValue(e, i), n(i)) return a.convertToReferenceFrame(e, i, this._referenceFrame, t, i)
				}, l.prototype.setInterpolationOptions = function (e)
				{
					this._property.setInterpolationOptions(e)
				}, l.prototype.addSample = function (e, t, i)
				{
					var o = this._numberOfDerivatives;
					if (o > 0 && (!n(i) || i.length !== o)) throw new r("derivatives length must be equal to the number of derivatives.");
					this._property.addSample(e, t, i)
				}, l.prototype.addSamples = function (e, t, n)
				{
					this._property.addSamples(e, t, n)
				}, l.prototype.addSamplesPackedArray = function (e, t)
				{
					this._property.addSamplesPackedArray(e, t)
				}, l.prototype.equals = function (e)
				{
					return this === e || e instanceof l && u.equals(this._property, e._property) && this._referenceFrame === e._referenceFrame
				}, l
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("8", ["1e", "5", "6"], function (e, t, n)
			{
				"use strict";

				function i()
				{
					this._listeners = [], this._scopes = [], this._toRemove = [], this._insideRaiseEvent = !1
				}
				return n(i.prototype,
				{
					numberOfListeners:
					{
						get: function ()
						{
							return this._listeners.length - this._toRemove.length
						}
					}
				}), i.prototype.addEventListener = function (t, n)
				{
					e.typeOf.func("listener", t), this._listeners.push(t), this._scopes.push(n);
					var i = this;
					return function ()
					{
						i.removeEventListener(t, n)
					}
				}, i.prototype.removeEventListener = function (t, n)
				{
					e.typeOf.func("listener", t);
					for (var i = this._listeners, r = this._scopes, o = -1, s = 0; s < i.length; s++)
						if (i[s] === t && r[s] === n)
						{
							o = s;
							break
						}
					return -1 !== o && (this._insideRaiseEvent ? (this._toRemove.push(o), i[o] = void 0, r[o] = void 0) : (i.splice(o, 1), r.splice(o, 1)), !0)
				}, i.prototype.raiseEvent = function ()
				{
					this._insideRaiseEvent = !0;
					var e, n = this._listeners,
						i = this._scopes,
						r = n.length;
					for (e = 0; e < r; e++)
					{
						var o = n[e];
						t(o) && n[e].apply(i[e], arguments)
					}
					var s = this._toRemove;
					for (r = s.length, e = 0; e < r; e++)
					{
						var a = s[e];
						n.splice(a, 1), i.splice(a, 1)
					}
					s.length = 0, this._insideRaiseEvent = !1
				}, i
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("3a", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					NONE: 0,
					HOLD: 1,
					EXTRAPOLATE: 2
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("3b", ["5", "7"], function (e, t)
			{
				"use strict";
				var n = {
					type: "Linear"
				};
				return n.getRequiredDataPoints = function (e)
				{
					return 2
				}, n.interpolateOrderZero = function (n, i, r, o, s)
				{
					if (2 !== i.length) throw new t("The xTable provided to the linear interpolator must have exactly two elements.");
					if (o <= 0) throw new t("There must be at least 1 dependent variable for each independent variable.");
					e(s) || (s = new Array(o));
					var a, u, c, l = i[0],
						h = i[1];
					if (l === h) throw new t("Divide by zero error: xTable[0] and xTable[1] are equal");
					for (a = 0; a < o; a++) u = r[a], c = r[a + o], s[a] = ((c - u) * n + h * u - l * c) / (h - l);
					return s
				}, n
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("39", ["3c", "15", "5", "6", "7", "8", "3a", "17", "3b"], function (e, t, n, i, r, o, s, a, u)
			{
				"use strict";

				function c(e, t, n)
				{
					var i, r = e.length,
						o = n.length,
						s = r + o;
					if (e.length = s, r !== t)
					{
						var a = r - 1;
						for (i = s - 1; i >= t; i--) e[i] = e[a--]
					}
					for (i = 0; i < o; i++) e[t++] = n[i]
				}

				function l(e, t)
				{
					return e instanceof a ? e : "string" == typeof e ? a.fromIso8601(e) : a.addSeconds(t, e, new a)
				}

				function h(t, i, r, o, s)
				{
					for (var u, h, d, f, y, M, v = 0; v < o.length;)
					{
						y = l(o[v], t);
						var A = 0,
							E = 0;
						if ((d = e(i, y, a.compare)) < 0)
						{
							for (f = (d = ~d) * s, h = void 0, M = i[d]; v < o.length && (y = l(o[v], t), !(n(h) && a.compare(h, y) >= 0 || n(M) && a.compare(y, M) >= 0));)
							{
								for (p[A++] = y, v += 1, u = 0; u < s; u++) g[E++] = o[v], v += 1;
								h = y
							}
							A > 0 && (g.length = E, c(r, f, g), p.length = A, c(i, d, p))
						}
						else
						{
							for (u = 0; u < s; u++) v++, r[d * s + u] = o[v];
							v++
						}
					}
				}

				function d(e, i)
				{
					if (!n(e)) throw new r("type is required.");
					var a = e;
					a === Number && (a = f);
					var c, l = a.packedLength,
						h = t(a.packedInterpolationLength, l),
						d = 0;
					if (n(i))
					{
						var p = i.length;
						c = new Array(p);
						for (var g = 0; g < p; g++)
						{
							var y = i[g];
							y === Number && (y = f);
							var M = y.packedLength;
							l += M, h += t(y.packedInterpolationLength, M), c[g] = y
						}
						d = p
					}
					this._type = e, this._innerType = a, this._interpolationDegree = 1, this._interpolationAlgorithm = u, this._numberOfPoints = 0, this._times = [], this._values = [], this._xTable = [], this._yTable = [], this._packedLength = l, this._packedInterpolationLength = h, this._updateTableLength = !0, this._interpolationResult = new Array(h), this._definitionChanged = new o, this._derivativeTypes = i, this._innerDerivativeTypes = c, this._inputOrder = d, this._forwardExtrapolationType = s.NONE, this._forwardExtrapolationDuration = 0, this._backwardExtrapolationType = s.NONE, this._backwardExtrapolationDuration = 0
				}
				var f = {
						packedLength: 1,
						pack: function (e, n, i)
						{
							n[i = t(i, 0)] = e
						},
						unpack: function (e, n, i)
						{
							return n = t(n, 0), e[n]
						}
					},
					p = [],
					g = [];
				return i(d.prototype,
				{
					isConstant:
					{
						get: function ()
						{
							return 0 === this._values.length
						}
					},
					definitionChanged:
					{
						get: function ()
						{
							return this._definitionChanged
						}
					},
					type:
					{
						get: function ()
						{
							return this._type
						}
					},
					derivativeTypes:
					{
						get: function ()
						{
							return this._derivativeTypes
						}
					},
					interpolationDegree:
					{
						get: function ()
						{
							return this._interpolationDegree
						}
					},
					interpolationAlgorithm:
					{
						get: function ()
						{
							return this._interpolationAlgorithm
						}
					},
					forwardExtrapolationType:
					{
						get: function ()
						{
							return this._forwardExtrapolationType
						},
						set: function (e)
						{
							this._forwardExtrapolationType !== e && (this._forwardExtrapolationType = e, this._definitionChanged.raiseEvent(this))
						}
					},
					forwardExtrapolationDuration:
					{
						get: function ()
						{
							return this._forwardExtrapolationDuration
						},
						set: function (e)
						{
							this._forwardExtrapolationDuration !== e && (this._forwardExtrapolationDuration = e, this._definitionChanged.raiseEvent(this))
						}
					},
					backwardExtrapolationType:
					{
						get: function ()
						{
							return this._backwardExtrapolationType
						},
						set: function (e)
						{
							this._backwardExtrapolationType !== e && (this._backwardExtrapolationType = e, this._definitionChanged.raiseEvent(this))
						}
					},
					backwardExtrapolationDuration:
					{
						get: function ()
						{
							return this._backwardExtrapolationDuration
						},
						set: function (e)
						{
							this._backwardExtrapolationDuration !== e && (this._backwardExtrapolationDuration = e, this._definitionChanged.raiseEvent(this))
						}
					}
				}), d.prototype.getValue = function (t, i)
				{
					if (!n(t)) throw new r("time is required.");
					var o = this._times,
						u = o.length;
					if (0 !== u)
					{
						var c, l = this._innerType,
							h = this._values,
							d = e(o, t, a.compare);
						if (d < 0)
						{
							if (0 === (d = ~d))
							{
								var f = o[d];
								if (c = this._backwardExtrapolationDuration, this._backwardExtrapolationType === s.NONE || 0 !== c && a.secondsDifference(f, t) > c) return;
								if (this._backwardExtrapolationType === s.HOLD) return l.unpack(h, 0, i)
							}
							if (d >= u)
							{
								var p = o[d = u - 1];
								if (c = this._forwardExtrapolationDuration, this._forwardExtrapolationType === s.NONE || 0 !== c && a.secondsDifference(t, p) > c) return;
								if (this._forwardExtrapolationType === s.HOLD) return d = u - 1, l.unpack(h, d * l.packedLength, i)
							}
							var g = this._xTable,
								y = this._yTable,
								M = this._interpolationAlgorithm,
								v = this._packedInterpolationLength,
								A = this._inputOrder;
							if (this._updateTableLength)
							{
								this._updateTableLength = !1;
								var E = Math.min(M.getRequiredDataPoints(this._interpolationDegree, A), u);
								E !== this._numberOfPoints && (this._numberOfPoints = E, g.length = E, y.length = E * v)
							}
							var m = this._numberOfPoints - 1;
							if (m < 1) return;
							var w = 0,
								N = u - 1;
							if (N - w + 1 >= m + 1)
							{
								var D = d - (m / 2 | 0) - 1;
								D < w && (D = w);
								var T = D + m;
								T > N && (D = (T = N) - m) < w && (D = w), w = D, N = T
							}
							for (var I = N - w + 1, O = 0; O < I; ++O) g[O] = a.secondsDifference(o[w + O], o[N]);
							if (n(l.convertPackedArrayForInterpolation)) l.convertPackedArrayForInterpolation(h, w, N, y);
							else
								for (var S = 0, _ = this._packedLength, L = w * _, j = (N + 1) * _; L < j;) y[S] = h[L], L++, S++;
							var x, b = a.secondsDifference(t, o[N]);
							if (0 !== A && n(M.interpolate))
							{
								var C = Math.floor(v / (A + 1));
								x = M.interpolate(b, g, y, C, A, A, this._interpolationResult)
							}
							else x = M.interpolateOrderZero(b, g, y, v, this._interpolationResult);
							return n(l.unpackInterpolationResult) ? l.unpackInterpolationResult(x, h, w, N, i) : l.unpack(x, 0, i)
						}
						return l.unpack(h, d * this._packedLength, i)
					}
				}, d.prototype.setInterpolationOptions = function (e)
				{
					if (n(e))
					{
						var t = !1,
							i = e.interpolationAlgorithm,
							r = e.interpolationDegree;
						n(i) && this._interpolationAlgorithm !== i && (this._interpolationAlgorithm = i, t = !0), n(r) && this._interpolationDegree !== r && (this._interpolationDegree = r, t = !0), t && (this._updateTableLength = !0, this._definitionChanged.raiseEvent(this))
					}
				}, d.prototype.addSample = function (e, t, i)
				{
					var o = this._innerDerivativeTypes,
						s = n(o);
					if (!n(e)) throw new r("time is required.");
					if (!n(t)) throw new r("value is required.");
					if (s && !n(i)) throw new r("derivatives is required.");
					var a = this._innerType,
						u = [];
					if (u.push(e), a.pack(t, u, u.length), s)
						for (var c = o.length, l = 0; l < c; l++) o[l].pack(i[l], u, u.length);
					h(void 0, this._times, this._values, u, this._packedLength), this._updateTableLength = !0, this._definitionChanged.raiseEvent(this)
				}, d.prototype.addSamples = function (e, t, i)
				{
					var o = this._innerDerivativeTypes,
						s = n(o);
					if (!n(e)) throw new r("times is required.");
					if (!n(t)) throw new r("values is required.");
					if (e.length !== t.length) throw new r("times and values must be the same length.");
					if (s && (!n(i) || i.length !== e.length)) throw new r("times and derivativeValues must be the same length.");
					for (var a = this._innerType, u = e.length, c = [], l = 0; l < u; l++)
						if (c.push(e[l]), a.pack(t[l], c, c.length), s)
							for (var d = i[l], f = o.length, p = 0; p < f; p++) o[p].pack(d[p], c, c.length);
					h(void 0, this._times, this._values, c, this._packedLength), this._updateTableLength = !0, this._definitionChanged.raiseEvent(this)
				}, d.prototype.addSamplesPackedArray = function (e, t)
				{
					if (!n(e)) throw new r("packedSamples is required.");
					h(t, this._times, this._values, e, this._packedLength), this._updateTableLength = !0, this._definitionChanged.raiseEvent(this)
				}, d.prototype.equals = function (e)
				{
					if (this === e) return !0;
					if (!n(e)) return !1;
					if (this._type !== e._type || this._interpolationDegree !== e._interpolationDegree || this._interpolationAlgorithm !== e._interpolationAlgorithm) return !1;
					var t = this._derivativeTypes,
						i = n(t),
						r = e._derivativeTypes;
					if (i !== n(r)) return !1;
					var o, s;
					if (i)
					{
						if ((s = t.length) !== r.length) return !1;
						for (o = 0; o < s; o++)
							if (t[o] !== r[o]) return !1
					}
					var u = this._times,
						c = e._times;
					if ((s = u.length) !== c.length) return !1;
					for (o = 0; o < s; o++)
						if (!a.equals(u[o], c[o])) return !1;
					var l = this._values,
						h = e._values;
					for (o = 0; o < s; o++)
						if (l[o] !== h[o]) return !1;
					return !0
				}, d._mergeNewSamples = h, d
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("2c", ["5", "6", "7"], function (e, t, n)
			{
				"use strict";

				function i()
				{
					this._array = [], this._hash = {}
				}
				return t(i.prototype,
				{
					length:
					{
						get: function ()
						{
							return this._array.length
						}
					},
					values:
					{
						get: function ()
						{
							return this._array
						}
					}
				}), i.prototype.contains = function (t)
				{
					if ("string" != typeof t && "number" != typeof t) throw new n("key is required to be a string or number.");
					return e(this._hash[t])
				}, i.prototype.set = function (e, t)
				{
					if ("string" != typeof e && "number" != typeof e) throw new n("key is required to be a string or number.");
					t !== this._hash[e] && (this.remove(e), this._hash[e] = t, this._array.push(t))
				}, i.prototype.get = function (e)
				{
					if ("string" != typeof e && "number" != typeof e) throw new n("key is required to be a string or number.");
					return this._hash[e]
				}, i.prototype.remove = function (t)
				{
					if (e(t) && "string" != typeof t && "number" != typeof t) throw new n("key is required to be a string or number.");
					var i = this._hash[t],
						r = e(i);
					if (r)
					{
						var o = this._array;
						o.splice(o.indexOf(i), 1), delete this._hash[t]
					}
					return r
				}, i.prototype.removeAll = function ()
				{
					var e = this._array;
					e.length > 0 && (this._hash = {}, e.length = 0)
				}, i
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("16", ["5"], function (e)
			{
				"use strict";
				return "undefined" != typeof performance && e(performance.now) ? function ()
				{
					return performance.now()
				} : function ()
				{
					return Date.now()
				}
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("c", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					SHIFT: 0,
					CTRL: 1,
					ALT: 2
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("e", ["2c", "a", "15", "5", "b", "7", "3d", "16", "c", "f"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(e, t, n)
				{
					var i = e._element;
					if (i === document) return n.x = t.clientX, n.y = t.clientY, n;
					var r = i.getBoundingClientRect();
					return n.x = t.clientX - r.left, n.y = t.clientY - r.top, n
				}

				function h(e, t)
				{
					var n = e;
					return i(t) && (n += "+" + t), n
				}

				function d(e)
				{
					return e.shiftKey ? u.SHIFT : e.ctrlKey ? u.CTRL : e.altKey ? u.ALT : void 0
				}

				function f(e, t, n, i)
				{
					function r(t)
					{
						i(e, t)
					}
					n.addEventListener(t, r, !1), e._removalFunctions.push(function ()
					{
						n.removeEventListener(t, r, !1)
					})
				}

				function p(e)
				{
					var t = e._element,
						n = i(t.disableRootEvents) ? t : document;
					s.supportsPointerEvents() ? (f(e, "pointerdown", t, S), f(e, "pointerup", t, _), f(e, "pointermove", t, L), f(e, "pointercancel", t, _)) : (f(e, "mousedown", t, v), f(e, "mouseup", n, A), f(e, "mousemove", n, E), f(e, "touchstart", t, N), f(e, "touchend", n, D), f(e, "touchmove", n, I), f(e, "touchcancel", n, D)), f(e, "dblclick", t, m);
					f(e, "onwheel" in t ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll", t, w)
				}

				function g(e)
				{
					for (var t = e._removalFunctions, n = 0; n < t.length; ++n) t[n]()
				}

				function y(e)
				{
					e._lastSeenTouchEvent = a()
				}

				function M(e)
				{
					return a() - e._lastSeenTouchEvent > j.mouseEmulationIgnoreMilliseconds
				}

				function v(e, n)
				{
					if (M(e))
					{
						var r = n.button;
						e._buttonDown = r;
						var o;
						if (r === x.LEFT) o = c.LEFT_DOWN;
						else if (r === x.MIDDLE) o = c.MIDDLE_DOWN;
						else
						{
							if (r !== x.RIGHT) return;
							o = c.RIGHT_DOWN
						}
						var s = l(e, n, e._primaryPosition);
						t.clone(s, e._primaryStartPosition), t.clone(s, e._primaryPreviousPosition);
						var a = d(n),
							u = e.getInputAction(o, a);
						i(u) && (t.clone(s, b.position), u(b), n.preventDefault())
					}
				}

				function A(e, n)
				{
					if (M(e))
					{
						var r = n.button;
						e._buttonDown = void 0;
						var o, s;
						if (r === x.LEFT) o = c.LEFT_UP, s = c.LEFT_CLICK;
						else if (r === x.MIDDLE) o = c.MIDDLE_UP, s = c.MIDDLE_CLICK;
						else
						{
							if (r !== x.RIGHT) return;
							o = c.RIGHT_UP, s = c.RIGHT_CLICK
						}
						var a = d(n),
							u = e.getInputAction(o, a),
							h = e.getInputAction(s, a);
						if (i(u) || i(h))
						{
							var f = l(e, n, e._primaryPosition);
							if (i(u) && (t.clone(f, C.position), u(C)), i(h))
							{
								var p = e._primaryStartPosition,
									g = p.x - f.x,
									y = p.y - f.y;
								Math.sqrt(g * g + y * y) < e._clickPixelTolerance && (t.clone(f, R.position), h(R))
							}
						}
					}
				}

				function E(e, n)
				{
					if (M(e))
					{
						var r = d(n),
							o = l(e, n, e._primaryPosition),
							s = e._primaryPreviousPosition,
							a = e.getInputAction(c.MOUSE_MOVE, r);
						i(a) && (t.clone(s, z.startPosition), t.clone(o, z.endPosition), a(z)), t.clone(o, s), i(e._buttonDown) && n.preventDefault()
					}
				}

				function m(e, t)
				{
					var n;
					if (t.button === x.LEFT)
					{
						n = c.LEFT_DOUBLE_CLICK;
						var r = d(t),
							o = e.getInputAction(n, r);
						i(o) && (l(e, t, P.position), o(P))
					}
				}

				function w(e, t)
				{
					var n;
					if (i(t.deltaY))
					{
						var r = t.deltaMode;
						n = r === t.DOM_DELTA_PIXEL ? -t.deltaY : r === t.DOM_DELTA_LINE ? 40 * -t.deltaY : 120 * -t.deltaY
					}
					else n = t.detail > 0 ? -120 * t.detail : t.wheelDelta;
					if (i(n))
					{
						var o = d(t),
							s = e.getInputAction(c.WHEEL, o);
						i(s) && (s(n), t.preventDefault())
					}
				}

				function N(e, n)
				{
					y(e);
					var i, r, o, s = n.changedTouches,
						a = s.length,
						u = e._positions;
					for (i = 0; i < a; ++i) o = (r = s[i]).identifier, u.set(o, l(e, r, new t));
					T(e, n);
					var c = e._previousPositions;
					for (i = 0; i < a; ++i) o = (r = s[i]).identifier, c.set(o, t.clone(u.get(o)))
				}

				function D(e, t)
				{
					y(e);
					var n, i, r = t.changedTouches,
						o = r.length,
						s = e._positions;
					for (n = 0; n < o; ++n) i = r[n].identifier, s.remove(i);
					T(e, t);
					var a = e._previousPositions;
					for (n = 0; n < o; ++n) i = r[n].identifier, a.remove(i)
				}

				function T(e, n)
				{
					var r, o, s = d(n),
						a = e._positions,
						u = e._previousPositions,
						l = a.length;
					if (1 !== l && e._buttonDown === x.LEFT && (e._buttonDown = void 0, r = e.getInputAction(c.LEFT_UP, s), i(r) && (t.clone(e._primaryPosition, B.position), r(B)), 0 === l && (o = e.getInputAction(c.LEFT_CLICK, s), i(o))))
					{
						var h = e._primaryStartPosition,
							f = u.values[0],
							p = h.x - f.x,
							g = h.y - f.y;
						Math.sqrt(p * p + g * g) < e._clickPixelTolerance && (t.clone(e._primaryPosition, F.position), o(F))
					}
					if (2 !== l && e._isPinching && (e._isPinching = !1, r = e.getInputAction(c.PINCH_END, s), i(r) && r()), 1 === l)
					{
						var y = a.values[0];
						t.clone(y, e._primaryPosition), t.clone(y, e._primaryStartPosition), t.clone(y, e._primaryPreviousPosition), e._buttonDown = x.LEFT, r = e.getInputAction(c.LEFT_DOWN, s), i(r) && (t.clone(y, U.position), r(U)), n.preventDefault()
					}
					2 === l && (e._isPinching = !0, r = e.getInputAction(c.PINCH_START, s), i(r) && (t.clone(a.values[0], k.position1), t.clone(a.values[1], k.position2), r(k), n.preventDefault()))
				}

				function I(e, n)
				{
					y(e);
					var r, o, s, a = n.changedTouches,
						u = a.length,
						c = e._positions;
					for (r = 0; r < u; ++r)
					{
						s = (o = a[r]).identifier;
						var h = c.get(s);
						i(h) && l(e, o, h)
					}
					O(e, n);
					var d = e._previousPositions;
					for (r = 0; r < u; ++r) s = (o = a[r]).identifier, t.clone(c.get(s), d.get(s))
				}

				function O(e, n)
				{
					var r, o = d(n),
						s = e._positions,
						a = e._previousPositions,
						u = s.length;
					if (1 === u && e._buttonDown === x.LEFT)
					{
						var l = s.values[0];
						t.clone(l, e._primaryPosition);
						var h = e._primaryPreviousPosition;
						r = e.getInputAction(c.MOUSE_MOVE, o), i(r) && (t.clone(h, Q.startPosition), t.clone(l, Q.endPosition), r(Q)), t.clone(l, h), n.preventDefault()
					}
					else if (2 === u && e._isPinching && (r = e.getInputAction(c.PINCH_MOVE, o), i(r)))
					{
						var f = s.values[0],
							p = s.values[1],
							g = a.values[0],
							y = a.values[1],
							M = p.x - f.x,
							v = p.y - f.y,
							A = .25 * Math.sqrt(M * M + v * v),
							E = y.x - g.x,
							m = y.y - g.y,
							w = .25 * Math.sqrt(E * E + m * m),
							N = .125 * (p.y + f.y),
							D = .125 * (y.y + g.y),
							T = Math.atan2(v, M),
							I = Math.atan2(m, E);
						t.fromElements(0, w, Y.distance.startPosition), t.fromElements(0, A, Y.distance.endPosition), t.fromElements(I, D, Y.angleAndHeight.startPosition), t.fromElements(T, N, Y.angleAndHeight.endPosition), r(Y)
					}
				}

				function S(e, n)
				{
					if (n.target.setPointerCapture(n.pointerId), "touch" === n.pointerType)
					{
						var i = e._positions,
							r = n.pointerId;
						i.set(r, l(e, n, new t)), T(e, n), e._previousPositions.set(r, t.clone(i.get(r)))
					}
					else v(e, n)
				}

				function _(e, t)
				{
					if ("touch" === t.pointerType)
					{
						var n = e._positions,
							i = t.pointerId;
						n.remove(i), T(e, t), e._previousPositions.remove(i)
					}
					else A(e, t)
				}

				function L(e, n)
				{
					if ("touch" === n.pointerType)
					{
						var r = e._positions,
							o = n.pointerId,
							s = r.get(o);
						if (!i(s)) return;
						l(e, n, s), O(e, n);
						var a = e._previousPositions;
						t.clone(r.get(o), a.get(o))
					}
					else E(e, n)
				}

				function j(i)
				{
					this._inputEvents = {}, this._buttonDown = void 0, this._isPinching = !1, this._lastSeenTouchEvent = -j.mouseEmulationIgnoreMilliseconds, this._primaryStartPosition = new t, this._primaryPosition = new t, this._primaryPreviousPosition = new t, this._positions = new e, this._previousPositions = new e, this._removalFunctions = [], this._clickPixelTolerance = 5, this._element = n(i, document), p(this)
				}
				var x = {
						LEFT: 0,
						MIDDLE: 1,
						RIGHT: 2
					},
					b = {
						position: new t
					},
					C = {
						position: new t
					},
					R = {
						position: new t
					},
					z = {
						startPosition: new t,
						endPosition: new t
					},
					P = {
						position: new t
					},
					U = {
						position: new t
					},
					k = {
						position1: new t,
						position2: new t
					},
					B = {
						position: new t
					},
					F = {
						position: new t
					},
					Q = {
						startPosition: new t,
						endPosition: new t
					},
					Y = {
						distance:
						{
							startPosition: new t,
							endPosition: new t
						},
						angleAndHeight:
						{
							startPosition: new t,
							endPosition: new t
						}
					};
				return j.prototype.setInputAction = function (e, t, n)
				{
					if (!i(e)) throw new o("action is required.");
					if (!i(t)) throw new o("type is required.");
					var r = h(t, n);
					this._inputEvents[r] = e
				}, j.prototype.getInputAction = function (e, t)
				{
					if (!i(e)) throw new o("type is required.");
					var n = h(e, t);
					return this._inputEvents[n]
				}, j.prototype.removeInputAction = function (e, t)
				{
					if (!i(e)) throw new o("type is required.");
					var n = h(e, t);
					delete this._inputEvents[n]
				}, j.prototype.isDestroyed = function ()
				{
					return !1
				}, j.prototype.destroy = function ()
				{
					return g(this), r(this)
				}, j.mouseEmulationIgnoreMilliseconds = 800, j
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("f", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					LEFT_DOWN: 0,
					LEFT_UP: 1,
					LEFT_CLICK: 2,
					LEFT_DOUBLE_CLICK: 3,
					RIGHT_DOWN: 5,
					RIGHT_UP: 6,
					RIGHT_CLICK: 7,
					MIDDLE_DOWN: 10,
					MIDDLE_UP: 11,
					MIDDLE_CLICK: 12,
					MOUSE_MOVE: 15,
					WHEEL: 16,
					PINCH_START: 17,
					PINCH_END: 18,
					PINCH_MOVE: 19
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("3e", ["20", "5", "7", "17", "d", "28", "3f", "40"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e)
				{
					var t = 6.239996 + .0172019696544 * e;
					return .001657 * Math.sin(t + .01671 * Math.sin(t))
				}

				function c(e, t)
				{
					t = i.addSeconds(e, E, t);
					var n = i.totalDays(t) - m;
					return t = i.addSeconds(t, u(n), t)
				}

				function l(i, s, a, u, c, l, f)
				{
					if (a < 0 && (a = -a, c += r.PI), a < 0 || a > r.PI) throw new n("The inclination is out of range. Inclination must be greater than or equal to zero and less than or equal to Pi radians.");
					var p = i * (1 - s),
						y = u - c,
						M = c,
						v = d(l - u, s);
					if ("Hyperbolic" === h(s, 0) && Math.abs(r.negativePiToPi(v)) >= Math.acos(-1 / s)) throw new n("The true anomaly of the hyperbolic orbit lies outside of the bounds of the hyperbola.");
					g(y, a, M, I);
					var A = p * (1 + s),
						E = Math.cos(v),
						m = Math.sin(v),
						w = 1 + s * E;
					if (w <= r.Epsilon10) throw new n("elements cannot be converted to cartesian");
					var N = A / w;
					return t(f) ? (f.x = N * E, f.y = N * m, f.z = 0) : f = new e(N * E, N * m, 0), o.multiplyByVector(I, f, f)
				}

				function h(e, t)
				{
					if (e < 0) throw new n("eccentricity cannot be negative.");
					return e <= t ? "Circular" : e < 1 - t ? "Elliptical" : e <= 1 + t ? "Parabolic" : "Hyperbolic"
				}

				function d(e, t)
				{
					if (t < 0 || t >= 1) throw new n("eccentricity out of range.");
					return p(f(e, t), t)
				}

				function f(e, t)
				{
					if (t < 0 || t >= 1) throw new n("eccentricity out of range.");
					var i, o = Math.floor(e / r.TWO_PI),
						s = (e -= o * r.TWO_PI) + t * Math.sin(e) / (1 - Math.sin(e + t) + Math.sin(e)),
						a = Number.MAX_VALUE;
					for (i = 0; i < O && Math.abs(a - s) > S; ++i) s = (a = s) - (a - t * Math.sin(a) - e) / (1 - t * Math.cos(a));
					if (i >= O) throw new n("Kepler equation did not converge");
					return a = s + o * r.TWO_PI
				}

				function p(e, t)
				{
					if (t < 0 || t >= 1) throw new n("eccentricity out of range.");
					var i = Math.floor(e / r.TWO_PI);
					e -= i * r.TWO_PI;
					var o = Math.cos(e) - t,
						s = Math.sin(e) * Math.sqrt(1 - t * t),
						a = Math.atan2(s, o);
					return a = r.zeroToTwoPi(a), e < 0 && (a -= r.TWO_PI), a += i * r.TWO_PI
				}

				function g(e, i, s, a)
				{
					if (i < 0 || i > r.PI) throw new n("inclination out of range");
					var u = Math.cos(e),
						c = Math.sin(e),
						l = Math.cos(i),
						h = Math.sin(i),
						d = Math.cos(s),
						f = Math.sin(s);
					return t(a) ? (a[0] = d * u - f * c * l, a[1] = f * u + d * c * l, a[2] = c * h, a[3] = -d * c - f * u * l, a[4] = -f * c + d * u * l, a[5] = u * h, a[6] = f * h, a[7] = -d * h, a[8] = l) : a = new o(d * u - f * c * l, -d * c - f * u * l, f * h, f * u + d * c * l, -f * c + d * u * l, -d * h, c * h, u * h, l), a
				}

				function y(e, t)
				{
					c(e, Ie);
					var n = (Ie.dayNumber - w.dayNumber + (Ie.secondsOfDay - w.secondsOfDay) / s.SECONDS_PER_DAY) / (10 * s.DAYS_PER_JULIAN_CENTURY),
						i = .3595362 * n,
						r = _ + B * Math.cos(x * i) + W * Math.sin(x * i) + F * Math.cos(b * i) + X * Math.sin(b * i) + Q * Math.cos(C * i) + Z * Math.sin(C * i) + Y * Math.cos(R * i) + K * Math.sin(R * i) + G * Math.cos(z * i) + J * Math.sin(z * i) + V * Math.cos(P * i) + $ * Math.sin(P * i) + q * Math.cos(U * i) + ee * Math.sin(U * i) + H * Math.cos(k * i) + te * Math.sin(k * i),
						o = L + j * n + le * Math.cos(ne * i) + ve * Math.sin(ne * i) + he * Math.cos(ie * i) + Ae * Math.sin(ie * i) + de * Math.cos(re * i) + Ee * Math.sin(re * i) + fe * Math.cos(oe * i) + me * Math.sin(oe * i) + pe * Math.cos(se * i) + we * Math.sin(se * i) + ge * Math.cos(ae * i) + Ne * Math.sin(ae * i) + ye * Math.cos(ue * i) + De * Math.sin(ue * i) + Me * Math.cos(ce * i) + Te * Math.sin(ce * i);
					return l(r, .0167086342 - .0004203654 * n, 469.97289 * T * n, 102.93734808 * D + 11612.3529 * T * n, 174.87317577 * D - 8679.27034 * T * n, o, t)
				}

				function M(e, t)
				{
					c(e, Ie);
					var n = (Ie.dayNumber - w.dayNumber + (Ie.secondsOfDay - w.secondsOfDay) / s.SECONDS_PER_DAY) / s.DAYS_PER_JULIAN_CENTURY,
						i = n * n,
						r = i * n,
						o = r * n,
						a = 383397.7725 + .004 * n,
						u = .055545526 - 1.6e-8 * n,
						h = 5.15668983 * D,
						d = -8e-5 * n + .02966 * i - 42e-6 * r - 1.3e-7 * o,
						f = 83.35324312 * D,
						p = 14643420.2669 * n - 38.2702 * i - .045047 * r + 21301e-8 * o,
						g = 125.04455501 * D,
						y = -6967919.3631 * n + 6.3602 * i + .007625 * r - 3586e-8 * o,
						M = 218.31664563 * D,
						v = 1732559343.4847 * n - 6.391 * i + .006588 * r - 3169e-8 * o,
						A = 297.85019547 * D + T * (1602961601.209 * n - 6.3706 * i + .006593 * r - 3169e-8 * o),
						E = 134.96340251 * D + T * (1717915923.2178 * n + 31.8792 * i + .051635 * r - 2447e-7 * o),
						m = 357.52910918 * D + T * (129596581.0481 * n - .5532 * i + 136e-6 * r - 1149e-8 * o),
						I = 310.17137918 * D - T * (6967051.436 * n + 6.2068 * i + .007618 * r - 3219e-8 * o),
						O = 2 * A,
						S = 4 * A,
						_ = 6 * A,
						L = 2 * E,
						j = 3 * E,
						x = 4 * E,
						b = 2 * (93.27209062 * D + T * (1739527262.8478 * n - 12.7512 * i - .001037 * r + 417e-8 * o));
					a += 3400.4 * Math.cos(O) - 635.6 * Math.cos(O - E) - 235.6 * Math.cos(E) + 218.1 * Math.cos(O - m) + 181 * Math.cos(O + E), u += .014216 * Math.cos(O - E) + .008551 * Math.cos(O - L) - .001383 * Math.cos(E) + .001356 * Math.cos(O + E) - .001147 * Math.cos(S - j) - 914e-6 * Math.cos(S - L) + 869e-6 * Math.cos(O - m - E) - 627e-6 * Math.cos(O) - 394e-6 * Math.cos(S - x) + 282e-6 * Math.cos(O - m - L) - 279e-6 * Math.cos(A - E) - 236e-6 * Math.cos(L) + 231e-6 * Math.cos(S) + 229e-6 * Math.cos(_ - x) - 201e-6 * Math.cos(L - b), d += 486.26 * Math.cos(O - b) - 40.13 * Math.cos(O) + 37.51 * Math.cos(b) + 25.73 * Math.cos(L - b) + 19.97 * Math.cos(O - m - b), p += -55609 * Math.sin(O - E) - 34711 * Math.sin(O - L) - 9792 * Math.sin(E) + 9385 * Math.sin(S - j) + 7505 * Math.sin(S - L) + 5318 * Math.sin(O + E) + 3484 * Math.sin(S - x) - 3417 * Math.sin(O - m - E) - 2530 * Math.sin(_ - x) - 2376 * Math.sin(O) - 2075 * Math.sin(O - j) - 1883 * Math.sin(L) - 1736 * Math.sin(_ - 5 * E) + 1626 * Math.sin(m) - 1370 * Math.sin(_ - j), y += -5392 * Math.sin(O - b) - 540 * Math.sin(m) - 441 * Math.sin(O) + 423 * Math.sin(b) - 288 * Math.sin(L - b), v += -3332.9 * Math.sin(O) + 1197.4 * Math.sin(O - E) - 662.5 * Math.sin(m) + 396.3 * Math.sin(E) - 218 * Math.sin(O - m);
					var C = 2 * I,
						R = 3 * I;
					d += 46.997 * Math.cos(I) * n - .614 * Math.cos(O - b + I) * n + .614 * Math.cos(O - b - I) * n - .0297 * Math.cos(C) * i - .0335 * Math.cos(I) * i + .0012 * Math.cos(O - b + C) * i - 16e-5 * Math.cos(I) * r + 4e-5 * Math.cos(R) * r + 4e-5 * Math.cos(C) * r;
					var z = 2.116 * Math.sin(I) * n - .111 * Math.sin(O - b - I) * n - .0015 * Math.sin(I) * i;
					return p += z, v += z, y += -520.77 * Math.sin(I) * n + 13.66 * Math.sin(O - b + I) * n + 1.12 * Math.sin(O - I) * n - 1.06 * Math.sin(b - I) * n + .66 * Math.sin(C) * i + .371 * Math.sin(I) * i - .035 * Math.sin(O - b + C) * i - .015 * Math.sin(O - b + I) * i + .0014 * Math.sin(I) * r - .0011 * Math.sin(R) * r - 9e-4 * Math.sin(C) * r, l(a *= N, u, h + d * T, f + p * T, g + y * T, M + v * T, t)
				}

				function v(t, n)
				{
					return n = M(t, n), e.multiplyByScalar(n, Oe, n)
				}
				var A = {},
					E = 32.184,
					m = 2451545,
					w = new i(2451545, 0, a.TAI),
					N = 1e3,
					D = r.RADIANS_PER_DEGREE,
					T = r.RADIANS_PER_ARCSECOND,
					I = new o,
					O = 50,
					S = r.EPSILON8,
					_ = 149598022260.7121,
					L = 100.46645683 * D,
					j = 1295977422.83429 * T,
					x = 16002,
					b = 21863,
					C = 32004,
					R = 10931,
					z = 14529,
					P = 16368,
					U = 15318,
					k = 32794,
					B = 64e-7 * 14959787e4,
					F = -2273887.624,
					Q = 927506.794,
					Y = 14959787e4 * -8e-7,
					G = 32e-7 * 14959787e4,
					V = -613351.267,
					q = 284235.953,
					H = -164557.657,
					W = -2243968.05,
					X = -688150.202,
					Z = 1017265.516,
					K = 807828.498,
					J = 14e-7 * 14959787e4,
					$ = 359034.888,
					ee = 14959787e4 * -28e-7,
					te = 329115.314,
					ne = 10,
					ie = 16002,
					re = 21863,
					oe = 10931,
					se = 1473,
					ae = 32004,
					ue = 4387,
					ce = 73,
					le = -325e-7,
					he = -322e-7,
					de = 1e-7 * -79,
					fe = 232 * 1e-7,
					pe = 1e-7 * -52,
					ge = 97e-7,
					ye = 55e-7,
					Me = -41e-7,
					ve = -105e-7,
					Ae = -137e-7,
					Ee = 258e-7,
					me = 35e-7,
					we = 1e-7 * -116,
					Ne = -88e-7,
					De = -112e-7,
					Te = -8e-6,
					Ie = new i(0, 0, a.TAI),
					Oe = -.01215058143522694,
					Se = new o(1.0000000000000002, 5.619723173785822e-16, 4.690511510146299e-19, -5.154129427414611e-16, .9174820620691819, -.39777715593191376, -2.23970096136568e-16, .39777715593191376, .9174820620691819),
					_e = new e;
				return A.computeSunPositionInEarthInertialFrame = function (n, r)
				{
					return t(n) || (n = i.now()), t(r) || (r = new e), _e = y(n, _e), r = e.negate(_e, r), v(n, _e), e.subtract(r, _e, r), o.multiplyByVector(Se, r, r), r
				}, A.computeMoonPositionInEarthInertialFrame = function (e, n)
				{
					return t(e) || (e = i.now()), n = M(e, n), o.multiplyByVector(Se, n, n), n
				}, A
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("41", ["20", "42", "1e", "15", "5", "6", "43", "d"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e)
				{
					var t = e._uSquared,
						n = e._ellipsoid.maximumRadius,
						i = e._ellipsoid.minimumRadius,
						r = (n - i) / n,
						o = Math.cos(e._startHeading),
						s = Math.sin(e._startHeading),
						a = (1 - r) * Math.tan(e._start.latitude),
						u = 1 / Math.sqrt(1 + a * a),
						c = u * a,
						l = Math.atan2(a, o),
						h = u * s,
						d = h * h,
						f = 1 - d,
						p = Math.sqrt(f),
						g = t / 4,
						y = g * g,
						M = y * g,
						v = y * y,
						A = 1 + g - 3 * y / 4 + 5 * M / 4 - 175 * v / 64,
						E = 1 - g + 15 * y / 8 - 35 * M / 8,
						m = 1 - 3 * g + 35 * y / 4,
						w = 1 - 5 * g,
						N = A * l - E * Math.sin(2 * l) * g / 2 - m * Math.sin(4 * l) * y / 16 - w * Math.sin(6 * l) * M / 48 - 5 * Math.sin(8 * l) * v / 512,
						D = e._constants;
					D.a = n, D.b = i, D.f = r, D.cosineHeading = o, D.sineHeading = s, D.tanU = a, D.cosineU = u, D.sineU = c, D.sigma = l, D.sineAlpha = h, D.sineSquaredAlpha = d, D.cosineSquaredAlpha = f, D.cosineAlpha = p, D.u2Over4 = g, D.u4Over16 = y, D.u6Over64 = M, D.u8Over256 = v, D.a0 = A, D.a1 = E, D.a2 = m, D.a3 = w, D.distanceRatio = N
				}

				function c(e, t)
				{
					return e * t * (4 + e * (4 - 3 * t)) / 16
				}

				function l(e, t, n, i, r, o, s)
				{
					var a = c(e, n);
					return (1 - a) * e * t * (i + a * r * (s + a * o * (2 * s * s - 1)))
				}

				function h(e, t, n, i, r, o, s)
				{
					var u, c, h, d, f, p = (t - n) / t,
						g = o - i,
						y = Math.atan((1 - p) * Math.tan(r)),
						M = Math.atan((1 - p) * Math.tan(s)),
						v = Math.cos(y),
						A = Math.sin(y),
						E = Math.cos(M),
						m = Math.sin(M),
						w = v * E,
						N = v * m,
						D = A * m,
						T = A * E,
						I = g,
						O = a.TWO_PI,
						S = Math.cos(I),
						_ = Math.sin(I);
					do {
						S = Math.cos(I), _ = Math.sin(I);
						var L = N - T * S;
						h = Math.sqrt(E * E * _ * _ + L * L), c = D + w * S, u = Math.atan2(h, c);
						var j;
						0 === h ? (j = 0, d = 1) : d = 1 - (j = w * _ / h) * j, O = I, f = c - 2 * D / d, isNaN(f) && (f = 0), I = g + l(p, j, d, u, h, c, f)
					} while (Math.abs(I - O) > a.EPSILON12);
					var x = d * (t * t - n * n) / (n * n),
						b = x * (256 + x * (x * (74 - 47 * x) - 128)) / 1024,
						C = f * f,
						R = n * (1 + x * (4096 + x * (x * (320 - 175 * x) - 768)) / 16384) * (u - b * h * (f + b * (c * (2 * C - 1) - b * f * (4 * h * h - 3) * (4 * C - 3) / 6) / 4)),
						z = Math.atan2(E * _, N - T * S),
						P = Math.atan2(v * _, N * S - T);
					e._distance = R, e._startHeading = z, e._endHeading = P, e._uSquared = x
				}

				function d(i, r, o, s)
				{
					var a = e.normalize(s.cartographicToCartesian(r, g), p),
						c = e.normalize(s.cartographicToCartesian(o, g), g);
					n.typeOf.number.greaterThanOrEquals("value", Math.abs(Math.abs(e.angleBetween(a, c)) - Math.PI), .0125), h(i, s.maximumRadius, s.minimumRadius, r.longitude, r.latitude, o.longitude, o.latitude), i._start = t.clone(r, i._start), i._end = t.clone(o, i._end), i._start.height = 0, i._end.height = 0, u(i)
				}

				function f(e, n, o)
				{
					var a = i(o, s.WGS84);
					this._ellipsoid = a, this._start = new t, this._end = new t, this._constants = {}, this._startHeading = void 0, this._endHeading = void 0, this._distance = void 0, this._uSquared = void 0, r(e) && r(n) && d(this, e, n, a)
				}
				var p = new e,
					g = new e;
				return o(f.prototype,
				{
					ellipsoid:
					{
						get: function ()
						{
							return this._ellipsoid
						}
					},
					surfaceDistance:
					{
						get: function ()
						{
							return n.defined("distance", this._distance), this._distance
						}
					},
					start:
					{
						get: function ()
						{
							return this._start
						}
					},
					end:
					{
						get: function ()
						{
							return this._end
						}
					},
					startHeading:
					{
						get: function ()
						{
							return n.defined("distance", this._distance), this._startHeading
						}
					},
					endHeading:
					{
						get: function ()
						{
							return n.defined("distance", this._distance), this._endHeading
						}
					}
				}), f.prototype.setEndPoints = function (e, t)
				{
					n.defined("start", e), n.defined("end", t), d(this, e, t, this._ellipsoid)
				}, f.prototype.interpolateUsingFraction = function (e, t)
				{
					return this.interpolateUsingSurfaceDistance(this._distance * e, t)
				}, f.prototype.interpolateUsingSurfaceDistance = function (e, i)
				{
					n.defined("distance", this._distance);
					var o = this._constants,
						s = o.distanceRatio + e / o.b,
						a = Math.cos(2 * s),
						u = Math.cos(4 * s),
						c = Math.cos(6 * s),
						h = Math.sin(2 * s),
						d = Math.sin(4 * s),
						f = Math.sin(6 * s),
						p = Math.sin(8 * s),
						g = s * s,
						y = s * g,
						M = o.u8Over256,
						v = o.u2Over4,
						A = o.u6Over64,
						E = o.u4Over16,
						m = 2 * y * M * a / 3 + s * (1 - v + 7 * E / 4 - 15 * A / 4 + 579 * M / 64 - (E - 15 * A / 4 + 187 * M / 16) * a - (5 * A / 4 - 115 * M / 16) * u - 29 * M * c / 16) + (v / 2 - E + 71 * A / 32 - 85 * M / 16) * h + (5 * E / 16 - 5 * A / 4 + 383 * M / 96) * d - g * ((A - 11 * M / 2) * h + 5 * M * d / 2) + (29 * A / 96 - 29 * M / 16) * f + 539 * M * p / 1536,
						w = Math.asin(Math.sin(m) * o.cosineAlpha),
						N = Math.atan(o.a / o.b * Math.tan(w));
					m -= o.sigma;
					var D = Math.cos(2 * o.sigma + m),
						T = Math.sin(m),
						I = Math.cos(m),
						O = o.cosineU * I,
						S = o.sineU * T,
						_ = Math.atan2(T * o.sineHeading, O - S * o.cosineHeading) - l(o.f, o.sineAlpha, o.cosineSquaredAlpha, m, T, I, D);
					return r(i) ? (i.longitude = this._start.longitude + _, i.latitude = N, i.height = 0, i) : new t(this._start.longitude + _, N, 0)
				}, f
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("44", ["5"], function (e)
			{
				"use strict";
				var t = Array.isArray;
				return e(t) || (t = function (e)
				{
					return "[object Array]" === Object.prototype.toString.call(e)
				}), t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("45", ["20", "42", "15", "5", "7", "43", "41", "46", "44", "d", "29", "35"], function (e, t, n, i, r, o, s, a, u, c, l, h)
			{
				"use strict";

				function d(e, t, n)
				{
					var i = D;
					i.length = e;
					var r;
					if (t === n)
					{
						for (r = 0; r < e; r++) i[r] = t;
						return i
					}
					var o = (n - t) / e;
					for (r = 0; r < e; r++)
					{
						var s = t + r * o;
						i[r] = s
					}
					return i
				}

				function f(t, n, i, r, o, s, a, u)
				{
					var c = r.scaleToGeodeticSurface(t, S),
						l = r.scaleToGeodeticSurface(n, _),
						h = p.numberOfPoints(t, n, i),
						f = r.cartesianToCartographic(c, T),
						g = r.cartesianToCartographic(l, I),
						y = d(h, o, s);
					L.setEndPoints(f, g);
					var M = L.surfaceDistance / h,
						v = u;
					f.height = o;
					var A = r.cartographicToCartesian(f, O);
					e.pack(A, a, v), v += 3;
					for (var E = 1; E < h; E++)
					{
						var m = L.interpolateUsingSurfaceDistance(E * M, I);
						m.height = y[E], A = r.cartographicToCartesian(m, O), e.pack(A, a, v), v += 3
					}
					return v
				}
				var p = {};
				p.numberOfPoints = function (t, n, i)
				{
					var r = e.distance(t, n);
					return Math.ceil(r / i)
				};
				var g = new t;
				p.extractHeights = function (e, t)
				{
					for (var n = e.length, i = new Array(n), r = 0; r < n; r++)
					{
						var o = e[r];
						i[r] = t.cartesianToCartographic(o, g).height
					}
					return i
				};
				var y = new l,
					M = new e,
					v = new e,
					A = new h(e.UNIT_X, 0),
					E = new e,
					m = new h(e.UNIT_X, 0),
					w = new e,
					N = new e,
					D = [],
					T = new t,
					I = new t,
					O = new e,
					S = new e,
					_ = new e,
					L = new s;
				return p.wrapLongitude = function (t, r)
				{
					var o = [],
						s = [];
					if (i(t) && t.length > 0)
					{
						r = n(r, l.IDENTITY);
						var u = l.inverseTransformation(r, y),
							c = l.multiplyByPoint(u, e.ZERO, M),
							d = e.normalize(l.multiplyByPointAsVector(u, e.UNIT_Y, v), v),
							f = h.fromPointNormal(c, d, A),
							p = e.normalize(l.multiplyByPointAsVector(u, e.UNIT_X, E), E),
							g = h.fromPointNormal(c, p, m),
							D = 1;
						o.push(e.clone(t[0]));
						for (var T = o[0], I = t.length, O = 1; O < I; ++O)
						{
							var S = t[O];
							if (h.getPointDistance(g, T) < 0 || h.getPointDistance(g, S) < 0)
							{
								var _ = a.lineSegmentPlane(T, S, f, w);
								if (i(_))
								{
									var L = e.multiplyByScalar(d, 5e-9, N);
									h.getPointDistance(f, T) < 0 && e.negate(L, L), o.push(e.add(_, L, new e)), s.push(D + 1), e.negate(L, L), o.push(e.add(_, L, new e)), D = 1
								}
							}
							o.push(e.clone(t[O])), D++, T = S
						}
						s.push(D)
					}
					return {
						positions: o,
						lengths: s
					}
				}, p.generateArc = function (t)
				{
					i(t) || (t = {});
					var s = t.positions;
					if (!i(s)) throw new r("options.positions is required.");
					var a = s.length,
						l = n(t.ellipsoid, o.WGS84),
						h = n(t.height, 0),
						d = u(h);
					if (a < 1) return [];
					if (1 === a)
					{
						var g = l.scaleToGeodeticSurface(s[0], S);
						if (0 !== (h = d ? h[0] : h))
						{
							var y = l.geodeticSurfaceNormal(g, O);
							e.multiplyByScalar(y, h, y), e.add(g, y, g)
						}
						return [g.x, g.y, g.z]
					}
					var M = t.minDistance;
					if (!i(M))
					{
						var v = n(t.granularity, c.RADIANS_PER_DEGREE);
						M = c.chordLength(v, l.maximumRadius)
					}
					var A, E = 0;
					for (A = 0; A < a - 1; A++) E += p.numberOfPoints(s[A], s[A + 1], M);
					var m = 3 * (E + 1),
						w = new Array(m),
						N = 0;
					for (A = 0; A < a - 1; A++) N = f(s[A], s[A + 1], M, l, d ? h[A] : h, d ? h[A + 1] : h, w, N);
					D.length = 0;
					var I = s[a - 1],
						_ = l.cartesianToCartographic(I, T);
					_.height = d ? h[a - 1] : h;
					var L = l.cartographicToCartesian(_, O);
					return e.pack(L, w, m - 3), w
				}, p.generateCartesianArc = function (t)
				{
					for (var n = p.generateArc(t), i = n.length / 3, r = new Array(i), o = 0; o < i; o++) r[o] = e.unpack(n, 3 * o);
					return r
				}, p
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("47", ["48", "1e", "15", "5", "7", "49", "4a", "4b", "4c", "4d"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(r, c, h)
				{
					return t.defined("url", r), c = n(c, !0), h = i(h) ? h : new a, h.url = r, h.requestFunction = function ()
					{
						var t;
						t = !(s(r) || !c) && o(r);
						var n = e.defer();
						return l.createImage(r, t, n), n.promise
					}, u.request(h)
				}
				return l.createImage = function (e, t, n)
				{
					var i = new Image;
					i.onload = function ()
					{
						n.resolve(i)
					}, i.onerror = function (e)
					{
						n.reject(e)
					}, t && (c.contains(e) ? i.crossOrigin = "use-credentials" : i.crossOrigin = ""), i.src = e
				}, l.defaultCreateImage = l.createImage, l
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("4e", ["a", "15", "5", "6", "43", "4f", "50"], function (e, t, n, i, r, o, s)
			{
				"use strict";

				function a(i)
				{
					if (i = t(i,
						{}), this._ellipsoid = t(i.ellipsoid, r.WGS84), this._numberOfLevelZeroTilesX = t(i.numberOfLevelZeroTilesX, 1), this._numberOfLevelZeroTilesY = t(i.numberOfLevelZeroTilesY, 1), this._projection = new s(this._ellipsoid), n(i.rectangleSouthwestInMeters) && n(i.rectangleNortheastInMeters)) this._rectangleSouthwestInMeters = i.rectangleSouthwestInMeters, this._rectangleNortheastInMeters = i.rectangleNortheastInMeters;
					else
					{
						var a = this._ellipsoid.maximumRadius * Math.PI;
						this._rectangleSouthwestInMeters = new e(-a, -a), this._rectangleNortheastInMeters = new e(a, a)
					}
					var u = this._projection.unproject(this._rectangleSouthwestInMeters),
						c = this._projection.unproject(this._rectangleNortheastInMeters);
					this._rectangle = new o(u.longitude, u.latitude, c.longitude, c.latitude)
				}
				return i(a.prototype,
				{
					ellipsoid:
					{
						get: function ()
						{
							return this._ellipsoid
						}
					},
					rectangle:
					{
						get: function ()
						{
							return this._rectangle
						}
					},
					projection:
					{
						get: function ()
						{
							return this._projection
						}
					}
				}), a.prototype.getNumberOfXTilesAtLevel = function (e)
				{
					return this._numberOfLevelZeroTilesX << e
				}, a.prototype.getNumberOfYTilesAtLevel = function (e)
				{
					return this._numberOfLevelZeroTilesY << e
				}, a.prototype.rectangleToNativeRectangle = function (e, t)
				{
					var i = this._projection,
						r = i.project(o.southwest(e)),
						s = i.project(o.northeast(e));
					return n(t) ? (t.west = r.x, t.south = r.y, t.east = s.x, t.north = s.y, t) : new o(r.x, r.y, s.x, s.y)
				}, a.prototype.tileXYToNativeRectangle = function (e, t, i, r)
				{
					var s = this.getNumberOfXTilesAtLevel(i),
						a = this.getNumberOfYTilesAtLevel(i),
						u = (this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x) / s,
						c = this._rectangleSouthwestInMeters.x + e * u,
						l = this._rectangleSouthwestInMeters.x + (e + 1) * u,
						h = (this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y) / a,
						d = this._rectangleNortheastInMeters.y - t * h,
						f = this._rectangleNortheastInMeters.y - (t + 1) * h;
					return n(r) ? (r.west = c, r.south = f, r.east = l, r.north = d, r) : new o(c, f, l, d)
				}, a.prototype.tileXYToRectangle = function (t, n, i, r)
				{
					var o = this.tileXYToNativeRectangle(t, n, i, r),
						s = this._projection,
						a = s.unproject(new e(o.west, o.south)),
						u = s.unproject(new e(o.east, o.north));
					return o.west = a.longitude, o.south = a.latitude, o.east = u.longitude, o.north = u.latitude, o
				}, a.prototype.positionToTileXY = function (t, i, r)
				{
					var s = this._rectangle;
					if (o.contains(s, t))
					{
						var a = this.getNumberOfXTilesAtLevel(i),
							u = this.getNumberOfYTilesAtLevel(i),
							c = (this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x) / a,
							l = (this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y) / u,
							h = this._projection.project(t),
							d = h.x - this._rectangleSouthwestInMeters.x,
							f = this._rectangleNortheastInMeters.y - h.y,
							p = d / c | 0;
						p >= a && (p = a - 1);
						var g = f / l | 0;
						return g >= u && (g = u - 1), n(r) ? (r.x = p, r.y = g, r) : new e(p, g)
					}
				}, a
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("51", ["5"], function (e)
			{
				"use strict";

				function t(t, i, r)
				{
					e(i) || (i = t.width), e(r) || (r = t.height);
					var o = n[i];
					e(o) || (o = {}, n[i] = o);
					var s = o[r];
					if (!e(s))
					{
						var a = document.createElement("canvas");
						a.width = i, a.height = r, (s = a.getContext("2d")).globalCompositeOperation = "copy", o[r] = s
					}
					return s.drawImage(t, 0, 0, i, r), s.getImageData(0, 0, i, r).data
				}
				var n = {};
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("52", ["a", "1e", "15", "5", "6", "43", "53", "d", "4f"], function (e, t, n, i, r, o, s, a, u)
			{
				"use strict";

				function c(e)
				{
					e = n(e,
					{}), this._ellipsoid = n(e.ellipsoid, o.WGS84), this._rectangle = n(e.rectangle, u.MAX_VALUE), this._projection = new s(this._ellipsoid), this._numberOfLevelZeroTilesX = n(e.numberOfLevelZeroTilesX, 2), this._numberOfLevelZeroTilesY = n(e.numberOfLevelZeroTilesY, 1)
				}
				return r(c.prototype,
				{
					ellipsoid:
					{
						get: function ()
						{
							return this._ellipsoid
						}
					},
					rectangle:
					{
						get: function ()
						{
							return this._rectangle
						}
					},
					projection:
					{
						get: function ()
						{
							return this._projection
						}
					}
				}), c.prototype.getNumberOfXTilesAtLevel = function (e)
				{
					return this._numberOfLevelZeroTilesX << e
				}, c.prototype.getNumberOfYTilesAtLevel = function (e)
				{
					return this._numberOfLevelZeroTilesY << e
				}, c.prototype.rectangleToNativeRectangle = function (e, n)
				{
					t.defined("rectangle", e);
					var r = a.toDegrees(e.west),
						o = a.toDegrees(e.south),
						s = a.toDegrees(e.east),
						c = a.toDegrees(e.north);
					return i(n) ? (n.west = r, n.south = o, n.east = s, n.north = c, n) : new u(r, o, s, c)
				}, c.prototype.tileXYToNativeRectangle = function (e, t, n, i)
				{
					var r = this.tileXYToRectangle(e, t, n, i);
					return r.west = a.toDegrees(r.west), r.south = a.toDegrees(r.south), r.east = a.toDegrees(r.east), r.north = a.toDegrees(r.north), r
				}, c.prototype.tileXYToRectangle = function (e, t, n, r)
				{
					var o = this._rectangle,
						s = this.getNumberOfXTilesAtLevel(n),
						a = this.getNumberOfYTilesAtLevel(n),
						c = o.width / s,
						l = e * c + o.west,
						h = (e + 1) * c + o.west,
						d = o.height / a,
						f = o.north - t * d,
						p = o.north - (t + 1) * d;
					return i(r) || (r = new u(l, p, h, f)), r.west = l, r.south = p, r.east = h, r.north = f, r
				}, c.prototype.positionToTileXY = function (t, n, r)
				{
					var o = this._rectangle;
					if (u.contains(o, t))
					{
						var s = this.getNumberOfXTilesAtLevel(n),
							c = this.getNumberOfYTilesAtLevel(n),
							l = o.width / s,
							h = o.height / c,
							d = t.longitude;
						o.east < o.west && (d += a.TWO_PI);
						var f = (d - o.west) / l | 0;
						f >= s && (f = s - 1);
						var p = (o.north - t.latitude) / h | 0;
						return p >= c && (p = c - 1), i(r) ? (r.x = f, r.y = p, r) : new e(f, p)
					}
				}, c
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("54", ["55", "20", "1e", "15", "5", "6", "4f"], function (e, t, n, i, r, o, s)
			{
				"use strict";

				function a(e, i)
				{
					n.typeOf.object("ellipsoid", e), this._ellipsoid = e, this._cameraPosition = new t, this._cameraPositionInScaledSpace = new t, this._distanceToLimbInScaledSpaceSquared = 0, r(i) && (this.cameraPosition = i)
				}

				function u(e, n, i)
				{
					var r = e.transformPositionToScaledSpace(n, p),
						o = t.magnitudeSquared(r),
						s = Math.sqrt(o),
						a = t.divideByScalar(r, s, g);
					o = Math.max(1, o);
					var u = 1 / (s = Math.max(1, s));
					return 1 / (t.dot(a, i) * u - t.magnitude(t.cross(a, i, a)) * (Math.sqrt(o - 1) * u))
				}

				function c(e, n, i)
				{
					if (!(n <= 0 || n === 1 / 0 || n !== n)) return t.multiplyByScalar(e, n, i)
				}

				function l(e, n)
				{
					return t.equals(n, t.ZERO) ? n : (e.transformPositionToScaledSpace(n, y), t.normalize(y, y))
				}
				o(a.prototype,
				{
					ellipsoid:
					{
						get: function ()
						{
							return this._ellipsoid
						}
					},
					cameraPosition:
					{
						get: function ()
						{
							return this._cameraPosition
						},
						set: function (e)
						{
							var n = this._ellipsoid.transformPositionToScaledSpace(e, this._cameraPositionInScaledSpace),
								i = t.magnitudeSquared(n) - 1;
							t.clone(e, this._cameraPosition), this._cameraPositionInScaledSpace = n, this._distanceToLimbInScaledSpaceSquared = i
						}
					}
				});
				var h = new t;
				a.prototype.isPointVisible = function (e)
				{
					var t = this._ellipsoid.transformPositionToScaledSpace(e, h);
					return this.isScaledSpacePointVisible(t)
				}, a.prototype.isScaledSpacePointVisible = function (e)
				{
					var n = this._cameraPositionInScaledSpace,
						i = this._distanceToLimbInScaledSpaceSquared,
						r = t.subtract(e, n, h),
						o = -t.dot(r, n);
					return !(i < 0 ? o > 0 : o > i && o * o / t.magnitudeSquared(r) > i)
				}, a.prototype.computeHorizonCullingPoint = function (e, i, o)
				{
					n.typeOf.object("directionToPoint", e), n.defined("positions", i), r(o) || (o = new t);
					for (var s = this._ellipsoid, a = l(s, e), h = 0, d = 0, f = i.length; d < f; ++d)
					{
						var p = u(s, i[d], a);
						h = Math.max(h, p)
					}
					return c(a, h, o)
				};
				var d = new t;
				a.prototype.computeHorizonCullingPointFromVertices = function (e, o, s, a, h)
				{
					n.typeOf.object("directionToPoint", e), n.defined("vertices", o), n.typeOf.number("stride", s), r(h) || (h = new t), a = i(a, t.ZERO);
					for (var f = this._ellipsoid, p = l(f, e), g = 0, y = 0, M = o.length; y < M; y += s)
					{
						d.x = o[y] + a.x, d.y = o[y + 1] + a.y, d.z = o[y + 2] + a.z;
						var v = u(f, d, p);
						g = Math.max(g, v)
					}
					return c(p, g, h)
				};
				var f = [];
				a.prototype.computeHorizonCullingPointFromRectangle = function (i, r, o)
				{
					n.typeOf.object("rectangle", i);
					var a = s.subsample(i, r, 0, f),
						u = e.fromPoints(a);
					if (!(t.magnitude(u.center) < .1 * r.minimumRadius)) return this.computeHorizonCullingPoint(u.center, a, o)
				};
				var p = new t,
					g = new t,
					y = new t;
				return a
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("53", ["20", "42", "15", "5", "6", "7", "43"], function (e, t, n, i, r, o, s)
			{
				"use strict";

				function a(e)
				{
					this._ellipsoid = n(e, s.WGS84), this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis
				}
				return r(a.prototype,
				{
					ellipsoid:
					{
						get: function ()
						{
							return this._ellipsoid
						}
					}
				}), a.prototype.project = function (t, n)
				{
					var r = this._semimajorAxis,
						o = t.longitude * r,
						s = t.latitude * r,
						a = t.height;
					return i(n) ? (n.x = o, n.y = s, n.z = a, n) : new e(o, s, a)
				}, a.prototype.unproject = function (e, n)
				{
					if (!i(e)) throw new o("cartesian is required");
					var r = this._oneOverSemimajorAxis,
						s = e.x * r,
						a = e.y * r,
						u = e.z;
					return i(n) ? (n.longitude = s, n.latitude = a, n.height = u, n) : new t(s, a, u)
				}, a
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("55", ["20", "42", "1e", "15", "5", "43", "53", "34", "56", "28", "29", "4f"], function (e, t, n, i, r, o, s, a, u, c, l, h)
			{
				"use strict";

				function d(t, n)
				{
					this.center = e.clone(i(t, e.ZERO)), this.radius = i(n, 0)
				}
				var f = new e,
					p = new e,
					g = new e,
					y = new e,
					M = new e,
					v = new e,
					A = new e,
					E = new e,
					m = new e,
					w = new e,
					N = new e,
					D = new e;
				d.fromPoints = function (t, n)
				{
					if (r(n) || (n = new d), !r(t) || 0 === t.length) return n.center = e.clone(e.ZERO, n.center), n.radius = 0, n;
					var i, o = e.clone(t[0], A),
						s = e.clone(o, f),
						a = e.clone(o, p),
						u = e.clone(o, g),
						c = e.clone(o, y),
						l = e.clone(o, M),
						h = e.clone(o, v),
						T = t.length;
					for (i = 1; i < T; i++)
					{
						e.clone(t[i], o);
						var I = o.x,
							O = o.y,
							S = o.z;
						I < s.x && e.clone(o, s), I > c.x && e.clone(o, c), O < a.y && e.clone(o, a), O > l.y && e.clone(o, l), S < u.z && e.clone(o, u), S > h.z && e.clone(o, h)
					}
					var _ = e.magnitudeSquared(e.subtract(c, s, E)),
						L = e.magnitudeSquared(e.subtract(l, a, E)),
						j = e.magnitudeSquared(e.subtract(h, u, E)),
						x = s,
						b = c,
						C = _;
					L > C && (C = L, x = a, b = l), j > C && (C = j, x = u, b = h);
					var R = m;
					R.x = .5 * (x.x + b.x), R.y = .5 * (x.y + b.y), R.z = .5 * (x.z + b.z);
					var z = e.magnitudeSquared(e.subtract(b, R, E)),
						P = Math.sqrt(z),
						U = w;
					U.x = s.x, U.y = a.y, U.z = u.z;
					var k = N;
					k.x = c.x, k.y = l.y, k.z = h.z;
					var B = e.multiplyByScalar(e.add(U, k, E), .5, D),
						F = 0;
					for (i = 0; i < T; i++)
					{
						e.clone(t[i], o);
						var Q = e.magnitude(e.subtract(o, B, E));
						Q > F && (F = Q);
						var Y = e.magnitudeSquared(e.subtract(o, R, E));
						if (Y > z)
						{
							var G = Math.sqrt(Y);
							z = (P = .5 * (P + G)) * P;
							var V = G - P;
							R.x = (P * R.x + V * o.x) / G, R.y = (P * R.y + V * o.y) / G, R.z = (P * R.z + V * o.z) / G
						}
					}
					return P < F ? (e.clone(R, n.center), n.radius = P) : (e.clone(B, n.center), n.radius = F), n
				};
				var T = new s,
					I = new e,
					O = new e,
					S = new t,
					_ = new t;
				d.fromRectangle2D = function (e, t, n)
				{
					return d.fromRectangleWithHeights2D(e, t, 0, 0, n)
				}, d.fromRectangleWithHeights2D = function (t, n, o, s, a)
				{
					if (r(a) || (a = new d), !r(t)) return a.center = e.clone(e.ZERO, a.center), a.radius = 0, a;
					n = i(n, T), h.southwest(t, S), S.height = o, h.northeast(t, _), _.height = s;
					var u = n.project(S, I),
						c = n.project(_, O),
						l = c.x - u.x,
						f = c.y - u.y,
						p = c.z - u.z;
					a.radius = .5 * Math.sqrt(l * l + f * f + p * p);
					var g = a.center;
					return g.x = u.x + .5 * l, g.y = u.y + .5 * f, g.z = u.z + .5 * p, a
				};
				var L = [];
				d.fromRectangle3D = function (e, t, n, s)
				{
					t = i(t, o.WGS84), n = i(n, 0);
					var a;
					return r(e) && (a = h.subsample(e, t, n, L)), d.fromPoints(a, s)
				}, d.fromVertices = function (t, o, s, a)
				{
					if (r(a) || (a = new d), !r(t) || 0 === t.length) return a.center = e.clone(e.ZERO, a.center), a.radius = 0, a;
					o = i(o, e.ZERO), s = i(s, 3), n.typeOf.number.greaterThanOrEquals("stride", s, 3);
					var u = A;
					u.x = t[0] + o.x, u.y = t[1] + o.y, u.z = t[2] + o.z;
					var c, l = e.clone(u, f),
						h = e.clone(u, p),
						T = e.clone(u, g),
						I = e.clone(u, y),
						O = e.clone(u, M),
						S = e.clone(u, v),
						_ = t.length;
					for (c = 0; c < _; c += s)
					{
						var L = t[c] + o.x,
							j = t[c + 1] + o.y,
							x = t[c + 2] + o.z;
						u.x = L, u.y = j, u.z = x, L < l.x && e.clone(u, l), L > I.x && e.clone(u, I), j < h.y && e.clone(u, h), j > O.y && e.clone(u, O), x < T.z && e.clone(u, T), x > S.z && e.clone(u, S)
					}
					var b = e.magnitudeSquared(e.subtract(I, l, E)),
						C = e.magnitudeSquared(e.subtract(O, h, E)),
						R = e.magnitudeSquared(e.subtract(S, T, E)),
						z = l,
						P = I,
						U = b;
					C > U && (U = C, z = h, P = O), R > U && (U = R, z = T, P = S);
					var k = m;
					k.x = .5 * (z.x + P.x), k.y = .5 * (z.y + P.y), k.z = .5 * (z.z + P.z);
					var B = e.magnitudeSquared(e.subtract(P, k, E)),
						F = Math.sqrt(B),
						Q = w;
					Q.x = l.x, Q.y = h.y, Q.z = T.z;
					var Y = N;
					Y.x = I.x, Y.y = O.y, Y.z = S.z;
					var G = e.multiplyByScalar(e.add(Q, Y, E), .5, D),
						V = 0;
					for (c = 0; c < _; c += s)
					{
						u.x = t[c] + o.x, u.y = t[c + 1] + o.y, u.z = t[c + 2] + o.z;
						var q = e.magnitude(e.subtract(u, G, E));
						q > V && (V = q);
						var H = e.magnitudeSquared(e.subtract(u, k, E));
						if (H > B)
						{
							var W = Math.sqrt(H);
							B = (F = .5 * (F + W)) * F;
							var X = W - F;
							k.x = (F * k.x + X * u.x) / W, k.y = (F * k.y + X * u.y) / W, k.z = (F * k.z + X * u.z) / W
						}
					}
					return F < V ? (e.clone(k, a.center), a.radius = F) : (e.clone(G, a.center), a.radius = V), a
				}, d.fromEncodedCartesianVertices = function (t, n, i)
				{
					if (r(i) || (i = new d), !r(t) || !r(n) || t.length !== n.length || 0 === t.length) return i.center = e.clone(e.ZERO, i.center), i.radius = 0, i;
					var o = A;
					o.x = t[0] + n[0], o.y = t[1] + n[1], o.z = t[2] + n[2];
					var s, a = e.clone(o, f),
						u = e.clone(o, p),
						c = e.clone(o, g),
						l = e.clone(o, y),
						h = e.clone(o, M),
						T = e.clone(o, v),
						I = t.length;
					for (s = 0; s < I; s += 3)
					{
						var O = t[s] + n[s],
							S = t[s + 1] + n[s + 1],
							_ = t[s + 2] + n[s + 2];
						o.x = O, o.y = S, o.z = _, O < a.x && e.clone(o, a), O > l.x && e.clone(o, l), S < u.y && e.clone(o, u), S > h.y && e.clone(o, h), _ < c.z && e.clone(o, c), _ > T.z && e.clone(o, T)
					}
					var L = e.magnitudeSquared(e.subtract(l, a, E)),
						j = e.magnitudeSquared(e.subtract(h, u, E)),
						x = e.magnitudeSquared(e.subtract(T, c, E)),
						b = a,
						C = l,
						R = L;
					j > R && (R = j, b = u, C = h), x > R && (R = x, b = c, C = T);
					var z = m;
					z.x = .5 * (b.x + C.x), z.y = .5 * (b.y + C.y), z.z = .5 * (b.z + C.z);
					var P = e.magnitudeSquared(e.subtract(C, z, E)),
						U = Math.sqrt(P),
						k = w;
					k.x = a.x, k.y = u.y, k.z = c.z;
					var B = N;
					B.x = l.x, B.y = h.y, B.z = T.z;
					var F = e.multiplyByScalar(e.add(k, B, E), .5, D),
						Q = 0;
					for (s = 0; s < I; s += 3)
					{
						o.x = t[s] + n[s], o.y = t[s + 1] + n[s + 1], o.z = t[s + 2] + n[s + 2];
						var Y = e.magnitude(e.subtract(o, F, E));
						Y > Q && (Q = Y);
						var G = e.magnitudeSquared(e.subtract(o, z, E));
						if (G > P)
						{
							var V = Math.sqrt(G);
							P = (U = .5 * (U + V)) * U;
							var q = V - U;
							z.x = (U * z.x + q * o.x) / V, z.y = (U * z.y + q * o.y) / V, z.z = (U * z.z + q * o.z) / V
						}
					}
					return U < Q ? (e.clone(z, i.center), i.radius = U) : (e.clone(F, i.center), i.radius = Q), i
				}, d.fromCornerPoints = function (t, i, o)
				{
					n.typeOf.object("corner", t), n.typeOf.object("oppositeCorner", i), r(o) || (o = new d);
					var s = o.center;
					return e.add(t, i, s), e.multiplyByScalar(s, .5, s), o.radius = e.distance(s, i), o
				}, d.fromEllipsoid = function (t, i)
				{
					return n.typeOf.object("ellipsoid", t), r(i) || (i = new d), e.clone(e.ZERO, i.center), i.radius = t.maximumRadius, i
				};
				var j = new e;
				d.fromBoundingSpheres = function (t, n)
				{
					if (r(n) || (n = new d), !r(t) || 0 === t.length) return n.center = e.clone(e.ZERO, n.center), n.radius = 0, n;
					var i = t.length;
					if (1 === i) return d.clone(t[0], n);
					if (2 === i) return d.union(t[0], t[1], n);
					var o, s = [];
					for (o = 0; o < i; o++) s.push(t[o].center);
					var a = (n = d.fromPoints(s, n)).center,
						u = n.radius;
					for (o = 0; o < i; o++)
					{
						var c = t[o];
						u = Math.max(u, e.distance(a, c.center, j) + c.radius)
					}
					return n.radius = u, n
				};
				var x = new e,
					b = new e,
					C = new e;
				d.fromOrientedBoundingBox = function (t, i)
				{
					n.defined("orientedBoundingBox", t), r(i) || (i = new d);
					var o = t.halfAxes,
						s = c.getColumn(o, 0, x),
						a = c.getColumn(o, 1, b),
						u = c.getColumn(o, 2, C);
					return e.add(s, a, s), e.add(s, u, s), i.center = e.clone(t.center, i.center), i.radius = e.magnitude(s), i
				}, d.clone = function (t, n)
				{
					if (r(t)) return r(n) ? (n.center = e.clone(t.center, n.center), n.radius = t.radius, n) : new d(t.center, t.radius)
				}, d.packedLength = 4, d.pack = function (e, t, r)
				{
					n.typeOf.object("value", e), n.defined("array", t), r = i(r, 0);
					var o = e.center;
					return t[r++] = o.x, t[r++] = o.y, t[r++] = o.z, t[r] = e.radius, t
				}, d.unpack = function (e, t, o)
				{
					n.defined("array", e), t = i(t, 0), r(o) || (o = new d);
					var s = o.center;
					return s.x = e[t++], s.y = e[t++], s.z = e[t++], o.radius = e[t], o
				};
				var R = new e,
					z = new e;
				d.union = function (t, i, o)
				{
					n.typeOf.object("left", t), n.typeOf.object("right", i), r(o) || (o = new d);
					var s = t.center,
						a = t.radius,
						u = i.center,
						c = i.radius,
						l = e.subtract(u, s, R),
						h = e.magnitude(l);
					if (a >= h + c) return t.clone(o), o;
					if (c >= h + a) return i.clone(o), o;
					var f = .5 * (a + h + c),
						p = e.multiplyByScalar(l, (-a + f) / h, z);
					return e.add(p, s, p), e.clone(p, o.center), o.radius = f, o
				};
				var P = new e;
				d.expand = function (t, i, r)
				{
					n.typeOf.object("sphere", t), n.typeOf.object("point", i), r = d.clone(t, r);
					var o = e.magnitude(e.subtract(i, r.center, P));
					return o > r.radius && (r.radius = o), r
				}, d.intersectPlane = function (t, i)
				{
					n.typeOf.object("sphere", t), n.typeOf.object("plane", i);
					var r = t.center,
						o = t.radius,
						s = i.normal,
						u = e.dot(s, r) + i.distance;
					return u < -o ? a.OUTSIDE : u < o ? a.INTERSECTING : a.INSIDE
				}, d.transform = function (e, t, i)
				{
					return n.typeOf.object("sphere", e), n.typeOf.object("transform", t), r(i) || (i = new d), i.center = l.multiplyByPoint(t, e.center, i.center), i.radius = l.getMaximumScale(t) * e.radius, i
				};
				var U = new e;
				d.distanceSquaredTo = function (t, i)
				{
					n.typeOf.object("sphere", t), n.typeOf.object("cartesian", i);
					var r = e.subtract(t.center, i, U);
					return e.magnitudeSquared(r) - t.radius * t.radius
				}, d.transformWithoutScale = function (e, t, i)
				{
					return n.typeOf.object("sphere", e), n.typeOf.object("transform", t), r(i) || (i = new d), i.center = l.multiplyByPoint(t, e.center, i.center), i.radius = e.radius, i
				};
				var k = new e;
				d.computePlaneDistances = function (t, i, o, s)
				{
					n.typeOf.object("sphere", t), n.typeOf.object("position", i), n.typeOf.object("direction", o), r(s) || (s = new u);
					var a = e.subtract(t.center, i, k),
						c = e.dot(o, a);
					return s.start = c - t.radius, s.stop = c + t.radius, s
				};
				for (var B = new e, F = new e, Q = new e, Y = new e, G = new e, V = new t, q = new Array(8), H = 0; H < 8; ++H) q[H] = new e;
				var W = new s;
				return d.projectTo2D = function (t, r, o)
				{
					n.typeOf.object("sphere", t);
					var s = (r = i(r, W)).ellipsoid,
						a = t.center,
						u = t.radius,
						c = s.geodeticSurfaceNormal(a, B),
						l = e.cross(e.UNIT_Z, c, F);
					e.normalize(l, l);
					var h = e.cross(c, l, Q);
					e.normalize(h, h), e.multiplyByScalar(c, u, c), e.multiplyByScalar(h, u, h), e.multiplyByScalar(l, u, l);
					var f = e.negate(h, G),
						p = e.negate(l, Y),
						g = q,
						y = g[0];
					e.add(c, h, y), e.add(y, l, y), y = g[1], e.add(c, h, y), e.add(y, p, y), y = g[2], e.add(c, f, y), e.add(y, p, y), y = g[3], e.add(c, f, y), e.add(y, l, y), e.negate(c, c), y = g[4], e.add(c, h, y), e.add(y, l, y), y = g[5], e.add(c, h, y), e.add(y, p, y), y = g[6], e.add(c, f, y), e.add(y, p, y), y = g[7], e.add(c, f, y), e.add(y, l, y);
					for (var M = g.length, v = 0; v < M; ++v)
					{
						var A = g[v];
						e.add(a, A, A);
						var E = s.cartesianToCartographic(A, V);
						r.project(E, A)
					}
					var m = (a = (o = d.fromPoints(g, o)).center).x,
						w = a.y,
						N = a.z;
					return a.x = N, a.y = m, a.z = w, o
				}, d.isOccluded = function (e, t)
				{
					return n.typeOf.object("sphere", e), n.typeOf.object("occluder", t), !t.isBoundingSphereVisible(e)
				}, d.equals = function (t, n)
				{
					return t === n || r(t) && r(n) && e.equals(t.center, n.center) && t.radius === n.radius
				}, d.prototype.intersectPlane = function (e)
				{
					return d.intersectPlane(this, e)
				}, d.prototype.distanceSquaredTo = function (e)
				{
					return d.distanceSquaredTo(this, e)
				}, d.prototype.computePlaneDistances = function (e, t, n)
				{
					return d.computePlaneDistances(this, e, t, n)
				}, d.prototype.isOccluded = function (e)
				{
					return d.isOccluded(this, e)
				}, d.prototype.equals = function (e)
				{
					return d.equals(this, e)
				}, d.prototype.clone = function (e)
				{
					return d.clone(this, e)
				}, d
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("57", ["20", "1e", "15", "5", "34"], function (e, t, n, i, r)
			{
				"use strict";

				function o(t, r, o)
				{
					this.minimum = e.clone(n(t, e.ZERO)), this.maximum = e.clone(n(r, e.ZERO)), i(o) ? o = e.clone(o) : (o = e.add(this.minimum, this.maximum, new e), e.multiplyByScalar(o, .5, o)), this.center = o
				}
				o.fromPoints = function (t, n)
				{
					if (i(n) || (n = new o), !i(t) || 0 === t.length) return n.minimum = e.clone(e.ZERO, n.minimum), n.maximum = e.clone(e.ZERO, n.maximum), n.center = e.clone(e.ZERO, n.center), n;
					for (var r = t[0].x, s = t[0].y, a = t[0].z, u = t[0].x, c = t[0].y, l = t[0].z, h = t.length, d = 1; d < h; d++)
					{
						var f = t[d],
							p = f.x,
							g = f.y,
							y = f.z;
						r = Math.min(p, r), u = Math.max(p, u), s = Math.min(g, s), c = Math.max(g, c), a = Math.min(y, a), l = Math.max(y, l)
					}
					var M = n.minimum;
					M.x = r, M.y = s, M.z = a;
					var v = n.maximum;
					v.x = u, v.y = c, v.z = l;
					var A = e.add(M, v, n.center);
					return e.multiplyByScalar(A, .5, A), n
				}, o.clone = function (t, n)
				{
					if (i(t)) return i(n) ? (n.minimum = e.clone(t.minimum, n.minimum), n.maximum = e.clone(t.maximum, n.maximum), n.center = e.clone(t.center, n.center), n) : new o(t.minimum, t.maximum)
				}, o.equals = function (t, n)
				{
					return t === n || i(t) && i(n) && e.equals(t.center, n.center) && e.equals(t.minimum, n.minimum) && e.equals(t.maximum, n.maximum)
				};
				var s = new e;
				return o.intersectPlane = function (n, i)
				{
					t.defined("box", n), t.defined("plane", i), s = e.subtract(n.maximum, n.minimum, s);
					var o = e.multiplyByScalar(s, .5, s),
						a = i.normal,
						u = o.x * Math.abs(a.x) + o.y * Math.abs(a.y) + o.z * Math.abs(a.z),
						c = e.dot(n.center, a) + i.distance;
					return c - u > 0 ? r.INSIDE : c + u < 0 ? r.OUTSIDE : r.INTERSECTING
				}, o.prototype.clone = function (e)
				{
					return o.clone(this, e)
				}, o.prototype.intersectPlane = function (e)
				{
					return o.intersectPlane(this, e)
				}, o.prototype.equals = function (e)
				{
					return o.equals(this, e)
				}, o
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("58", ["7", "59"], function (e, t)
			{
				"use strict";

				function n(e, t, n, i)
				{
					var r, o, s = e,
						a = t / 3,
						u = n / 3,
						c = i,
						l = s * u,
						h = a * c,
						d = a * a,
						f = u * u,
						p = s * u - d,
						g = s * c - a * u,
						y = a * c - f,
						M = 4 * p * y - g * g;
					if (M < 0)
					{
						var v, A, E;
						d * h >= l * f ? (v = s, A = p, E = -2 * a * p + s * g) : (v = c, A = y, E = -c * g + 2 * u * y);
						var m = -(E < 0 ? -1 : 1) * Math.abs(v) * Math.sqrt(-M),
							w = (o = -E + m) / 2,
							N = w < 0 ? -Math.pow(-w, 1 / 3) : Math.pow(w, 1 / 3),
							D = o === m ? -N : -A / N;
						return r = A <= 0 ? N + D : -E / (N * N + D * D + A), d * h >= l * f ? [(r - a) / s] : [-c / (r + u)]
					}
					var T = p,
						I = -2 * a * p + s * g,
						O = y,
						S = -c * g + 2 * u * y,
						_ = Math.sqrt(M),
						L = Math.sqrt(3) / 2,
						j = Math.abs(Math.atan2(s * _, -I) / 3);
					r = 2 * Math.sqrt(-T);
					var x = Math.cos(j);
					o = r * x;
					var b = r * (-x / 2 - L * Math.sin(j)),
						C = o + b > 2 * a ? o - a : b - a,
						R = s,
						z = C / R;
					j = Math.abs(Math.atan2(c * _, -S) / 3);
					var P = -c,
						U = (o = (r = 2 * Math.sqrt(-O)) * (x = Math.cos(j))) + (b = r * (-x / 2 - L * Math.sin(j))) < 2 * u ? o + u : b + u,
						k = P / U,
						B = -C * U - R * P,
						F = (u * B - a * (C * P)) / (-a * B + u * (R * U));
					return z <= F ? z <= k ? F <= k ? [z, F, k] : [z, k, F] : [k, z, F] : z <= k ? [F, z, k] : F <= k ? [F, k, z] : [k, F, z]
				}
				var i = {};
				return i.computeDiscriminant = function (t, n, i, r)
				{
					if ("number" != typeof t) throw new e("a is a required number.");
					if ("number" != typeof n) throw new e("b is a required number.");
					if ("number" != typeof i) throw new e("c is a required number.");
					if ("number" != typeof r) throw new e("d is a required number.");
					var o = n * n,
						s = i * i;
					return 18 * t * n * i * r + o * s - 27 * (t * t) * (r * r) - 4 * (t * s * i + o * n * r)
				}, i.computeRealRoots = function (i, r, o, s)
				{
					if ("number" != typeof i) throw new e("a is a required number.");
					if ("number" != typeof r) throw new e("b is a required number.");
					if ("number" != typeof o) throw new e("c is a required number.");
					if ("number" != typeof s) throw new e("d is a required number.");
					var a, u;
					if (0 === i) return t.computeRealRoots(r, o, s);
					if (0 === r)
					{
						if (0 === o)
						{
							if (0 === s) return [0, 0, 0];
							var c = (u = -s / i) < 0 ? -Math.pow(-u, 1 / 3) : Math.pow(u, 1 / 3);
							return [c, c, c]
						}
						return 0 === s ? (a = t.computeRealRoots(i, 0, o), 0 === a.Length ? [0] : [a[0], 0, a[1]]) : n(i, 0, o, s)
					}
					return 0 === o ? 0 === s ? (u = -r / i, u < 0 ? [u, 0, 0] : [0, 0, u]) : n(i, r, 0, s) : 0 === s ? (a = t.computeRealRoots(i, r, o), 0 === a.length ? [0] : a[1] <= 0 ? [a[0], a[1], 0] : a[0] >= 0 ? [0, a[0], a[1]] : [a[0], 0, a[1]]) : n(i, r, o, s)
				}, i
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("59", ["7", "d"], function (e, t)
			{
				"use strict";

				function n(e, n, i)
				{
					var r = e + n;
					return t.sign(e) !== t.sign(n) && Math.abs(r / Math.max(Math.abs(e), Math.abs(n))) < i ? 0 : r
				}
				var i = {};
				return i.computeDiscriminant = function (t, n, i)
				{
					if ("number" != typeof t) throw new e("a is a required number.");
					if ("number" != typeof n) throw new e("b is a required number.");
					if ("number" != typeof i) throw new e("c is a required number.");
					return n * n - 4 * t * i
				}, i.computeRealRoots = function (i, r, o)
				{
					if ("number" != typeof i) throw new e("a is a required number.");
					if ("number" != typeof r) throw new e("b is a required number.");
					if ("number" != typeof o) throw new e("c is a required number.");
					var s;
					if (0 === i) return 0 === r ? [] : [-o / r];
					if (0 === r)
					{
						if (0 === o) return [0, 0];
						var a = Math.abs(o),
							u = Math.abs(i);
						if (a < u && a / u < t.EPSILON14) return [0, 0];
						if (a > u && u / a < t.EPSILON14) return [];
						if ((s = -o / i) < 0) return [];
						var c = Math.sqrt(s);
						return [-c, c]
					}
					if (0 === o) return s = -r / i, s < 0 ? [s, 0] : [0, s];
					var l = n(r * r, -(4 * i * o), t.EPSILON14);
					if (l < 0) return [];
					var h = -.5 * n(r, t.sign(r) * Math.sqrt(l), t.EPSILON14);
					return r > 0 ? [h / i, o / h] : [o / h, h / i]
				}, i
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("5a", ["58", "7", "d", "59"], function (e, t, n, i)
			{
				"use strict";

				function r(t, r, o, s)
				{
					var a = t * t,
						u = r - 3 * a / 8,
						c = o - r * t / 2 + a * t / 8,
						l = s - o * t / 4 + r * a / 16 - 3 * a * a / 256,
						h = e.computeRealRoots(1, 2 * u, u * u - 4 * l, -c * c);
					if (h.length > 0)
					{
						var d = -t / 4,
							f = h[h.length - 1];
						if (Math.abs(f) < n.EPSILON14)
						{
							var p = i.computeRealRoots(1, u, l);
							if (2 === p.length)
							{
								var g, y = p[0],
									M = p[1];
								if (y >= 0 && M >= 0)
								{
									var v = Math.sqrt(y),
										A = Math.sqrt(M);
									return [d - A, d - v, d + v, d + A]
								}
								if (y >= 0 && M < 0) return g = Math.sqrt(y), [d - g, d + g];
								if (y < 0 && M >= 0) return g = Math.sqrt(M), [d - g, d + g]
							}
							return []
						}
						if (f > 0)
						{
							var E = Math.sqrt(f),
								m = (u + f - c / E) / 2,
								w = (u + f + c / E) / 2,
								N = i.computeRealRoots(1, E, m),
								D = i.computeRealRoots(1, -E, w);
							return 0 !== N.length ? (N[0] += d, N[1] += d, 0 !== D.length ? (D[0] += d, D[1] += d, N[1] <= D[0] ? [N[0], N[1], D[0], D[1]] : D[1] <= N[0] ? [D[0], D[1], N[0], N[1]] : N[0] >= D[0] && N[1] <= D[1] ? [D[0], N[0], N[1], D[1]] : D[0] >= N[0] && D[1] <= N[1] ? [N[0], D[0], D[1], N[1]] : N[0] > D[0] && N[0] < D[1] ? [D[0], N[0], D[1], N[1]] : [N[0], D[0], N[1], D[1]]) : N) : 0 !== D.length ? (D[0] += d, D[1] += d, D) : []
						}
					}
					return []
				}

				function o(t, r, o, s)
				{
					var a = t * t,
						u = -2 * r,
						c = o * t + r * r - 4 * s,
						l = a * s - o * r * t + o * o,
						h = e.computeRealRoots(1, u, c, l);
					if (h.length > 0)
					{
						var d, f, p = h[0],
							g = r - p,
							y = g * g,
							M = t / 2,
							v = g / 2,
							A = y - 4 * s,
							E = y + 4 * Math.abs(s),
							m = a - 4 * p,
							w = a + 4 * Math.abs(p);
						if (p < 0 || A * w < m * E)
						{
							var N = Math.sqrt(m);
							d = N / 2, f = 0 === N ? 0 : (t * v - o) / N
						}
						else
						{
							var D = Math.sqrt(A);
							d = 0 === D ? 0 : (t * v - o) / D, f = D / 2
						}
						var T, I;
						0 === M && 0 === d ? (T = 0, I = 0) : n.sign(M) === n.sign(d) ? I = p / (T = M + d) : T = p / (I = M - d);
						var O, S;
						0 === v && 0 === f ? (O = 0, S = 0) : n.sign(v) === n.sign(f) ? S = s / (O = v + f) : O = s / (S = v - f);
						var _ = i.computeRealRoots(1, T, O),
							L = i.computeRealRoots(1, I, S);
						if (0 !== _.length) return 0 !== L.length ? _[1] <= L[0] ? [_[0], _[1], L[0], L[1]] : L[1] <= _[0] ? [L[0], L[1], _[0], _[1]] : _[0] >= L[0] && _[1] <= L[1] ? [L[0], _[0], _[1], L[1]] : L[0] >= _[0] && L[1] <= _[1] ? [_[0], L[0], L[1], _[1]] : _[0] > L[0] && _[0] < L[1] ? [L[0], _[0], L[1], _[1]] : [_[0], L[0], _[1], L[1]] : _;
						if (0 !== L.length) return L
					}
					return []
				}
				var s = {};
				return s.computeDiscriminant = function (e, n, i, r, o)
				{
					if ("number" != typeof e) throw new t("a is a required number.");
					if ("number" != typeof n) throw new t("b is a required number.");
					if ("number" != typeof i) throw new t("c is a required number.");
					if ("number" != typeof r) throw new t("d is a required number.");
					if ("number" != typeof o) throw new t("e is a required number.");
					var s = e * e,
						a = n * n,
						u = a * n,
						c = i * i,
						l = c * i,
						h = r * r,
						d = h * r,
						f = o * o;
					return a * c * h - 4 * u * d - 4 * e * l * h + 18 * e * n * i * d - 27 * s * h * h + 256 * (s * e) * (f * o) + o * (18 * u * i * r - 4 * a * l + 16 * e * c * c - 80 * e * n * c * r - 6 * e * a * h + 144 * s * i * h) + f * (144 * e * a * i - 27 * a * a - 128 * s * c - 192 * s * n * r)
				}, s.computeRealRoots = function (i, s, a, u, c)
				{
					if ("number" != typeof i) throw new t("a is a required number.");
					if ("number" != typeof s) throw new t("b is a required number.");
					if ("number" != typeof a) throw new t("c is a required number.");
					if ("number" != typeof u) throw new t("d is a required number.");
					if ("number" != typeof c) throw new t("e is a required number.");
					if (Math.abs(i) < n.EPSILON15) return e.computeRealRoots(s, a, u, c);
					var l = s / i,
						h = a / i,
						d = u / i,
						f = c / i,
						p = l < 0 ? 1 : 0;
					switch (p += h < 0 ? p + 1 : p, p += d < 0 ? p + 1 : p, p += f < 0 ? p + 1 : p)
					{
					case 0:
						return r(l, h, d, f);
					case 1:
					case 2:
						return o(l, h, d, f);
					case 3:
					case 4:
						return r(l, h, d, f);
					case 5:
						return o(l, h, d, f);
					case 6:
					case 7:
						return r(l, h, d, f);
					case 8:
						return o(l, h, d, f);
					case 9:
					case 10:
						return r(l, h, d, f);
					case 11:
						return o(l, h, d, f);
					case 12:
					case 13:
					case 14:
					case 15:
						return r(l, h, d, f);
					default:
						return
					}
				}, s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("46", ["20", "42", "15", "5", "7", "56", "d", "28", "59", "5a", "5b"], function (e, t, n, i, r, o, s, a, u, c, l)
			{
				"use strict";

				function h(e, t, n, i)
				{
					var r = t * t - 4 * e * n;
					if (!(r < 0))
					{
						if (r > 0)
						{
							var o = 1 / (2 * e),
								s = Math.sqrt(r),
								a = (-t + s) * o,
								u = (-t - s) * o;
							return a < u ? (i.root0 = a, i.root1 = u) : (i.root0 = u, i.root1 = a), i
						}
						var c = -t / (2 * e);
						if (0 !== c) return i.root0 = i.root1 = c, i
					}
				}

				function d(t, n, r)
				{
					i(r) || (r = new o);
					var s = t.origin,
						a = t.direction,
						u = n.center,
						c = n.radius * n.radius,
						l = e.subtract(s, u, v),
						d = h(e.dot(a, a), 2 * e.dot(a, l), e.magnitudeSquared(l) - c, w);
					if (i(d)) return r.start = d.root0, r.stop = d.root1, r
				}

				function f(e, t, n)
				{
					var i = e + t;
					return s.sign(e) !== s.sign(t) && Math.abs(i / Math.max(Math.abs(e), Math.abs(t))) < n ? 0 : i
				}

				function p(t, n, i, r, o)
				{
					var l, h = r * r,
						d = o * o,
						p = (t[a.COLUMN1ROW1] - t[a.COLUMN2ROW2]) * d,
						g = o * (r * f(t[a.COLUMN1ROW0], t[a.COLUMN0ROW1], s.EPSILON15) + n.y),
						y = t[a.COLUMN0ROW0] * h + t[a.COLUMN2ROW2] * d + r * n.x + i,
						M = d * f(t[a.COLUMN2ROW1], t[a.COLUMN1ROW2], s.EPSILON15),
						v = o * (r * f(t[a.COLUMN2ROW0], t[a.COLUMN0ROW2]) + n.z),
						A = [];
					if (0 === v && 0 === M)
					{
						if (0 === (l = u.computeRealRoots(p, g, y)).length) return A;
						var E = l[0],
							m = Math.sqrt(Math.max(1 - E * E, 0));
						if (A.push(new e(r, o * E, o * -m)), A.push(new e(r, o * E, o * m)), 2 === l.length)
						{
							var w = l[1],
								N = Math.sqrt(Math.max(1 - w * w, 0));
							A.push(new e(r, o * w, o * -N)), A.push(new e(r, o * w, o * N))
						}
						return A
					}
					var D = v * v,
						T = M * M,
						I = v * M,
						O = p * p + T,
						S = 2 * (g * p + I),
						_ = 2 * y * p + g * g - T + D,
						L = 2 * (y * g - I),
						j = y * y - D;
					if (0 === O && 0 === S && 0 === _ && 0 === L) return A;
					var x = (l = c.computeRealRoots(O, S, _, L, j)).length;
					if (0 === x) return A;
					for (var b = 0; b < x; ++b)
					{
						var C, R = l[b],
							z = R * R,
							P = Math.max(1 - z, 0),
							U = Math.sqrt(P),
							k = (C = s.sign(p) === s.sign(y) ? f(p * z + y, g * R, s.EPSILON12) : s.sign(y) === s.sign(g * R) ? f(p * z, g * R + y, s.EPSILON12) : f(p * z + g * R, y, s.EPSILON12)) * f(M * R, v, s.EPSILON15);
						k < 0 ? A.push(new e(r, o * R, o * U)) : k > 0 ? A.push(new e(r, o * R, o * -U)) : 0 !== U ? (A.push(new e(r, o * R, o * -U)), A.push(new e(r, o * R, o * U)), ++b) : A.push(new e(r, o * R, o * U))
					}
					return A
				}
				var g = {};
				g.rayPlane = function (t, n, o)
				{
					if (!i(t)) throw new r("ray is required.");
					if (!i(n)) throw new r("plane is required.");
					i(o) || (o = new e);
					var a = t.origin,
						u = t.direction,
						c = n.normal,
						l = e.dot(c, u);
					if (!(Math.abs(l) < s.EPSILON15))
					{
						var h = (-n.distance - e.dot(c, a)) / l;
						if (!(h < 0)) return o = e.multiplyByScalar(u, h, o), e.add(a, o, o)
					}
				};
				var y = new e,
					M = new e,
					v = new e,
					A = new e,
					E = new e;
				g.rayTriangleParametric = function (t, o, a, u, c)
				{
					if (!i(t)) throw new r("ray is required.");
					if (!i(o)) throw new r("p0 is required.");
					if (!i(a)) throw new r("p1 is required.");
					if (!i(u)) throw new r("p2 is required.");
					c = n(c, !1);
					var l, h, d, f, p, g = t.origin,
						m = t.direction,
						w = e.subtract(a, o, y),
						N = e.subtract(u, o, M),
						D = e.cross(m, N, v),
						T = e.dot(w, D);
					if (c)
					{
						if (T < s.EPSILON6) return;
						if (l = e.subtract(g, o, A), (d = e.dot(l, D)) < 0 || d > T) return;
						if (h = e.cross(l, w, E), (f = e.dot(m, h)) < 0 || d + f > T) return;
						p = e.dot(N, h) / T
					}
					else
					{
						if (Math.abs(T) < s.EPSILON6) return;
						var I = 1 / T;
						if (l = e.subtract(g, o, A), (d = e.dot(l, D) * I) < 0 || d > 1) return;
						if (h = e.cross(l, w, E), (f = e.dot(m, h) * I) < 0 || d + f > 1) return;
						p = e.dot(N, h) * I
					}
					return p
				}, g.rayTriangle = function (t, n, r, o, s, a)
				{
					var u = g.rayTriangleParametric(t, n, r, o, s);
					if (i(u) && !(u < 0)) return i(a) || (a = new e), e.multiplyByScalar(t.direction, u, a), e.add(t.origin, a, a)
				};
				var m = new l;
				g.lineSegmentTriangle = function (t, n, o, s, a, u, c)
				{
					if (!i(t)) throw new r("v0 is required.");
					if (!i(n)) throw new r("v1 is required.");
					if (!i(o)) throw new r("p0 is required.");
					if (!i(s)) throw new r("p1 is required.");
					if (!i(a)) throw new r("p2 is required.");
					var l = m;
					e.clone(t, l.origin), e.subtract(n, t, l.direction), e.normalize(l.direction, l.direction);
					var h = g.rayTriangleParametric(l, o, s, a, u);
					if (!(!i(h) || h < 0 || h > e.distance(t, n))) return i(c) || (c = new e), e.multiplyByScalar(l.direction, h, c), e.add(l.origin, c, c)
				};
				var w = {
					root0: 0,
					root1: 0
				};
				g.raySphere = function (e, t, n)
				{
					if (!i(e)) throw new r("ray is required.");
					if (!i(t)) throw new r("sphere is required.");
					if (n = d(e, t, n), i(n) && !(n.stop < 0)) return n.start = Math.max(n.start, 0), n
				};
				var N = new l;
				g.lineSegmentSphere = function (t, n, o, s)
				{
					if (!i(t)) throw new r("p0 is required.");
					if (!i(n)) throw new r("p1 is required.");
					if (!i(o)) throw new r("sphere is required.");
					var a = N;
					e.clone(t, a.origin);
					var u = e.subtract(n, t, a.direction),
						c = e.magnitude(u);
					if (e.normalize(u, u), s = d(a, o, s), !(!i(s) || s.stop < 0 || s.start > c)) return s.start = Math.max(s.start, 0), s.stop = Math.min(s.stop, c), s
				};
				var D = new e,
					T = new e;
				g.rayEllipsoid = function (t, n)
				{
					if (!i(t)) throw new r("ray is required.");
					if (!i(n)) throw new r("ellipsoid is required.");
					var s, a, u, c, l, h = n.oneOverRadii,
						d = e.multiplyComponents(h, t.origin, D),
						f = e.multiplyComponents(h, t.direction, T),
						p = e.magnitudeSquared(d),
						g = e.dot(d, f);
					if (p > 1)
					{
						if (g >= 0) return;
						var y = g * g;
						if (s = p - 1, a = e.magnitudeSquared(f), u = a * s, y < u) return;
						if (y > u)
						{
							c = g * g - u;
							var M = (l = -g + Math.sqrt(c)) / a,
								v = s / l;
							return M < v ? new o(M, v) :
							{
								start: v,
								stop: M
							}
						}
						var A = Math.sqrt(s / a);
						return new o(A, A)
					}
					return p < 1 ? (s = p - 1, a = e.magnitudeSquared(f), u = a * s, c = g * g - u, l = -g + Math.sqrt(c), new o(0, l / a)) : g < 0 ? (a = e.magnitudeSquared(f), new o(0, -g / a)) : void 0
				};
				var I = new e,
					O = new e,
					S = new e,
					_ = new e,
					L = new e,
					j = new a,
					x = new a,
					b = new a,
					C = new a,
					R = new a,
					z = new a,
					P = new a,
					U = new e,
					k = new e,
					B = new t;
				g.grazingAltitudeLocation = function (t, n)
				{
					if (!i(t)) throw new r("ray is required.");
					if (!i(n)) throw new r("ellipsoid is required.");
					var o = t.origin,
						u = t.direction;
					if (!e.equals(o, e.ZERO))
					{
						var c = n.geodeticSurfaceNormal(o, I);
						if (e.dot(u, c) >= 0) return o
					}
					var l = i(this.rayEllipsoid(t, n)),
						h = n.transformPositionToScaledSpace(u, I),
						d = e.normalize(h, h),
						f = e.mostOrthogonalAxis(h, _),
						g = e.normalize(e.cross(f, d, O), O),
						y = e.normalize(e.cross(d, g, S), S),
						M = j;
					M[0] = d.x, M[1] = d.y, M[2] = d.z, M[3] = g.x, M[4] = g.y, M[5] = g.z, M[6] = y.x, M[7] = y.y, M[8] = y.z;
					var v = a.transpose(M, x),
						A = a.fromScale(n.radii, b),
						E = a.fromScale(n.oneOverRadii, C),
						m = R;
					m[0] = 0, m[1] = -u.z, m[2] = u.y, m[3] = u.z, m[4] = 0, m[5] = -u.x, m[6] = -u.y, m[7] = u.x, m[8] = 0;
					var w, N, D = a.multiply(a.multiply(v, E, z), m, z),
						T = a.multiply(a.multiply(D, A, P), M, P),
						F = a.multiplyByVector(D, o, L),
						Q = p(T, e.negate(F, I), 0, 0, 1),
						Y = Q.length;
					if (Y > 0)
					{
						for (var G = e.clone(e.ZERO, k), V = Number.NEGATIVE_INFINITY, q = 0; q < Y; ++q)
						{
							w = a.multiplyByVector(A, a.multiplyByVector(M, Q[q], U), U);
							var H = e.normalize(e.subtract(w, o, _), _),
								W = e.dot(H, u);
							W > V && (V = W, G = e.clone(w, G))
						}
						var X = n.cartesianToCartographic(G, B);
						return V = s.clamp(V, 0, 1), N = e.magnitude(e.subtract(G, o, _)) * Math.sqrt(1 - V * V), N = l ? -N : N, X.height = N, n.cartographicToCartesian(X, new e)
					}
				};
				var F = new e;
				return g.lineSegmentPlane = function (t, n, o, a)
				{
					if (!i(t)) throw new r("endPoint0 is required.");
					if (!i(n)) throw new r("endPoint1 is required.");
					if (!i(o)) throw new r("plane is required.");
					i(a) || (a = new e);
					var u = e.subtract(n, t, F),
						c = o.normal,
						l = e.dot(c, u);
					if (!(Math.abs(l) < s.EPSILON6))
					{
						var h = e.dot(c, t),
							d = -(o.distance + h) / l;
						if (!(d < 0 || d > 1)) return e.multiplyByScalar(u, d, a), e.add(t, a, a), a
					}
				}, g.trianglePlaneIntersection = function (t, n, o, s)
				{
					if (!(i(t) && i(n) && i(o) && i(s))) throw new r("p0, p1, p2, and plane are required.");
					var a = s.normal,
						u = s.distance,
						c = e.dot(a, t) + u < 0,
						l = e.dot(a, n) + u < 0,
						h = e.dot(a, o) + u < 0,
						d = 0;
					d += c ? 1 : 0, d += l ? 1 : 0;
					var f, p;
					if (1 !== (d += h ? 1 : 0) && 2 !== d || (f = new e, p = new e), 1 === d)
					{
						if (c) return g.lineSegmentPlane(t, n, s, f), g.lineSegmentPlane(t, o, s, p),
						{
							positions: [t, n, o, f, p],
							indices: [0, 3, 4, 1, 2, 4, 1, 4, 3]
						};
						if (l) return g.lineSegmentPlane(n, o, s, f), g.lineSegmentPlane(n, t, s, p),
						{
							positions: [t, n, o, f, p],
							indices: [1, 3, 4, 2, 0, 4, 2, 4, 3]
						};
						if (h) return g.lineSegmentPlane(o, t, s, f), g.lineSegmentPlane(o, n, s, p),
						{
							positions: [t, n, o, f, p],
							indices: [2, 3, 4, 0, 1, 4, 0, 4, 3]
						}
					}
					else if (2 === d)
					{
						if (!c) return g.lineSegmentPlane(n, t, s, f), g.lineSegmentPlane(o, t, s, p),
						{
							positions: [t, n, o, f, p],
							indices: [1, 2, 4, 1, 4, 3, 0, 3, 4]
						};
						if (!l) return g.lineSegmentPlane(o, n, s, f), g.lineSegmentPlane(t, n, s, p),
						{
							positions: [t, n, o, f, p],
							indices: [2, 0, 4, 2, 4, 3, 1, 3, 4]
						};
						if (!h) return g.lineSegmentPlane(t, o, s, f), g.lineSegmentPlane(n, o, s, p),
						{
							positions: [t, n, o, f, p],
							indices: [0, 1, 4, 0, 4, 3, 2, 3, 4]
						}
					}
				}, g
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("5b", ["20", "15", "5", "7"], function (e, t, n, i)
			{
				"use strict";

				function r(n, i)
				{
					i = e.clone(t(i, e.ZERO)), e.equals(i, e.ZERO) || e.normalize(i, i), this.origin = e.clone(t(n, e.ZERO)), this.direction = i
				}
				return r.getPoint = function (t, r, o)
				{
					if (!n(t)) throw new i("ray is requred");
					if ("number" != typeof r) throw new i("t is a required number");
					return n(o) || (o = new e), o = e.multiplyByScalar(t.direction, r, o), e.add(t.origin, o, o)
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("5c", ["57", "a", "20", "33", "15", "5", "6", "7", "43", "46", "29", "35", "5b", "2b"], function (e, t, n, i, r, o, s, a, u, c, l, h, d, f)
			{
				"use strict";

				function p(e, t)
				{
					if (!o(e)) throw new a("origin is required.");
					if (t = r(t, u.WGS84), e = t.scaleToGeodeticSurface(e), !o(e)) throw new a("origin must not be at the center of the ellipsoid.");
					var i = f.eastNorthUpToFixedFrame(e, t);
					this._ellipsoid = t, this._origin = e, this._xAxis = n.fromCartesian4(l.getColumn(i, 0, g)), this._yAxis = n.fromCartesian4(l.getColumn(i, 1, g));
					var s = n.fromCartesian4(l.getColumn(i, 2, g));
					this._plane = h.fromPointNormal(e, s)
				}
				var g = new i;
				s(p.prototype,
				{
					ellipsoid:
					{
						get: function ()
						{
							return this._ellipsoid
						}
					},
					origin:
					{
						get: function ()
						{
							return this._origin
						}
					},
					plane:
					{
						get: function ()
						{
							return this._plane
						}
					},
					xAxis:
					{
						get: function ()
						{
							return this._xAxis
						}
					},
					yAxis:
					{
						get: function ()
						{
							return this._yAxis
						}
					},
					zAxis:
					{
						get: function ()
						{
							return this._plane.normal
						}
					}
				});
				var y = new e;
				p.fromPoints = function (t, n)
				{
					if (!o(t)) throw new a("cartesians is required.");
					return new p(e.fromPoints(t, y).center, n)
				};
				var M = new d,
					v = new n;
				p.prototype.projectPointOntoPlane = function (e, i)
				{
					if (!o(e)) throw new a("cartesian is required.");
					var r = M;
					r.origin = e, n.normalize(e, r.direction);
					var s = c.rayPlane(r, this._plane, v);
					if (o(s) || (n.negate(r.direction, r.direction), s = c.rayPlane(r, this._plane, v)), o(s))
					{
						var u = n.subtract(s, this._origin, s),
							l = n.dot(this._xAxis, u),
							h = n.dot(this._yAxis, u);
						return o(i) ? (i.x = l, i.y = h, i) : new t(l, h)
					}
				}, p.prototype.projectPointsOntoPlane = function (e, t)
				{
					if (!o(e)) throw new a("cartesians is required.");
					o(t) || (t = []);
					for (var n = 0, i = e.length, r = 0; r < i; r++)
					{
						var s = this.projectPointOntoPlane(e[r], t[n]);
						o(s) && (t[n] = s, n++)
					}
					return t.length = n, t
				}, p.prototype.projectPointToNearestOnPlane = function (e, i)
				{
					if (!o(e)) throw new a("cartesian is required.");
					o(i) || (i = new t);
					var r = M;
					r.origin = e, n.clone(this._plane.normal, r.direction);
					var s = c.rayPlane(r, this._plane, v);
					o(s) || (n.negate(r.direction, r.direction), s = c.rayPlane(r, this._plane, v));
					var u = n.subtract(s, this._origin, s),
						l = n.dot(this._xAxis, u),
						h = n.dot(this._yAxis, u);
					return i.x = l, i.y = h, i
				}, p.prototype.projectPointsToNearestOnPlane = function (e, t)
				{
					if (!o(e)) throw new a("cartesians is required.");
					o(t) || (t = []);
					var n = e.length;
					t.length = n;
					for (var i = 0; i < n; i++) t[i] = this.projectPointToNearestOnPlane(e[i], t[i]);
					return t
				};
				var A = new n;
				return p.prototype.projectPointsOntoEllipsoid = function (e, t)
				{
					if (!o(e)) throw new a("cartesians is required.");
					var i = e.length;
					o(t) ? t.length = i : t = new Array(i);
					for (var r = this._ellipsoid, s = this._origin, u = this._xAxis, c = this._yAxis, l = A, h = 0; h < i; ++h)
					{
						var d = e[h];
						n.multiplyByScalar(u, d.x, l), o(t[h]) || (t[h] = new n);
						var f = n.add(s, l, t[h]);
						n.multiplyByScalar(c, d.y, l), n.add(f, l, f), r.scaleToGeocentricSurface(f, f)
					}
					return t
				}, p
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("34", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					OUTSIDE: -1,
					INTERSECTING: 0,
					INSIDE: 1
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("56", ["15"], function (e)
			{
				"use strict";

				function t(t, n)
				{
					this.start = e(t, 0), this.stop = e(n, 0)
				}
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("35", ["20", "5", "7", "11", "d"], function (e, t, n, i, r)
			{
				"use strict";

				function o(i, o)
				{
					if (!t(i)) throw new n("normal is required.");
					if (!r.equalsEpsilon(e.magnitude(i), 1, r.EPSILON6)) throw new n("normal must be normalized.");
					if (!t(o)) throw new n("distance is required.");
					this.normal = e.clone(i), this.distance = o
				}
				o.fromPointNormal = function (i, s, a)
				{
					if (!t(i)) throw new n("point is required.");
					if (!t(s)) throw new n("normal is required.");
					if (!r.equalsEpsilon(e.magnitude(s), 1, r.EPSILON6)) throw new n("normal must be normalized.");
					var u = -e.dot(s, i);
					return t(a) ? (e.clone(s, a.normal), a.distance = u, a) : new o(s, u)
				};
				var s = new e;
				return o.fromCartesian4 = function (i, a)
				{
					if (!t(i)) throw new n("coefficients is required.");
					var u = e.fromCartesian4(i, s),
						c = i.w;
					if (!r.equalsEpsilon(e.magnitude(u), 1, r.EPSILON6)) throw new n("normal must be normalized.");
					return t(a) ? (e.clone(u, a.normal), a.distance = c, a) : new o(u, c)
				}, o.getPointDistance = function (i, r)
				{
					if (!t(i)) throw new n("plane is required.");
					if (!t(r)) throw new n("point is required.");
					return e.dot(i.normal, r) + i.distance
				}, o.ORIGIN_XY_PLANE = i(new o(e.UNIT_Z, 0)), o.ORIGIN_YZ_PLANE = i(new o(e.UNIT_X, 0)), o.ORIGIN_ZX_PLANE = i(new o(e.UNIT_Y, 0)), o
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("5d", ["55", "a", "20", "42", "15", "5", "7", "43", "5c", "34", "56", "d", "28", "35", "4f"], function (e, t, n, i, r, o, s, a, u, c, l, h, d, f, p)
			{
				"use strict";

				function g(e, t)
				{
					this.center = n.clone(r(e, n.ZERO)), this.halfAxes = d.clone(r(t, d.ZERO))
				}

				function y(e, t, i, r, a, u, c, l)
				{
					if (!(o(t) && o(i) && o(r) && o(a) && o(u) && o(c))) throw new s("all extents (minimum/maximum X/Y/Z) are required.");
					o(l) || (l = new g);
					var h = l.halfAxes;
					d.setColumn(h, 0, e.xAxis, h), d.setColumn(h, 1, e.yAxis, h), d.setColumn(h, 2, e.zAxis, h);
					var f = T;
					f.x = (t + i) / 2, f.y = (r + a) / 2, f.z = (u + c) / 2;
					var p = I;
					p.x = (i - t) / 2, p.y = (a - r) / 2, p.z = (c - u) / 2;
					var y = l.center;
					return f = d.multiplyByVector(h, f, f), n.add(e.origin, f, y), d.multiplyByScale(h, p, h), l
				}
				var M = new n,
					v = new n,
					A = new n,
					E = new n,
					m = new n,
					w = new n,
					N = new d,
					D = {
						unitary: new d,
						diagonal: new d
					};
				g.fromPoints = function (e, t)
				{
					if (o(t) || (t = new g), !o(e) || 0 === e.length) return t.halfAxes = d.ZERO, t.center = n.ZERO, t;
					var i, r = e.length,
						s = n.clone(e[0], M);
					for (i = 1; i < r; i++) n.add(s, e[i], s);
					var a = 1 / r;
					n.multiplyByScalar(s, a, s);
					var u, c = 0,
						l = 0,
						h = 0,
						f = 0,
						p = 0,
						y = 0;
					for (i = 0; i < r; i++) c += (u = n.subtract(e[i], s, v)).x * u.x, l += u.x * u.y, h += u.x * u.z, f += u.y * u.y, p += u.y * u.z, y += u.z * u.z;
					c *= a, l *= a, h *= a, f *= a, p *= a, y *= a;
					var T = N;
					T[0] = c, T[1] = l, T[2] = h, T[3] = l, T[4] = f, T[5] = p, T[6] = h, T[7] = p, T[8] = y;
					var I = d.computeEigenDecomposition(T, D),
						O = d.clone(I.unitary, t.halfAxes),
						S = d.getColumn(O, 0, E),
						_ = d.getColumn(O, 1, m),
						L = d.getColumn(O, 2, w),
						j = -Number.MAX_VALUE,
						x = -Number.MAX_VALUE,
						b = -Number.MAX_VALUE,
						C = Number.MAX_VALUE,
						R = Number.MAX_VALUE,
						z = Number.MAX_VALUE;
					for (i = 0; i < r; i++) u = e[i], j = Math.max(n.dot(S, u), j), x = Math.max(n.dot(_, u), x), b = Math.max(n.dot(L, u), b), C = Math.min(n.dot(S, u), C), R = Math.min(n.dot(_, u), R), z = Math.min(n.dot(L, u), z);
					S = n.multiplyByScalar(S, .5 * (C + j), S), _ = n.multiplyByScalar(_, .5 * (R + x), _), L = n.multiplyByScalar(L, .5 * (z + b), L);
					var P = n.add(S, _, t.center);
					n.add(P, L, P);
					var U = A;
					return U.x = j - C, U.y = x - R, U.z = b - z, n.multiplyByScalar(U, .5, U), d.multiplyByScale(t.halfAxes, U, t.halfAxes), t
				};
				var T = new n,
					I = new n,
					O = new i,
					S = new n,
					_ = [new i, new i, new i, new i, new i, new i, new i, new i],
					L = [new n, new n, new n, new n, new n, new n, new n, new n],
					j = [new t, new t, new t, new t, new t, new t, new t, new t];
				g.fromRectangle = function (e, t, n, i, c)
				{
					if (!o(e)) throw new s("rectangle is required");
					if (e.width < 0 || e.width > h.PI) throw new s("Rectangle width must be between 0 and pi");
					if (e.height < 0 || e.height > h.PI) throw new s("Rectangle height must be between 0 and pi");
					if (o(i) && !h.equalsEpsilon(i.radii.x, i.radii.y, h.EPSILON15)) throw new s("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
					t = r(t, 0), n = r(n, 0), i = r(i, a.WGS84);
					var l = p.center(e, O),
						d = i.cartographicToCartesian(l, S),
						g = new u(d, i),
						M = g.plane,
						v = _[0],
						A = _[1],
						E = _[2],
						m = _[3],
						w = _[4],
						N = _[5],
						D = _[6],
						T = _[7],
						I = l.longitude,
						x = e.south < 0 && e.north > 0 ? 0 : l.latitude;
					D.latitude = N.latitude = w.latitude = e.south, T.latitude = m.latitude = x, v.latitude = A.latitude = E.latitude = e.north, D.longitude = T.longitude = v.longitude = e.west, N.longitude = A.longitude = I, w.longitude = m.longitude = E.longitude = e.east, E.height = A.height = v.height = T.height = D.height = N.height = w.height = m.height = n, i.cartographicArrayToCartesianArray(_, L), g.projectPointsToNearestOnPlane(L, j);
					var b = Math.min(j[6].x, j[7].x, j[0].x),
						C = Math.max(j[2].x, j[3].x, j[4].x),
						R = Math.min(j[4].y, j[5].y, j[6].y),
						z = Math.max(j[0].y, j[1].y, j[2].y);
					return E.height = v.height = w.height = D.height = t, i.cartographicArrayToCartesianArray(_, L), y(g, b, C, R, z, Math.min(f.getPointDistance(M, L[0]), f.getPointDistance(M, L[2]), f.getPointDistance(M, L[4]), f.getPointDistance(M, L[6])), n, c)
				}, g.clone = function (e, t)
				{
					if (o(e)) return o(t) ? (n.clone(e.center, t.center), d.clone(e.halfAxes, t.halfAxes), t) : new g(e.center, e.halfAxes)
				}, g.intersectPlane = function (e, t)
				{
					if (!o(e)) throw new s("box is required.");
					if (!o(t)) throw new s("plane is required.");
					var i = e.center,
						r = t.normal,
						a = e.halfAxes,
						u = r.x,
						l = r.y,
						h = r.z,
						f = Math.abs(u * a[d.COLUMN0ROW0] + l * a[d.COLUMN0ROW1] + h * a[d.COLUMN0ROW2]) + Math.abs(u * a[d.COLUMN1ROW0] + l * a[d.COLUMN1ROW1] + h * a[d.COLUMN1ROW2]) + Math.abs(u * a[d.COLUMN2ROW0] + l * a[d.COLUMN2ROW1] + h * a[d.COLUMN2ROW2]),
						p = n.dot(r, i) + t.distance;
					return p <= -f ? c.OUTSIDE : p >= f ? c.INSIDE : c.INTERSECTING
				};
				var x = new n,
					b = new n,
					C = new n,
					R = new n;
				g.distanceSquaredTo = function (e, t)
				{
					if (!o(e)) throw new s("box is required.");
					if (!o(t)) throw new s("cartesian is required.");
					var i = n.subtract(t, e.center, T),
						r = e.halfAxes,
						a = d.getColumn(r, 0, x),
						u = d.getColumn(r, 1, b),
						c = d.getColumn(r, 2, C),
						l = n.magnitude(a),
						h = n.magnitude(u),
						f = n.magnitude(c);
					n.normalize(a, a), n.normalize(u, u), n.normalize(c, c);
					var p = R;
					p.x = n.dot(i, a), p.y = n.dot(i, u), p.z = n.dot(i, c);
					var g, y = 0;
					return p.x < -l ? y += (g = p.x + l) * g : p.x > l && (y += (g = p.x - l) * g), p.y < -h ? y += (g = p.y + h) * g : p.y > h && (y += (g = p.y - h) * g), p.z < -f ? y += (g = p.z + f) * g : p.z > f && (y += (g = p.z - f) * g), y
				};
				var z = new n,
					P = new n;
				g.computePlaneDistances = function (e, t, i, r)
				{
					if (!o(e)) throw new s("box is required.");
					if (!o(t)) throw new s("position is required.");
					if (!o(i)) throw new s("direction is required.");
					o(r) || (r = new l);
					var a = Number.POSITIVE_INFINITY,
						u = Number.NEGATIVE_INFINITY,
						c = e.center,
						h = e.halfAxes,
						f = d.getColumn(h, 0, x),
						p = d.getColumn(h, 1, b),
						g = d.getColumn(h, 2, C),
						y = n.add(f, p, z);
					n.add(y, g, y), n.add(y, c, y);
					var M = n.subtract(y, t, P),
						v = n.dot(i, M);
					return a = Math.min(v, a), u = Math.max(v, u), n.add(c, f, y), n.add(y, p, y), n.subtract(y, g, y), n.subtract(y, t, M), v = n.dot(i, M), a = Math.min(v, a), u = Math.max(v, u), n.add(c, f, y), n.subtract(y, p, y), n.add(y, g, y), n.subtract(y, t, M), v = n.dot(i, M), a = Math.min(v, a), u = Math.max(v, u), n.add(c, f, y), n.subtract(y, p, y), n.subtract(y, g, y), n.subtract(y, t, M), v = n.dot(i, M), a = Math.min(v, a), u = Math.max(v, u), n.subtract(c, f, y), n.add(y, p, y), n.add(y, g, y), n.subtract(y, t, M), v = n.dot(i, M), a = Math.min(v, a), u = Math.max(v, u), n.subtract(c, f, y), n.add(y, p, y), n.subtract(y, g, y), n.subtract(y, t, M), v = n.dot(i, M), a = Math.min(v, a), u = Math.max(v, u), n.subtract(c, f, y), n.subtract(y, p, y), n.add(y, g, y), n.subtract(y, t, M), v = n.dot(i, M), a = Math.min(v, a), u = Math.max(v, u), n.subtract(c, f, y), n.subtract(y, p, y), n.subtract(y, g, y), n.subtract(y, t, M), v = n.dot(i, M), a = Math.min(v, a), u = Math.max(v, u), r.start = a, r.stop = u, r
				};
				var U = new e;
				return g.isOccluded = function (t, n)
				{
					if (!o(t)) throw new s("box is required.");
					if (!o(n)) throw new s("occluder is required.");
					var i = e.fromOrientedBoundingBox(t, U);
					return !n.isBoundingSphereVisible(i)
				}, g.prototype.intersectPlane = function (e)
				{
					return g.intersectPlane(this, e)
				}, g.prototype.distanceSquaredTo = function (e)
				{
					return g.distanceSquaredTo(this, e)
				}, g.prototype.computePlaneDistances = function (e, t, n)
				{
					return g.computePlaneDistances(this, e, t, n)
				}, g.prototype.isOccluded = function (e)
				{
					return g.isOccluded(this, e)
				}, g.equals = function (e, t)
				{
					return e === t || o(e) && o(t) && n.equals(e.center, t.center) && d.equals(e.halfAxes, t.halfAxes)
				}, g.prototype.clone = function (e)
				{
					return g.clone(this, e)
				}, g.prototype.equals = function (e)
				{
					return g.equals(this, e)
				}, g
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("5e", ["48", "3c", "15", "5", "5f", "11", "17", "60", "61", "2d", "3f", "40"], function (e, t, n, i, r, o, s, a, u, c, l, h)
			{
				"use strict";

				function d(t)
				{
					if (t = n(t, n.EMPTY_OBJECT), this._dates = void 0, this._samples = void 0, this._dateColumn = -1, this._xPoleWanderRadiansColumn = -1, this._yPoleWanderRadiansColumn = -1, this._ut1MinusUtcSecondsColumn = -1, this._xCelestialPoleOffsetRadiansColumn = -1, this._yCelestialPoleOffsetRadiansColumn = -1, this._taiMinusUtcSecondsColumn = -1, this._columnCount = 0, this._lastIndex = -1, this._downloadPromise = void 0, this._dataError = void 0, this._addNewLeapSeconds = n(t.addNewLeapSeconds, !0), i(t.data)) p(this, t.data);
					else if (i(t.url))
					{
						var r = this;
						this._downloadPromise = e(u(t.url), function (e)
						{
							p(r, e)
						}, function ()
						{
							r._dataError = "An error occurred while retrieving the EOP data from the URL " + t.url + "."
						})
					}
					else p(this,
					{
						columnNames: ["dateIso8601", "modifiedJulianDateUtc", "xPoleWanderRadians", "yPoleWanderRadians", "ut1MinusUtcSeconds", "lengthOfDayCorrectionSeconds", "xCelestialPoleOffsetRadians", "yCelestialPoleOffsetRadians", "taiMinusUtcSeconds"],
						samples: []
					})
				}

				function f(e, t)
				{
					return s.compare(e.julianDate, t)
				}

				function p(e, n)
				{
					if (i(n.columnNames))
						if (i(n.samples))
						{
							var r = n.columnNames.indexOf("modifiedJulianDateUtc"),
								o = n.columnNames.indexOf("xPoleWanderRadians"),
								u = n.columnNames.indexOf("yPoleWanderRadians"),
								c = n.columnNames.indexOf("ut1MinusUtcSeconds"),
								d = n.columnNames.indexOf("xCelestialPoleOffsetRadians"),
								p = n.columnNames.indexOf("yCelestialPoleOffsetRadians"),
								g = n.columnNames.indexOf("taiMinusUtcSeconds");
							if (r < 0 || o < 0 || u < 0 || c < 0 || d < 0 || p < 0 || g < 0) e._dataError = "Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns";
							else
							{
								var y = e._samples = n.samples,
									M = e._dates = [];
								e._dateColumn = r, e._xPoleWanderRadiansColumn = o, e._yPoleWanderRadiansColumn = u, e._ut1MinusUtcSecondsColumn = c, e._xCelestialPoleOffsetRadiansColumn = d, e._yCelestialPoleOffsetRadiansColumn = p, e._taiMinusUtcSecondsColumn = g, e._columnCount = n.columnNames.length, e._lastIndex = void 0;
								for (var v, A = e._addNewLeapSeconds, E = 0, m = y.length; E < m; E += e._columnCount)
								{
									var w = y[E + r],
										N = y[E + g],
										D = w + l.MODIFIED_JULIAN_DATE_DIFFERENCE,
										T = new s(D, N, h.TAI);
									if (M.push(T), A)
									{
										if (N !== v && i(v))
										{
											var I = s.leapSeconds,
												O = t(I, T, f);
											if (O < 0)
											{
												var S = new a(T, N);
												I.splice(~O, 0, S)
											}
										}
										v = N
									}
								}
							}
						}
					else e._dataError = "Error in loaded EOP data: The samples property is required.";
					else e._dataError = "Error in loaded EOP data: The columnNames property is required."
				}

				function g(e, t, n, i, r)
				{
					var o = n * i;
					r.xPoleWander = t[o + e._xPoleWanderRadiansColumn], r.yPoleWander = t[o + e._yPoleWanderRadiansColumn], r.xPoleOffset = t[o + e._xCelestialPoleOffsetRadiansColumn], r.yPoleOffset = t[o + e._yCelestialPoleOffsetRadiansColumn], r.ut1MinusUtc = t[o + e._ut1MinusUtcSecondsColumn]
				}

				function y(e, t, n)
				{
					return t + e * (n - t)
				}

				function M(e, t, n, i, r, o, a)
				{
					var u = e._columnCount;
					if (o > t.length - 1) return a.xPoleWander = 0, a.yPoleWander = 0, a.xPoleOffset = 0, a.yPoleOffset = 0, a.ut1MinusUtc = 0, a;
					var c = t[r],
						l = t[o];
					if (c.equals(l) || i.equals(c)) return g(e, n, r, u, a), a;
					if (i.equals(l)) return g(e, n, o, u, a), a;
					var h = s.secondsDifference(i, c) / s.secondsDifference(l, c),
						d = r * u,
						f = o * u,
						p = n[d + e._ut1MinusUtcSecondsColumn],
						M = n[f + e._ut1MinusUtcSecondsColumn],
						v = M - p;
					if (v > .5 || v < -.5)
					{
						var A = n[d + e._taiMinusUtcSecondsColumn],
							E = n[f + e._taiMinusUtcSecondsColumn];
						A !== E && (l.equals(i) ? p = M : M -= E - A)
					}
					return a.xPoleWander = y(h, n[d + e._xPoleWanderRadiansColumn], n[f + e._xPoleWanderRadiansColumn]), a.yPoleWander = y(h, n[d + e._yPoleWanderRadiansColumn], n[f + e._yPoleWanderRadiansColumn]), a.xPoleOffset = y(h, n[d + e._xCelestialPoleOffsetRadiansColumn], n[f + e._xCelestialPoleOffsetRadiansColumn]), a.yPoleOffset = y(h, n[d + e._yCelestialPoleOffsetRadiansColumn], n[f + e._yCelestialPoleOffsetRadiansColumn]), a.ut1MinusUtc = y(h, p, M), a
				}
				return d.NONE = o(
				{
					getPromiseToLoad: function ()
					{
						return e()
					},
					compute: function (e, t)
					{
						return i(t) ? (t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0) : t = new r(0, 0, 0, 0, 0), t
					}
				}), d.prototype.getPromiseToLoad = function ()
				{
					return e(this._downloadPromise)
				}, d.prototype.compute = function (e, n)
				{
					if (i(this._samples))
					{
						if (i(n) || (n = new r(0, 0, 0, 0, 0)), 0 === this._samples.length) return n.xPoleWander = 0, n.yPoleWander = 0, n.xPoleOffset = 0, n.yPoleOffset = 0, n.ut1MinusUtc = 0, n;
						var o = this._dates,
							a = this._lastIndex,
							u = 0,
							l = 0;
						if (i(a))
						{
							var h = o[a],
								d = o[a + 1],
								f = s.lessThanOrEquals(h, e),
								p = !i(d),
								g = p || s.greaterThanOrEquals(d, e);
							if (f && g) return u = a, !p && d.equals(e) && ++u, l = u + 1, M(this, o, this._samples, e, u, l, n), n
						}
						var y = t(o, e, s.compare, this._dateColumn);
						return y >= 0 ? (y < o.length - 1 && o[y + 1].equals(e) && ++y, u = y, l = y) : (u = (l = ~y) - 1) < 0 && (u = 0), this._lastIndex = u, M(this, o, this._samples, e, u, l, n), n
					}
					if (i(this._dataError)) throw new c(this._dataError)
				}, d
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("5f", [], function ()
			{
				"use strict";

				function e(e, t, n, i, r)
				{
					this.xPoleWander = e, this.yPoleWander = t, this.xPoleOffset = n, this.yPoleOffset = i, this.ut1MinusUtc = r
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("62", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					TERRAIN: 0,
					IMAGERY: 1,
					TILES3D: 2,
					OTHER: 3
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("4b", ["15", "5", "6", "63", "62"], function (e, t, n, i, r)
			{
				"use strict";

				function o(t)
				{
					t = e(t, e.EMPTY_OBJECT);
					var n = e(t.throttleByServer, !1),
						o = n || e(t.throttle, !1);
					this.url = t.url, this.requestFunction = t.requestFunction, this.cancelFunction = t.cancelFunction, this.priorityFunction = t.priorityFunction, this.priority = e(t.priority, 0), this.throttle = o, this.throttleByServer = n, this.type = e(t.type, r.OTHER), this.serverKey = void 0, this.state = i.UNISSUED, this.deferred = void 0, this.cancelled = !1
				}
				return o.prototype.cancel = function ()
				{
					this.cancelled = !0
				}, o
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("64", [], function ()
			{
				"use strict";

				function e(e)
				{
					var t = {};
					if (!e) return t;
					for (var n = e.split("\r\n"), i = 0; i < n.length; ++i)
					{
						var r = n[i],
							o = r.indexOf(": ");
						if (o > 0)
						{
							var s = r.substring(0, o),
								a = r.substring(o + 2);
							t[s] = a
						}
					}
					return t
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("65", ["5", "64"], function (e, t)
			{
				"use strict";

				function n(e, n, i)
				{
					this.statusCode = e, this.response = n, this.responseHeaders = i, "string" == typeof this.responseHeaders && (this.responseHeaders = t(this.responseHeaders))
				}
				return n.prototype.toString = function ()
				{
					var t = "Request has failed.";
					return e(this.statusCode) && (t += " Status Code: " + this.statusCode), t
				}, n
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("66", ["15"], function (e)
			{
				"use strict";

				function t(n, i)
				{
					if (null === n || "object" != typeof n) return n;
					i = e(i, !1);
					var r = new n.constructor;
					for (var o in n)
						if (n.hasOwnProperty(o))
						{
							var s = n[o];
							i && (s = t(s, i)), r[o] = s
						}
					return r
				}
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("67", ["1e", "15", "5", "6"], function (e, t, n, i)
			{
				"use strict";

				function r(t)
				{
					e.typeOf.object("options", t), e.defined("options.comparator", t.comparator), this._comparator = t.comparator, this._array = [], this._length = 0, this._maximumLength = void 0
				}

				function o(e, t, n)
				{
					var i = e[t];
					e[t] = e[n], e[n] = i
				}
				return i(r.prototype,
				{
					length:
					{
						get: function ()
						{
							return this._length
						}
					},
					internalArray:
					{
						get: function ()
						{
							return this._array
						}
					},
					maximumLength:
					{
						get: function ()
						{
							return this._maximumLength
						},
						set: function (e)
						{
							this._maximumLength = e, this._length > e && e > 0 && (this._length = e, this._array.length = e)
						}
					},
					comparator:
					{
						get: function ()
						{
							return this._comparator
						}
					}
				}), r.prototype.reserve = function (e)
				{
					e = t(e, this._length), this._array.length = e
				}, r.prototype.heapify = function (e)
				{
					e = t(e, 0);
					for (var n = this._length, i = this._comparator, r = this._array, s = -1, a = !0; a;)
					{
						var u = 2 * (e + 1),
							c = u - 1;
						s = c < n && i(r[c], r[e]) < 0 ? c : e, u < n && i(r[u], r[s]) < 0 && (s = u), s !== e ? (o(r, s, e), e = s) : a = !1
					}
				}, r.prototype.resort = function ()
				{
					for (var e = this._length, t = Math.ceil(e / 2); t >= 0; --t) this.heapify(t)
				}, r.prototype.insert = function (t)
				{
					e.defined("element", t);
					var i = this._array,
						r = this._comparator,
						s = this._maximumLength,
						a = this._length++;
					for (a < i.length ? i[a] = t : i.push(t); 0 !== a;)
					{
						var u = Math.floor((a - 1) / 2);
						if (!(r(i[a], i[u]) < 0)) break;
						o(i, a, u), a = u
					}
					var c;
					return n(s) && this._length > s && (c = i[s], this._length = s), c
				}, r.prototype.pop = function (n)
				{
					if (n = t(n, 0), 0 !== this._length)
					{
						e.typeOf.number.lessThan("index", n, this._length);
						var i = this._array,
							r = i[n];
						return o(i, n, --this._length), this.heapify(n), r
					}
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("68", ["1e"], function (e)
			{
				"use strict";

				function t(t)
				{
					return e.typeOf.string("uri", t), n.test(t)
				}
				var n = /^blob:/i;
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("4a", ["1e"], function (e)
			{
				"use strict";

				function t(t)
				{
					return e.typeOf.string("uri", t), n.test(t)
				}
				var n = /^data:/i;
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("63", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					UNISSUED: 0,
					ISSUED: 1,
					ACTIVE: 2,
					RECEIVED: 3,
					CANCELLED: 4,
					FAILED: 5
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("4c", ["69", "48", "1e", "66", "5", "6", "67", "68", "4a", "63"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(e, t)
				{
					return e.priority - t.priority
				}

				function h()
				{}

				function d(e)
				{
					r(e.priorityFunction) && (e.priority = e.priorityFunction())
				}

				function f(e)
				{
					return T[e] < h.maximumRequestsPerServer
				}

				function p(e)
				{
					return e.state === c.UNISSUED && (e.state = c.ISSUED, e.deferred = t.defer()), e.deferred.promise
				}

				function g(e)
				{
					return function (t)
					{
						e.state !== c.CANCELLED && (--m.numberOfActiveRequests, --T[e.serverKey], e.state = c.RECEIVED, e.deferred.resolve(t))
					}
				}

				function y(e)
				{
					return function (t)
					{
						e.state !== c.CANCELLED && (++m.numberOfFailedRequests, --m.numberOfActiveRequests, --T[e.serverKey], e.state = c.FAILED, e.deferred.reject(t))
					}
				}

				function M(e)
				{
					var t = p(e);
					return e.state = c.ACTIVE, D.push(e), ++m.numberOfActiveRequests, ++m.numberOfActiveRequestsEver, ++T[e.serverKey], e.requestFunction().then(g(e)).otherwise(y(e)), t
				}

				function v(e)
				{
					var t = e.state === c.ACTIVE;
					e.state = c.CANCELLED, ++m.numberOfCancelledRequests, e.deferred.reject(), t && (--m.numberOfActiveRequests, --T[e.serverKey], ++m.numberOfCancelledActiveRequests), r(e.cancelFunction) && e.cancelFunction()
				}

				function A()
				{
					m.numberOfAttemptedRequests = 0, m.numberOfCancelledRequests = 0, m.numberOfCancelledActiveRequests = 0
				}

				function E()
				{
					h.debugShowStatistics && (m.numberOfAttemptedRequests > 0 && console.log("Number of attempted requests: " + m.numberOfAttemptedRequests), m.numberOfActiveRequests > 0 && console.log("Number of active requests: " + m.numberOfActiveRequests), m.numberOfCancelledRequests > 0 && console.log("Number of cancelled requests: " + m.numberOfCancelledRequests), m.numberOfCancelledActiveRequests > 0 && console.log("Number of cancelled active requests: " + m.numberOfCancelledActiveRequests), m.numberOfFailedRequests > 0 && console.log("Number of failed requests: " + m.numberOfFailedRequests), A())
				}
				var m = {
						numberOfAttemptedRequests: 0,
						numberOfActiveRequests: 0,
						numberOfCancelledRequests: 0,
						numberOfCancelledActiveRequests: 0,
						numberOfFailedRequests: 0,
						numberOfActiveRequestsEver: 0
					},
					w = 20,
					N = new s(
					{
						comparator: l
					});
				N.maximumLength = w, N.reserve(w);
				var D = [],
					T = {},
					I = "undefined" != typeof document ? new e(document.location.href) : new e;
				return h.maximumRequests = 50, h.maximumRequestsPerServer = 6, h.throttleRequests = !0, h.debugShowStatistics = !1, o(h,
				{
					statistics:
					{
						get: function ()
						{
							return m
						}
					},
					priorityHeapLength:
					{
						get: function ()
						{
							return w
						},
						set: function (e)
						{
							if (e < w)
								for (; N.length > e;) v(N.pop());
							w = e, N.maximumLength = e, N.reserve(e)
						}
					}
				}), h.update = function ()
				{
					var e, t, n = 0,
						i = D.length;
					for (e = 0; e < i; ++e)(t = D[e]).cancelled && v(t), t.state === c.ACTIVE ? n > 0 && (D[e - n] = t) : ++n;
					D.length -= n;
					var r = N.internalArray,
						o = N.length;
					for (e = 0; e < o; ++e) d(r[e]);
					N.resort();
					for (var s = Math.max(h.maximumRequests - D.length, 0), a = 0; a < s && N.length > 0;)(t = N.pop()).cancelled ? v(t) : !t.throttleByServer || f(t.serverKey) ? (M(t), ++a) : v(t);
					E()
				}, h.getServerKey = function (t)
				{
					n.typeOf.string("url", t);
					var i = new e(t).resolve(I);
					i.normalize();
					var o = i.authority;
					/:/.test(o) || (o = o + ":" + ("https" === i.scheme ? "443" : "80"));
					var s = T[o];
					return r(s) || (T[o] = 0), o
				}, h.request = function (e)
				{
					if (n.typeOf.object("request", e), n.typeOf.string("request.url", e.url), n.typeOf.func("request.requestFunction", e.requestFunction), u(e.url) || a(e.url)) return e.state = c.RECEIVED, e.requestFunction();
					if (++m.numberOfAttemptedRequests, r(e.serverKey) || (e.serverKey = h.getServerKey(e.url)), !h.throttleRequests || !e.throttle) return M(e);
					if (!(D.length >= h.maximumRequests) && (!e.throttleByServer || f(e.serverKey)))
					{
						d(e);
						var t = N.insert(e);
						if (r(t))
						{
							if (t === e) return;
							v(t)
						}
						return p(e)
					}
				}, h.clearForSpecs = function ()
				{
					for (; N.length > 0;) v(N.pop());
					for (var e = D.length, t = 0; t < e; ++t) v(D[t]);
					D.length = 0, T = {}, m.numberOfAttemptedRequests = 0, m.numberOfActiveRequests = 0, m.numberOfCancelledRequests = 0, m.numberOfCancelledActiveRequests = 0, m.numberOfFailedRequests = 0, m.numberOfActiveRequestsEver = 0
				}, h.numberOfActiveRequestsByServer = function (e)
				{
					return T[e]
				}, h.requestHeap = N, h
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("4d", ["69", "5", "7"], function (e, t, n)
			{
				"use strict";

				function i(n)
				{
					var i = new e(n);
					i.normalize();
					var r = i.getAuthority();
					if (t(r))
					{
						if (-1 !== r.indexOf("@") && (r = r.split("@")[1]), -1 === r.indexOf(":"))
						{
							var o = i.getScheme();
							if (t(o) || (o = (o = window.location.protocol).substring(0, o.length - 1)), "http" === o) r += ":80";
							else
							{
								if ("https" !== o) return;
								r += ":443"
							}
						}
						return r
					}
				}
				var r = {},
					o = {};
				return r.add = function (e, i)
				{
					if (!t(e)) throw new n("host is required.");
					if (!t(i) || i <= 0) throw new n("port is required to be greater than 0.");
					var r = e.toLowerCase() + ":" + i;
					t(o[r]) || (o[r] = !0)
				}, r.remove = function (e, i)
				{
					if (!t(e)) throw new n("host is required.");
					if (!t(i) || i <= 0) throw new n("port is required to be greater than 0.");
					var r = e.toLowerCase() + ":" + i;
					t(o[r]) && delete o[r]
				}, r.contains = function (e)
				{
					if (!t(e)) throw new n("url is required.");
					var r = i(e);
					return !(!t(r) || !t(o[r]))
				}, r.clear = function ()
				{
					o = {}
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("6a", ["48", "1e", "15", "5", "7", "4b", "65", "4c", "2d", "4d"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(r)
				{
					r = n(r, n.EMPTY_OBJECT), t.defined("options.url", r.url);
					var s = r.url,
						u = r.responseType,
						c = n(r.method, "GET"),
						h = r.data,
						d = r.headers,
						f = r.overrideMimeType;
					s = n(s, r.url);
					var p = i(r.request) ? r.request : new o;
					return p.url = s, p.requestFunction = function ()
					{
						var t = e.defer(),
							n = l.load(s, u, c, h, d, t, f);
						return i(n) && i(n.abort) && (p.cancelFunction = function ()
						{
							n.abort()
						}), t.promise
					}, a.request(p)
				}

				function h(e, t)
				{
					var n = decodeURIComponent(t);
					return e ? atob(n) : n
				}

				function d(e, t)
				{
					for (var n = h(e, t), i = new ArrayBuffer(n.length), r = new Uint8Array(i), o = 0; o < n.length; o++) r[o] = n.charCodeAt(o);
					return i
				}

				function f(e, t)
				{
					t = n(t, "");
					var i = e[1],
						o = !!e[2],
						s = e[3];
					switch (t)
					{
					case "":
					case "text":
						return h(o, s);
					case "arraybuffer":
						return d(o, s);
					case "blob":
						var a = d(o, s);
						return new Blob([a],
						{
							type: i
						});
					case "document":
						return (new DOMParser).parseFromString(h(o, s), i);
					case "json":
						return JSON.parse(h(o, s));
					default:
						throw new r("Unhandled responseType: " + t)
					}
				}
				var p = /^data:(.*?)(;base64)?,(.*)$/;
				return l.load = function (e, t, n, r, o, a, l)
				{
					var h = p.exec(e);
					{
						if (null === h)
						{
							var d = new XMLHttpRequest;
							if (c.contains(e) && (d.withCredentials = !0), i(l) && i(d.overrideMimeType) && d.overrideMimeType(l), d.open(n, e, !0), i(o))
								for (var g in o) o.hasOwnProperty(g) && d.setRequestHeader(g, o[g]);
							return i(t) && (d.responseType = t), d.onload = function ()
							{
								if (d.status < 200 || d.status >= 300) a.reject(new s(d.status, d.response, d.getAllResponseHeaders()));
								else
								{
									var e = d.response,
										n = d.responseType;
									if (!i(e) || i(t) && n !== t)
										if ("json" === t && "string" == typeof e) try
										{
											a.resolve(JSON.parse(e))
										}
									catch (e)
									{
										a.reject(e)
									}
									else("" === n || "document" === n) && i(d.responseXML) && d.responseXML.hasChildNodes() ? a.resolve(d.responseXML) : "" !== n && "text" !== n || !i(d.responseText) ? a.reject(new u("Invalid XMLHttpRequest response type.")) : a.resolve(d.responseText);
									else a.resolve(e)
								}
							}, d.onerror = function (e)
							{
								a.reject(new s)
							}, d.send(r), d
						}
						a.resolve(f(h, t))
					}
				}, l.defaultLoad = l.load, l
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("6b", ["6a"], function (e)
			{
				"use strict";

				function t(t, n, i)
				{
					return e(
					{
						url: t,
						headers: n,
						request: i
					})
				}
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("61", ["66", "5", "7", "6b"], function (e, t, n, i)
			{
				"use strict";

				function r(r, s, a)
				{
					if (!t(r)) throw new n("url is required.");
					t(s) ? t(s.Accept) || ((s = e(s)).Accept = o.Accept) : s = o;
					var u = i(r, s, a);
					if (t(u)) return u.then(function (e)
					{
						return JSON.parse(e)
					})
				}
				var o = {
					Accept: "application/json,*/*;q=0.01"
				};
				return r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("6c", ["48", "6d", "15", "5", "6e", "17", "61", "40"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e)
				{
					e = n(e, n.EMPTY_OBJECT), this._xysFileUrlTemplate = e.xysFileUrlTemplate, this._interpolationOrder = n(e.interpolationOrder, 9), this._sampleZeroJulianEphemerisDate = n(e.sampleZeroJulianEphemerisDate, 2442396.5), this._sampleZeroDateTT = new o(this._sampleZeroJulianEphemerisDate, 0, a.TAI), this._stepSizeDays = n(e.stepSizeDays, 1), this._samplesPerXysFile = n(e.samplesPerXysFile, 1e3), this._totalSamples = n(e.totalSamples, 27426), this._samples = new Array(3 * this._totalSamples), this._chunkDownloadsInProgress = [];
					for (var t = this._interpolationOrder, i = this._denominators = new Array(t + 1), r = this._xTable = new Array(t + 1), s = Math.pow(this._stepSizeDays, t), u = 0; u <= t; ++u)
					{
						i[u] = s, r[u] = u * this._stepSizeDays;
						for (var c = 0; c <= t; ++c) c !== u && (i[u] *= u - c);
						i[u] = 1 / i[u]
					}
					this._work = new Array(t + 1), this._coef = new Array(t + 1)
				}

				function c(e, t, n)
				{
					var i = h;
					return i.dayNumber = t, i.secondsOfDay = n, o.daysDifference(i, e._sampleZeroDateTT)
				}

				function l(n, r)
				{
					if (n._chunkDownloadsInProgress[r]) return n._chunkDownloadsInProgress[r];
					var o = e.defer();
					n._chunkDownloadsInProgress[r] = o;
					var a, u = n._xysFileUrlTemplate;
					return a = i(u) ? u.replace("{0}", r) : t("Assets/IAU2006_XYS/IAU2006_XYS_" + r + ".json"), e(s(a), function (e)
					{
						n._chunkDownloadsInProgress[r] = !1;
						for (var t = n._samples, i = e.samples, s = r * n._samplesPerXysFile * 3, a = 0, u = i.length; a < u; ++a) t[s + a] = i[a];
						o.resolve()
					}), o.promise
				}
				var h = new o(0, 0, a.TAI);
				return u.prototype.preload = function (t, n, i, r)
				{
					var o = c(this, t, n),
						s = c(this, i, r),
						a = o / this._stepSizeDays - this._interpolationOrder / 2 | 0;
					a < 0 && (a = 0);
					var u = s / this._stepSizeDays - this._interpolationOrder / 2 | 0 + this._interpolationOrder;
					u >= this._totalSamples && (u = this._totalSamples - 1);
					for (var h = a / this._samplesPerXysFile | 0, d = u / this._samplesPerXysFile | 0, f = [], p = h; p <= d; ++p) f.push(l(this, p));
					return e.all(f)
				}, u.prototype.computeXysRadians = function (e, t, n)
				{
					var o = c(this, e, t);
					if (!(o < 0))
					{
						var s = o / this._stepSizeDays | 0;
						if (!(s >= this._totalSamples))
						{
							var a = this._interpolationOrder,
								u = s - (a / 2 | 0);
							u < 0 && (u = 0);
							var h = u + a;
							h >= this._totalSamples && (u = (h = this._totalSamples - 1) - a) < 0 && (u = 0);
							var d = !1,
								f = this._samples;
							if (i(f[3 * u]) || (l(this, u / this._samplesPerXysFile | 0), d = !0), i(f[3 * h]) || (l(this, h / this._samplesPerXysFile | 0), d = !0), !d)
							{
								i(n) ? (n.x = 0, n.y = 0, n.s = 0) : n = new r(0, 0, 0);
								var p, g, y = o - u * this._stepSizeDays,
									M = this._work,
									v = this._denominators,
									A = this._coef,
									E = this._xTable;
								for (p = 0; p <= a; ++p) M[p] = y - E[p];
								for (p = 0; p <= a; ++p)
								{
									for (A[p] = 1, g = 0; g <= a; ++g) g !== p && (A[p] *= M[g]);
									A[p] *= v[p];
									var m = 3 * (u + p);
									n.x += A[p] * f[m++], n.y += A[p] * f[m++], n.s += A[p] * f[m]
								}
								return n
							}
						}
					}
				}, u
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("6e", [], function ()
			{
				"use strict";

				function e(e, t, n)
				{
					this.x = e, this.y = t, this.s = n
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("6f", [], function ()
			{
				function e()
				{
					var e = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g,
						t = arguments,
						n = 0,
						i = function (e, t, n, i)
						{
							n || (n = " ");
							var r = e.length >= t ? "" : Array(1 + t - e.length >>> 0).join(n);
							return i ? e + r : r + e
						},
						r = function (e, t, n, r, o, s)
						{
							var a = r - e.length;
							return a > 0 && (e = n || !o ? i(e, r, s, n) : e.slice(0, t.length) + i("", a, "0", !0) + e.slice(t.length)), e
						},
						o = function (e, t, n, o, s, a, u)
						{
							var c = e >>> 0;
							return n = n && c &&
							{
								2: "0b",
								8: "0",
								16: "0x"
							}[t] || "", e = n + i(c.toString(t), a || 0, "0", !1), r(e, n, o, s, u)
						},
						s = function (e, t, n, i, o, s)
						{
							return null != i && (e = e.slice(0, i)), r(e, "", t, n, o, s)
						},
						a = function (e, a, u, c, l, h, d)
						{
							var f, p, g, y, M;
							if ("%%" == e) return "%";
							for (var v = !1, A = "", E = !1, m = !1, w = " ", N = u.length, D = 0; u && D < N; D++) switch (u.charAt(D))
							{
							case " ":
								A = " ";
								break;
							case "+":
								A = "+";
								break;
							case "-":
								v = !0;
								break;
							case "'":
								w = u.charAt(D + 1);
								break;
							case "0":
								E = !0;
								break;
							case "#":
								m = !0
							}
							if ((c = c ? "*" == c ? +t[n++] : "*" == c.charAt(0) ? +t[c.slice(1, -1)] : +c : 0) < 0 && (c = -c, v = !0), !isFinite(c)) throw new Error("sprintf: (minimum-)width must be finite");
							switch (h = h ? "*" == h ? +t[n++] : "*" == h.charAt(0) ? +t[h.slice(1, -1)] : +h : "fFeE".indexOf(d) > -1 ? 6 : "d" == d ? 0 : void 0, M = a ? t[a.slice(0, -1)] : t[n++], d)
							{
							case "s":
								return s(String(M), v, c, h, E, w);
							case "c":
								return s(String.fromCharCode(+M), v, c, h, E);
							case "b":
								return o(M, 2, m, v, c, h, E);
							case "o":
								return o(M, 8, m, v, c, h, E);
							case "x":
								return o(M, 16, m, v, c, h, E);
							case "X":
								return o(M, 16, m, v, c, h, E).toUpperCase();
							case "u":
								return o(M, 10, m, v, c, h, E);
							case "i":
							case "d":
								return f = +M || 0, f = Math.round(f - f % 1), p = f < 0 ? "-" : A, M = p + i(String(Math.abs(f)), h, "0", !1), r(M, p, v, c, E);
							case "e":
							case "E":
							case "f":
							case "F":
							case "g":
							case "G":
								return f = +M, p = f < 0 ? "-" : A, g = ["toExponential", "toFixed", "toPrecision"]["efg".indexOf(d.toLowerCase())], y = ["toString", "toUpperCase"]["eEfFgG".indexOf(d) % 2], M = p + Math.abs(f)[g](h), r(M, p, v, c, E)[y]();
							default:
								return e
							}
						};
					return t[n++].replace(e, a)
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("3c", ["1e", "5"], function (e, t)
			{
				"use strict";

				function n(t, n, i)
				{
					e.defined("array", t), e.defined("itemToFind", n), e.defined("comparator", i);
					for (var r, o, s = 0, a = t.length - 1; s <= a;)
						if (r = ~~((s + a) / 2), (o = i(t[r], n)) < 0) s = r + 1;
						else
						{
							if (!(o > 0)) return r;
							a = r - 1
						}
					return ~(a + 1)
				}
				return n
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("70", [], function ()
			{
				"use strict";

				function e(e, t, n, i, r, o, s, a)
				{
					this.year = e, this.month = t, this.day = n, this.hour = i, this.minute = r, this.second = o, this.millisecond = s, this.isLeapSecond = a
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("71", ["7"], function (e)
			{
				"use strict";

				function t(t)
				{
					if (null === t || isNaN(t)) throw new e("year is required and must be a number.");
					return t % 4 == 0 && t % 100 != 0 || t % 400 == 0
				}
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("60", [], function ()
			{
				"use strict";

				function e(e, t)
				{
					this.julianDate = e, this.offset = t
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("40", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					UTC: 0,
					TAI: 1
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("17", ["6f", "3c", "15", "5", "7", "70", "71", "60", "3f", "40"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(e, t)
				{
					return g.compare(e.julianDate, t.julianDate)
				}

				function h(e)
				{
					v.julianDate = e;
					var n = g.leapSeconds,
						i = t(n, v, l);
					i < 0 && (i = ~i), i >= n.length && (i = n.length - 1);
					var r = n[i].offset;
					i > 0 && g.secondsDifference(n[i].julianDate, e) > r && (r = n[--i].offset), g.addSeconds(e, r, e)
				}

				function d(e, n)
				{
					v.julianDate = e;
					var i = g.leapSeconds,
						r = t(i, v, l);
					if (r < 0 && (r = ~r), 0 === r) return g.addSeconds(e, -i[0].offset, n);
					if (r >= i.length) return g.addSeconds(e, -i[r - 1].offset, n);
					var o = g.secondsDifference(i[r].julianDate, e);
					return 0 === o ? g.addSeconds(e, -i[r].offset, n) : o <= 1 ? void 0 : g.addSeconds(e, -i[--r].offset, n)
				}

				function f(e, t, n)
				{
					var i = t / u.SECONDS_PER_DAY | 0;
					return e += i, (t -= u.SECONDS_PER_DAY * i) < 0 && (e--, t += u.SECONDS_PER_DAY), n.dayNumber = e, n.secondsOfDay = t, n
				}

				function p(e, t, n, i, r, o, s)
				{
					var a = (t - 14) / 12 | 0,
						c = e + 4800 + a,
						l = (1461 * c / 4 | 0) + (367 * (t - 2 - 12 * a) / 12 | 0) - (3 * ((c + 100) / 100 | 0) / 4 | 0) + n - 32075;
					(i -= 12) < 0 && (i += 24);
					var h = o + (i * u.SECONDS_PER_HOUR + r * u.SECONDS_PER_MINUTE + s * u.SECONDS_PER_MILLISECOND);
					return h >= 43200 && (l -= 1), [l, h]
				}

				function g(e, t, i)
				{
					this.dayNumber = void 0, this.secondsOfDay = void 0, e = n(e, 0), t = n(t, 0), i = n(i, c.UTC);
					var r = 0 | e;
					f(r, t += (e - r) * u.SECONDS_PER_DAY, this), i === c.UTC && h(this)
				}
				var y = new o,
					M = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
					v = new a,
					A = /^(\d{4})$/,
					E = /^(\d{4})-(\d{2})$/,
					m = /^(\d{4})-?(\d{3})$/,
					w = /^(\d{4})-?W(\d{2})-?(\d{1})?$/,
					N = /^(\d{4})-?(\d{2})-?(\d{2})$/,
					D = /([Z+\-])?(\d{2})?:?(\d{2})?$/,
					T = /^(\d{2})(\.\d+)?/.source + D.source,
					I = /^(\d{2}):?(\d{2})(\.\d+)?/.source + D.source,
					O = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + D.source,
					S = "Invalid ISO 8601 date.";
				g.fromGregorianDate = function (e, t)
				{
					if (!(e instanceof o)) throw new r("date must be a valid GregorianDate.");
					var n = p(e.year, e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
					return i(t) ? (f(n[0], n[1], t), h(t), t) : new g(n[0], n[1], c.UTC)
				}, g.fromDate = function (e, t)
				{
					if (!(e instanceof Date) || isNaN(e.getTime())) throw new r("date must be a valid JavaScript Date.");
					var n = p(e.getUTCFullYear(), e.getUTCMonth() + 1, e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
					return i(t) ? (f(n[0], n[1], t), h(t), t) : new g(n[0], n[1], c.UTC)
				}, g.fromIso8601 = function (e, t)
				{
					if ("string" != typeof e) throw new r(S);
					var n, o, a, u = (e = e.replace(",", ".")).split("T"),
						l = 1,
						d = 1,
						y = 0,
						v = 0,
						D = 0,
						_ = 0,
						L = u[0],
						j = u[1];
					if (!i(L)) throw new r(S);
					var x;
					if (null !== (u = L.match(N)))
					{
						if ((x = L.split("-").length - 1) > 0 && 2 !== x) throw new r(S);
						n = +u[1], l = +u[2], d = +u[3]
					}
					else if (null !== (u = L.match(E))) n = +u[1], l = +u[2];
					else if (null !== (u = L.match(A))) n = +u[1];
					else
					{
						var b;
						if (null !== (u = L.match(m)))
						{
							if (n = +u[1], b = +u[2], a = s(n), b < 1 || a && b > 366 || !a && b > 365) throw new r(S)
						}
						else
						{
							if (null === (u = L.match(w))) throw new r(S);
							n = +u[1];
							var C = +u[2],
								R = +u[3] || 0;
							if ((x = L.split("-").length - 1) > 0 && (!i(u[3]) && 1 !== x || i(u[3]) && 2 !== x)) throw new r(S);
							b = 7 * C + R - new Date(Date.UTC(n, 0, 4)).getUTCDay() - 3
						}(o = new Date(Date.UTC(n, 0, 1))).setUTCDate(b), l = o.getUTCMonth() + 1, d = o.getUTCDate()
					}
					if (a = s(n), l < 1 || l > 12 || d < 1 || (2 !== l || !a) && d > M[l - 1] || a && 2 === l && d > 29) throw new r(S);
					var z;
					if (i(j))
					{
						if (null !== (u = j.match(O)))
						{
							if ((x = j.split(":").length - 1) > 0 && 2 !== x && 3 !== x) throw new r(S);
							y = +u[1], v = +u[2], D = +u[3], _ = 1e3 * +(u[4] || 0), z = 5
						}
						else if (null !== (u = j.match(I)))
						{
							if ((x = j.split(":").length - 1) > 2) throw new r(S);
							y = +u[1], v = +u[2], D = 60 * +(u[3] || 0), z = 4
						}
						else
						{
							if (null === (u = j.match(T))) throw new r(S);
							y = +u[1], v = 60 * +(u[2] || 0), z = 3
						}
						if (v >= 60 || D >= 61 || y > 24 || 24 === y && (v > 0 || D > 0 || _ > 0)) throw new r(S);
						var P = u[z],
							U = +u[z + 1],
							k = +(u[z + 2] || 0);
						switch (P)
						{
						case "+":
							y -= U, v -= k;
							break;
						case "-":
							y += U, v += k;
							break;
						case "Z":
							break;
						default:
							v += new Date(Date.UTC(n, l - 1, d, y, v)).getTimezoneOffset()
						}
					}
					var B = 60 === D;
					for (B && D--; v >= 60;) v -= 60, y++;
					for (; y >= 24;) y -= 24, d++;
					for (o = a && 2 === l ? 29 : M[l - 1]; d > o;) d -= o, ++l > 12 && (l -= 12, n++), o = a && 2 === l ? 29 : M[l - 1];
					for (; v < 0;) v += 60, y--;
					for (; y < 0;) y += 24, d--;
					for (; d < 1;) --l < 1 && (l += 12, n--), d += o = a && 2 === l ? 29 : M[l - 1];
					var F = p(n, l, d, y, v, D, _);
					return i(t) ? (f(F[0], F[1], t), h(t)) : t = new g(F[0], F[1], c.UTC), B && g.addSeconds(t, 1, t), t
				}, g.now = function (e)
				{
					return g.fromDate(new Date, e)
				};
				var _ = new g(0, 0, c.TAI);
				return g.toGregorianDate = function (e, t)
				{
					if (!i(e)) throw new r("julianDate is required.");
					var n = !1,
						s = d(e, _);
					i(s) || (g.addSeconds(e, -1, _), s = d(_, _), n = !0);
					var a = s.dayNumber,
						c = s.secondsOfDay;
					c >= 43200 && (a += 1);
					var l = a + 68569 | 0,
						h = 4 * l / 146097 | 0,
						f = 4e3 * ((l = l - ((146097 * h + 3) / 4 | 0) | 0) + 1) / 1461001 | 0,
						p = 80 * (l = l - (1461 * f / 4 | 0) + 31 | 0) / 2447 | 0,
						y = l - (2447 * p / 80 | 0) | 0,
						M = p + 2 - 12 * (l = p / 11 | 0) | 0,
						v = 100 * (h - 49) + f + l | 0,
						A = c / u.SECONDS_PER_HOUR | 0,
						E = c - A * u.SECONDS_PER_HOUR,
						m = E / u.SECONDS_PER_MINUTE | 0,
						w = 0 | (E -= m * u.SECONDS_PER_MINUTE),
						N = (E - w) / u.SECONDS_PER_MILLISECOND;
					return (A += 12) > 23 && (A -= 24), n && (w += 1), i(t) ? (t.year = v, t.month = M, t.day = y, t.hour = A, t.minute = m, t.second = w, t.millisecond = N, t.isLeapSecond = n, t) : new o(v, M, y, A, m, w, N, n)
				}, g.toDate = function (e)
				{
					if (!i(e)) throw new r("julianDate is required.");
					var t = g.toGregorianDate(e, y),
						n = t.second;
					return t.isLeapSecond && (n -= 1), new Date(Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute, n, t.millisecond))
				}, g.toIso8601 = function (t, n)
				{
					if (!i(t)) throw new r("julianDate is required.");
					var o, s = g.toGregorianDate(t, y);
					return i(n) || 0 === s.millisecond ? i(n) && 0 !== n ? (o = (.01 * s.millisecond).toFixed(n).replace(".", "").slice(0, n), e("%04d-%02d-%02dT%02d:%02d:%02d.%sZ", s.year, s.month, s.day, s.hour, s.minute, s.second, o)) : e("%04d-%02d-%02dT%02d:%02d:%02dZ", s.year, s.month, s.day, s.hour, s.minute, s.second) : (o = (.01 * s.millisecond).toString().replace(".", ""), e("%04d-%02d-%02dT%02d:%02d:%02d.%sZ", s.year, s.month, s.day, s.hour, s.minute, s.second, o))
				}, g.clone = function (e, t)
				{
					if (i(e)) return i(t) ? (t.dayNumber = e.dayNumber, t.secondsOfDay = e.secondsOfDay, t) : new g(e.dayNumber, e.secondsOfDay, c.TAI)
				}, g.compare = function (e, t)
				{
					if (!i(e)) throw new r("left is required.");
					if (!i(t)) throw new r("right is required.");
					var n = e.dayNumber - t.dayNumber;
					return 0 !== n ? n : e.secondsOfDay - t.secondsOfDay
				}, g.equals = function (e, t)
				{
					return e === t || i(e) && i(t) && e.dayNumber === t.dayNumber && e.secondsOfDay === t.secondsOfDay
				}, g.equalsEpsilon = function (e, t, n)
				{
					if (!i(n)) throw new r("epsilon is required.");
					return e === t || i(e) && i(t) && Math.abs(g.secondsDifference(e, t)) <= n
				}, g.totalDays = function (e)
				{
					if (!i(e)) throw new r("julianDate is required.");
					return e.dayNumber + e.secondsOfDay / u.SECONDS_PER_DAY
				}, g.secondsDifference = function (e, t)
				{
					if (!i(e)) throw new r("left is required.");
					if (!i(t)) throw new r("right is required.");
					return (e.dayNumber - t.dayNumber) * u.SECONDS_PER_DAY + (e.secondsOfDay - t.secondsOfDay)
				}, g.daysDifference = function (e, t)
				{
					if (!i(e)) throw new r("left is required.");
					if (!i(t)) throw new r("right is required.");
					return e.dayNumber - t.dayNumber + (e.secondsOfDay - t.secondsOfDay) / u.SECONDS_PER_DAY
				}, g.computeTaiMinusUtc = function (e)
				{
					v.julianDate = e;
					var n = g.leapSeconds,
						i = t(n, v, l);
					return i < 0 && (i = ~i, --i < 0 && (i = 0)), n[i].offset
				}, g.addSeconds = function (e, t, n)
				{
					if (!i(e)) throw new r("julianDate is required.");
					if (!i(t)) throw new r("seconds is required.");
					if (!i(n)) throw new r("result is required.");
					return f(e.dayNumber, e.secondsOfDay + t, n)
				}, g.addMinutes = function (e, t, n)
				{
					if (!i(e)) throw new r("julianDate is required.");
					if (!i(t)) throw new r("minutes is required.");
					if (!i(n)) throw new r("result is required.");
					var o = e.secondsOfDay + t * u.SECONDS_PER_MINUTE;
					return f(e.dayNumber, o, n)
				}, g.addHours = function (e, t, n)
				{
					if (!i(e)) throw new r("julianDate is required.");
					if (!i(t)) throw new r("hours is required.");
					if (!i(n)) throw new r("result is required.");
					var o = e.secondsOfDay + t * u.SECONDS_PER_HOUR;
					return f(e.dayNumber, o, n)
				}, g.addDays = function (e, t, n)
				{
					if (!i(e)) throw new r("julianDate is required.");
					if (!i(t)) throw new r("days is required.");
					if (!i(n)) throw new r("result is required.");
					return f(e.dayNumber + t, e.secondsOfDay, n)
				}, g.lessThan = function (e, t)
				{
					return g.compare(e, t) < 0
				}, g.lessThanOrEquals = function (e, t)
				{
					return g.compare(e, t) <= 0
				}, g.greaterThan = function (e, t)
				{
					return g.compare(e, t) > 0
				}, g.greaterThanOrEquals = function (e, t)
				{
					return g.compare(e, t) >= 0
				}, g.prototype.clone = function (e)
				{
					return g.clone(this, e)
				}, g.prototype.equals = function (e)
				{
					return g.equals(this, e)
				}, g.prototype.equalsEpsilon = function (e, t)
				{
					return g.equalsEpsilon(this, e, t)
				}, g.prototype.toString = function ()
				{
					return g.toIso8601(this)
				}, g.leapSeconds = [new a(new g(2441317, 43210, c.TAI), 10), new a(new g(2441499, 43211, c.TAI), 11), new a(new g(2441683, 43212, c.TAI), 12), new a(new g(2442048, 43213, c.TAI), 13), new a(new g(2442413, 43214, c.TAI), 14), new a(new g(2442778, 43215, c.TAI), 15), new a(new g(2443144, 43216, c.TAI), 16), new a(new g(2443509, 43217, c.TAI), 17), new a(new g(2443874, 43218, c.TAI), 18), new a(new g(2444239, 43219, c.TAI), 19), new a(new g(2444786, 43220, c.TAI), 20), new a(new g(2445151, 43221, c.TAI), 21), new a(new g(2445516, 43222, c.TAI), 22), new a(new g(2446247, 43223, c.TAI), 23), new a(new g(2447161, 43224, c.TAI), 24), new a(new g(2447892, 43225, c.TAI), 25), new a(new g(2448257, 43226, c.TAI), 26), new a(new g(2448804, 43227, c.TAI), 27), new a(new g(2449169, 43228, c.TAI), 28), new a(new g(2449534, 43229, c.TAI), 29), new a(new g(2450083, 43230, c.TAI), 30), new a(new g(2450630, 43231, c.TAI), 31), new a(new g(2451179, 43232, c.TAI), 32), new a(new g(2453736, 43233, c.TAI), 33), new a(new g(2454832, 43234, c.TAI), 34), new a(new g(2456109, 43235, c.TAI), 35), new a(new g(2457204, 43236, c.TAI), 36), new a(new g(2457754, 43237, c.TAI), 37)], g
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("72", ["15", "5", "7", "d"], function (e, t, n, i)
			{
				"use strict";

				function r(t, n, i)
				{
					this.heading = e(t, 0), this.pitch = e(n, 0), this.roll = e(i, 0)
				}
				return r.fromQuaternion = function (e, i)
				{
					if (!t(e)) throw new n("quaternion is required");
					t(i) || (i = new r);
					var o = 2 * (e.w * e.y - e.z * e.x),
						s = 1 - 2 * (e.x * e.x + e.y * e.y),
						a = 2 * (e.w * e.x + e.y * e.z),
						u = 1 - 2 * (e.y * e.y + e.z * e.z),
						c = 2 * (e.w * e.z + e.x * e.y);
					return i.heading = -Math.atan2(c, u), i.roll = Math.atan2(a, s), i.pitch = -Math.asin(o), i
				}, r.fromDegrees = function (e, o, s, a)
				{
					if (!t(e)) throw new n("heading is required");
					if (!t(o)) throw new n("pitch is required");
					if (!t(s)) throw new n("roll is required");
					return t(a) || (a = new r), a.heading = e * i.RADIANS_PER_DEGREE, a.pitch = o * i.RADIANS_PER_DEGREE, a.roll = s * i.RADIANS_PER_DEGREE, a
				}, r.clone = function (e, n)
				{
					if (t(e)) return t(n) ? (n.heading = e.heading, n.pitch = e.pitch, n.roll = e.roll, n) : new r(e.heading, e.pitch, e.roll)
				}, r.equals = function (e, n)
				{
					return e === n || t(e) && t(n) && e.heading === n.heading && e.pitch === n.pitch && e.roll === n.roll
				}, r.equalsEpsilon = function (e, n, r, o)
				{
					return e === n || t(e) && t(n) && i.equalsEpsilon(e.heading, n.heading, r, o) && i.equalsEpsilon(e.pitch, n.pitch, r, o) && i.equalsEpsilon(e.roll, n.roll, r, o)
				}, r.prototype.clone = function (e)
				{
					return r.clone(this, e)
				}, r.prototype.equals = function (e)
				{
					return r.equals(this, e)
				}, r.prototype.equalsEpsilon = function (e, t, n)
				{
					return r.equalsEpsilon(this, e, t, n)
				}, r.prototype.toString = function ()
				{
					return "(" + this.heading + ", " + this.pitch + ", " + this.roll + ")"
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("2a", ["20", "1e", "15", "5", "3d", "11", "72", "d", "28"], function (e, t, n, i, r, o, s, a, u)
			{
				"use strict";

				function c(e, t, i, r)
				{
					this.x = n(e, 0), this.y = n(t, 0), this.z = n(i, 0), this.w = n(r, 0)
				}
				var l = new e;
				c.fromAxisAngle = function (n, r, o)
				{
					t.typeOf.object("axis", n), t.typeOf.number("angle", r);
					var s = r / 2,
						a = Math.sin(s),
						u = (l = e.normalize(n, l)).x * a,
						h = l.y * a,
						d = l.z * a,
						f = Math.cos(s);
					return i(o) ? (o.x = u, o.y = h, o.z = d, o.w = f, o) : new c(u, h, d, f)
				};
				var h = [1, 2, 0],
					d = new Array(3);
				c.fromRotationMatrix = function (e, n)
				{
					t.typeOf.object("matrix", e);
					var r, o, s, a, l, f = e[u.COLUMN0ROW0],
						p = e[u.COLUMN1ROW1],
						g = e[u.COLUMN2ROW2],
						y = f + p + g;
					if (y > 0) l = .5 * (r = Math.sqrt(y + 1)), r = .5 / r, o = (e[u.COLUMN1ROW2] - e[u.COLUMN2ROW1]) * r, s = (e[u.COLUMN2ROW0] - e[u.COLUMN0ROW2]) * r, a = (e[u.COLUMN0ROW1] - e[u.COLUMN1ROW0]) * r;
					else
					{
						var M = h,
							v = 0;
						p > f && (v = 1), g > f && g > p && (v = 2);
						var A = M[v],
							E = M[A];
						r = Math.sqrt(e[u.getElementIndex(v, v)] - e[u.getElementIndex(A, A)] - e[u.getElementIndex(E, E)] + 1);
						var m = d;
						m[v] = .5 * r, r = .5 / r, l = (e[u.getElementIndex(E, A)] - e[u.getElementIndex(A, E)]) * r, m[A] = (e[u.getElementIndex(A, v)] + e[u.getElementIndex(v, A)]) * r, m[E] = (e[u.getElementIndex(E, v)] + e[u.getElementIndex(v, E)]) * r, o = -m[0], s = -m[1], a = -m[2]
					}
					return i(n) ? (n.x = o, n.y = s, n.z = a, n.w = l, n) : new c(o, s, a, l)
				};
				var f = new c,
					p = new c,
					g = new c,
					y = new c;
				c.fromHeadingPitchRoll = function (n, i)
				{
					return t.typeOf.object("headingPitchRoll", n), y = c.fromAxisAngle(e.UNIT_X, n.roll, f), g = c.fromAxisAngle(e.UNIT_Y, -n.pitch, i), i = c.multiply(g, y, g), p = c.fromAxisAngle(e.UNIT_Z, -n.heading, f), c.multiply(p, i, i)
				};
				var M = new e,
					v = new e,
					A = new c,
					E = new c,
					m = new c;
				c.packedLength = 4, c.pack = function (e, i, r)
				{
					return t.typeOf.object("value", e), t.defined("array", i), r = n(r, 0), i[r++] = e.x, i[r++] = e.y, i[r++] = e.z, i[r] = e.w, i
				}, c.unpack = function (e, r, o)
				{
					return t.defined("array", e), r = n(r, 0), i(o) || (o = new c), o.x = e[r], o.y = e[r + 1], o.z = e[r + 2], o.w = e[r + 3], o
				}, c.packedInterpolationLength = 3, c.convertPackedArrayForInterpolation = function (e, t, n, i)
				{
					c.unpack(e, 4 * n, m), c.conjugate(m, m);
					for (var r = 0, o = n - t + 1; r < o; r++)
					{
						var s = 3 * r;
						c.unpack(e, 4 * (t + r), A), c.multiply(A, m, A), A.w < 0 && c.negate(A, A), c.computeAxis(A, M);
						var a = c.computeAngle(A);
						i[s] = M.x * a, i[s + 1] = M.y * a, i[s + 2] = M.z * a
					}
				}, c.unpackInterpolationResult = function (t, n, r, o, s)
				{
					i(s) || (s = new c), e.fromArray(t, 0, v);
					var a = e.magnitude(v);
					return c.unpack(n, 4 * o, E), 0 === a ? c.clone(c.IDENTITY, A) : c.fromAxisAngle(v, a, A), c.multiply(A, E, s)
				}, c.clone = function (e, t)
				{
					if (i(e)) return i(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t) : new c(e.x, e.y, e.z, e.w)
				}, c.conjugate = function (e, n)
				{
					return t.typeOf.object("quaternion", e), t.typeOf.object("result", n), n.x = -e.x, n.y = -e.y, n.z = -e.z, n.w = e.w, n
				}, c.magnitudeSquared = function (e)
				{
					return t.typeOf.object("quaternion", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w
				}, c.magnitude = function (e)
				{
					return Math.sqrt(c.magnitudeSquared(e))
				}, c.normalize = function (e, n)
				{
					t.typeOf.object("result", n);
					var i = 1 / c.magnitude(e),
						r = e.x * i,
						o = e.y * i,
						s = e.z * i,
						a = e.w * i;
					return n.x = r, n.y = o, n.z = s, n.w = a, n
				}, c.inverse = function (e, n)
				{
					t.typeOf.object("result", n);
					var i = c.magnitudeSquared(e);
					return n = c.conjugate(e, n), c.multiplyByScalar(n, 1 / i, n)
				}, c.add = function (e, n, i)
				{
					return t.typeOf.object("left", e), t.typeOf.object("right", n), t.typeOf.object("result", i), i.x = e.x + n.x, i.y = e.y + n.y, i.z = e.z + n.z, i.w = e.w + n.w, i
				}, c.subtract = function (e, n, i)
				{
					return t.typeOf.object("left", e), t.typeOf.object("right", n), t.typeOf.object("result", i), i.x = e.x - n.x, i.y = e.y - n.y, i.z = e.z - n.z, i.w = e.w - n.w, i
				}, c.negate = function (e, n)
				{
					return t.typeOf.object("quaternion", e), t.typeOf.object("result", n), n.x = -e.x, n.y = -e.y, n.z = -e.z, n.w = -e.w, n
				}, c.dot = function (e, n)
				{
					return t.typeOf.object("left", e), t.typeOf.object("right", n), e.x * n.x + e.y * n.y + e.z * n.z + e.w * n.w
				}, c.multiply = function (e, n, i)
				{
					t.typeOf.object("left", e), t.typeOf.object("right", n), t.typeOf.object("result", i);
					var r = e.x,
						o = e.y,
						s = e.z,
						a = e.w,
						u = n.x,
						c = n.y,
						l = n.z,
						h = n.w,
						d = a * u + r * h + o * l - s * c,
						f = a * c - r * l + o * h + s * u,
						p = a * l + r * c - o * u + s * h,
						g = a * h - r * u - o * c - s * l;
					return i.x = d, i.y = f, i.z = p, i.w = g, i
				}, c.multiplyByScalar = function (e, n, i)
				{
					return t.typeOf.object("quaternion", e), t.typeOf.number("scalar", n), t.typeOf.object("result", i), i.x = e.x * n, i.y = e.y * n, i.z = e.z * n, i.w = e.w * n, i
				}, c.divideByScalar = function (e, n, i)
				{
					return t.typeOf.object("quaternion", e), t.typeOf.number("scalar", n), t.typeOf.object("result", i), i.x = e.x / n, i.y = e.y / n, i.z = e.z / n, i.w = e.w / n, i
				}, c.computeAxis = function (e, n)
				{
					t.typeOf.object("quaternion", e), t.typeOf.object("result", n);
					var i = e.w;
					if (Math.abs(i - 1) < a.EPSILON6) return n.x = n.y = n.z = 0, n;
					var r = 1 / Math.sqrt(1 - i * i);
					return n.x = e.x * r, n.y = e.y * r, n.z = e.z * r, n
				}, c.computeAngle = function (e)
				{
					return t.typeOf.object("quaternion", e), Math.abs(e.w - 1) < a.EPSILON6 ? 0 : 2 * Math.acos(e.w)
				};
				var w = new c;
				c.lerp = function (e, n, i, r)
				{
					return t.typeOf.object("start", e), t.typeOf.object("end", n), t.typeOf.number("t", i), t.typeOf.object("result", r), w = c.multiplyByScalar(n, i, w), r = c.multiplyByScalar(e, 1 - i, r), c.add(w, r, r)
				};
				var N = new c,
					D = new c,
					T = new c;
				c.slerp = function (e, n, i, r)
				{
					t.typeOf.object("start", e), t.typeOf.object("end", n), t.typeOf.number("t", i), t.typeOf.object("result", r);
					var o = c.dot(e, n),
						s = n;
					if (o < 0 && (o = -o, s = N = c.negate(n, N)), 1 - o < a.EPSILON6) return c.lerp(e, s, i, r);
					var u = Math.acos(o);
					return D = c.multiplyByScalar(e, Math.sin((1 - i) * u), D), T = c.multiplyByScalar(s, Math.sin(i * u), T), r = c.add(D, T, r), c.multiplyByScalar(r, 1 / Math.sin(u), r)
				}, c.log = function (n, i)
				{
					t.typeOf.object("quaternion", n), t.typeOf.object("result", i);
					var r = a.acosClamped(n.w),
						o = 0;
					return 0 !== r && (o = r / Math.sin(r)), e.multiplyByScalar(n, o, i)
				}, c.exp = function (n, i)
				{
					t.typeOf.object("cartesian", n), t.typeOf.object("result", i);
					var r = e.magnitude(n),
						o = 0;
					return 0 !== r && (o = Math.sin(r) / r), i.x = n.x * o, i.y = n.y * o, i.z = n.z * o, i.w = Math.cos(r), i
				};
				var I = new e,
					O = new e,
					S = new c,
					_ = new c;
				c.computeInnerQuadrangle = function (n, i, r, o)
				{
					t.typeOf.object("q0", n), t.typeOf.object("q1", i), t.typeOf.object("q2", r), t.typeOf.object("result", o);
					var s = c.conjugate(i, S);
					c.multiply(s, r, _);
					var a = c.log(_, I);
					c.multiply(s, n, _);
					var u = c.log(_, O);
					return e.add(a, u, a), e.multiplyByScalar(a, .25, a), e.negate(a, a), c.exp(a, S), c.multiply(i, S, o)
				}, c.squad = function (e, n, i, r, o, s)
				{
					t.typeOf.object("q0", e), t.typeOf.object("q1", n), t.typeOf.object("s0", i), t.typeOf.object("s1", r), t.typeOf.number("t", o), t.typeOf.object("result", s);
					var a = c.slerp(e, n, o, S),
						u = c.slerp(i, r, o, _);
					return c.slerp(a, u, 2 * o * (1 - o), s)
				};
				for (var L = new c, j = 1.9011074535173003, x = r.supportsTypedArrays() ? new Float32Array(8) : [], b = r.supportsTypedArrays() ? new Float32Array(8) : [], C = r.supportsTypedArrays() ? new Float32Array(8) : [], R = r.supportsTypedArrays() ? new Float32Array(8) : [], z = 0; z < 7; ++z)
				{
					var P = z + 1,
						U = 2 * P + 1;
					x[z] = 1 / (P * U), b[z] = P / U
				}
				return x[7] = j / 136, b[7] = 8 * j / 17, c.fastSlerp = function (e, n, i, r)
				{
					t.typeOf.object("start", e), t.typeOf.object("end", n), t.typeOf.number("t", i), t.typeOf.object("result", r);
					var o, s = c.dot(e, n);
					s >= 0 ? o = 1 : (o = -1, s = -s);
					for (var a = s - 1, u = 1 - i, l = i * i, h = u * u, d = 7; d >= 0; --d) C[d] = (x[d] * l - b[d]) * a, R[d] = (x[d] * h - b[d]) * a;
					var f = o * i * (1 + C[0] * (1 + C[1] * (1 + C[2] * (1 + C[3] * (1 + C[4] * (1 + C[5] * (1 + C[6] * (1 + C[7])))))))),
						p = u * (1 + R[0] * (1 + R[1] * (1 + R[2] * (1 + R[3] * (1 + R[4] * (1 + R[5] * (1 + R[6] * (1 + R[7])))))))),
						g = c.multiplyByScalar(e, p, L);
					return c.multiplyByScalar(n, f, r), c.add(g, r, r)
				}, c.fastSquad = function (e, n, i, r, o, s)
				{
					t.typeOf.object("q0", e), t.typeOf.object("q1", n), t.typeOf.object("s0", i), t.typeOf.object("s1", r), t.typeOf.number("t", o), t.typeOf.object("result", s);
					var a = c.fastSlerp(e, n, o, S),
						u = c.fastSlerp(i, r, o, _);
					return c.fastSlerp(a, u, 2 * o * (1 - o), s)
				}, c.equals = function (e, t)
				{
					return e === t || i(e) && i(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w
				}, c.equalsEpsilon = function (e, n, r)
				{
					return t.typeOf.number("epsilon", r), e === n || i(e) && i(n) && Math.abs(e.x - n.x) <= r && Math.abs(e.y - n.y) <= r && Math.abs(e.z - n.z) <= r && Math.abs(e.w - n.w) <= r
				}, c.ZERO = o(new c(0, 0, 0, 0)), c.IDENTITY = o(new c(0, 0, 0, 1)), c.prototype.clone = function (e)
				{
					return c.clone(this, e)
				}, c.prototype.equals = function (e)
				{
					return c.equals(this, e)
				}, c.prototype.equalsEpsilon = function (e, t)
				{
					return c.equalsEpsilon(this, e, t)
				}, c.prototype.toString = function ()
				{
					return "(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")"
				}, c
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("3f", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					SECONDS_PER_MILLISECOND: .001,
					SECONDS_PER_MINUTE: 60,
					MINUTES_PER_HOUR: 60,
					HOURS_PER_DAY: 24,
					SECONDS_PER_HOUR: 3600,
					MINUTES_PER_DAY: 1440,
					SECONDS_PER_DAY: 86400,
					DAYS_PER_JULIAN_CENTURY: 36525,
					PICOSECOND: 1e-9,
					MODIFIED_JULIAN_DATE_DIFFERENCE: 2400000.5
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("2b", ["48", "a", "20", "33", "42", "1e", "15", "5", "7", "5e", "5f", "43", "6c", "6e", "17", "d", "28", "29", "2a", "3f"], function (e, t, n, i, r, o, s, a, u, c, l, h, d, f, p, g, y, M, v, A)
			{
				"use strict";
				var E = {},
					m = {
						up:
						{
							south: "east",
							north: "west",
							west: "south",
							east: "north"
						},
						down:
						{
							south: "west",
							north: "east",
							west: "north",
							east: "south"
						},
						south:
						{
							up: "west",
							down: "east",
							west: "down",
							east: "up"
						},
						north:
						{
							up: "east",
							down: "west",
							west: "up",
							east: "down"
						},
						west:
						{
							up: "north",
							down: "south",
							north: "down",
							south: "up"
						},
						east:
						{
							up: "south",
							down: "north",
							north: "up",
							south: "down"
						}
					},
					w = {
						north: [-1, 0, 0],
						east: [0, 1, 0],
						up: [0, 0, 1],
						south: [1, 0, 0],
						west: [0, -1, 0],
						down: [0, 0, -1]
					},
					N = {},
					D = {
						east: new n,
						north: new n,
						up: new n,
						west: new n,
						south: new n,
						down: new n
					},
					T = new n,
					I = new n,
					O = new n;
				E.localFrameToFixedFrameGenerator = function (e, t)
				{
					if (!m.hasOwnProperty(e) || !m[e].hasOwnProperty(t)) throw new u("firstAxis and secondAxis must be east, north, up, west, south or down.");
					var i, r = m[e][t],
						o = e + t;
					return a(N[o]) ? i = N[o] : (i = function (i, o, c)
					{
						if (!a(i)) throw new u("origin is required.");
						if (a(c) || (c = new M), g.equalsEpsilon(i.x, 0, g.EPSILON14) && g.equalsEpsilon(i.y, 0, g.EPSILON14))
						{
							var l = g.sign(i.z);
							n.unpack(w[e], 0, T), "east" !== e && "west" !== e && n.multiplyByScalar(T, l, T), n.unpack(w[t], 0, I), "east" !== t && "west" !== t && n.multiplyByScalar(I, l, I), n.unpack(w[r], 0, O), "east" !== r && "west" !== r && n.multiplyByScalar(O, l, O)
						}
						else
						{
							(o = s(o, h.WGS84)).geodeticSurfaceNormal(i, D.up);
							var d = D.up,
								f = D.east;
							f.x = -i.y, f.y = i.x, f.z = 0, n.normalize(f, D.east), n.cross(d, f, D.north), n.multiplyByScalar(D.up, -1, D.down), n.multiplyByScalar(D.east, -1, D.west), n.multiplyByScalar(D.north, -1, D.south), T = D[e], I = D[t], O = D[r]
						}
						return c[0] = T.x, c[1] = T.y, c[2] = T.z, c[3] = 0, c[4] = I.x, c[5] = I.y, c[6] = I.z, c[7] = 0, c[8] = O.x, c[9] = O.y, c[10] = O.z, c[11] = 0, c[12] = i.x, c[13] = i.y, c[14] = i.z, c[15] = 1, c
					}, N[o] = i), i
				}, E.eastNorthUpToFixedFrame = E.localFrameToFixedFrameGenerator("east", "north"), E.northEastDownToFixedFrame = E.localFrameToFixedFrameGenerator("north", "east"), E.northUpEastToFixedFrame = E.localFrameToFixedFrameGenerator("north", "up"), E.northWestUpToFixedFrame = E.localFrameToFixedFrameGenerator("north", "west");
				var S = new v,
					_ = new n(1, 1, 1),
					L = new M;
				E.headingPitchRollToFixedFrame = function (e, t, i, r, a)
				{
					o.typeOf.object("HeadingPitchRoll", t), r = s(r, E.eastNorthUpToFixedFrame);
					var u = v.fromHeadingPitchRoll(t, S),
						c = M.fromTranslationQuaternionRotationScale(n.ZERO, u, _, L);
					return a = r(e, i, a), M.multiply(a, c, a)
				};
				var j = new M,
					x = new y;
				E.headingPitchRollQuaternion = function (e, t, n, i, r)
				{
					o.typeOf.object("HeadingPitchRoll", t);
					var s = E.headingPitchRollToFixedFrame(e, t, n, i, j),
						a = M.getRotation(s, x);
					return v.fromRotationMatrix(a, r)
				};
				var b = g.TWO_PI / 86400,
					C = new p;
				E.computeTemeToPseudoFixedMatrix = function (e, t)
				{
					if (!a(e)) throw new u("date is required.");
					var n, i = (C = p.addSeconds(e, -p.computeTaiMinusUtc(e), C)).dayNumber,
						r = C.secondsOfDay,
						o = i - 2451545,
						s = (24110.54841 + (n = r >= 43200 ? (o + .5) / A.DAYS_PER_JULIAN_CENTURY : (o - .5) / A.DAYS_PER_JULIAN_CENTURY) * (8640184.812866 + n * (.093104 + -62e-7 * n))) * b % g.TWO_PI + (72921158553e-15 + 1.1772758384668e-19 * (i - 2451545.5)) * ((r + .5 * A.SECONDS_PER_DAY) % A.SECONDS_PER_DAY),
						c = Math.cos(s),
						l = Math.sin(s);
					return a(t) ? (t[0] = c, t[1] = -l, t[2] = 0, t[3] = l, t[4] = c, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t) : new y(c, l, 0, -l, c, 0, 0, 0, 1)
				}, E.iau2006XysData = new d, E.earthOrientationParameters = c.NONE;
				E.preloadIcrfFixed = function (t)
				{
					var n = t.start.dayNumber,
						i = t.start.secondsOfDay + 32.184,
						r = t.stop.dayNumber,
						o = t.stop.secondsOfDay + 32.184,
						s = E.iau2006XysData.preload(n, i, r, o),
						a = E.earthOrientationParameters.getPromiseToLoad();
					return e.all([s, a])
				}, E.computeIcrfToFixedMatrix = function (e, t)
				{
					if (!a(e)) throw new u("date is required.");
					a(t) || (t = new y);
					var n = E.computeFixedToIcrfMatrix(e, t);
					if (a(n)) return y.transpose(n, t)
				};
				var R = new f(0, 0, 0),
					z = new l(0, 0, 0, 0, 0, 0),
					P = new y,
					U = new y;
				E.computeFixedToIcrfMatrix = function (e, t)
				{
					if (!a(e)) throw new u("date is required.");
					a(t) || (t = new y);
					var n = E.earthOrientationParameters.compute(e, z);
					if (a(n))
					{
						var i = e.dayNumber,
							r = e.secondsOfDay + 32.184,
							o = E.iau2006XysData.computeXysRadians(i, r, R);
						if (a(o))
						{
							var s = o.x + n.xPoleOffset,
								c = o.y + n.yPoleOffset,
								l = 1 / (1 + Math.sqrt(1 - s * s - c * c)),
								h = P;
							h[0] = 1 - l * s * s, h[3] = -l * s * c, h[6] = s, h[1] = -l * s * c, h[4] = 1 - l * c * c, h[7] = c, h[2] = -s, h[5] = -c, h[8] = 1 - l * (s * s + c * c);
							var d = y.fromRotationZ(-o.s, U),
								f = y.multiply(h, d, P),
								M = e.dayNumber - 2451545,
								v = (e.secondsOfDay - p.computeTaiMinusUtc(e) + n.ut1MinusUtc) / A.SECONDS_PER_DAY,
								m = .779057273264 + v + .00273781191135448 * (M + v);
							m = m % 1 * g.TWO_PI;
							var w = y.fromRotationZ(m, U),
								N = y.multiply(f, w, P),
								D = Math.cos(n.xPoleWander),
								T = Math.cos(n.yPoleWander),
								I = Math.sin(n.xPoleWander),
								O = Math.sin(n.yPoleWander),
								S = i - 2451545 + r / A.SECONDS_PER_DAY,
								_ = -47e-6 * (S /= 36525) * g.RADIANS_PER_DEGREE / 3600,
								L = Math.cos(_),
								j = Math.sin(_),
								x = U;
							return x[0] = D * L, x[1] = D * j, x[2] = I, x[3] = -T * j + O * I * L, x[4] = T * L + O * I * j, x[5] = -O * D, x[6] = -O * j - T * I * L, x[7] = O * L - T * I * j, x[8] = T * D, y.multiply(N, x, t)
						}
					}
				};
				var k = new i;
				E.pointToWindowCoordinates = function (e, t, n, i)
				{
					return i = E.pointToGLWindowCoordinates(e, t, n, i), i.y = 2 * t[5] - i.y, i
				}, E.pointToGLWindowCoordinates = function (e, n, r, o)
				{
					if (!a(e)) throw new u("modelViewProjectionMatrix is required.");
					if (!a(n)) throw new u("viewportTransformation is required.");
					if (!a(r)) throw new u("point is required.");
					a(o) || (o = new t);
					var s = k;
					return M.multiplyByVector(e, i.fromElements(r.x, r.y, r.z, 1, s), s), i.multiplyByScalar(s, 1 / s.w, s), M.multiplyByVector(n, s, s), t.fromCartesian4(s, o)
				};
				var B = new n,
					F = new n,
					Q = new n;
				E.rotationMatrixFromPositionVelocity = function (e, t, i, r)
				{
					if (!a(e)) throw new u("position is required.");
					if (!a(t)) throw new u("velocity is required.");
					var o = s(i, h.WGS84).geodeticSurfaceNormal(e, B),
						c = n.cross(t, o, F);
					n.equalsEpsilon(c, n.ZERO, g.EPSILON6) && (c = n.clone(n.UNIT_X, c));
					var l = n.cross(c, t, Q);
					return n.cross(t, l, c), n.negate(c, c), a(r) || (r = new y), r[0] = t.x, r[1] = t.y, r[2] = t.z, r[3] = c.x, r[4] = c.y, r[5] = c.z, r[6] = l.x, r[7] = l.y, r[8] = l.z, r
				};
				var Y = new M(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1),
					G = new r,
					V = new n,
					q = new n,
					H = new y,
					W = new M,
					X = new M;
				return E.basisTo2D = function (e, t, i)
				{
					if (!a(e)) throw new u("projection is required.");
					if (!a(t)) throw new u("matrix is required.");
					if (!a(i)) throw new u("result is required.");
					var r = M.getTranslation(t, q),
						o = e.ellipsoid,
						s = o.cartesianToCartographic(r, G),
						c = e.project(s, V);
					n.fromElements(c.z, c.x, c.y, c);
					var l = E.eastNorthUpToFixedFrame(r, o, W),
						h = M.inverseTransformation(l, X),
						d = M.getRotation(t, H),
						f = M.multiplyByMatrix3(h, d, i);
					return M.multiply(Y, f, i), M.setTranslation(i, c, i), i
				}, E.wgs84To2DModelMatrix = function (e, t, i)
				{
					if (!a(e)) throw new u("projection is required.");
					if (!a(t)) throw new u("center is required.");
					if (!a(i)) throw new u("result is required.");
					var r = e.ellipsoid,
						o = E.eastNorthUpToFixedFrame(t, r, W),
						s = M.inverseTransformation(o, X),
						c = r.cartesianToCartographic(t, G),
						l = e.project(c, V);
					n.fromElements(l.z, l.x, l.y, l);
					var h = M.fromTranslation(l, W);
					return M.multiply(Y, s, i), M.multiply(h, i, i), i
				}, E
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("50", ["20", "42", "15", "5", "6", "7", "43", "d"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e)
				{
					this._ellipsoid = n(e, s.WGS84), this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis
				}
				return r(u.prototype,
				{
					ellipsoid:
					{
						get: function ()
						{
							return this._ellipsoid
						}
					}
				}), u.mercatorAngleToGeodeticLatitude = function (e)
				{
					return a.PI_OVER_TWO - 2 * Math.atan(Math.exp(-e))
				}, u.geodeticLatitudeToMercatorAngle = function (e)
				{
					e > u.MaximumLatitude ? e = u.MaximumLatitude : e < -u.MaximumLatitude && (e = -u.MaximumLatitude);
					var t = Math.sin(e);
					return .5 * Math.log((1 + t) / (1 - t))
				}, u.MaximumLatitude = u.mercatorAngleToGeodeticLatitude(Math.PI), u.prototype.project = function (t, n)
				{
					var r = this._semimajorAxis,
						o = t.longitude * r,
						s = u.geodeticLatitudeToMercatorAngle(t.latitude) * r,
						a = t.height;
					return i(n) ? (n.x = o, n.y = s, n.z = a, n) : new e(o, s, a)
				}, u.prototype.unproject = function (e, n)
				{
					if (!i(e)) throw new o("cartesian is required");
					var r = this._oneOverSemimajorAxis,
						s = e.x * r,
						a = u.mercatorAngleToGeodeticLatitude(e.y * r),
						c = e.z;
					return i(n) ? (n.longitude = s, n.latitude = a, n.height = c, n) : new t(s, a, c)
				}, u
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("73", ["57", "55", "a", "20", "15", "5", "7", "43", "54", "11", "d", "29", "5d", "4f", "74", "2b", "50"], function (e, t, n, i, r, o, s, a, u, c, l, h, d, f, p, g, y)
			{
				"use strict";
				var M = {};
				M.DEFAULT_STRUCTURE = c(
				{
					heightScale: 1,
					heightOffset: 0,
					elementsPerHeight: 1,
					stride: 1,
					elementMultiplier: 256,
					isBigEndian: !1
				});
				var v = new i,
					A = new h,
					E = new i,
					m = new i;
				return M.computeVertices = function (c)
				{
					if (!o(c) || !o(c.heightmap)) throw new s("options.heightmap is required.");
					if (!o(c.width) || !o(c.height)) throw new s("options.width and options.height are required.");
					if (!o(c.nativeRectangle)) throw new s("options.nativeRectangle is required.");
					if (!o(c.skirtHeight)) throw new s("options.skirtHeight is required.");
					var w, N, D, T, I = Math.cos,
						O = Math.sin,
						S = Math.sqrt,
						_ = Math.atan,
						L = Math.exp,
						j = l.PI_OVER_TWO,
						x = l.toRadians,
						b = c.heightmap,
						C = c.width,
						R = c.height,
						z = c.skirtHeight,
						P = r(c.isGeographic, !0),
						U = r(c.ellipsoid, a.WGS84),
						k = 1 / U.maximumRadius,
						B = c.nativeRectangle,
						F = c.rectangle;
					o(F) ? (w = F.west, N = F.south, D = F.east, T = F.north) : P ? (w = x(B.west), N = x(B.south), D = x(B.east), T = x(B.north)) : (w = B.west * k, N = j - 2 * _(L(-B.south * k)), D = B.east * k, T = j - 2 * _(L(-B.north * k)));
					var Q = c.relativeToCenter,
						Y = o(Q);
					Q = Y ? Q : i.ZERO;
					var G, V, q = r(c.exaggeration, 1),
						H = r(c.includeWebMercatorT, !1),
						W = r(c.structure, M.DEFAULT_STRUCTURE),
						X = r(W.heightScale, M.DEFAULT_STRUCTURE.heightScale),
						Z = r(W.heightOffset, M.DEFAULT_STRUCTURE.heightOffset),
						K = r(W.elementsPerHeight, M.DEFAULT_STRUCTURE.elementsPerHeight),
						J = r(W.stride, M.DEFAULT_STRUCTURE.stride),
						$ = r(W.elementMultiplier, M.DEFAULT_STRUCTURE.elementMultiplier),
						ee = r(W.isBigEndian, M.DEFAULT_STRUCTURE.isBigEndian),
						te = f.computeWidth(B),
						ne = f.computeHeight(B),
						ie = te / (C - 1),
						re = ne / (R - 1),
						oe = U.radiiSquared,
						se = oe.x,
						ae = oe.y,
						ue = oe.z,
						ce = 65536,
						le = -65536,
						he = g.eastNorthUpToFixedFrame(Q, U),
						de = h.inverseTransformation(he, A);
					H && (G = y.geodeticLatitudeToMercatorAngle(N), V = 1 / (y.geodeticLatitudeToMercatorAngle(T) - G));
					var fe = E;
					fe.x = Number.POSITIVE_INFINITY, fe.y = Number.POSITIVE_INFINITY, fe.z = Number.POSITIVE_INFINITY;
					var pe = m;
					pe.x = Number.NEGATIVE_INFINITY, pe.y = Number.NEGATIVE_INFINITY, pe.z = Number.NEGATIVE_INFINITY;
					var ge = Number.POSITIVE_INFINITY,
						ye = (C + (z > 0 ? 2 : 0)) * (R + (z > 0 ? 2 : 0)),
						Me = new Array(ye),
						ve = new Array(ye),
						Ae = new Array(ye),
						Ee = H ? new Array(ye) : [],
						me = 0,
						we = R,
						Ne = 0,
						De = C;
					z > 0 && (--me, ++we, --Ne, ++De);
					for (var Te = 0, Ie = me; Ie < we; ++Ie)
					{
						var Oe = Ie;
						Oe < 0 && (Oe = 0), Oe >= R && (Oe = R - 1);
						var Se = B.north - re * Oe,
							_e = I(Se = P ? x(Se) : j - 2 * _(L(-Se * k))),
							Le = O(Se),
							je = ue * Le,
							xe = (Se - N) / (T - N);
						xe = l.clamp(xe, 0, 1);
						var be;
						H && (be = (y.geodeticLatitudeToMercatorAngle(Se) - G) * V);
						for (var Ce = Ne; Ce < De; ++Ce)
						{
							var Re = Ce;
							Re < 0 && (Re = 0), Re >= C && (Re = C - 1);
							var ze = B.west + ie * Re;
							P ? ze = x(ze) : ze *= k;
							var Pe, Ue = Oe * (C * J) + Re * J;
							if (1 === K) Pe = b[Ue];
							else
							{
								Pe = 0;
								var ke;
								if (ee)
									for (ke = 0; ke < K; ++ke) Pe = Pe * $ + b[Ue + ke];
								else
									for (ke = K - 1; ke >= 0; --ke) Pe = Pe * $ + b[Ue + ke]
							}
							Pe = (Pe * X + Z) * q;
							var Be = (ze - w) / (D - w);
							if (Be = l.clamp(Be, 0, 1), Ae[Te] = new n(Be, xe), le = Math.max(le, Pe), ce = Math.min(ce, Pe), Ce !== Re || Ie !== Oe)
							{
								Ce < 0 ? ze -= 1e-5 * te : ze += 1e-5 * te, Ie < 0 ? Se += 1e-5 * ne : Se -= 1e-5 * ne, _e = I(Se), je = ue * (Le = O(Se)), Pe -= z
							}
							var Fe = _e * I(ze),
								Qe = _e * O(ze),
								Ye = se * Fe,
								Ge = ae * Qe,
								Ve = 1 / S(Ye * Fe + Ge * Qe + je * Le),
								qe = Ye * Ve,
								He = Ge * Ve,
								We = je * Ve,
								Xe = new i;
							Xe.x = qe + Fe * Pe, Xe.y = He + Qe * Pe, Xe.z = We + Le * Pe, Me[Te] = Xe, ve[Te] = Pe, H && (Ee[Te] = be), Te++, h.multiplyByPoint(de, Xe, v), i.minimumByComponent(v, fe, fe), i.maximumByComponent(v, pe, pe), ge = Math.min(ge, Pe)
						}
					}
					var Ze, Ke = t.fromPoints(Me);
					o(F) && F.width < l.PI_OVER_TWO + l.EPSILON5 && (Ze = d.fromRectangle(F, ce, le, U));
					var Je;
					Y && (Je = new u(U).computeHorizonCullingPoint(Q, Me));
					for (var $e = new e(fe, pe, Q), et = new p($e, ge, le, he, !1, H), tt = new Float32Array(ye * et.getStride()), nt = 0, it = 0; it < ye; ++it) nt = et.encode(tt, nt, Me[it], Ae[it], ve[it], void 0, Ee[it]);
					return {
						vertices: tt,
						maximumHeight: le,
						minimumHeight: ce,
						encoding: et,
						boundingSphere3D: Ke,
						orientedBoundingBox: Ze,
						occludeePointInScaledSpace: Je
					}
				}, M
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("42", ["20", "1e", "15", "5", "11", "d", "75"], function (e, t, n, i, r, o, s)
			{
				"use strict";

				function a(e, t, i)
				{
					this.longitude = n(e, 0), this.latitude = n(t, 0), this.height = n(i, 0)
				}
				a.fromRadians = function (e, r, o, s)
				{
					return t.typeOf.number("longitude", e), t.typeOf.number("latitude", r), o = n(o, 0), i(s) ? (s.longitude = e, s.latitude = r, s.height = o, s) : new a(e, r, o)
				}, a.fromDegrees = function (e, n, i, r)
				{
					return t.typeOf.number("longitude", e), t.typeOf.number("latitude", n), e = o.toRadians(e), n = o.toRadians(n), a.fromRadians(e, n, i, r)
				};
				var u = new e,
					c = new e,
					l = new e,
					h = new e(1 / 6378137, 1 / 6378137, 1 / 6356752.314245179),
					d = new e(1 / 40680631590769, 1 / 40680631590769, 1 / 40408299984661.445),
					f = o.EPSILON1;
				return a.fromCartesian = function (t, n, r)
				{
					var p = i(n) ? n.oneOverRadii : h,
						g = i(n) ? n.oneOverRadiiSquared : d,
						y = i(n) ? n._centerToleranceSquared : f,
						M = s(t, p, g, y, c);
					if (i(M))
					{
						var v = e.multiplyComponents(M, g, u);
						v = e.normalize(v, v);
						var A = e.subtract(t, M, l),
							E = Math.atan2(v.y, v.x),
							m = Math.asin(v.z),
							w = o.sign(e.dot(A, t)) * e.magnitude(A);
						return i(r) ? (r.longitude = E, r.latitude = m, r.height = w, r) : new a(E, m, w)
					}
				}, a.clone = function (e, t)
				{
					if (i(e)) return i(t) ? (t.longitude = e.longitude, t.latitude = e.latitude, t.height = e.height, t) : new a(e.longitude, e.latitude, e.height)
				}, a.equals = function (e, t)
				{
					return e === t || i(e) && i(t) && e.longitude === t.longitude && e.latitude === t.latitude && e.height === t.height
				}, a.equalsEpsilon = function (e, n, r)
				{
					return t.typeOf.number("epsilon", r), e === n || i(e) && i(n) && Math.abs(e.longitude - n.longitude) <= r && Math.abs(e.latitude - n.latitude) <= r && Math.abs(e.height - n.height) <= r
				}, a.ZERO = r(new a(0, 0, 0)), a.prototype.clone = function (e)
				{
					return a.clone(this, e)
				}, a.prototype.equals = function (e)
				{
					return a.equals(this, e)
				}, a.prototype.equalsEpsilon = function (e, t)
				{
					return a.equalsEpsilon(this, e, t)
				}, a.prototype.toString = function ()
				{
					return "(" + this.longitude + ", " + this.latitude + ", " + this.height + ")"
				}, a
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("75", ["20", "5", "7", "d"], function (e, t, n, i)
			{
				"use strict";

				function r(r, a, u, c, l)
				{
					if (!t(r)) throw new n("cartesian is required.");
					if (!t(a)) throw new n("oneOverRadii is required.");
					if (!t(u)) throw new n("oneOverRadiiSquared is required.");
					if (!t(c)) throw new n("centerToleranceSquared is required.");
					var h = r.x,
						d = r.y,
						f = r.z,
						p = a.x,
						g = a.y,
						y = a.z,
						M = h * h * p * p,
						v = d * d * g * g,
						A = f * f * y * y,
						E = M + v + A,
						m = Math.sqrt(1 / E),
						w = e.multiplyByScalar(r, m, o);
					if (E < c) return isFinite(m) ? e.clone(w, l) : void 0;
					var N = u.x,
						D = u.y,
						T = u.z,
						I = s;
					I.x = w.x * N * 2, I.y = w.y * D * 2, I.z = w.z * T * 2;
					var O, S, _, L, j, x, b, C = (1 - m) * e.magnitude(r) / (.5 * e.magnitude(I)),
						R = 0;
					do {
						R = (O = M * (j = (S = 1 / (1 + (C -= R) * N)) * S) + v * (x = (_ = 1 / (1 + C * D)) * _) + A * (b = (L = 1 / (1 + C * T)) * L) - 1) / (-2 * (M * (j * S) * N + v * (x * _) * D + A * (b * L) * T))
					} while (Math.abs(O) > i.EPSILON12);
					return t(l) ? (l.x = h * S, l.y = d * _, l.z = f * L, l) : new e(h * S, d * _, f * L)
				}
				var o = new e,
					s = new e;
				return r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("43", ["20", "42", "1e", "15", "5", "6", "7", "11", "d", "75"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(t, r, o, s)
				{
					r = i(r, 0), o = i(o, 0), s = i(s, 0), n.typeOf.number.greaterThanOrEquals("x", r, 0), n.typeOf.number.greaterThanOrEquals("y", o, 0), n.typeOf.number.greaterThanOrEquals("z", s, 0), t._radii = new e(r, o, s), t._radiiSquared = new e(r * r, o * o, s * s), t._radiiToTheFourth = new e(r * r * r * r, o * o * o * o, s * s * s * s), t._oneOverRadii = new e(0 === r ? 0 : 1 / r, 0 === o ? 0 : 1 / o, 0 === s ? 0 : 1 / s), t._oneOverRadiiSquared = new e(0 === r ? 0 : 1 / (r * r), 0 === o ? 0 : 1 / (o * o), 0 === s ? 0 : 1 / (s * s)), t._minimumRadius = Math.min(r, o, s), t._maximumRadius = Math.max(r, o, s), t._centerToleranceSquared = u.EPSILON1, 0 !== t._radiiSquared.z && (t._squaredXOverSquaredZ = t._radiiSquared.x / t._radiiSquared.z)
				}

				function h(e, t, n)
				{
					this._radii = void 0, this._radiiSquared = void 0, this._radiiToTheFourth = void 0, this._oneOverRadii = void 0, this._oneOverRadiiSquared = void 0, this._minimumRadius = void 0, this._maximumRadius = void 0, this._centerToleranceSquared = void 0, this._squaredXOverSquaredZ = void 0, l(this, e, t, n)
				}
				o(h.prototype,
				{
					radii:
					{
						get: function ()
						{
							return this._radii
						}
					},
					radiiSquared:
					{
						get: function ()
						{
							return this._radiiSquared
						}
					},
					radiiToTheFourth:
					{
						get: function ()
						{
							return this._radiiToTheFourth
						}
					},
					oneOverRadii:
					{
						get: function ()
						{
							return this._oneOverRadii
						}
					},
					oneOverRadiiSquared:
					{
						get: function ()
						{
							return this._oneOverRadiiSquared
						}
					},
					minimumRadius:
					{
						get: function ()
						{
							return this._minimumRadius
						}
					},
					maximumRadius:
					{
						get: function ()
						{
							return this._maximumRadius
						}
					}
				}), h.clone = function (t, n)
				{
					if (r(t))
					{
						var i = t._radii;
						return r(n) ? (e.clone(i, n._radii), e.clone(t._radiiSquared, n._radiiSquared), e.clone(t._radiiToTheFourth, n._radiiToTheFourth), e.clone(t._oneOverRadii, n._oneOverRadii), e.clone(t._oneOverRadiiSquared, n._oneOverRadiiSquared), n._minimumRadius = t._minimumRadius, n._maximumRadius = t._maximumRadius, n._centerToleranceSquared = t._centerToleranceSquared, n) : new h(i.x, i.y, i.z)
					}
				}, h.fromCartesian3 = function (e, t)
				{
					return r(t) || (t = new h), r(e) ? (l(t, e.x, e.y, e.z), t) : t
				}, h.WGS84 = a(new h(6378137, 6378137, 6356752.314245179)), h.UNIT_SPHERE = a(new h(1, 1, 1)), h.MOON = a(new h(u.LUNAR_RADIUS, u.LUNAR_RADIUS, u.LUNAR_RADIUS)), h.prototype.clone = function (e)
				{
					return h.clone(this, e)
				}, h.packedLength = e.packedLength, h.pack = function (t, r, o)
				{
					return n.typeOf.object("value", t), n.defined("array", r), o = i(o, 0), e.pack(t._radii, r, o), r
				}, h.unpack = function (t, r, o)
				{
					n.defined("array", t), r = i(r, 0);
					var s = e.unpack(t, r);
					return h.fromCartesian3(s, o)
				}, h.prototype.geocentricSurfaceNormal = e.normalize, h.prototype.geodeticSurfaceNormalCartographic = function (t, i)
				{
					n.typeOf.object("cartographic", t);
					var o = t.longitude,
						s = t.latitude,
						a = Math.cos(s),
						u = a * Math.cos(o),
						c = a * Math.sin(o),
						l = Math.sin(s);
					return r(i) || (i = new e), i.x = u, i.y = c, i.z = l, e.normalize(i, i)
				}, h.prototype.geodeticSurfaceNormal = function (t, n)
				{
					return r(n) || (n = new e), n = e.multiplyComponents(t, this._oneOverRadiiSquared, n), e.normalize(n, n)
				};
				var d = new e,
					f = new e;
				h.prototype.cartographicToCartesian = function (t, n)
				{
					var i = d,
						o = f;
					this.geodeticSurfaceNormalCartographic(t, i), e.multiplyComponents(this._radiiSquared, i, o);
					var s = Math.sqrt(e.dot(i, o));
					return e.divideByScalar(o, s, o), e.multiplyByScalar(i, t.height, i), r(n) || (n = new e), e.add(o, i, n)
				}, h.prototype.cartographicArrayToCartesianArray = function (e, t)
				{
					n.defined("cartographics", e);
					var i = e.length;
					r(t) ? t.length = i : t = new Array(i);
					for (var o = 0; o < i; o++) t[o] = this.cartographicToCartesian(e[o], t[o]);
					return t
				};
				var p = new e,
					g = new e,
					y = new e;
				return h.prototype.cartesianToCartographic = function (n, i)
				{
					var o = this.scaleToGeodeticSurface(n, g);
					if (r(o))
					{
						var s = this.geodeticSurfaceNormal(o, p),
							a = e.subtract(n, o, y),
							c = Math.atan2(s.y, s.x),
							l = Math.asin(s.z),
							h = u.sign(e.dot(a, n)) * e.magnitude(a);
						return r(i) ? (i.longitude = c, i.latitude = l, i.height = h, i) : new t(c, l, h)
					}
				}, h.prototype.cartesianArrayToCartographicArray = function (e, t)
				{
					n.defined("cartesians", e);
					var i = e.length;
					r(t) ? t.length = i : t = new Array(i);
					for (var o = 0; o < i; ++o) t[o] = this.cartesianToCartographic(e[o], t[o]);
					return t
				}, h.prototype.scaleToGeodeticSurface = function (e, t)
				{
					return c(e, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, t)
				}, h.prototype.scaleToGeocentricSurface = function (t, i)
				{
					n.typeOf.object("cartesian", t), r(i) || (i = new e);
					var o = t.x,
						s = t.y,
						a = t.z,
						u = this._oneOverRadiiSquared,
						c = 1 / Math.sqrt(o * o * u.x + s * s * u.y + a * a * u.z);
					return e.multiplyByScalar(t, c, i)
				}, h.prototype.transformPositionToScaledSpace = function (t, n)
				{
					return r(n) || (n = new e), e.multiplyComponents(t, this._oneOverRadii, n)
				}, h.prototype.transformPositionFromScaledSpace = function (t, n)
				{
					return r(n) || (n = new e), e.multiplyComponents(t, this._radii, n)
				}, h.prototype.equals = function (t)
				{
					return this === t || r(t) && e.equals(this._radii, t._radii)
				}, h.prototype.toString = function ()
				{
					return this._radii.toString()
				}, h.prototype.getSurfaceNormalIntersectionWithZAxis = function (t, o, a)
				{
					if (n.typeOf.object("position", t), !u.equalsEpsilon(this._radii.x, this._radii.y, u.EPSILON15)) throw new s("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
					n.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0), o = i(o, 0);
					var c = this._squaredXOverSquaredZ;
					if (r(a) || (a = new e), a.x = 0, a.y = 0, a.z = t.z * (1 - c), !(Math.abs(a.z) >= this._radii.z - o)) return a
				}, h
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("4f", ["42", "1e", "15", "5", "6", "43", "11", "d"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e, t, i, r)
				{
					this.west = n(e, 0), this.south = n(t, 0), this.east = n(i, 0), this.north = n(r, 0)
				}
				r(u.prototype,
				{
					width:
					{
						get: function ()
						{
							return u.computeWidth(this)
						}
					},
					height:
					{
						get: function ()
						{
							return u.computeHeight(this)
						}
					}
				}), u.packedLength = 4, u.pack = function (e, i, r)
				{
					return t.typeOf.object("value", e), t.defined("array", i), r = n(r, 0), i[r++] = e.west, i[r++] = e.south, i[r++] = e.east, i[r] = e.north, i
				}, u.unpack = function (e, r, o)
				{
					return t.defined("array", e), r = n(r, 0), i(o) || (o = new u), o.west = e[r++], o.south = e[r++], o.east = e[r++], o.north = e[r], o
				}, u.computeWidth = function (e)
				{
					t.typeOf.object("rectangle", e);
					var n = e.east,
						i = e.west;
					return n < i && (n += a.TWO_PI), n - i
				}, u.computeHeight = function (e)
				{
					return t.typeOf.object("rectangle", e), e.north - e.south
				}, u.fromDegrees = function (e, t, r, o, s)
				{
					return e = a.toRadians(n(e, 0)), t = a.toRadians(n(t, 0)), r = a.toRadians(n(r, 0)), o = a.toRadians(n(o, 0)), i(s) ? (s.west = e, s.south = t, s.east = r, s.north = o, s) : new u(e, t, r, o)
				}, u.fromRadians = function (e, t, r, o, s)
				{
					return i(s) ? (s.west = n(e, 0), s.south = n(t, 0), s.east = n(r, 0), s.north = n(o, 0), s) : new u(e, t, r, o)
				}, u.fromCartographicArray = function (e, n)
				{
					t.defined("cartographics", e);
					for (var r = Number.MAX_VALUE, o = -Number.MAX_VALUE, s = Number.MAX_VALUE, c = -Number.MAX_VALUE, l = Number.MAX_VALUE, h = -Number.MAX_VALUE, d = 0, f = e.length; d < f; d++)
					{
						var p = e[d];
						r = Math.min(r, p.longitude), o = Math.max(o, p.longitude), l = Math.min(l, p.latitude), h = Math.max(h, p.latitude);
						var g = p.longitude >= 0 ? p.longitude : p.longitude + a.TWO_PI;
						s = Math.min(s, g), c = Math.max(c, g)
					}
					return o - r > c - s && (r = s, (o = c) > a.PI && (o -= a.TWO_PI), r > a.PI && (r -= a.TWO_PI)), i(n) ? (n.west = r, n.south = l, n.east = o, n.north = h, n) : new u(r, l, o, h)
				}, u.fromCartesianArray = function (e, r, s)
				{
					t.defined("cartesians", e), r = n(r, o.WGS84);
					for (var c = Number.MAX_VALUE, l = -Number.MAX_VALUE, h = Number.MAX_VALUE, d = -Number.MAX_VALUE, f = Number.MAX_VALUE, p = -Number.MAX_VALUE, g = 0, y = e.length; g < y; g++)
					{
						var M = r.cartesianToCartographic(e[g]);
						c = Math.min(c, M.longitude), l = Math.max(l, M.longitude), f = Math.min(f, M.latitude), p = Math.max(p, M.latitude);
						var v = M.longitude >= 0 ? M.longitude : M.longitude + a.TWO_PI;
						h = Math.min(h, v), d = Math.max(d, v)
					}
					return l - c > d - h && (c = h, (l = d) > a.PI && (l -= a.TWO_PI), c > a.PI && (c -= a.TWO_PI)), i(s) ? (s.west = c, s.south = f, s.east = l, s.north = p, s) : new u(c, f, l, p)
				}, u.clone = function (e, t)
				{
					if (i(e)) return i(t) ? (t.west = e.west, t.south = e.south, t.east = e.east, t.north = e.north, t) : new u(e.west, e.south, e.east, e.north)
				}, u.prototype.clone = function (e)
				{
					return u.clone(this, e)
				}, u.prototype.equals = function (e)
				{
					return u.equals(this, e)
				}, u.equals = function (e, t)
				{
					return e === t || i(e) && i(t) && e.west === t.west && e.south === t.south && e.east === t.east && e.north === t.north
				}, u.prototype.equalsEpsilon = function (e, n)
				{
					return t.typeOf.number("epsilon", n), i(e) && Math.abs(this.west - e.west) <= n && Math.abs(this.south - e.south) <= n && Math.abs(this.east - e.east) <= n && Math.abs(this.north - e.north) <= n
				}, u.validate = function (e)
				{
					t.typeOf.object("rectangle", e);
					var n = e.north;
					t.typeOf.number.greaterThanOrEquals("north", n, -a.PI_OVER_TWO), t.typeOf.number.lessThanOrEquals("north", n, a.PI_OVER_TWO);
					var i = e.south;
					t.typeOf.number.greaterThanOrEquals("south", i, -a.PI_OVER_TWO), t.typeOf.number.lessThanOrEquals("south", i, a.PI_OVER_TWO);
					var r = e.west;
					t.typeOf.number.greaterThanOrEquals("west", r, -Math.PI), t.typeOf.number.lessThanOrEquals("west", r, Math.PI);
					var o = e.east;
					t.typeOf.number.greaterThanOrEquals("east", o, -Math.PI), t.typeOf.number.lessThanOrEquals("east", o, Math.PI)
				}, u.southwest = function (n, r)
				{
					return t.typeOf.object("rectangle", n), i(r) ? (r.longitude = n.west, r.latitude = n.south, r.height = 0, r) : new e(n.west, n.south)
				}, u.northwest = function (n, r)
				{
					return t.typeOf.object("rectangle", n), i(r) ? (r.longitude = n.west, r.latitude = n.north, r.height = 0, r) : new e(n.west, n.north)
				}, u.northeast = function (n, r)
				{
					return t.typeOf.object("rectangle", n), i(r) ? (r.longitude = n.east, r.latitude = n.north, r.height = 0, r) : new e(n.east, n.north)
				}, u.southeast = function (n, r)
				{
					return t.typeOf.object("rectangle", n), i(r) ? (r.longitude = n.east, r.latitude = n.south, r.height = 0, r) : new e(n.east, n.south)
				}, u.center = function (n, r)
				{
					t.typeOf.object("rectangle", n);
					var o = n.east,
						s = n.west;
					o < s && (o += a.TWO_PI);
					var u = a.negativePiToPi(.5 * (s + o)),
						c = .5 * (n.south + n.north);
					return i(r) ? (r.longitude = u, r.latitude = c, r.height = 0, r) : new e(u, c)
				}, u.intersection = function (e, n, r)
				{
					t.typeOf.object("rectangle", e), t.typeOf.object("otherRectangle", n);
					var o = e.east,
						s = e.west,
						c = n.east,
						l = n.west;
					o < s && c > 0 ? o += a.TWO_PI : c < l && o > 0 && (c += a.TWO_PI), o < s && l < 0 ? l += a.TWO_PI : c < l && s < 0 && (s += a.TWO_PI);
					var h = a.negativePiToPi(Math.max(s, l)),
						d = a.negativePiToPi(Math.min(o, c));
					if (!((e.west < e.east || n.west < n.east) && d <= h))
					{
						var f = Math.max(e.south, n.south),
							p = Math.min(e.north, n.north);
						if (!(f >= p)) return i(r) ? (r.west = h, r.south = f, r.east = d, r.north = p, r) : new u(h, f, d, p)
					}
				}, u.simpleIntersection = function (e, n, r)
				{
					t.typeOf.object("rectangle", e), t.typeOf.object("otherRectangle", n);
					var o = Math.max(e.west, n.west),
						s = Math.max(e.south, n.south),
						a = Math.min(e.east, n.east),
						c = Math.min(e.north, n.north);
					if (!(s >= c || o >= a)) return i(r) ? (r.west = o, r.south = s, r.east = a, r.north = c, r) : new u(o, s, a, c)
				}, u.union = function (e, n, r)
				{
					t.typeOf.object("rectangle", e), t.typeOf.object("otherRectangle", n), i(r) || (r = new u);
					var o = e.east,
						s = e.west,
						c = n.east,
						l = n.west;
					o < s && c > 0 ? o += a.TWO_PI : c < l && o > 0 && (c += a.TWO_PI), o < s && l < 0 ? l += a.TWO_PI : c < l && s < 0 && (s += a.TWO_PI);
					var h = a.convertLongitudeRange(Math.min(s, l)),
						d = a.convertLongitudeRange(Math.max(o, c));
					return r.west = h, r.south = Math.min(e.south, n.south), r.east = d, r.north = Math.max(e.north, n.north), r
				}, u.expand = function (e, n, r)
				{
					return t.typeOf.object("rectangle", e), t.typeOf.object("cartographic", n), i(r) || (r = new u), r.west = Math.min(e.west, n.longitude), r.south = Math.min(e.south, n.latitude), r.east = Math.max(e.east, n.longitude), r.north = Math.max(e.north, n.latitude), r
				}, u.contains = function (e, n)
				{
					t.typeOf.object("rectangle", e), t.typeOf.object("cartographic", n);
					var i = n.longitude,
						r = n.latitude,
						o = e.west,
						s = e.east;
					return s < o && (s += a.TWO_PI, i < 0 && (i += a.TWO_PI)), (i > o || a.equalsEpsilon(i, o, a.EPSILON14)) && (i < s || a.equalsEpsilon(i, s, a.EPSILON14)) && r >= e.south && r <= e.north
				};
				var c = new e;
				return u.subsample = function (e, r, s, l)
				{
					t.typeOf.object("rectangle", e), r = n(r, o.WGS84), s = n(s, 0), i(l) || (l = []);
					var h = 0,
						d = e.north,
						f = e.south,
						p = e.east,
						g = e.west,
						y = c;
					y.height = s, y.longitude = g, y.latitude = d, l[h] = r.cartographicToCartesian(y, l[h]), h++, y.longitude = p, l[h] = r.cartographicToCartesian(y, l[h]), h++, y.latitude = f, l[h] = r.cartographicToCartesian(y, l[h]), h++, y.longitude = g, l[h] = r.cartographicToCartesian(y, l[h]), h++, y.latitude = d < 0 ? d : f > 0 ? f : 0;
					for (var M = 1; M < 8; ++M) y.longitude = -Math.PI + M * a.PI_OVER_TWO, u.contains(e, y) && (l[h] = r.cartographicToCartesian(y, l[h]), h++);
					return 0 === y.latitude && (y.longitude = g, l[h] = r.cartographicToCartesian(y, l[h]), h++, y.longitude = p, l[h] = r.cartographicToCartesian(y, l[h]), h++), l.length = h, l
				}, u.MAX_VALUE = s(new u(-Math.PI, -a.PI_OVER_TWO, Math.PI, a.PI_OVER_TWO)), u
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("76", ["69", "15", "5", "7"], function (e, t, n, i)
			{
				"use strict";

				function r(r, o, s)
				{
					if (!n(r)) throw new i("first is required");
					if (!n(o)) throw new i("second is required");
					if (s = t(s, !0), r instanceof e || (r = new e(r)), o instanceof e || (o = new e(o)), "data" === r.scheme) return r.toString();
					if ("data" === o.scheme) return o.toString();
					n(o.authority) && !n(o.scheme) && ("undefined" != typeof document && n(document.location) && n(document.location.href) ? o.scheme = new e(document.location.href).scheme : o.scheme = r.scheme);
					var a = r;
					o.isAbsolute() && (a = o);
					var u = "";
					n(a.scheme) && (u += a.scheme + ":"), n(a.authority) && (u += "//" + a.authority, "" !== a.path && "/" !== a.path && (u = u.replace(/\/?$/, "/"), a.path = a.path.replace(/^\/?/g, ""))), u += a === r ? s ? r.path.replace(/\/?$/, "/") + o.path.replace(/^\/?/g, "") : r.path + o.path : o.path;
					var c = n(r.query),
						l = n(o.query);
					c && l ? u += "?" + r.query + "&" + o.query : c && !l ? u += "?" + r.query : !c && l && (u += "?" + o.query);
					var h = n(o.fragment);
					return n(r.fragment) && !h ? u += "#" + r.fragment : h && (u += "#" + o.fragment), u
				}
				return r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("6d", ["69", "5", "7", "77", "76", "require"], function (e, t, n, i, r, o)
			{
				"use strict";

				function s()
				{
					for (var e = document.getElementsByTagName("script"), t = 0, n = e.length; t < n; ++t)
					{
						var i = e[t].getAttribute("src"),
							r = p.exec(i);
						if (null !== r) return r[1]
					}
				}

				function a()
				{
					if (t(h)) return h;
					var r;
					if (r = "undefined" != typeof CESIUM_BASE_URL ? CESIUM_BASE_URL : s(), !t(r)) throw new n("Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.");
					return h = new e(i(r))
				}

				function u(e)
				{
					return o.toUrl("../" + e)
				}

				function c(e)
				{
					return r(a(), e)
				}

				function l(e)
				{
					t(d) || (d = t(o.toUrl) ? u : c), t(f) || (f = document.createElement("a"));
					var n = d(e);
					return f.href = n, f.href = f.href, f.href
				}
				var h, d, f, p = /((?:.*\/)|^)cesium[\w-]*\.js(?:\W|$)/i;
				return l._cesiumScriptRegex = p, l.setBaseUrl = function (t)
				{
					h = new e(t).resolve(new e(document.location.href))
				}, l
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("b", ["15", "7"], function (e, t)
			{
				"use strict";

				function n()
				{
					return !0
				}

				function i(i, r)
				{
					function o()
					{
						throw new t(r)
					}
					r = e(r, "This object was destroyed, i.e., destroy() was called.");
					for (var s in i) "function" == typeof i[s] && (i[s] = o);
					i.isDestroyed = n
				}
				return i
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("69", [], function ()
			{
				function e(t)
				{
					if (t instanceof e) this.scheme = t.scheme, this.authority = t.authority, this.path = t.path, this.query = t.query, this.fragment = t.fragment;
					else if (t)
					{
						var n = i.exec(t);
						this.scheme = n[1], this.authority = n[2], this.path = n[3], this.query = n[4], this.fragment = n[5]
					}
				}

				function t(e)
				{
					var t = unescape(e);
					return o.test(t) ? t : e.toUpperCase()
				}

				function n(e, t, n, i)
				{
					return (t || "") + n.toLowerCase() + (i || "")
				}
				e.prototype.scheme = null, e.prototype.authority = null, e.prototype.path = "", e.prototype.query = null, e.prototype.fragment = null;
				var i = new RegExp("^(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*)(?:\\?([^#]*))?(?:#(.*))?$");
				e.prototype.getScheme = function ()
				{
					return this.scheme
				}, e.prototype.getAuthority = function ()
				{
					return this.authority
				}, e.prototype.getPath = function ()
				{
					return this.path
				}, e.prototype.getQuery = function ()
				{
					return this.query
				}, e.prototype.getFragment = function ()
				{
					return this.fragment
				}, e.prototype.isAbsolute = function ()
				{
					return !!this.scheme && !this.fragment
				}, e.prototype.isSameDocumentAs = function (e)
				{
					return e.scheme == this.scheme && e.authority == this.authority && e.path == this.path && e.query == this.query
				}, e.prototype.equals = function (e)
				{
					return this.isSameDocumentAs(e) && e.fragment == this.fragment
				}, e.prototype.normalize = function ()
				{
					this.removeDotSegments(), this.scheme && (this.scheme = this.scheme.toLowerCase()), this.authority && (this.authority = this.authority.replace(s, n).replace(r, t)), this.path && (this.path = this.path.replace(r, t)), this.query && (this.query = this.query.replace(r, t)), this.fragment && (this.fragment = this.fragment.replace(r, t))
				};
				var r = /%[0-9a-z]{2}/gi,
					o = /[a-zA-Z0-9\-\._~]/,
					s = /(.*@)?([^@:]*)(:.*)?/;
				return e.prototype.resolve = function (t)
				{
					var n = new e;
					return this.scheme ? (n.scheme = this.scheme, n.authority = this.authority, n.path = this.path, n.query = this.query) : (n.scheme = t.scheme, this.authority ? (n.authority = this.authority, n.path = this.path, n.query = this.query) : (n.authority = t.authority, "" == this.path ? (n.path = t.path, n.query = this.query || t.query) : ("/" == this.path.charAt(0) ? (n.path = this.path, n.removeDotSegments()) : (t.authority && "" == t.path ? n.path = "/" + this.path : n.path = t.path.substring(0, t.path.lastIndexOf("/") + 1) + this.path, n.removeDotSegments()), n.query = this.query))), n.fragment = this.fragment, n
				}, e.prototype.removeDotSegments = function ()
				{
					var e, t = this.path.split("/"),
						n = [],
						i = "" == t[0];
					i && t.shift();
					for ("" == t[0] && t.shift(); t.length;) ".." == (e = t.shift()) ? n.pop() : "." != e && n.push(e);
					"." != e && ".." != e || n.push(""), i && n.unshift(""), this.path = n.join("/")
				}, e.prototype.toString = function ()
				{
					var e = "";
					return this.scheme && (e += this.scheme + ":"), this.authority && (e += "//" + this.authority), e += this.path, this.query && (e += "?" + this.query), this.fragment && (e += "#" + this.fragment), e
				}, e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("77", ["69", "15", "5", "7"], function (e, t, n, i)
			{
				"use strict";

				function r(r, o)
				{
					if (!n(r)) throw new i("relative uri is required.");
					o = t(o, document.location.href);
					var s = new e(o);
					return new e(r).resolve(s).toString()
				}
				return r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("49", ["5"], function (e)
			{
				"use strict";

				function t(t)
				{
					e(n) || (n = document.createElement("a")), n.href = window.location.href;
					var i = n.host,
						r = n.protocol;
					return n.href = t, n.href = n.href, r !== n.protocol || i !== n.host
				}
				var n;
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("78", ["48", "6d", "15", "5", "b", "7", "77", "49", "2d", "require"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l()
				{
					if (!i(g._canTransferArrayBuffer))
					{
						var t = new Worker(d("Workers/transferTypedArrayTest.js"));
						t.postMessage = n(t.webkitPostMessage, t.postMessage);
						var r = new Int8Array([99]);
						try
						{
							t.postMessage(
							{
								array: r
							}, [r.buffer])
						}
						catch (e)
						{
							return g._canTransferArrayBuffer = !1, g._canTransferArrayBuffer
						}
						var o = e.defer();
						t.onmessage = function (e)
						{
							var n = e.data.array,
								r = i(n) && 99 === n[0];
							o.resolve(r), t.terminate(), g._canTransferArrayBuffer = r
						}, g._canTransferArrayBuffer = o.promise
					}
					return g._canTransferArrayBuffer
				}

				function h(e, t)
				{
					--e._activeTasks;
					var n = t.id;
					if (i(n))
					{
						var r = e._deferreds,
							s = r[n];
						if (i(t.error))
						{
							var a = t.error;
							"RuntimeError" === a.name ? (a = new u(t.error.message)).stack = t.error.stack : "DeveloperError" === a.name && ((a = new o(t.error.message)).stack = t.error.stack), s.reject(a)
						}
						else s.resolve(t.result);
						delete r[n]
					}
				}

				function d(e)
				{
					var n = t(e);
					if (a(n))
					{
						var i, r = 'importScripts("' + n + '");';
						try
						{
							i = new Blob([r],
							{
								type: "application/javascript"
							})
						}
						catch (e)
						{
							var o = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder);
							o.append(r), i = o.getBlob("application/javascript")
						}
						n = (window.URL || window.webkitURL).createObjectURL(i)
					}
					return n
				}

				function f()
				{
					return i(y) || (y = d("Workers/cesiumWorkerBootstrapper.js")), y
				}

				function p(e)
				{
					var r = new Worker(f());
					r.postMessage = n(r.webkitPostMessage, r.postMessage);
					var o = {
						loaderConfig:
						{},
						workerModule: g._workerModulePrefix + e._workerName
					};
					return i(g._loaderConfig) ? o.loaderConfig = g._loaderConfig : i(c.toUrl) ? o.loaderConfig.baseUrl = s("..", t("Workers/cesiumWorkerBootstrapper.js")) : o.loaderConfig.paths = {
						Workers: t("Workers")
					}, r.postMessage(o), r.onmessage = function (t)
					{
						h(e, t.data)
					}, r
				}

				function g(e, t)
				{
					this._workerName = e, this._maximumActiveTasks = n(t, 5), this._activeTasks = 0, this._deferreds = {}, this._nextID = 0
				}
				var y, M = [];
				return g.prototype.scheduleTask = function (t, n)
				{
					if (i(this._worker) || (this._worker = p(this)), !(this._activeTasks >= this._maximumActiveTasks))
					{
						++this._activeTasks;
						var r = this;
						return e(l(), function (o)
						{
							i(n) ? o || (n.length = 0) : n = M;
							var s = r._nextID++,
								a = e.defer();
							return r._deferreds[s] = a, r._worker.postMessage(
							{
								id: s,
								parameters: t,
								canTransferArrayBuffer: o
							}, n), a.promise
						})
					}
				}, g.prototype.isDestroyed = function ()
				{
					return !1
				}, g.prototype.destroy = function ()
				{
					return i(this._worker) && this._worker.terminate(), r(this)
				}, g._defaultWorkerModulePrefix = "Workers/", g._workerModulePrefix = g._defaultWorkerModulePrefix, g._loaderConfig = void 0, g._canTransferArrayBuffer = void 0, g
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("79", ["a", "20", "1e", "5", "7", "d"], function (e, t, n, i, r, o)
			{
				"use strict";
				var s = {};
				s.octEncodeInRange = function (e, i, s)
				{
					n.defined("vector", e), n.defined("result", s);
					var a = t.magnitudeSquared(e);
					if (Math.abs(a - 1) > o.EPSILON6) throw new r("vector must be normalized.");
					if (s.x = e.x / (Math.abs(e.x) + Math.abs(e.y) + Math.abs(e.z)), s.y = e.y / (Math.abs(e.x) + Math.abs(e.y) + Math.abs(e.z)), e.z < 0)
					{
						var u = s.x,
							c = s.y;
						s.x = (1 - Math.abs(c)) * o.signNotZero(u), s.y = (1 - Math.abs(u)) * o.signNotZero(c)
					}
					return s.x = o.toSNorm(s.x, i), s.y = o.toSNorm(s.y, i), s
				}, s.octEncode = function (e, t)
				{
					return s.octEncodeInRange(e, 255, t)
				}, s.octDecodeInRange = function (e, i, s, a)
				{
					if (n.defined("result", a), e < 0 || e > s || i < 0 || i > s) throw new r("x and y must be a signed normalized integer between 0 and " + s);
					if (a.x = o.fromSNorm(e, s), a.y = o.fromSNorm(i, s), a.z = 1 - (Math.abs(a.x) + Math.abs(a.y)), a.z < 0)
					{
						var u = a.x;
						a.x = (1 - Math.abs(a.y)) * o.signNotZero(u), a.y = (1 - Math.abs(u)) * o.signNotZero(a.y)
					}
					return t.normalize(a, a)
				}, s.octDecode = function (e, t, n)
				{
					return s.octDecodeInRange(e, t, 255, n)
				}, s.octPackFloat = function (e)
				{
					return n.defined("encoded", e), 256 * e.x + e.y
				};
				var a = new e;
				return s.octEncodeFloat = function (e)
				{
					return s.octEncode(e, a), s.octPackFloat(a)
				}, s.octDecodeFloat = function (e, t)
				{
					n.defined("value", e);
					var i = e / 256,
						r = Math.floor(i),
						o = 256 * (i - r);
					return s.octDecode(r, o, t)
				}, s.octPack = function (e, t, i, r)
				{
					n.defined("v1", e), n.defined("v2", t), n.defined("v3", i), n.defined("result", r);
					var o = s.octEncodeFloat(e),
						u = s.octEncodeFloat(t),
						c = s.octEncode(i, a);
					return r.x = 65536 * c.x + o, r.y = 65536 * c.y + u, r
				}, s.octUnpack = function (e, t, i, r)
				{
					n.defined("packed", e), n.defined("v1", t), n.defined("v2", i), n.defined("v3", r);
					var o = e.x / 65536,
						a = Math.floor(o),
						u = 65536 * (o - a);
					o = e.y / 65536;
					var c = Math.floor(o),
						l = 65536 * (o - c);
					s.octDecodeFloat(u, t), s.octDecodeFloat(l, i), s.octDecode(a, c, r)
				}, s.compressTextureCoordinates = function (e)
				{
					return n.defined("textureCoordinates", e), 4096 * (4095 * e.x | 0) + (4095 * e.y | 0)
				}, s.decompressTextureCoordinates = function (e, t)
				{
					n.defined("compressed", e), n.defined("result", t);
					var i = e / 4096,
						r = Math.floor(i);
					return t.x = r / 4095, t.y = (e - 4096 * r) / 4095, t
				}, s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("a", ["1e", "15", "5", "7", "11", "d"], function (e, t, n, i, r, o)
			{
				"use strict";

				function s(e, n)
				{
					this.x = t(e, 0), this.y = t(n, 0)
				}
				s.fromElements = function (e, t, i)
				{
					return n(i) ? (i.x = e, i.y = t, i) : new s(e, t)
				}, s.clone = function (e, t)
				{
					if (n(e)) return n(t) ? (t.x = e.x, t.y = e.y, t) : new s(e.x, e.y)
				}, s.fromCartesian3 = s.clone, s.fromCartesian4 = s.clone, s.packedLength = 2, s.pack = function (n, i, r)
				{
					return e.typeOf.object("value", n), e.defined("array", i), r = t(r, 0), i[r++] = n.x, i[r] = n.y, i
				}, s.unpack = function (i, r, o)
				{
					return e.defined("array", i), r = t(r, 0), n(o) || (o = new s), o.x = i[r++], o.y = i[r], o
				}, s.packArray = function (t, i)
				{
					e.defined("array", t);
					var r = t.length;
					n(i) ? i.length = 2 * r : i = new Array(2 * r);
					for (var o = 0; o < r; ++o) s.pack(t[o], i, 2 * o);
					return i
				}, s.unpackArray = function (t, i)
				{
					e.defined("array", t);
					var r = t.length;
					n(i) ? i.length = r / 2 : i = new Array(r / 2);
					for (var o = 0; o < r; o += 2)
					{
						var a = o / 2;
						i[a] = s.unpack(t, o, i[a])
					}
					return i
				}, s.fromArray = s.unpack, s.maximumComponent = function (t)
				{
					return e.typeOf.object("cartesian", t), Math.max(t.x, t.y)
				}, s.minimumComponent = function (t)
				{
					return e.typeOf.object("cartesian", t), Math.min(t.x, t.y)
				}, s.minimumByComponent = function (t, n, i)
				{
					return e.typeOf.object("first", t), e.typeOf.object("second", n), e.typeOf.object("result", i), i.x = Math.min(t.x, n.x), i.y = Math.min(t.y, n.y), i
				}, s.maximumByComponent = function (t, n, i)
				{
					return e.typeOf.object("first", t), e.typeOf.object("second", n), e.typeOf.object("result", i), i.x = Math.max(t.x, n.x), i.y = Math.max(t.y, n.y), i
				}, s.magnitudeSquared = function (t)
				{
					return e.typeOf.object("cartesian", t), t.x * t.x + t.y * t.y
				}, s.magnitude = function (e)
				{
					return Math.sqrt(s.magnitudeSquared(e))
				};
				var a = new s;
				s.distance = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), s.subtract(t, n, a), s.magnitude(a)
				}, s.distanceSquared = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), s.subtract(t, n, a), s.magnitudeSquared(a)
				}, s.normalize = function (t, n)
				{
					e.typeOf.object("cartesian", t), e.typeOf.object("result", n);
					var r = s.magnitude(t);
					if (n.x = t.x / r, n.y = t.y / r, isNaN(n.x) || isNaN(n.y)) throw new i("normalized result is not a number");
					return n
				}, s.dot = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), t.x * n.x + t.y * n.y
				}, s.multiplyComponents = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x * n.x, i.y = t.y * n.y, i
				}, s.divideComponents = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x / n.x, i.y = t.y / n.y, i
				}, s.add = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x + n.x, i.y = t.y + n.y, i
				}, s.subtract = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x - n.x, i.y = t.y - n.y, i
				}, s.multiplyByScalar = function (t, n, i)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.number("scalar", n), e.typeOf.object("result", i), i.x = t.x * n, i.y = t.y * n, i
				}, s.divideByScalar = function (t, n, i)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.number("scalar", n), e.typeOf.object("result", i), i.x = t.x / n, i.y = t.y / n, i
				}, s.negate = function (t, n)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.object("result", n), n.x = -t.x, n.y = -t.y, n
				}, s.abs = function (t, n)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.object("result", n), n.x = Math.abs(t.x), n.y = Math.abs(t.y), n
				};
				var u = new s;
				s.lerp = function (t, n, i, r)
				{
					return e.typeOf.object("start", t), e.typeOf.object("end", n), e.typeOf.number("t", i), e.typeOf.object("result", r), s.multiplyByScalar(n, i, u), r = s.multiplyByScalar(t, 1 - i, r), s.add(u, r, r)
				};
				var c = new s,
					l = new s;
				s.angleBetween = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), s.normalize(t, c), s.normalize(n, l), o.acosClamped(s.dot(c, l))
				};
				var h = new s;
				return s.mostOrthogonalAxis = function (t, n)
				{
					e.typeOf.object("cartesian", t), e.typeOf.object("result", n);
					var i = s.normalize(t, h);
					return s.abs(i, i), n = i.x <= i.y ? s.clone(s.UNIT_X, n) : s.clone(s.UNIT_Y, n)
				}, s.equals = function (e, t)
				{
					return e === t || n(e) && n(t) && e.x === t.x && e.y === t.y
				}, s.equalsArray = function (e, t, n)
				{
					return e.x === t[n] && e.y === t[n + 1]
				}, s.equalsEpsilon = function (e, t, i, r)
				{
					return e === t || n(e) && n(t) && o.equalsEpsilon(e.x, t.x, i, r) && o.equalsEpsilon(e.y, t.y, i, r)
				}, s.ZERO = r(new s(0, 0)), s.UNIT_X = r(new s(1, 0)), s.UNIT_Y = r(new s(0, 1)), s.prototype.clone = function (e)
				{
					return s.clone(this, e)
				}, s.prototype.equals = function (e)
				{
					return s.equals(this, e)
				}, s.prototype.equalsEpsilon = function (e, t, n)
				{
					return s.equalsEpsilon(this, e, t, n)
				}, s.prototype.toString = function ()
				{
					return "(" + this.x + ", " + this.y + ")"
				}, s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("7a", ["5", "6"], function (e, t)
			{
				"use strict";
				var n, i = {
						requestFullscreen: void 0,
						exitFullscreen: void 0,
						fullscreenEnabled: void 0,
						fullscreenElement: void 0,
						fullscreenchange: void 0,
						fullscreenerror: void 0
					},
					r = {};
				return t(r,
				{
					element:
					{
						get: function ()
						{
							if (r.supportsFullscreen()) return document[i.fullscreenElement]
						}
					},
					changeEventName:
					{
						get: function ()
						{
							if (r.supportsFullscreen()) return i.fullscreenchange
						}
					},
					errorEventName:
					{
						get: function ()
						{
							if (r.supportsFullscreen()) return i.fullscreenerror
						}
					},
					enabled:
					{
						get: function ()
						{
							if (r.supportsFullscreen()) return document[i.fullscreenEnabled]
						}
					},
					fullscreen:
					{
						get: function ()
						{
							if (r.supportsFullscreen()) return null !== r.element
						}
					}
				}), r.supportsFullscreen = function ()
				{
					if (e(n)) return n;
					n = !1;
					var t = document.body;
					if ("function" == typeof t.requestFullscreen) return i.requestFullscreen = "requestFullscreen", i.exitFullscreen = "exitFullscreen", i.fullscreenEnabled = "fullscreenEnabled", i.fullscreenElement = "fullscreenElement", i.fullscreenchange = "fullscreenchange", i.fullscreenerror = "fullscreenerror", n = !0;
					for (var r, o = ["webkit", "moz", "o", "ms", "khtml"], s = 0, a = o.length; s < a; ++s)
					{
						var u = o[s];
						"function" == typeof t[r = u + "RequestFullscreen"] ? (i.requestFullscreen = r, n = !0) : "function" == typeof t[r = u + "RequestFullScreen"] && (i.requestFullscreen = r, n = !0), r = u + "ExitFullscreen", "function" == typeof document[r] ? i.exitFullscreen = r : (r = u + "CancelFullScreen", "function" == typeof document[r] && (i.exitFullscreen = r)), r = u + "FullscreenEnabled", void 0 !== document[r] ? i.fullscreenEnabled = r : (r = u + "FullScreenEnabled", void 0 !== document[r] && (i.fullscreenEnabled = r)), r = u + "FullscreenElement", void 0 !== document[r] ? i.fullscreenElement = r : (r = u + "FullScreenElement", void 0 !== document[r] && (i.fullscreenElement = r)), r = u + "fullscreenchange", void 0 !== document["on" + r] && ("ms" === u && (r = "MSFullscreenChange"), i.fullscreenchange = r), r = u + "fullscreenerror", void 0 !== document["on" + r] && ("ms" === u && (r = "MSFullscreenError"), i.fullscreenerror = r)
					}
					return n
				}, r.requestFullscreen = function (e, t)
				{
					r.supportsFullscreen() && e[i.requestFullscreen](
					{
						vrDisplay: t
					})
				}, r.exitFullscreen = function ()
				{
					r.supportsFullscreen() && document[i.exitFullscreen]()
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("3d", ["15", "5", "7a"], function (e, t, n)
			{
				"use strict";

				function i(e)
				{
					for (var t = e.split("."), n = 0, i = t.length; n < i; ++n) t[n] = parseInt(t[n], 10);
					return t
				}

				function r()
				{
					if (!t(m) && (m = !1, !d()))
					{
						var e = / Chrome\/([\.0-9]+)/.exec(E.userAgent);
						null !== e && (m = !0, w = i(e[1]))
					}
					return m
				}

				function o()
				{
					return r() && w
				}

				function s()
				{
					if (!t(N) && (N = !1, !r() && !d() && / Safari\/[\.0-9]+/.test(E.userAgent)))
					{
						var e = / Version\/([\.0-9]+)/.exec(E.userAgent);
						null !== e && (N = !0, D = i(e[1]))
					}
					return N
				}

				function a()
				{
					return s() && D
				}

				function u()
				{
					if (!t(T))
					{
						T = !1;
						var e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(E.userAgent);
						null !== e && (T = !0, (I = i(e[1])).isNightly = !!e[2])
					}
					return T
				}

				function c()
				{
					return u() && I
				}

				function l()
				{
					if (!t(O))
					{
						O = !1;
						var e;
						"Microsoft Internet Explorer" === E.appName ? null !== (e = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(E.userAgent)) && (O = !0, S = i(e[1])) : "Netscape" === E.appName && null !== (e = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(E.userAgent)) && (O = !0, S = i(e[1]))
					}
					return O
				}

				function h()
				{
					return l() && S
				}

				function d()
				{
					if (!t(_))
					{
						_ = !1;
						var e = / Edge\/([\.0-9]+)/.exec(E.userAgent);
						null !== e && (_ = !0, L = i(e[1]))
					}
					return _
				}

				function f()
				{
					return d() && L
				}

				function p()
				{
					if (!t(j))
					{
						j = !1;
						var e = /Firefox\/([\.0-9]+)/.exec(E.userAgent);
						null !== e && (j = !0, x = i(e[1]))
					}
					return j
				}

				function g()
				{
					return t(b) || (b = /Windows/i.test(E.appVersion)), b
				}

				function y()
				{
					return p() && x
				}

				function M()
				{
					return t(C) || (C = "undefined" != typeof PointerEvent && (!t(E.pointerEnabled) || E.pointerEnabled)), C
				}

				function v()
				{
					if (!t(z))
					{
						var e = document.createElement("canvas");
						e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
						var n = e.style.imageRendering;
						(z = t(n) && "" !== n) && (R = n)
					}
					return z
				}

				function A()
				{
					return v() ? R : void 0
				}
				var E, m, w, N, D, T, I, O, S, _, L, j, x, b, C, R, z, P = {
					isChrome: r,
					chromeVersion: o,
					isSafari: s,
					safariVersion: a,
					isWebkit: u,
					webkitVersion: c,
					isInternetExplorer: l,
					internetExplorerVersion: h,
					isEdge: d,
					edgeVersion: f,
					isFirefox: p,
					firefoxVersion: y,
					isWindows: g,
					hardwareConcurrency: e((E = "undefined" != typeof navigator ? navigator :
					{}).hardwareConcurrency, 3),
					supportsPointerEvents: M,
					supportsImageRenderingPixelated: v,
					imageRenderingValue: A
				};
				return P.supportsFullscreen = function ()
				{
					return n.supportsFullscreen()
				}, P.supportsTypedArrays = function ()
				{
					return "undefined" != typeof ArrayBuffer
				}, P.supportsWebWorkers = function ()
				{
					return "undefined" != typeof Worker
				}, P
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("7b", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					DEPTH_BUFFER_BIT: 256,
					STENCIL_BUFFER_BIT: 1024,
					COLOR_BUFFER_BIT: 16384,
					POINTS: 0,
					LINES: 1,
					LINE_LOOP: 2,
					LINE_STRIP: 3,
					TRIANGLES: 4,
					TRIANGLE_STRIP: 5,
					TRIANGLE_FAN: 6,
					ZERO: 0,
					ONE: 1,
					SRC_COLOR: 768,
					ONE_MINUS_SRC_COLOR: 769,
					SRC_ALPHA: 770,
					ONE_MINUS_SRC_ALPHA: 771,
					DST_ALPHA: 772,
					ONE_MINUS_DST_ALPHA: 773,
					DST_COLOR: 774,
					ONE_MINUS_DST_COLOR: 775,
					SRC_ALPHA_SATURATE: 776,
					FUNC_ADD: 32774,
					BLEND_EQUATION: 32777,
					BLEND_EQUATION_RGB: 32777,
					BLEND_EQUATION_ALPHA: 34877,
					FUNC_SUBTRACT: 32778,
					FUNC_REVERSE_SUBTRACT: 32779,
					BLEND_DST_RGB: 32968,
					BLEND_SRC_RGB: 32969,
					BLEND_DST_ALPHA: 32970,
					BLEND_SRC_ALPHA: 32971,
					CONSTANT_COLOR: 32769,
					ONE_MINUS_CONSTANT_COLOR: 32770,
					CONSTANT_ALPHA: 32771,
					ONE_MINUS_CONSTANT_ALPHA: 32772,
					BLEND_COLOR: 32773,
					ARRAY_BUFFER: 34962,
					ELEMENT_ARRAY_BUFFER: 34963,
					ARRAY_BUFFER_BINDING: 34964,
					ELEMENT_ARRAY_BUFFER_BINDING: 34965,
					STREAM_DRAW: 35040,
					STATIC_DRAW: 35044,
					DYNAMIC_DRAW: 35048,
					BUFFER_SIZE: 34660,
					BUFFER_USAGE: 34661,
					CURRENT_VERTEX_ATTRIB: 34342,
					FRONT: 1028,
					BACK: 1029,
					FRONT_AND_BACK: 1032,
					CULL_FACE: 2884,
					BLEND: 3042,
					DITHER: 3024,
					STENCIL_TEST: 2960,
					DEPTH_TEST: 2929,
					SCISSOR_TEST: 3089,
					POLYGON_OFFSET_FILL: 32823,
					SAMPLE_ALPHA_TO_COVERAGE: 32926,
					SAMPLE_COVERAGE: 32928,
					NO_ERROR: 0,
					INVALID_ENUM: 1280,
					INVALID_VALUE: 1281,
					INVALID_OPERATION: 1282,
					OUT_OF_MEMORY: 1285,
					CW: 2304,
					CCW: 2305,
					LINE_WIDTH: 2849,
					ALIASED_POINT_SIZE_RANGE: 33901,
					ALIASED_LINE_WIDTH_RANGE: 33902,
					CULL_FACE_MODE: 2885,
					FRONT_FACE: 2886,
					DEPTH_RANGE: 2928,
					DEPTH_WRITEMASK: 2930,
					DEPTH_CLEAR_VALUE: 2931,
					DEPTH_FUNC: 2932,
					STENCIL_CLEAR_VALUE: 2961,
					STENCIL_FUNC: 2962,
					STENCIL_FAIL: 2964,
					STENCIL_PASS_DEPTH_FAIL: 2965,
					STENCIL_PASS_DEPTH_PASS: 2966,
					STENCIL_REF: 2967,
					STENCIL_VALUE_MASK: 2963,
					STENCIL_WRITEMASK: 2968,
					STENCIL_BACK_FUNC: 34816,
					STENCIL_BACK_FAIL: 34817,
					STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
					STENCIL_BACK_PASS_DEPTH_PASS: 34819,
					STENCIL_BACK_REF: 36003,
					STENCIL_BACK_VALUE_MASK: 36004,
					STENCIL_BACK_WRITEMASK: 36005,
					VIEWPORT: 2978,
					SCISSOR_BOX: 3088,
					COLOR_CLEAR_VALUE: 3106,
					COLOR_WRITEMASK: 3107,
					UNPACK_ALIGNMENT: 3317,
					PACK_ALIGNMENT: 3333,
					MAX_TEXTURE_SIZE: 3379,
					MAX_VIEWPORT_DIMS: 3386,
					SUBPIXEL_BITS: 3408,
					RED_BITS: 3410,
					GREEN_BITS: 3411,
					BLUE_BITS: 3412,
					ALPHA_BITS: 3413,
					DEPTH_BITS: 3414,
					STENCIL_BITS: 3415,
					POLYGON_OFFSET_UNITS: 10752,
					POLYGON_OFFSET_FACTOR: 32824,
					TEXTURE_BINDING_2D: 32873,
					SAMPLE_BUFFERS: 32936,
					SAMPLES: 32937,
					SAMPLE_COVERAGE_VALUE: 32938,
					SAMPLE_COVERAGE_INVERT: 32939,
					COMPRESSED_TEXTURE_FORMATS: 34467,
					DONT_CARE: 4352,
					FASTEST: 4353,
					NICEST: 4354,
					GENERATE_MIPMAP_HINT: 33170,
					BYTE: 5120,
					UNSIGNED_BYTE: 5121,
					SHORT: 5122,
					UNSIGNED_SHORT: 5123,
					INT: 5124,
					UNSIGNED_INT: 5125,
					FLOAT: 5126,
					DEPTH_COMPONENT: 6402,
					ALPHA: 6406,
					RGB: 6407,
					RGBA: 6408,
					LUMINANCE: 6409,
					LUMINANCE_ALPHA: 6410,
					UNSIGNED_SHORT_4_4_4_4: 32819,
					UNSIGNED_SHORT_5_5_5_1: 32820,
					UNSIGNED_SHORT_5_6_5: 33635,
					FRAGMENT_SHADER: 35632,
					VERTEX_SHADER: 35633,
					MAX_VERTEX_ATTRIBS: 34921,
					MAX_VERTEX_UNIFORM_VECTORS: 36347,
					MAX_VARYING_VECTORS: 36348,
					MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
					MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
					MAX_TEXTURE_IMAGE_UNITS: 34930,
					MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
					SHADER_TYPE: 35663,
					DELETE_STATUS: 35712,
					LINK_STATUS: 35714,
					VALIDATE_STATUS: 35715,
					ATTACHED_SHADERS: 35717,
					ACTIVE_UNIFORMS: 35718,
					ACTIVE_ATTRIBUTES: 35721,
					SHADING_LANGUAGE_VERSION: 35724,
					CURRENT_PROGRAM: 35725,
					NEVER: 512,
					LESS: 513,
					EQUAL: 514,
					LEQUAL: 515,
					GREATER: 516,
					NOTEQUAL: 517,
					GEQUAL: 518,
					ALWAYS: 519,
					KEEP: 7680,
					REPLACE: 7681,
					INCR: 7682,
					DECR: 7683,
					INVERT: 5386,
					INCR_WRAP: 34055,
					DECR_WRAP: 34056,
					VENDOR: 7936,
					RENDERER: 7937,
					VERSION: 7938,
					NEAREST: 9728,
					LINEAR: 9729,
					NEAREST_MIPMAP_NEAREST: 9984,
					LINEAR_MIPMAP_NEAREST: 9985,
					NEAREST_MIPMAP_LINEAR: 9986,
					LINEAR_MIPMAP_LINEAR: 9987,
					TEXTURE_MAG_FILTER: 10240,
					TEXTURE_MIN_FILTER: 10241,
					TEXTURE_WRAP_S: 10242,
					TEXTURE_WRAP_T: 10243,
					TEXTURE_2D: 3553,
					TEXTURE: 5890,
					TEXTURE_CUBE_MAP: 34067,
					TEXTURE_BINDING_CUBE_MAP: 34068,
					TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
					TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
					TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
					TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
					TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
					TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
					MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
					TEXTURE0: 33984,
					TEXTURE1: 33985,
					TEXTURE2: 33986,
					TEXTURE3: 33987,
					TEXTURE4: 33988,
					TEXTURE5: 33989,
					TEXTURE6: 33990,
					TEXTURE7: 33991,
					TEXTURE8: 33992,
					TEXTURE9: 33993,
					TEXTURE10: 33994,
					TEXTURE11: 33995,
					TEXTURE12: 33996,
					TEXTURE13: 33997,
					TEXTURE14: 33998,
					TEXTURE15: 33999,
					TEXTURE16: 34e3,
					TEXTURE17: 34001,
					TEXTURE18: 34002,
					TEXTURE19: 34003,
					TEXTURE20: 34004,
					TEXTURE21: 34005,
					TEXTURE22: 34006,
					TEXTURE23: 34007,
					TEXTURE24: 34008,
					TEXTURE25: 34009,
					TEXTURE26: 34010,
					TEXTURE27: 34011,
					TEXTURE28: 34012,
					TEXTURE29: 34013,
					TEXTURE30: 34014,
					TEXTURE31: 34015,
					ACTIVE_TEXTURE: 34016,
					REPEAT: 10497,
					CLAMP_TO_EDGE: 33071,
					MIRRORED_REPEAT: 33648,
					FLOAT_VEC2: 35664,
					FLOAT_VEC3: 35665,
					FLOAT_VEC4: 35666,
					INT_VEC2: 35667,
					INT_VEC3: 35668,
					INT_VEC4: 35669,
					BOOL: 35670,
					BOOL_VEC2: 35671,
					BOOL_VEC3: 35672,
					BOOL_VEC4: 35673,
					FLOAT_MAT2: 35674,
					FLOAT_MAT3: 35675,
					FLOAT_MAT4: 35676,
					SAMPLER_2D: 35678,
					SAMPLER_CUBE: 35680,
					VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
					VERTEX_ATTRIB_ARRAY_SIZE: 34339,
					VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
					VERTEX_ATTRIB_ARRAY_TYPE: 34341,
					VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
					VERTEX_ATTRIB_ARRAY_POINTER: 34373,
					VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
					IMPLEMENTATION_COLOR_READ_TYPE: 35738,
					IMPLEMENTATION_COLOR_READ_FORMAT: 35739,
					COMPILE_STATUS: 35713,
					LOW_FLOAT: 36336,
					MEDIUM_FLOAT: 36337,
					HIGH_FLOAT: 36338,
					LOW_INT: 36339,
					MEDIUM_INT: 36340,
					HIGH_INT: 36341,
					FRAMEBUFFER: 36160,
					RENDERBUFFER: 36161,
					RGBA4: 32854,
					RGB5_A1: 32855,
					RGB565: 36194,
					DEPTH_COMPONENT16: 33189,
					STENCIL_INDEX: 6401,
					STENCIL_INDEX8: 36168,
					DEPTH_STENCIL: 34041,
					RENDERBUFFER_WIDTH: 36162,
					RENDERBUFFER_HEIGHT: 36163,
					RENDERBUFFER_INTERNAL_FORMAT: 36164,
					RENDERBUFFER_RED_SIZE: 36176,
					RENDERBUFFER_GREEN_SIZE: 36177,
					RENDERBUFFER_BLUE_SIZE: 36178,
					RENDERBUFFER_ALPHA_SIZE: 36179,
					RENDERBUFFER_DEPTH_SIZE: 36180,
					RENDERBUFFER_STENCIL_SIZE: 36181,
					FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
					FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
					FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
					FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
					COLOR_ATTACHMENT0: 36064,
					DEPTH_ATTACHMENT: 36096,
					STENCIL_ATTACHMENT: 36128,
					DEPTH_STENCIL_ATTACHMENT: 33306,
					NONE: 0,
					FRAMEBUFFER_COMPLETE: 36053,
					FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
					FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
					FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
					FRAMEBUFFER_UNSUPPORTED: 36061,
					FRAMEBUFFER_BINDING: 36006,
					RENDERBUFFER_BINDING: 36007,
					MAX_RENDERBUFFER_SIZE: 34024,
					INVALID_FRAMEBUFFER_OPERATION: 1286,
					UNPACK_FLIP_Y_WEBGL: 37440,
					UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
					CONTEXT_LOST_WEBGL: 37442,
					UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
					BROWSER_DEFAULT_WEBGL: 37444,
					COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
					COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
					COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
					COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
					COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
					COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
					COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
					COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
					COMPRESSED_RGB_ETC1_WEBGL: 36196,
					DOUBLE: 5130,
					READ_BUFFER: 3074,
					UNPACK_ROW_LENGTH: 3314,
					UNPACK_SKIP_ROWS: 3315,
					UNPACK_SKIP_PIXELS: 3316,
					PACK_ROW_LENGTH: 3330,
					PACK_SKIP_ROWS: 3331,
					PACK_SKIP_PIXELS: 3332,
					COLOR: 6144,
					DEPTH: 6145,
					STENCIL: 6146,
					RED: 6403,
					RGB8: 32849,
					RGBA8: 32856,
					RGB10_A2: 32857,
					TEXTURE_BINDING_3D: 32874,
					UNPACK_SKIP_IMAGES: 32877,
					UNPACK_IMAGE_HEIGHT: 32878,
					TEXTURE_3D: 32879,
					TEXTURE_WRAP_R: 32882,
					MAX_3D_TEXTURE_SIZE: 32883,
					UNSIGNED_INT_2_10_10_10_REV: 33640,
					MAX_ELEMENTS_VERTICES: 33e3,
					MAX_ELEMENTS_INDICES: 33001,
					TEXTURE_MIN_LOD: 33082,
					TEXTURE_MAX_LOD: 33083,
					TEXTURE_BASE_LEVEL: 33084,
					TEXTURE_MAX_LEVEL: 33085,
					MIN: 32775,
					MAX: 32776,
					DEPTH_COMPONENT24: 33190,
					MAX_TEXTURE_LOD_BIAS: 34045,
					TEXTURE_COMPARE_MODE: 34892,
					TEXTURE_COMPARE_FUNC: 34893,
					CURRENT_QUERY: 34917,
					QUERY_RESULT: 34918,
					QUERY_RESULT_AVAILABLE: 34919,
					STREAM_READ: 35041,
					STREAM_COPY: 35042,
					STATIC_READ: 35045,
					STATIC_COPY: 35046,
					DYNAMIC_READ: 35049,
					DYNAMIC_COPY: 35050,
					MAX_DRAW_BUFFERS: 34852,
					DRAW_BUFFER0: 34853,
					DRAW_BUFFER1: 34854,
					DRAW_BUFFER2: 34855,
					DRAW_BUFFER3: 34856,
					DRAW_BUFFER4: 34857,
					DRAW_BUFFER5: 34858,
					DRAW_BUFFER6: 34859,
					DRAW_BUFFER7: 34860,
					DRAW_BUFFER8: 34861,
					DRAW_BUFFER9: 34862,
					DRAW_BUFFER10: 34863,
					DRAW_BUFFER11: 34864,
					DRAW_BUFFER12: 34865,
					DRAW_BUFFER13: 34866,
					DRAW_BUFFER14: 34867,
					DRAW_BUFFER15: 34868,
					MAX_FRAGMENT_UNIFORM_COMPONENTS: 35657,
					MAX_VERTEX_UNIFORM_COMPONENTS: 35658,
					SAMPLER_3D: 35679,
					SAMPLER_2D_SHADOW: 35682,
					FRAGMENT_SHADER_DERIVATIVE_HINT: 35723,
					PIXEL_PACK_BUFFER: 35051,
					PIXEL_UNPACK_BUFFER: 35052,
					PIXEL_PACK_BUFFER_BINDING: 35053,
					PIXEL_UNPACK_BUFFER_BINDING: 35055,
					FLOAT_MAT2x3: 35685,
					FLOAT_MAT2x4: 35686,
					FLOAT_MAT3x2: 35687,
					FLOAT_MAT3x4: 35688,
					FLOAT_MAT4x2: 35689,
					FLOAT_MAT4x3: 35690,
					SRGB: 35904,
					SRGB8: 35905,
					SRGB8_ALPHA8: 35907,
					COMPARE_REF_TO_TEXTURE: 34894,
					RGBA32F: 34836,
					RGB32F: 34837,
					RGBA16F: 34842,
					RGB16F: 34843,
					VERTEX_ATTRIB_ARRAY_INTEGER: 35069,
					MAX_ARRAY_TEXTURE_LAYERS: 35071,
					MIN_PROGRAM_TEXEL_OFFSET: 35076,
					MAX_PROGRAM_TEXEL_OFFSET: 35077,
					MAX_VARYING_COMPONENTS: 35659,
					TEXTURE_2D_ARRAY: 35866,
					TEXTURE_BINDING_2D_ARRAY: 35869,
					R11F_G11F_B10F: 35898,
					UNSIGNED_INT_10F_11F_11F_REV: 35899,
					RGB9_E5: 35901,
					UNSIGNED_INT_5_9_9_9_REV: 35902,
					TRANSFORM_FEEDBACK_BUFFER_MODE: 35967,
					MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 35968,
					TRANSFORM_FEEDBACK_VARYINGS: 35971,
					TRANSFORM_FEEDBACK_BUFFER_START: 35972,
					TRANSFORM_FEEDBACK_BUFFER_SIZE: 35973,
					TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 35976,
					RASTERIZER_DISCARD: 35977,
					MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 35978,
					MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 35979,
					INTERLEAVED_ATTRIBS: 35980,
					SEPARATE_ATTRIBS: 35981,
					TRANSFORM_FEEDBACK_BUFFER: 35982,
					TRANSFORM_FEEDBACK_BUFFER_BINDING: 35983,
					RGBA32UI: 36208,
					RGB32UI: 36209,
					RGBA16UI: 36214,
					RGB16UI: 36215,
					RGBA8UI: 36220,
					RGB8UI: 36221,
					RGBA32I: 36226,
					RGB32I: 36227,
					RGBA16I: 36232,
					RGB16I: 36233,
					RGBA8I: 36238,
					RGB8I: 36239,
					RED_INTEGER: 36244,
					RGB_INTEGER: 36248,
					RGBA_INTEGER: 36249,
					SAMPLER_2D_ARRAY: 36289,
					SAMPLER_2D_ARRAY_SHADOW: 36292,
					SAMPLER_CUBE_SHADOW: 36293,
					UNSIGNED_INT_VEC2: 36294,
					UNSIGNED_INT_VEC3: 36295,
					UNSIGNED_INT_VEC4: 36296,
					INT_SAMPLER_2D: 36298,
					INT_SAMPLER_3D: 36299,
					INT_SAMPLER_CUBE: 36300,
					INT_SAMPLER_2D_ARRAY: 36303,
					UNSIGNED_INT_SAMPLER_2D: 36306,
					UNSIGNED_INT_SAMPLER_3D: 36307,
					UNSIGNED_INT_SAMPLER_CUBE: 36308,
					UNSIGNED_INT_SAMPLER_2D_ARRAY: 36311,
					DEPTH_COMPONENT32F: 36012,
					DEPTH32F_STENCIL8: 36013,
					FLOAT_32_UNSIGNED_INT_24_8_REV: 36269,
					FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 33296,
					FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 33297,
					FRAMEBUFFER_ATTACHMENT_RED_SIZE: 33298,
					FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 33299,
					FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 33300,
					FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 33301,
					FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 33302,
					FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 33303,
					FRAMEBUFFER_DEFAULT: 33304,
					UNSIGNED_INT_24_8: 34042,
					DEPTH24_STENCIL8: 35056,
					UNSIGNED_NORMALIZED: 35863,
					DRAW_FRAMEBUFFER_BINDING: 36006,
					READ_FRAMEBUFFER: 36008,
					DRAW_FRAMEBUFFER: 36009,
					READ_FRAMEBUFFER_BINDING: 36010,
					RENDERBUFFER_SAMPLES: 36011,
					FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 36052,
					MAX_COLOR_ATTACHMENTS: 36063,
					COLOR_ATTACHMENT1: 36065,
					COLOR_ATTACHMENT2: 36066,
					COLOR_ATTACHMENT3: 36067,
					COLOR_ATTACHMENT4: 36068,
					COLOR_ATTACHMENT5: 36069,
					COLOR_ATTACHMENT6: 36070,
					COLOR_ATTACHMENT7: 36071,
					COLOR_ATTACHMENT8: 36072,
					COLOR_ATTACHMENT9: 36073,
					COLOR_ATTACHMENT10: 36074,
					COLOR_ATTACHMENT11: 36075,
					COLOR_ATTACHMENT12: 36076,
					COLOR_ATTACHMENT13: 36077,
					COLOR_ATTACHMENT14: 36078,
					COLOR_ATTACHMENT15: 36079,
					FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 36182,
					MAX_SAMPLES: 36183,
					HALF_FLOAT: 5131,
					RG: 33319,
					RG_INTEGER: 33320,
					R8: 33321,
					RG8: 33323,
					R16F: 33325,
					R32F: 33326,
					RG16F: 33327,
					RG32F: 33328,
					R8I: 33329,
					R8UI: 33330,
					R16I: 33331,
					R16UI: 33332,
					R32I: 33333,
					R32UI: 33334,
					RG8I: 33335,
					RG8UI: 33336,
					RG16I: 33337,
					RG16UI: 33338,
					RG32I: 33339,
					RG32UI: 33340,
					VERTEX_ARRAY_BINDING: 34229,
					R8_SNORM: 36756,
					RG8_SNORM: 36757,
					RGB8_SNORM: 36758,
					RGBA8_SNORM: 36759,
					SIGNED_NORMALIZED: 36764,
					COPY_READ_BUFFER: 36662,
					COPY_WRITE_BUFFER: 36663,
					COPY_READ_BUFFER_BINDING: 36662,
					COPY_WRITE_BUFFER_BINDING: 36663,
					UNIFORM_BUFFER: 35345,
					UNIFORM_BUFFER_BINDING: 35368,
					UNIFORM_BUFFER_START: 35369,
					UNIFORM_BUFFER_SIZE: 35370,
					MAX_VERTEX_UNIFORM_BLOCKS: 35371,
					MAX_FRAGMENT_UNIFORM_BLOCKS: 35373,
					MAX_COMBINED_UNIFORM_BLOCKS: 35374,
					MAX_UNIFORM_BUFFER_BINDINGS: 35375,
					MAX_UNIFORM_BLOCK_SIZE: 35376,
					MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 35377,
					MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 35379,
					UNIFORM_BUFFER_OFFSET_ALIGNMENT: 35380,
					ACTIVE_UNIFORM_BLOCKS: 35382,
					UNIFORM_TYPE: 35383,
					UNIFORM_SIZE: 35384,
					UNIFORM_BLOCK_INDEX: 35386,
					UNIFORM_OFFSET: 35387,
					UNIFORM_ARRAY_STRIDE: 35388,
					UNIFORM_MATRIX_STRIDE: 35389,
					UNIFORM_IS_ROW_MAJOR: 35390,
					UNIFORM_BLOCK_BINDING: 35391,
					UNIFORM_BLOCK_DATA_SIZE: 35392,
					UNIFORM_BLOCK_ACTIVE_UNIFORMS: 35394,
					UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 35395,
					UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 35396,
					UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 35398,
					INVALID_INDEX: 4294967295,
					MAX_VERTEX_OUTPUT_COMPONENTS: 37154,
					MAX_FRAGMENT_INPUT_COMPONENTS: 37157,
					MAX_SERVER_WAIT_TIMEOUT: 37137,
					OBJECT_TYPE: 37138,
					SYNC_CONDITION: 37139,
					SYNC_STATUS: 37140,
					SYNC_FLAGS: 37141,
					SYNC_FENCE: 37142,
					SYNC_GPU_COMMANDS_COMPLETE: 37143,
					UNSIGNALED: 37144,
					SIGNALED: 37145,
					ALREADY_SIGNALED: 37146,
					TIMEOUT_EXPIRED: 37147,
					CONDITION_SATISFIED: 37148,
					WAIT_FAILED: 37149,
					SYNC_FLUSH_COMMANDS_BIT: 1,
					VERTEX_ATTRIB_ARRAY_DIVISOR: 35070,
					ANY_SAMPLES_PASSED: 35887,
					ANY_SAMPLES_PASSED_CONSERVATIVE: 36202,
					SAMPLER_BINDING: 35097,
					RGB10_A2UI: 36975,
					INT_2_10_10_10_REV: 36255,
					TRANSFORM_FEEDBACK: 36386,
					TRANSFORM_FEEDBACK_PAUSED: 36387,
					TRANSFORM_FEEDBACK_ACTIVE: 36388,
					TRANSFORM_FEEDBACK_BINDING: 36389,
					COMPRESSED_R11_EAC: 37488,
					COMPRESSED_SIGNED_R11_EAC: 37489,
					COMPRESSED_RG11_EAC: 37490,
					COMPRESSED_SIGNED_RG11_EAC: 37491,
					COMPRESSED_RGB8_ETC2: 37492,
					COMPRESSED_SRGB8_ETC2: 37493,
					COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37494,
					COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37495,
					COMPRESSED_RGBA8_ETC2_EAC: 37496,
					COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37497,
					TEXTURE_IMMUTABLE_FORMAT: 37167,
					MAX_ELEMENT_INDEX: 36203,
					TEXTURE_IMMUTABLE_LEVELS: 33503,
					MAX_TEXTURE_MAX_ANISOTROPY_EXT: 34047
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("7c", ["15", "5", "7", "3d", "11", "7b"], function (e, t, n, i, r, o)
			{
				"use strict";
				if (!i.supportsTypedArrays()) return {};
				var s = {
					BYTE: o.BYTE,
					UNSIGNED_BYTE: o.UNSIGNED_BYTE,
					SHORT: o.SHORT,
					UNSIGNED_SHORT: o.UNSIGNED_SHORT,
					INT: o.INT,
					UNSIGNED_INT: o.UNSIGNED_INT,
					FLOAT: o.FLOAT,
					DOUBLE: o.DOUBLE
				};
				return s.getSizeInBytes = function (e)
				{
					if (!t(e)) throw new n("value is required.");
					switch (e)
					{
					case s.BYTE:
						return Int8Array.BYTES_PER_ELEMENT;
					case s.UNSIGNED_BYTE:
						return Uint8Array.BYTES_PER_ELEMENT;
					case s.SHORT:
						return Int16Array.BYTES_PER_ELEMENT;
					case s.UNSIGNED_SHORT:
						return Uint16Array.BYTES_PER_ELEMENT;
					case s.INT:
						return Int32Array.BYTES_PER_ELEMENT;
					case s.UNSIGNED_INT:
						return Uint32Array.BYTES_PER_ELEMENT;
					case s.FLOAT:
						return Float32Array.BYTES_PER_ELEMENT;
					case s.DOUBLE:
						return Float64Array.BYTES_PER_ELEMENT;
					default:
						throw new n("componentDatatype is not a valid value.")
					}
				}, s.fromTypedArray = function (e)
				{
					return e instanceof Int8Array ? s.BYTE : e instanceof Uint8Array ? s.UNSIGNED_BYTE : e instanceof Int16Array ? s.SHORT : e instanceof Uint16Array ? s.UNSIGNED_SHORT : e instanceof Int32Array ? s.INT : e instanceof Uint32Array ? s.UNSIGNED_INT : e instanceof Float32Array ? s.FLOAT : e instanceof Float64Array ? s.DOUBLE : void 0
				}, s.validate = function (e)
				{
					return t(e) && (e === s.BYTE || e === s.UNSIGNED_BYTE || e === s.SHORT || e === s.UNSIGNED_SHORT || e === s.INT || e === s.UNSIGNED_INT || e === s.FLOAT || e === s.DOUBLE)
				}, s.createTypedArray = function (e, i)
				{
					if (!t(e)) throw new n("componentDatatype is required.");
					if (!t(i)) throw new n("valuesOrLength is required.");
					switch (e)
					{
					case s.BYTE:
						return new Int8Array(i);
					case s.UNSIGNED_BYTE:
						return new Uint8Array(i);
					case s.SHORT:
						return new Int16Array(i);
					case s.UNSIGNED_SHORT:
						return new Uint16Array(i);
					case s.INT:
						return new Int32Array(i);
					case s.UNSIGNED_INT:
						return new Uint32Array(i);
					case s.FLOAT:
						return new Float32Array(i);
					case s.DOUBLE:
						return new Float64Array(i);
					default:
						throw new n("componentDatatype is not a valid value.")
					}
				}, s.createArrayBufferView = function (i, r, o, a)
				{
					if (!t(i)) throw new n("componentDatatype is required.");
					if (!t(r)) throw new n("buffer is required.");
					switch (o = e(o, 0), a = e(a, (r.byteLength - o) / s.getSizeInBytes(i)), i)
					{
					case s.BYTE:
						return new Int8Array(r, o, a);
					case s.UNSIGNED_BYTE:
						return new Uint8Array(r, o, a);
					case s.SHORT:
						return new Int16Array(r, o, a);
					case s.UNSIGNED_SHORT:
						return new Uint16Array(r, o, a);
					case s.INT:
						return new Int32Array(r, o, a);
					case s.UNSIGNED_INT:
						return new Uint32Array(r, o, a);
					case s.FLOAT:
						return new Float32Array(r, o, a);
					case s.DOUBLE:
						return new Float64Array(r, o, a);
					default:
						throw new n("componentDatatype is not a valid value.")
					}
				}, s.fromName = function (e)
				{
					switch (e)
					{
					case "BYTE":
						return s.BYTE;
					case "UNSIGNED_BYTE":
						return s.UNSIGNED_BYTE;
					case "SHORT":
						return s.SHORT;
					case "UNSIGNED_SHORT":
						return s.UNSIGNED_SHORT;
					case "INT":
						return s.INT;
					case "UNSIGNED_INT":
						return s.UNSIGNED_INT;
					case "FLOAT":
						return s.FLOAT;
					case "DOUBLE":
						return s.DOUBLE;
					default:
						throw new n("name is not a valid value.")
					}
				}, r(s)
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("33", ["1e", "15", "5", "7", "11", "d"], function (e, t, n, i, r, o)
			{
				"use strict";

				function s(e, n, i, r)
				{
					this.x = t(e, 0), this.y = t(n, 0), this.z = t(i, 0), this.w = t(r, 0)
				}
				s.fromElements = function (e, t, i, r, o)
				{
					return n(o) ? (o.x = e, o.y = t, o.z = i, o.w = r, o) : new s(e, t, i, r)
				}, s.fromColor = function (t, i)
				{
					return e.typeOf.object("color", t), n(i) ? (i.x = t.red, i.y = t.green, i.z = t.blue, i.w = t.alpha, i) : new s(t.red, t.green, t.blue, t.alpha)
				}, s.clone = function (e, t)
				{
					if (n(e)) return n(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t) : new s(e.x, e.y, e.z, e.w)
				}, s.packedLength = 4, s.pack = function (n, i, r)
				{
					return e.typeOf.object("value", n), e.defined("array", i), r = t(r, 0), i[r++] = n.x, i[r++] = n.y, i[r++] = n.z, i[r] = n.w, i
				}, s.unpack = function (i, r, o)
				{
					return e.defined("array", i), r = t(r, 0), n(o) || (o = new s), o.x = i[r++], o.y = i[r++], o.z = i[r++], o.w = i[r], o
				}, s.packArray = function (t, i)
				{
					e.defined("array", t);
					var r = t.length;
					n(i) ? i.length = 4 * r : i = new Array(4 * r);
					for (var o = 0; o < r; ++o) s.pack(t[o], i, 4 * o);
					return i
				}, s.unpackArray = function (t, i)
				{
					e.defined("array", t);
					var r = t.length;
					n(i) ? i.length = r / 4 : i = new Array(r / 4);
					for (var o = 0; o < r; o += 4)
					{
						var a = o / 4;
						i[a] = s.unpack(t, o, i[a])
					}
					return i
				}, s.fromArray = s.unpack, s.maximumComponent = function (t)
				{
					return e.typeOf.object("cartesian", t), Math.max(t.x, t.y, t.z, t.w)
				}, s.minimumComponent = function (t)
				{
					return e.typeOf.object("cartesian", t), Math.min(t.x, t.y, t.z, t.w)
				}, s.minimumByComponent = function (t, n, i)
				{
					return e.typeOf.object("first", t), e.typeOf.object("second", n), e.typeOf.object("result", i), i.x = Math.min(t.x, n.x), i.y = Math.min(t.y, n.y), i.z = Math.min(t.z, n.z), i.w = Math.min(t.w, n.w), i
				}, s.maximumByComponent = function (t, n, i)
				{
					return e.typeOf.object("first", t), e.typeOf.object("second", n), e.typeOf.object("result", i), i.x = Math.max(t.x, n.x), i.y = Math.max(t.y, n.y), i.z = Math.max(t.z, n.z), i.w = Math.max(t.w, n.w), i
				}, s.magnitudeSquared = function (t)
				{
					return e.typeOf.object("cartesian", t), t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w
				}, s.magnitude = function (e)
				{
					return Math.sqrt(s.magnitudeSquared(e))
				};
				var a = new s;
				s.distance = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), s.subtract(t, n, a), s.magnitude(a)
				}, s.distanceSquared = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), s.subtract(t, n, a), s.magnitudeSquared(a)
				}, s.normalize = function (t, n)
				{
					e.typeOf.object("cartesian", t), e.typeOf.object("result", n);
					var r = s.magnitude(t);
					if (n.x = t.x / r, n.y = t.y / r, n.z = t.z / r, n.w = t.w / r, isNaN(n.x) || isNaN(n.y) || isNaN(n.z) || isNaN(n.w)) throw new i("normalized result is not a number");
					return n
				}, s.dot = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), t.x * n.x + t.y * n.y + t.z * n.z + t.w * n.w
				}, s.multiplyComponents = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x * n.x, i.y = t.y * n.y, i.z = t.z * n.z, i.w = t.w * n.w, i
				}, s.divideComponents = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x / n.x, i.y = t.y / n.y, i.z = t.z / n.z, i.w = t.w / n.w, i
				}, s.add = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x + n.x, i.y = t.y + n.y, i.z = t.z + n.z, i.w = t.w + n.w, i
				}, s.subtract = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x - n.x, i.y = t.y - n.y, i.z = t.z - n.z, i.w = t.w - n.w, i
				}, s.multiplyByScalar = function (t, n, i)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.number("scalar", n), e.typeOf.object("result", i), i.x = t.x * n, i.y = t.y * n, i.z = t.z * n, i.w = t.w * n, i
				}, s.divideByScalar = function (t, n, i)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.number("scalar", n), e.typeOf.object("result", i), i.x = t.x / n, i.y = t.y / n, i.z = t.z / n, i.w = t.w / n, i
				}, s.negate = function (t, n)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.object("result", n), n.x = -t.x, n.y = -t.y, n.z = -t.z, n.w = -t.w, n
				}, s.abs = function (t, n)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.object("result", n), n.x = Math.abs(t.x), n.y = Math.abs(t.y), n.z = Math.abs(t.z), n.w = Math.abs(t.w), n
				};
				var u = new s;
				s.lerp = function (t, n, i, r)
				{
					return e.typeOf.object("start", t), e.typeOf.object("end", n), e.typeOf.number("t", i), e.typeOf.object("result", r), s.multiplyByScalar(n, i, u), r = s.multiplyByScalar(t, 1 - i, r), s.add(u, r, r)
				};
				var c = new s;
				return s.mostOrthogonalAxis = function (t, n)
				{
					e.typeOf.object("cartesian", t), e.typeOf.object("result", n);
					var i = s.normalize(t, c);
					return s.abs(i, i), n = i.x <= i.y ? i.x <= i.z ? i.x <= i.w ? s.clone(s.UNIT_X, n) : s.clone(s.UNIT_W, n) : i.z <= i.w ? s.clone(s.UNIT_Z, n) : s.clone(s.UNIT_W, n) : i.y <= i.z ? i.y <= i.w ? s.clone(s.UNIT_Y, n) : s.clone(s.UNIT_W, n) : i.z <= i.w ? s.clone(s.UNIT_Z, n) : s.clone(s.UNIT_W, n)
				}, s.equals = function (e, t)
				{
					return e === t || n(e) && n(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w
				}, s.equalsArray = function (e, t, n)
				{
					return e.x === t[n] && e.y === t[n + 1] && e.z === t[n + 2] && e.w === t[n + 3]
				}, s.equalsEpsilon = function (e, t, i, r)
				{
					return e === t || n(e) && n(t) && o.equalsEpsilon(e.x, t.x, i, r) && o.equalsEpsilon(e.y, t.y, i, r) && o.equalsEpsilon(e.z, t.z, i, r) && o.equalsEpsilon(e.w, t.w, i, r)
				}, s.ZERO = r(new s(0, 0, 0, 0)), s.UNIT_X = r(new s(1, 0, 0, 0)), s.UNIT_Y = r(new s(0, 1, 0, 0)), s.UNIT_Z = r(new s(0, 0, 1, 0)), s.UNIT_W = r(new s(0, 0, 0, 1)), s.prototype.clone = function (e)
				{
					return s.clone(this, e)
				}, s.prototype.equals = function (e)
				{
					return s.equals(this, e)
				}, s.prototype.equalsEpsilon = function (e, t, n)
				{
					return s.equalsEpsilon(this, e, t, n)
				}, s.prototype.toString = function ()
				{
					return "(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")"
				}, s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("20", ["1e", "15", "5", "7", "11", "d"], function (e, t, n, i, r, o)
			{
				"use strict";

				function s(e, n, i)
				{
					this.x = t(e, 0), this.y = t(n, 0), this.z = t(i, 0)
				}
				s.fromSpherical = function (i, r)
				{
					e.typeOf.object("spherical", i), n(r) || (r = new s);
					var o = i.clock,
						a = i.cone,
						u = t(i.magnitude, 1),
						c = u * Math.sin(a);
					return r.x = c * Math.cos(o), r.y = c * Math.sin(o), r.z = u * Math.cos(a), r
				}, s.fromElements = function (e, t, i, r)
				{
					return n(r) ? (r.x = e, r.y = t, r.z = i, r) : new s(e, t, i)
				}, s.clone = function (e, t)
				{
					if (n(e)) return n(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t) : new s(e.x, e.y, e.z)
				}, s.fromCartesian4 = s.clone, s.packedLength = 3, s.pack = function (n, i, r)
				{
					return e.typeOf.object("value", n), e.defined("array", i), r = t(r, 0), i[r++] = n.x, i[r++] = n.y, i[r] = n.z, i
				}, s.unpack = function (i, r, o)
				{
					return e.defined("array", i), r = t(r, 0), n(o) || (o = new s), o.x = i[r++], o.y = i[r++], o.z = i[r], o
				}, s.packArray = function (t, i)
				{
					e.defined("array", t);
					var r = t.length;
					n(i) ? i.length = 3 * r : i = new Array(3 * r);
					for (var o = 0; o < r; ++o) s.pack(t[o], i, 3 * o);
					return i
				}, s.unpackArray = function (t, r)
				{
					if (e.defined("array", t), e.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new i("array length must be a multiple of 3.");
					var o = t.length;
					n(r) ? r.length = o / 3 : r = new Array(o / 3);
					for (var a = 0; a < o; a += 3)
					{
						var u = a / 3;
						r[u] = s.unpack(t, a, r[u])
					}
					return r
				}, s.fromArray = s.unpack, s.maximumComponent = function (t)
				{
					return e.typeOf.object("cartesian", t), Math.max(t.x, t.y, t.z)
				}, s.minimumComponent = function (t)
				{
					return e.typeOf.object("cartesian", t), Math.min(t.x, t.y, t.z)
				}, s.minimumByComponent = function (t, n, i)
				{
					return e.typeOf.object("first", t), e.typeOf.object("second", n), e.typeOf.object("result", i), i.x = Math.min(t.x, n.x), i.y = Math.min(t.y, n.y), i.z = Math.min(t.z, n.z), i
				}, s.maximumByComponent = function (t, n, i)
				{
					return e.typeOf.object("first", t), e.typeOf.object("second", n), e.typeOf.object("result", i), i.x = Math.max(t.x, n.x), i.y = Math.max(t.y, n.y), i.z = Math.max(t.z, n.z), i
				}, s.magnitudeSquared = function (t)
				{
					return e.typeOf.object("cartesian", t), t.x * t.x + t.y * t.y + t.z * t.z
				}, s.magnitude = function (e)
				{
					return Math.sqrt(s.magnitudeSquared(e))
				};
				var a = new s;
				s.distance = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), s.subtract(t, n, a), s.magnitude(a)
				}, s.distanceSquared = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), s.subtract(t, n, a), s.magnitudeSquared(a)
				}, s.normalize = function (t, n)
				{
					e.typeOf.object("cartesian", t), e.typeOf.object("result", n);
					var r = s.magnitude(t);
					if (n.x = t.x / r, n.y = t.y / r, n.z = t.z / r, isNaN(n.x) || isNaN(n.y) || isNaN(n.z)) throw new i("normalized result is not a number");
					return n
				}, s.dot = function (t, n)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), t.x * n.x + t.y * n.y + t.z * n.z
				}, s.multiplyComponents = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x * n.x, i.y = t.y * n.y, i.z = t.z * n.z, i
				}, s.divideComponents = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x / n.x, i.y = t.y / n.y, i.z = t.z / n.z, i
				}, s.add = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x + n.x, i.y = t.y + n.y, i.z = t.z + n.z, i
				}, s.subtract = function (t, n, i)
				{
					return e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i), i.x = t.x - n.x, i.y = t.y - n.y, i.z = t.z - n.z, i
				}, s.multiplyByScalar = function (t, n, i)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.number("scalar", n), e.typeOf.object("result", i), i.x = t.x * n, i.y = t.y * n, i.z = t.z * n, i
				}, s.divideByScalar = function (t, n, i)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.number("scalar", n), e.typeOf.object("result", i), i.x = t.x / n, i.y = t.y / n, i.z = t.z / n, i
				}, s.negate = function (t, n)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.object("result", n), n.x = -t.x, n.y = -t.y, n.z = -t.z, n
				}, s.abs = function (t, n)
				{
					return e.typeOf.object("cartesian", t), e.typeOf.object("result", n), n.x = Math.abs(t.x), n.y = Math.abs(t.y), n.z = Math.abs(t.z), n
				};
				var u = new s;
				s.lerp = function (t, n, i, r)
				{
					return e.typeOf.object("start", t), e.typeOf.object("end", n), e.typeOf.number("t", i), e.typeOf.object("result", r), s.multiplyByScalar(n, i, u), r = s.multiplyByScalar(t, 1 - i, r), s.add(u, r, r)
				};
				var c = new s,
					l = new s;
				s.angleBetween = function (t, n)
				{
					e.typeOf.object("left", t), e.typeOf.object("right", n), s.normalize(t, c), s.normalize(n, l);
					var i = s.dot(c, l),
						r = s.magnitude(s.cross(c, l, c));
					return Math.atan2(r, i)
				};
				var h = new s;
				s.mostOrthogonalAxis = function (t, n)
				{
					e.typeOf.object("cartesian", t), e.typeOf.object("result", n);
					var i = s.normalize(t, h);
					return s.abs(i, i), n = i.x <= i.y ? i.x <= i.z ? s.clone(s.UNIT_X, n) : s.clone(s.UNIT_Z, n) : i.y <= i.z ? s.clone(s.UNIT_Y, n) : s.clone(s.UNIT_Z, n)
				}, s.equals = function (e, t)
				{
					return e === t || n(e) && n(t) && e.x === t.x && e.y === t.y && e.z === t.z
				}, s.equalsArray = function (e, t, n)
				{
					return e.x === t[n] && e.y === t[n + 1] && e.z === t[n + 2]
				}, s.equalsEpsilon = function (e, t, i, r)
				{
					return e === t || n(e) && n(t) && o.equalsEpsilon(e.x, t.x, i, r) && o.equalsEpsilon(e.y, t.y, i, r) && o.equalsEpsilon(e.z, t.z, i, r)
				}, s.cross = function (t, n, i)
				{
					e.typeOf.object("left", t), e.typeOf.object("right", n), e.typeOf.object("result", i);
					var r = t.x,
						o = t.y,
						s = t.z,
						a = n.x,
						u = n.y,
						c = n.z,
						l = o * c - s * u,
						h = s * a - r * c,
						d = r * u - o * a;
					return i.x = l, i.y = h, i.z = d, i
				}, s.fromDegrees = function (t, n, i, r, a)
				{
					return e.typeOf.number("longitude", t), e.typeOf.number("latitude", n), t = o.toRadians(t), n = o.toRadians(n), s.fromRadians(t, n, i, r, a)
				};
				var d = new s,
					f = new s,
					p = new s(40680631590769, 40680631590769, 40408299984661.445);
				return s.fromRadians = function (i, r, o, a, u)
				{
					e.typeOf.number("longitude", i), e.typeOf.number("latitude", r), o = t(o, 0);
					var c = n(a) ? a.radiiSquared : p,
						l = Math.cos(r);
					d.x = l * Math.cos(i), d.y = l * Math.sin(i), d.z = Math.sin(r), d = s.normalize(d, d), s.multiplyComponents(c, d, f);
					var h = Math.sqrt(s.dot(d, f));
					return f = s.divideByScalar(f, h, f), d = s.multiplyByScalar(d, o, d), n(u) || (u = new s), s.add(f, d, u)
				}, s.fromDegreesArray = function (t, r, o)
				{
					if (e.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new i("the number of coordinates must be a multiple of 2 and at least 2");
					var a = t.length;
					n(o) ? o.length = a / 2 : o = new Array(a / 2);
					for (var u = 0; u < a; u += 2)
					{
						var c = t[u],
							l = t[u + 1],
							h = u / 2;
						o[h] = s.fromDegrees(c, l, 0, r, o[h])
					}
					return o
				}, s.fromRadiansArray = function (t, r, o)
				{
					if (e.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new i("the number of coordinates must be a multiple of 2 and at least 2");
					var a = t.length;
					n(o) ? o.length = a / 2 : o = new Array(a / 2);
					for (var u = 0; u < a; u += 2)
					{
						var c = t[u],
							l = t[u + 1],
							h = u / 2;
						o[h] = s.fromRadians(c, l, 0, r, o[h])
					}
					return o
				}, s.fromDegreesArrayHeights = function (t, r, o)
				{
					if (e.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new i("the number of coordinates must be a multiple of 3 and at least 3");
					var a = t.length;
					n(o) ? o.length = a / 3 : o = new Array(a / 3);
					for (var u = 0; u < a; u += 3)
					{
						var c = t[u],
							l = t[u + 1],
							h = t[u + 2],
							d = u / 3;
						o[d] = s.fromDegrees(c, l, h, r, o[d])
					}
					return o
				}, s.fromRadiansArrayHeights = function (t, r, o)
				{
					if (e.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new i("the number of coordinates must be a multiple of 3 and at least 3");
					var a = t.length;
					n(o) ? o.length = a / 3 : o = new Array(a / 3);
					for (var u = 0; u < a; u += 3)
					{
						var c = t[u],
							l = t[u + 1],
							h = t[u + 2],
							d = u / 3;
						o[d] = s.fromRadians(c, l, h, r, o[d])
					}
					return o
				}, s.ZERO = r(new s(0, 0, 0)), s.UNIT_X = r(new s(1, 0, 0)), s.UNIT_Y = r(new s(0, 1, 0)), s.UNIT_Z = r(new s(0, 0, 1)), s.prototype.clone = function (e)
				{
					return s.clone(this, e)
				}, s.prototype.equals = function (e)
				{
					return s.equals(this, e)
				}, s.prototype.equalsEpsilon = function (e, t, n)
				{
					return s.equalsEpsilon(this, e, t, n)
				}, s.prototype.toString = function ()
				{
					return "(" + this.x + ", " + this.y + ", " + this.z + ")"
				}, s
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("28", ["20", "1e", "15", "5", "6", "7", "11", "d"], function (e, t, n, i, r, o, s, a)
			{
				"use strict";

				function u(e, t, i, r, o, s, a, u, c)
				{
					this[0] = n(e, 0), this[1] = n(r, 0), this[2] = n(a, 0), this[3] = n(t, 0), this[4] = n(o, 0), this[5] = n(u, 0), this[6] = n(i, 0), this[7] = n(s, 0), this[8] = n(c, 0)
				}

				function c(e)
				{
					for (var t = 0, n = 0; n < 9; ++n)
					{
						var i = e[n];
						t += i * i
					}
					return Math.sqrt(t)
				}

				function l(e)
				{
					for (var t = 0, n = 0; n < 3; ++n)
					{
						var i = e[u.getElementIndex(g[n], p[n])];
						t += 2 * i * i
					}
					return Math.sqrt(t)
				}

				function h(e, t)
				{
					for (var n = a.EPSILON15, i = 0, r = 1, o = 0; o < 3; ++o)
					{
						var s = Math.abs(e[u.getElementIndex(g[o], p[o])]);
						s > i && (r = o, i = s)
					}
					var c = 1,
						l = 0,
						h = p[r],
						d = g[r];
					if (Math.abs(e[u.getElementIndex(d, h)]) > n)
					{
						var f, y = (e[u.getElementIndex(d, d)] - e[u.getElementIndex(h, h)]) / 2 / e[u.getElementIndex(d, h)];
						l = (f = y < 0 ? -1 / (-y + Math.sqrt(1 + y * y)) : 1 / (y + Math.sqrt(1 + y * y))) * (c = 1 / Math.sqrt(1 + f * f))
					}
					return t = u.clone(u.IDENTITY, t), t[u.getElementIndex(h, h)] = t[u.getElementIndex(d, d)] = c, t[u.getElementIndex(d, h)] = l, t[u.getElementIndex(h, d)] = -l, t
				}
				u.packedLength = 9, u.pack = function (e, i, r)
				{
					return t.typeOf.object("value", e), t.defined("array", i), r = n(r, 0), i[r++] = e[0], i[r++] = e[1], i[r++] = e[2], i[r++] = e[3], i[r++] = e[4], i[r++] = e[5], i[r++] = e[6], i[r++] = e[7], i[r++] = e[8], i
				}, u.unpack = function (e, r, o)
				{
					return t.defined("array", e), r = n(r, 0), i(o) || (o = new u), o[0] = e[r++], o[1] = e[r++], o[2] = e[r++], o[3] = e[r++], o[4] = e[r++], o[5] = e[r++], o[6] = e[r++], o[7] = e[r++], o[8] = e[r++], o
				}, u.clone = function (e, t)
				{
					if (i(e)) return i(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t) : new u(e[0], e[3], e[6], e[1], e[4], e[7], e[2], e[5], e[8])
				}, u.fromArray = function (e, r, o)
				{
					return t.defined("array", e), r = n(r, 0), i(o) || (o = new u), o[0] = e[r], o[1] = e[r + 1], o[2] = e[r + 2], o[3] = e[r + 3], o[4] = e[r + 4], o[5] = e[r + 5], o[6] = e[r + 6], o[7] = e[r + 7], o[8] = e[r + 8], o
				}, u.fromColumnMajorArray = function (e, n)
				{
					return t.defined("values", e), u.clone(e, n)
				}, u.fromRowMajorArray = function (e, n)
				{
					return t.defined("values", e), i(n) ? (n[0] = e[0], n[1] = e[3], n[2] = e[6], n[3] = e[1], n[4] = e[4], n[5] = e[7], n[6] = e[2], n[7] = e[5], n[8] = e[8], n) : new u(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8])
				}, u.fromQuaternion = function (e, n)
				{
					t.typeOf.object("quaternion", e);
					var r = e.x * e.x,
						o = e.x * e.y,
						s = e.x * e.z,
						a = e.x * e.w,
						c = e.y * e.y,
						l = e.y * e.z,
						h = e.y * e.w,
						d = e.z * e.z,
						f = e.z * e.w,
						p = e.w * e.w,
						g = r - c - d + p,
						y = 2 * (o - f),
						M = 2 * (s + h),
						v = 2 * (o + f),
						A = -r + c - d + p,
						E = 2 * (l - a),
						m = 2 * (s - h),
						w = 2 * (l + a),
						N = -r - c + d + p;
					return i(n) ? (n[0] = g, n[1] = v, n[2] = m, n[3] = y, n[4] = A, n[5] = w, n[6] = M, n[7] = E, n[8] = N, n) : new u(g, y, M, v, A, E, m, w, N)
				}, u.fromHeadingPitchRoll = function (e, n)
				{
					t.typeOf.object("headingPitchRoll", e);
					var r = Math.cos(-e.pitch),
						o = Math.cos(-e.heading),
						s = Math.cos(e.roll),
						a = Math.sin(-e.pitch),
						c = Math.sin(-e.heading),
						l = Math.sin(e.roll),
						h = r * o,
						d = -s * c + l * a * o,
						f = l * c + s * a * o,
						p = r * c,
						g = s * o + l * a * c,
						y = -l * o + s * a * c,
						M = -a,
						v = l * r,
						A = s * r;
					return i(n) ? (n[0] = h, n[1] = p, n[2] = M, n[3] = d, n[4] = g, n[5] = v, n[6] = f, n[7] = y, n[8] = A, n) : new u(h, d, f, p, g, y, M, v, A)
				}, u.fromScale = function (e, n)
				{
					return t.typeOf.object("scale", e), i(n) ? (n[0] = e.x, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = e.y, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = e.z, n) : new u(e.x, 0, 0, 0, e.y, 0, 0, 0, e.z)
				}, u.fromUniformScale = function (e, n)
				{
					return t.typeOf.number("scale", e), i(n) ? (n[0] = e, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = e, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = e, n) : new u(e, 0, 0, 0, e, 0, 0, 0, e)
				}, u.fromCrossProduct = function (e, n)
				{
					return t.typeOf.object("vector", e), i(n) ? (n[0] = 0, n[1] = e.z, n[2] = -e.y, n[3] = -e.z, n[4] = 0, n[5] = e.x, n[6] = e.y, n[7] = -e.x, n[8] = 0, n) : new u(0, -e.z, e.y, e.z, 0, -e.x, -e.y, e.x, 0)
				}, u.fromRotationX = function (e, n)
				{
					t.typeOf.number("angle", e);
					var r = Math.cos(e),
						o = Math.sin(e);
					return i(n) ? (n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = r, n[5] = o, n[6] = 0, n[7] = -o, n[8] = r, n) : new u(1, 0, 0, 0, r, -o, 0, o, r)
				}, u.fromRotationY = function (e, n)
				{
					t.typeOf.number("angle", e);
					var r = Math.cos(e),
						o = Math.sin(e);
					return i(n) ? (n[0] = r, n[1] = 0, n[2] = -o, n[3] = 0, n[4] = 1, n[5] = 0, n[6] = o, n[7] = 0, n[8] = r, n) : new u(r, 0, o, 0, 1, 0, -o, 0, r)
				}, u.fromRotationZ = function (e, n)
				{
					t.typeOf.number("angle", e);
					var r = Math.cos(e),
						o = Math.sin(e);
					return i(n) ? (n[0] = r, n[1] = o, n[2] = 0, n[3] = -o, n[4] = r, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = 1, n) : new u(r, -o, 0, o, r, 0, 0, 0, 1)
				}, u.toArray = function (e, n)
				{
					return t.typeOf.object("matrix", e), i(n) ? (n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n) : [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]]
				}, u.getElementIndex = function (e, n)
				{
					return t.typeOf.number.greaterThanOrEquals("row", n, 0), t.typeOf.number.lessThanOrEquals("row", n, 2), t.typeOf.number.greaterThanOrEquals("column", e, 0), t.typeOf.number.lessThanOrEquals("column", e, 2), 3 * e + n
				}, u.getColumn = function (e, n, i)
				{
					t.typeOf.object("matrix", e), t.typeOf.number.greaterThanOrEquals("index", n, 0), t.typeOf.number.lessThanOrEquals("index", n, 2), t.typeOf.object("result", i);
					var r = 3 * n,
						o = e[r],
						s = e[r + 1],
						a = e[r + 2];
					return i.x = o, i.y = s, i.z = a, i
				}, u.setColumn = function (e, n, i, r)
				{
					t.typeOf.object("matrix", e), t.typeOf.number.greaterThanOrEquals("index", n, 0), t.typeOf.number.lessThanOrEquals("index", n, 2), t.typeOf.object("cartesian", i), t.typeOf.object("result", r);
					var o = 3 * n;
					return (r = u.clone(e, r))[o] = i.x, r[o + 1] = i.y, r[o + 2] = i.z, r
				}, u.getRow = function (e, n, i)
				{
					t.typeOf.object("matrix", e), t.typeOf.number.greaterThanOrEquals("index", n, 0), t.typeOf.number.lessThanOrEquals("index", n, 2), t.typeOf.object("result", i);
					var r = e[n],
						o = e[n + 3],
						s = e[n + 6];
					return i.x = r, i.y = o, i.z = s, i
				}, u.setRow = function (e, n, i, r)
				{
					return t.typeOf.object("matrix", e), t.typeOf.number.greaterThanOrEquals("index", n, 0), t.typeOf.number.lessThanOrEquals("index", n, 2), t.typeOf.object("cartesian", i), t.typeOf.object("result", r), r = u.clone(e, r), r[n] = i.x, r[n + 3] = i.y, r[n + 6] = i.z, r
				};
				var d = new e;
				u.getScale = function (n, i)
				{
					return t.typeOf.object("matrix", n), t.typeOf.object("result", i), i.x = e.magnitude(e.fromElements(n[0], n[1], n[2], d)), i.y = e.magnitude(e.fromElements(n[3], n[4], n[5], d)), i.z = e.magnitude(e.fromElements(n[6], n[7], n[8], d)), i
				};
				var f = new e;
				u.getMaximumScale = function (t)
				{
					return u.getScale(t, f), e.maximumComponent(f)
				}, u.multiply = function (e, n, i)
				{
					t.typeOf.object("left", e), t.typeOf.object("right", n), t.typeOf.object("result", i);
					var r = e[0] * n[0] + e[3] * n[1] + e[6] * n[2],
						o = e[1] * n[0] + e[4] * n[1] + e[7] * n[2],
						s = e[2] * n[0] + e[5] * n[1] + e[8] * n[2],
						a = e[0] * n[3] + e[3] * n[4] + e[6] * n[5],
						u = e[1] * n[3] + e[4] * n[4] + e[7] * n[5],
						c = e[2] * n[3] + e[5] * n[4] + e[8] * n[5],
						l = e[0] * n[6] + e[3] * n[7] + e[6] * n[8],
						h = e[1] * n[6] + e[4] * n[7] + e[7] * n[8],
						d = e[2] * n[6] + e[5] * n[7] + e[8] * n[8];
					return i[0] = r, i[1] = o, i[2] = s, i[3] = a, i[4] = u, i[5] = c, i[6] = l, i[7] = h, i[8] = d, i
				}, u.add = function (e, n, i)
				{
					return t.typeOf.object("left", e), t.typeOf.object("right", n), t.typeOf.object("result", i), i[0] = e[0] + n[0], i[1] = e[1] + n[1], i[2] = e[2] + n[2], i[3] = e[3] + n[3], i[4] = e[4] + n[4], i[5] = e[5] + n[5], i[6] = e[6] + n[6], i[7] = e[7] + n[7], i[8] = e[8] + n[8], i
				}, u.subtract = function (e, n, i)
				{
					return t.typeOf.object("left", e), t.typeOf.object("right", n), t.typeOf.object("result", i), i[0] = e[0] - n[0], i[1] = e[1] - n[1], i[2] = e[2] - n[2], i[3] = e[3] - n[3], i[4] = e[4] - n[4], i[5] = e[5] - n[5], i[6] = e[6] - n[6], i[7] = e[7] - n[7], i[8] = e[8] - n[8], i
				}, u.multiplyByVector = function (e, n, i)
				{
					t.typeOf.object("matrix", e), t.typeOf.object("cartesian", n), t.typeOf.object("result", i);
					var r = n.x,
						o = n.y,
						s = n.z,
						a = e[0] * r + e[3] * o + e[6] * s,
						u = e[1] * r + e[4] * o + e[7] * s,
						c = e[2] * r + e[5] * o + e[8] * s;
					return i.x = a, i.y = u, i.z = c, i
				}, u.multiplyByScalar = function (e, n, i)
				{
					return t.typeOf.object("matrix", e), t.typeOf.number("scalar", n), t.typeOf.object("result", i), i[0] = e[0] * n, i[1] = e[1] * n, i[2] = e[2] * n, i[3] = e[3] * n, i[4] = e[4] * n, i[5] = e[5] * n, i[6] = e[6] * n, i[7] = e[7] * n, i[8] = e[8] * n, i
				}, u.multiplyByScale = function (e, n, i)
				{
					return t.typeOf.object("matrix", e), t.typeOf.object("scale", n), t.typeOf.object("result", i), i[0] = e[0] * n.x, i[1] = e[1] * n.x, i[2] = e[2] * n.x, i[3] = e[3] * n.y, i[4] = e[4] * n.y, i[5] = e[5] * n.y, i[6] = e[6] * n.z, i[7] = e[7] * n.z, i[8] = e[8] * n.z, i
				}, u.negate = function (e, n)
				{
					return t.typeOf.object("matrix", e), t.typeOf.object("result", n), n[0] = -e[0], n[1] = -e[1], n[2] = -e[2], n[3] = -e[3], n[4] = -e[4], n[5] = -e[5], n[6] = -e[6], n[7] = -e[7], n[8] = -e[8], n
				}, u.transpose = function (e, n)
				{
					t.typeOf.object("matrix", e), t.typeOf.object("result", n);
					var i = e[0],
						r = e[3],
						o = e[6],
						s = e[1],
						a = e[4],
						u = e[7],
						c = e[2],
						l = e[5],
						h = e[8];
					return n[0] = i, n[1] = r, n[2] = o, n[3] = s, n[4] = a, n[5] = u, n[6] = c, n[7] = l, n[8] = h, n
				};
				var p = [1, 0, 0],
					g = [2, 2, 1],
					y = new u,
					M = new u;
				return u.computeEigenDecomposition = function (e, n)
				{
					t.typeOf.object("matrix", e);
					var r = a.EPSILON20,
						o = 0,
						s = 0;
					i(n) || (n = {});
					for (var d = n.unitary = u.clone(u.IDENTITY, n.unitary), f = n.diagonal = u.clone(e, n.diagonal), p = r * c(f); s < 10 && l(f) > p;) h(f, y), u.transpose(y, M), u.multiply(f, y, f), u.multiply(M, f, f), u.multiply(d, y, d), ++o > 2 && (++s, o = 0);
					return n
				}, u.abs = function (e, n)
				{
					return t.typeOf.object("matrix", e), t.typeOf.object("result", n), n[0] = Math.abs(e[0]), n[1] = Math.abs(e[1]), n[2] = Math.abs(e[2]), n[3] = Math.abs(e[3]), n[4] = Math.abs(e[4]), n[5] = Math.abs(e[5]), n[6] = Math.abs(e[6]), n[7] = Math.abs(e[7]), n[8] = Math.abs(e[8]), n
				}, u.determinant = function (e)
				{
					t.typeOf.object("matrix", e);
					var n = e[0],
						i = e[3],
						r = e[6],
						o = e[1],
						s = e[4],
						a = e[7],
						u = e[2],
						c = e[5],
						l = e[8];
					return n * (s * l - c * a) + o * (c * r - i * l) + u * (i * a - s * r)
				}, u.inverse = function (e, n)
				{
					t.typeOf.object("matrix", e), t.typeOf.object("result", n);
					var i = e[0],
						r = e[1],
						s = e[2],
						c = e[3],
						l = e[4],
						h = e[5],
						d = e[6],
						f = e[7],
						p = e[8],
						g = u.determinant(e);
					if (Math.abs(g) <= a.EPSILON15) throw new o("matrix is not invertible");
					n[0] = l * p - f * h, n[1] = f * s - r * p, n[2] = r * h - l * s, n[3] = d * h - c * p, n[4] = i * p - d * s, n[5] = c * s - i * h, n[6] = c * f - d * l, n[7] = d * r - i * f, n[8] = i * l - c * r;
					var y = 1 / g;
					return u.multiplyByScalar(n, y, n)
				}, u.equals = function (e, t)
				{
					return e === t || i(e) && i(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8]
				}, u.equalsEpsilon = function (e, n, r)
				{
					return t.typeOf.number("epsilon", r), e === n || i(e) && i(n) && Math.abs(e[0] - n[0]) <= r && Math.abs(e[1] - n[1]) <= r && Math.abs(e[2] - n[2]) <= r && Math.abs(e[3] - n[3]) <= r && Math.abs(e[4] - n[4]) <= r && Math.abs(e[5] - n[5]) <= r && Math.abs(e[6] - n[6]) <= r && Math.abs(e[7] - n[7]) <= r && Math.abs(e[8] - n[8]) <= r
				}, u.IDENTITY = s(new u(1, 0, 0, 0, 1, 0, 0, 0, 1)), u.ZERO = s(new u(0, 0, 0, 0, 0, 0, 0, 0, 0)), u.COLUMN0ROW0 = 0, u.COLUMN0ROW1 = 1, u.COLUMN0ROW2 = 2, u.COLUMN1ROW0 = 3, u.COLUMN1ROW1 = 4, u.COLUMN1ROW2 = 5, u.COLUMN2ROW0 = 6, u.COLUMN2ROW1 = 7, u.COLUMN2ROW2 = 8, r(u.prototype,
				{
					length:
					{
						get: function ()
						{
							return u.packedLength
						}
					}
				}), u.prototype.clone = function (e)
				{
					return u.clone(this, e)
				}, u.prototype.equals = function (e)
				{
					return u.equals(this, e)
				}, u.equalsArray = function (e, t, n)
				{
					return e[0] === t[n] && e[1] === t[n + 1] && e[2] === t[n + 2] && e[3] === t[n + 3] && e[4] === t[n + 4] && e[5] === t[n + 5] && e[6] === t[n + 6] && e[7] === t[n + 7] && e[8] === t[n + 8]
				}, u.prototype.equalsEpsilon = function (e, t)
				{
					return u.equalsEpsilon(this, e, t)
				}, u.prototype.toString = function ()
				{
					return "(" + this[0] + ", " + this[3] + ", " + this[6] + ")\n(" + this[1] + ", " + this[4] + ", " + this[7] + ")\n(" + this[2] + ", " + this[5] + ", " + this[8] + ")"
				}, u
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("2d", ["5"], function (e)
			{
				"use strict";

				function t(e)
				{
					this.name = "RuntimeError", this.message = e;
					var t;
					try
					{
						throw new Error
					}
					catch (e)
					{
						t = e.stack
					}
					this.stack = t
				}
				return e(Object.create) && (t.prototype = Object.create(Error.prototype), t.prototype.constructor = t), t.prototype.toString = function ()
				{
					var t = this.name + ": " + this.message;
					return e(this.stack) && (t += "\n" + this.stack.toString()), t
				}, t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("29", ["20", "33", "1e", "15", "5", "6", "11", "d", "28", "2d"], function (e, t, n, i, r, o, s, a, u, c)
			{
				"use strict";

				function l(e, t, n, r, o, s, a, u, c, l, h, d, f, p, g, y)
				{
					this[0] = i(e, 0), this[1] = i(o, 0), this[2] = i(c, 0), this[3] = i(f, 0), this[4] = i(t, 0), this[5] = i(s, 0), this[6] = i(l, 0), this[7] = i(p, 0), this[8] = i(n, 0), this[9] = i(a, 0), this[10] = i(h, 0), this[11] = i(g, 0), this[12] = i(r, 0), this[13] = i(u, 0), this[14] = i(d, 0), this[15] = i(y, 0)
				}
				l.packedLength = 16, l.pack = function (e, t, r)
				{
					return n.typeOf.object("value", e), n.defined("array", t), r = i(r, 0), t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t[r++] = e[9], t[r++] = e[10], t[r++] = e[11], t[r++] = e[12], t[r++] = e[13], t[r++] = e[14], t[r] = e[15], t
				}, l.unpack = function (e, t, o)
				{
					return n.defined("array", e), t = i(t, 0), r(o) || (o = new l), o[0] = e[t++], o[1] = e[t++], o[2] = e[t++], o[3] = e[t++], o[4] = e[t++], o[5] = e[t++], o[6] = e[t++], o[7] = e[t++], o[8] = e[t++], o[9] = e[t++], o[10] = e[t++], o[11] = e[t++], o[12] = e[t++], o[13] = e[t++], o[14] = e[t++], o[15] = e[t], o
				}, l.clone = function (e, t)
				{
					if (r(e)) return r(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t) : new l(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15])
				}, l.fromArray = l.unpack, l.fromColumnMajorArray = function (e, t)
				{
					return n.defined("values", e), l.clone(e, t)
				}, l.fromRowMajorArray = function (e, t)
				{
					return n.defined("values", e), r(t) ? (t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15], t) : new l(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15])
				}, l.fromRotationTranslation = function (t, o, s)
				{
					return n.typeOf.object("rotation", t), o = i(o, e.ZERO), r(s) ? (s[0] = t[0], s[1] = t[1], s[2] = t[2], s[3] = 0, s[4] = t[3], s[5] = t[4], s[6] = t[5], s[7] = 0, s[8] = t[6], s[9] = t[7], s[10] = t[8], s[11] = 0, s[12] = o.x, s[13] = o.y, s[14] = o.z, s[15] = 1, s) : new l(t[0], t[3], t[6], o.x, t[1], t[4], t[7], o.y, t[2], t[5], t[8], o.z, 0, 0, 0, 1)
				}, l.fromTranslationQuaternionRotationScale = function (e, t, i, o)
				{
					n.typeOf.object("translation", e), n.typeOf.object("rotation", t), n.typeOf.object("scale", i), r(o) || (o = new l);
					var s = i.x,
						a = i.y,
						u = i.z,
						c = t.x * t.x,
						h = t.x * t.y,
						d = t.x * t.z,
						f = t.x * t.w,
						p = t.y * t.y,
						g = t.y * t.z,
						y = t.y * t.w,
						M = t.z * t.z,
						v = t.z * t.w,
						A = t.w * t.w,
						E = c - p - M + A,
						m = 2 * (h - v),
						w = 2 * (d + y),
						N = 2 * (h + v),
						D = -c + p - M + A,
						T = 2 * (g - f),
						I = 2 * (d - y),
						O = 2 * (g + f),
						S = -c - p + M + A;
					return o[0] = E * s, o[1] = N * s, o[2] = I * s, o[3] = 0, o[4] = m * a, o[5] = D * a, o[6] = O * a, o[7] = 0, o[8] = w * u, o[9] = T * u, o[10] = S * u, o[11] = 0, o[12] = e.x, o[13] = e.y, o[14] = e.z, o[15] = 1, o
				}, l.fromTranslationRotationScale = function (e, t)
				{
					return n.typeOf.object("translationRotationScale", e), l.fromTranslationQuaternionRotationScale(e.translation, e.rotation, e.scale, t)
				}, l.fromTranslation = function (e, t)
				{
					return n.typeOf.object("translation", e), l.fromRotationTranslation(u.IDENTITY, e, t)
				}, l.fromScale = function (e, t)
				{
					return n.typeOf.object("scale", e), r(t) ? (t[0] = e.x, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e.y, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = e.z, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t) : new l(e.x, 0, 0, 0, 0, e.y, 0, 0, 0, 0, e.z, 0, 0, 0, 0, 1)
				}, l.fromUniformScale = function (e, t)
				{
					return n.typeOf.number("scale", e), r(t) ? (t[0] = e, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = e, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t) : new l(e, 0, 0, 0, 0, e, 0, 0, 0, 0, e, 0, 0, 0, 0, 1)
				};
				var h = new e,
					d = new e,
					f = new e;
				l.fromCamera = function (t, i)
				{
					n.typeOf.object("camera", t);
					var o = t.position,
						s = t.direction,
						a = t.up;
					n.typeOf.object("camera.position", o), n.typeOf.object("camera.direction", s), n.typeOf.object("camera.up", a), e.normalize(s, h), e.normalize(e.cross(h, a, d), d), e.normalize(e.cross(d, h, f), f);
					var u = d.x,
						c = d.y,
						p = d.z,
						g = h.x,
						y = h.y,
						M = h.z,
						v = f.x,
						A = f.y,
						E = f.z,
						m = o.x,
						w = o.y,
						N = o.z,
						D = u * -m + c * -w + p * -N,
						T = v * -m + A * -w + E * -N,
						I = g * m + y * w + M * N;
					return r(i) ? (i[0] = u, i[1] = v, i[2] = -g, i[3] = 0, i[4] = c, i[5] = A, i[6] = -y, i[7] = 0, i[8] = p, i[9] = E, i[10] = -M, i[11] = 0, i[12] = D, i[13] = T, i[14] = I, i[15] = 1, i) : new l(u, c, p, D, v, A, E, T, -g, -y, -M, I, 0, 0, 0, 1)
				}, l.computePerspectiveFieldOfView = function (e, t, i, r, o)
				{
					n.typeOf.number.greaterThan("fovY", e, 0), n.typeOf.number.lessThan("fovY", e, Math.PI), n.typeOf.number.greaterThan("near", i, 0), n.typeOf.number.greaterThan("far", r, 0), n.typeOf.object("result", o);
					var s = 1 / Math.tan(.5 * e),
						a = s / t,
						u = (r + i) / (i - r),
						c = 2 * r * i / (i - r);
					return o[0] = a, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = s, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = u, o[11] = -1, o[12] = 0, o[13] = 0, o[14] = c, o[15] = 0, o
				}, l.computeOrthographicOffCenter = function (e, t, i, r, o, s, a)
				{
					n.typeOf.number("left", e), n.typeOf.number("right", t), n.typeOf.number("bottom", i), n.typeOf.number("top", r), n.typeOf.number("near", o), n.typeOf.number("far", s), n.typeOf.object("result", a);
					var u = 1 / (t - e),
						c = 1 / (r - i),
						l = 1 / (s - o),
						h = -(t + e) * u,
						d = -(r + i) * c,
						f = -(s + o) * l;
					return u *= 2, c *= 2, l *= -2, a[0] = u, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = c, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = l, a[11] = 0, a[12] = h, a[13] = d, a[14] = f, a[15] = 1, a
				}, l.computePerspectiveOffCenter = function (e, t, i, r, o, s, a)
				{
					n.typeOf.number("left", e), n.typeOf.number("right", t), n.typeOf.number("bottom", i), n.typeOf.number("top", r), n.typeOf.number("near", o), n.typeOf.number("far", s), n.typeOf.object("result", a);
					var u = 2 * o / (t - e),
						c = 2 * o / (r - i),
						l = (t + e) / (t - e),
						h = (r + i) / (r - i),
						d = -(s + o) / (s - o),
						f = -2 * s * o / (s - o);
					return a[0] = u, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = c, a[6] = 0, a[7] = 0, a[8] = l, a[9] = h, a[10] = d, a[11] = -1, a[12] = 0, a[13] = 0, a[14] = f, a[15] = 0, a
				}, l.computeInfinitePerspectiveOffCenter = function (e, t, i, r, o, s)
				{
					n.typeOf.number("left", e), n.typeOf.number("right", t), n.typeOf.number("bottom", i), n.typeOf.number("top", r), n.typeOf.number("near", o), n.typeOf.object("result", s);
					var a = 2 * o / (t - e),
						u = 2 * o / (r - i),
						c = (t + e) / (t - e),
						l = (r + i) / (r - i),
						h = -2 * o;
					return s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = c, s[9] = l, s[10] = -1, s[11] = -1, s[12] = 0, s[13] = 0, s[14] = h, s[15] = 0, s
				}, l.computeViewportTransformation = function (e, t, r, o)
				{
					n.typeOf.object("result", o), e = i(e, i.EMPTY_OBJECT);
					var s = i(e.x, 0),
						a = i(e.y, 0),
						u = i(e.width, 0),
						c = i(e.height, 0);
					t = i(t, 0);
					var l = .5 * u,
						h = .5 * c,
						d = .5 * ((r = i(r, 1)) - t),
						f = l,
						p = h,
						g = d,
						y = s + l,
						M = a + h,
						v = t + d;
					return o[0] = f, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = p, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = g, o[11] = 0, o[12] = y, o[13] = M, o[14] = v, o[15] = 1, o
				}, l.computeView = function (t, i, r, o, s)
				{
					return n.typeOf.object("position", t), n.typeOf.object("direction", i), n.typeOf.object("up", r), n.typeOf.object("right", o), n.typeOf.object("result", s), s[0] = o.x, s[1] = r.x, s[2] = -i.x, s[3] = 0, s[4] = o.y, s[5] = r.y, s[6] = -i.y, s[7] = 0, s[8] = o.z, s[9] = r.z, s[10] = -i.z, s[11] = 0, s[12] = -e.dot(o, t), s[13] = -e.dot(r, t), s[14] = e.dot(i, t), s[15] = 1, s
				}, l.toArray = function (e, t)
				{
					return n.typeOf.object("matrix", e), r(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t) : [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]]
				}, l.getElementIndex = function (e, t)
				{
					return n.typeOf.number.greaterThanOrEquals("row", t, 0), n.typeOf.number.lessThanOrEquals("row", t, 3), n.typeOf.number.greaterThanOrEquals("column", e, 0), n.typeOf.number.lessThanOrEquals("column", e, 3), 4 * e + t
				}, l.getColumn = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.number.greaterThanOrEquals("index", t, 0), n.typeOf.number.lessThanOrEquals("index", t, 3), n.typeOf.object("result", i);
					var r = 4 * t,
						o = e[r],
						s = e[r + 1],
						a = e[r + 2],
						u = e[r + 3];
					return i.x = o, i.y = s, i.z = a, i.w = u, i
				}, l.setColumn = function (e, t, i, r)
				{
					n.typeOf.object("matrix", e), n.typeOf.number.greaterThanOrEquals("index", t, 0), n.typeOf.number.lessThanOrEquals("index", t, 3), n.typeOf.object("cartesian", i), n.typeOf.object("result", r);
					var o = 4 * t;
					return (r = l.clone(e, r))[o] = i.x, r[o + 1] = i.y, r[o + 2] = i.z, r[o + 3] = i.w, r
				}, l.setTranslation = function (e, t, i)
				{
					return n.typeOf.object("matrix", e), n.typeOf.object("translation", t), n.typeOf.object("result", i), i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[8] = e[8], i[9] = e[9], i[10] = e[10], i[11] = e[11], i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = e[15], i
				}, l.getRow = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.number.greaterThanOrEquals("index", t, 0), n.typeOf.number.lessThanOrEquals("index", t, 3), n.typeOf.object("result", i);
					var r = e[t],
						o = e[t + 4],
						s = e[t + 8],
						a = e[t + 12];
					return i.x = r, i.y = o, i.z = s, i.w = a, i
				}, l.setRow = function (e, t, i, r)
				{
					return n.typeOf.object("matrix", e), n.typeOf.number.greaterThanOrEquals("index", t, 0), n.typeOf.number.lessThanOrEquals("index", t, 3), n.typeOf.object("cartesian", i), n.typeOf.object("result", r), r = l.clone(e, r), r[t] = i.x, r[t + 4] = i.y, r[t + 8] = i.z, r[t + 12] = i.w, r
				};
				var p = new e;
				l.getScale = function (t, i)
				{
					return n.typeOf.object("matrix", t), n.typeOf.object("result", i), i.x = e.magnitude(e.fromElements(t[0], t[1], t[2], p)), i.y = e.magnitude(e.fromElements(t[4], t[5], t[6], p)), i.z = e.magnitude(e.fromElements(t[8], t[9], t[10], p)), i
				};
				var g = new e;
				l.getMaximumScale = function (t)
				{
					return l.getScale(t, g), e.maximumComponent(g)
				}, l.multiply = function (e, t, i)
				{
					n.typeOf.object("left", e), n.typeOf.object("right", t), n.typeOf.object("result", i);
					var r = e[0],
						o = e[1],
						s = e[2],
						a = e[3],
						u = e[4],
						c = e[5],
						l = e[6],
						h = e[7],
						d = e[8],
						f = e[9],
						p = e[10],
						g = e[11],
						y = e[12],
						M = e[13],
						v = e[14],
						A = e[15],
						E = t[0],
						m = t[1],
						w = t[2],
						N = t[3],
						D = t[4],
						T = t[5],
						I = t[6],
						O = t[7],
						S = t[8],
						_ = t[9],
						L = t[10],
						j = t[11],
						x = t[12],
						b = t[13],
						C = t[14],
						R = t[15],
						z = r * E + u * m + d * w + y * N,
						P = o * E + c * m + f * w + M * N,
						U = s * E + l * m + p * w + v * N,
						k = a * E + h * m + g * w + A * N,
						B = r * D + u * T + d * I + y * O,
						F = o * D + c * T + f * I + M * O,
						Q = s * D + l * T + p * I + v * O,
						Y = a * D + h * T + g * I + A * O,
						G = r * S + u * _ + d * L + y * j,
						V = o * S + c * _ + f * L + M * j,
						q = s * S + l * _ + p * L + v * j,
						H = a * S + h * _ + g * L + A * j,
						W = r * x + u * b + d * C + y * R,
						X = o * x + c * b + f * C + M * R,
						Z = s * x + l * b + p * C + v * R,
						K = a * x + h * b + g * C + A * R;
					return i[0] = z, i[1] = P, i[2] = U, i[3] = k, i[4] = B, i[5] = F, i[6] = Q, i[7] = Y, i[8] = G, i[9] = V, i[10] = q, i[11] = H, i[12] = W, i[13] = X, i[14] = Z, i[15] = K, i
				}, l.add = function (e, t, i)
				{
					return n.typeOf.object("left", e), n.typeOf.object("right", t), n.typeOf.object("result", i), i[0] = e[0] + t[0], i[1] = e[1] + t[1], i[2] = e[2] + t[2], i[3] = e[3] + t[3], i[4] = e[4] + t[4], i[5] = e[5] + t[5], i[6] = e[6] + t[6], i[7] = e[7] + t[7], i[8] = e[8] + t[8], i[9] = e[9] + t[9], i[10] = e[10] + t[10], i[11] = e[11] + t[11], i[12] = e[12] + t[12], i[13] = e[13] + t[13], i[14] = e[14] + t[14], i[15] = e[15] + t[15], i
				}, l.subtract = function (e, t, i)
				{
					return n.typeOf.object("left", e), n.typeOf.object("right", t), n.typeOf.object("result", i), i[0] = e[0] - t[0], i[1] = e[1] - t[1], i[2] = e[2] - t[2], i[3] = e[3] - t[3], i[4] = e[4] - t[4], i[5] = e[5] - t[5], i[6] = e[6] - t[6], i[7] = e[7] - t[7], i[8] = e[8] - t[8], i[9] = e[9] - t[9], i[10] = e[10] - t[10], i[11] = e[11] - t[11], i[12] = e[12] - t[12], i[13] = e[13] - t[13], i[14] = e[14] - t[14], i[15] = e[15] - t[15], i
				}, l.multiplyTransformation = function (e, t, i)
				{
					n.typeOf.object("left", e), n.typeOf.object("right", t), n.typeOf.object("result", i);
					var r = e[0],
						o = e[1],
						s = e[2],
						a = e[4],
						u = e[5],
						c = e[6],
						l = e[8],
						h = e[9],
						d = e[10],
						f = e[12],
						p = e[13],
						g = e[14],
						y = t[0],
						M = t[1],
						v = t[2],
						A = t[4],
						E = t[5],
						m = t[6],
						w = t[8],
						N = t[9],
						D = t[10],
						T = t[12],
						I = t[13],
						O = t[14],
						S = r * y + a * M + l * v,
						_ = o * y + u * M + h * v,
						L = s * y + c * M + d * v,
						j = r * A + a * E + l * m,
						x = o * A + u * E + h * m,
						b = s * A + c * E + d * m,
						C = r * w + a * N + l * D,
						R = o * w + u * N + h * D,
						z = s * w + c * N + d * D,
						P = r * T + a * I + l * O + f,
						U = o * T + u * I + h * O + p,
						k = s * T + c * I + d * O + g;
					return i[0] = S, i[1] = _, i[2] = L, i[3] = 0, i[4] = j, i[5] = x, i[6] = b, i[7] = 0, i[8] = C, i[9] = R, i[10] = z, i[11] = 0, i[12] = P, i[13] = U, i[14] = k, i[15] = 1, i
				}, l.multiplyByMatrix3 = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("rotation", t), n.typeOf.object("result", i);
					var r = e[0],
						o = e[1],
						s = e[2],
						a = e[4],
						u = e[5],
						c = e[6],
						l = e[8],
						h = e[9],
						d = e[10],
						f = t[0],
						p = t[1],
						g = t[2],
						y = t[3],
						M = t[4],
						v = t[5],
						A = t[6],
						E = t[7],
						m = t[8],
						w = r * f + a * p + l * g,
						N = o * f + u * p + h * g,
						D = s * f + c * p + d * g,
						T = r * y + a * M + l * v,
						I = o * y + u * M + h * v,
						O = s * y + c * M + d * v,
						S = r * A + a * E + l * m,
						_ = o * A + u * E + h * m,
						L = s * A + c * E + d * m;
					return i[0] = w, i[1] = N, i[2] = D, i[3] = 0, i[4] = T, i[5] = I, i[6] = O, i[7] = 0, i[8] = S, i[9] = _, i[10] = L, i[11] = 0, i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15], i
				}, l.multiplyByTranslation = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("translation", t), n.typeOf.object("result", i);
					var r = t.x,
						o = t.y,
						s = t.z,
						a = r * e[0] + o * e[4] + s * e[8] + e[12],
						u = r * e[1] + o * e[5] + s * e[9] + e[13],
						c = r * e[2] + o * e[6] + s * e[10] + e[14];
					return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[8] = e[8], i[9] = e[9], i[10] = e[10], i[11] = e[11], i[12] = a, i[13] = u, i[14] = c, i[15] = e[15], i
				};
				var y = new e;
				l.multiplyByUniformScale = function (e, t, i)
				{
					return n.typeOf.object("matrix", e), n.typeOf.number("scale", t), n.typeOf.object("result", i), y.x = t, y.y = t, y.z = t, l.multiplyByScale(e, y, i)
				}, l.multiplyByScale = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("scale", t), n.typeOf.object("result", i);
					var r = t.x,
						o = t.y,
						s = t.z;
					return 1 === r && 1 === o && 1 === s ? l.clone(e, i) : (i[0] = r * e[0], i[1] = r * e[1], i[2] = r * e[2], i[3] = 0, i[4] = o * e[4], i[5] = o * e[5], i[6] = o * e[6], i[7] = 0, i[8] = s * e[8], i[9] = s * e[9], i[10] = s * e[10], i[11] = 0, i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = 1, i)
				}, l.multiplyByVector = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("cartesian", t), n.typeOf.object("result", i);
					var r = t.x,
						o = t.y,
						s = t.z,
						a = t.w,
						u = e[0] * r + e[4] * o + e[8] * s + e[12] * a,
						c = e[1] * r + e[5] * o + e[9] * s + e[13] * a,
						l = e[2] * r + e[6] * o + e[10] * s + e[14] * a,
						h = e[3] * r + e[7] * o + e[11] * s + e[15] * a;
					return i.x = u, i.y = c, i.z = l, i.w = h, i
				}, l.multiplyByPointAsVector = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("cartesian", t), n.typeOf.object("result", i);
					var r = t.x,
						o = t.y,
						s = t.z,
						a = e[0] * r + e[4] * o + e[8] * s,
						u = e[1] * r + e[5] * o + e[9] * s,
						c = e[2] * r + e[6] * o + e[10] * s;
					return i.x = a, i.y = u, i.z = c, i
				}, l.multiplyByPoint = function (e, t, i)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("cartesian", t), n.typeOf.object("result", i);
					var r = t.x,
						o = t.y,
						s = t.z,
						a = e[0] * r + e[4] * o + e[8] * s + e[12],
						u = e[1] * r + e[5] * o + e[9] * s + e[13],
						c = e[2] * r + e[6] * o + e[10] * s + e[14];
					return i.x = a, i.y = u, i.z = c, i
				}, l.multiplyByScalar = function (e, t, i)
				{
					return n.typeOf.object("matrix", e), n.typeOf.number("scalar", t), n.typeOf.object("result", i), i[0] = e[0] * t, i[1] = e[1] * t, i[2] = e[2] * t, i[3] = e[3] * t, i[4] = e[4] * t, i[5] = e[5] * t, i[6] = e[6] * t, i[7] = e[7] * t, i[8] = e[8] * t, i[9] = e[9] * t, i[10] = e[10] * t, i[11] = e[11] * t, i[12] = e[12] * t, i[13] = e[13] * t, i[14] = e[14] * t, i[15] = e[15] * t, i
				}, l.negate = function (e, t)
				{
					return n.typeOf.object("matrix", e), n.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t[9] = -e[9], t[10] = -e[10], t[11] = -e[11], t[12] = -e[12], t[13] = -e[13], t[14] = -e[14], t[15] = -e[15], t
				}, l.transpose = function (e, t)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("result", t);
					var i = e[1],
						r = e[2],
						o = e[3],
						s = e[6],
						a = e[7],
						u = e[11];
					return t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = i, t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = r, t[9] = s, t[10] = e[10], t[11] = e[14], t[12] = o, t[13] = a, t[14] = u, t[15] = e[15], t
				}, l.abs = function (e, t)
				{
					return n.typeOf.object("matrix", e), n.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t[9] = Math.abs(e[9]), t[10] = Math.abs(e[10]), t[11] = Math.abs(e[11]), t[12] = Math.abs(e[12]), t[13] = Math.abs(e[13]), t[14] = Math.abs(e[14]), t[15] = Math.abs(e[15]), t
				}, l.equals = function (e, t)
				{
					return e === t || r(e) && r(t) && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[3] === t[3] && e[7] === t[7] && e[11] === t[11] && e[15] === t[15]
				}, l.equalsEpsilon = function (e, t, i)
				{
					return n.typeOf.number("epsilon", i), e === t || r(e) && r(t) && Math.abs(e[0] - t[0]) <= i && Math.abs(e[1] - t[1]) <= i && Math.abs(e[2] - t[2]) <= i && Math.abs(e[3] - t[3]) <= i && Math.abs(e[4] - t[4]) <= i && Math.abs(e[5] - t[5]) <= i && Math.abs(e[6] - t[6]) <= i && Math.abs(e[7] - t[7]) <= i && Math.abs(e[8] - t[8]) <= i && Math.abs(e[9] - t[9]) <= i && Math.abs(e[10] - t[10]) <= i && Math.abs(e[11] - t[11]) <= i && Math.abs(e[12] - t[12]) <= i && Math.abs(e[13] - t[13]) <= i && Math.abs(e[14] - t[14]) <= i && Math.abs(e[15] - t[15]) <= i
				}, l.getTranslation = function (e, t)
				{
					return n.typeOf.object("matrix", e), n.typeOf.object("result", t), t.x = e[12], t.y = e[13], t.z = e[14], t
				}, l.getRotation = function (e, t)
				{
					return n.typeOf.object("matrix", e), n.typeOf.object("result", t), t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t
				};
				var M = new u,
					v = new u,
					A = new t,
					E = new t(0, 0, 0, 1);
				return l.inverse = function (e, i)
				{
					if (n.typeOf.object("matrix", e), n.typeOf.object("result", i), u.equalsEpsilon(l.getRotation(e, M), v, a.EPSILON7) && t.equals(l.getRow(e, 3, A), E)) return i[0] = 0, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = 0, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = 0, i[11] = 0, i[12] = -e[12], i[13] = -e[13], i[14] = -e[14], i[15] = 1, i;
					var r = e[0],
						o = e[4],
						s = e[8],
						h = e[12],
						d = e[1],
						f = e[5],
						p = e[9],
						g = e[13],
						y = e[2],
						m = e[6],
						w = e[10],
						N = e[14],
						D = e[3],
						T = e[7],
						I = e[11],
						O = e[15],
						S = w * O,
						_ = N * I,
						L = m * O,
						j = N * T,
						x = m * I,
						b = w * T,
						C = y * O,
						R = N * D,
						z = y * I,
						P = w * D,
						U = y * T,
						k = m * D,
						B = S * f + j * p + x * g - (_ * f + L * p + b * g),
						F = _ * d + C * p + P * g - (S * d + R * p + z * g),
						Q = L * d + R * f + U * g - (j * d + C * f + k * g),
						Y = b * d + z * f + k * p - (x * d + P * f + U * p),
						G = _ * o + L * s + b * h - (S * o + j * s + x * h),
						V = S * r + R * s + z * h - (_ * r + C * s + P * h),
						q = j * r + C * o + k * h - (L * r + R * o + U * h),
						H = x * r + P * o + U * s - (b * r + z * o + k * s),
						W = (S = s * g) * T + (j = h * f) * I + (x = o * p) * O - ((_ = h * p) * T + (L = o * g) * I + (b = s * f) * O),
						X = _ * D + (C = r * g) * I + (P = s * d) * O - (S * D + (R = h * d) * I + (z = r * p) * O),
						Z = L * D + R * T + (U = r * f) * O - (j * D + C * T + (k = o * d) * O),
						K = b * D + z * T + k * I - (x * D + P * T + U * I),
						J = L * w + b * N + _ * m - (x * N + S * m + j * w),
						$ = z * N + S * y + R * w - (C * w + P * N + _ * y),
						ee = C * m + k * N + j * y - (U * N + L * y + R * m),
						te = U * w + x * y + P * m - (z * m + k * w + b * y),
						ne = r * B + o * F + s * Q + h * Y;
					if (Math.abs(ne) < a.EPSILON20) throw new c("matrix is not invertible because its determinate is zero.");
					return ne = 1 / ne, i[0] = B * ne, i[1] = F * ne, i[2] = Q * ne, i[3] = Y * ne, i[4] = G * ne, i[5] = V * ne, i[6] = q * ne, i[7] = H * ne, i[8] = W * ne, i[9] = X * ne, i[10] = Z * ne, i[11] = K * ne, i[12] = J * ne, i[13] = $ * ne, i[14] = ee * ne, i[15] = te * ne, i
				}, l.inverseTransformation = function (e, t)
				{
					n.typeOf.object("matrix", e), n.typeOf.object("result", t);
					var i = e[0],
						r = e[1],
						o = e[2],
						s = e[4],
						a = e[5],
						u = e[6],
						c = e[8],
						l = e[9],
						h = e[10],
						d = e[12],
						f = e[13],
						p = e[14],
						g = -i * d - r * f - o * p,
						y = -s * d - a * f - u * p,
						M = -c * d - l * f - h * p;
					return t[0] = i, t[1] = s, t[2] = c, t[3] = 0, t[4] = r, t[5] = a, t[6] = l, t[7] = 0, t[8] = o, t[9] = u, t[10] = h, t[11] = 0, t[12] = g, t[13] = y, t[14] = M, t[15] = 1, t
				}, l.IDENTITY = s(new l(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)), l.ZERO = s(new l(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)), l.COLUMN0ROW0 = 0, l.COLUMN0ROW1 = 1, l.COLUMN0ROW2 = 2, l.COLUMN0ROW3 = 3, l.COLUMN1ROW0 = 4, l.COLUMN1ROW1 = 5, l.COLUMN1ROW2 = 6, l.COLUMN1ROW3 = 7, l.COLUMN2ROW0 = 8, l.COLUMN2ROW1 = 9, l.COLUMN2ROW2 = 10, l.COLUMN2ROW3 = 11, l.COLUMN3ROW0 = 12, l.COLUMN3ROW1 = 13, l.COLUMN3ROW2 = 14, l.COLUMN3ROW3 = 15, o(l.prototype,
				{
					length:
					{
						get: function ()
						{
							return l.packedLength
						}
					}
				}), l.prototype.clone = function (e)
				{
					return l.clone(this, e)
				}, l.prototype.equals = function (e)
				{
					return l.equals(this, e)
				}, l.equalsArray = function (e, t, n)
				{
					return e[0] === t[n] && e[1] === t[n + 1] && e[2] === t[n + 2] && e[3] === t[n + 3] && e[4] === t[n + 4] && e[5] === t[n + 5] && e[6] === t[n + 6] && e[7] === t[n + 7] && e[8] === t[n + 8] && e[9] === t[n + 9] && e[10] === t[n + 10] && e[11] === t[n + 11] && e[12] === t[n + 12] && e[13] === t[n + 13] && e[14] === t[n + 14] && e[15] === t[n + 15]
				}, l.prototype.equalsEpsilon = function (e, t)
				{
					return l.equalsEpsilon(this, e, t)
				}, l.prototype.toString = function ()
				{
					return "(" + this[0] + ", " + this[4] + ", " + this[8] + ", " + this[12] + ")\n(" + this[1] + ", " + this[5] + ", " + this[9] + ", " + this[13] + ")\n(" + this[2] + ", " + this[6] + ", " + this[10] + ", " + this[14] + ")\n(" + this[3] + ", " + this[7] + ", " + this[11] + ", " + this[15] + ")"
				}, l
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("7d", ["11"], function (e)
			{
				"use strict";
				return e(
				{
					NONE: 0,
					BITS12: 1
				})
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("74", ["79", "a", "20", "7c", "15", "5", "d", "29", "7d"], function (e, t, n, i, r, o, s, a, u)
			{
				"use strict";

				function c(e, t, i, s, c, d)
				{
					var y, M, v, A;
					if (o(e) && o(t) && o(i) && o(s))
					{
						var E = e.minimum,
							m = e.maximum,
							w = n.subtract(m, E, h),
							N = i - t;
						y = Math.max(n.maximumComponent(w), N) < g - 1 ? u.BITS12 : u.NONE, M = e.center, v = a.inverseTransformation(s, new a);
						var D = n.negate(E, l);
						a.multiply(a.fromTranslation(D, f), v, v);
						var T = l;
						T.x = 1 / w.x, T.y = 1 / w.y, T.z = 1 / w.z, a.multiply(a.fromScale(T, f), v, v), A = a.clone(s), a.setTranslation(A, n.ZERO, A), s = a.clone(s, new a);
						var I = a.fromTranslation(E, f),
							O = a.fromScale(w, p),
							S = a.multiply(I, O, f);
						a.multiply(s, S, s), a.multiply(A, S, A)
					}
					this.quantization = y, this.minimumHeight = t, this.maximumHeight = i, this.center = M, this.toScaledENU = v, this.fromScaledENU = s, this.matrix = A, this.hasVertexNormals = c, this.hasWebMercatorT = r(d, !1)
				}
				var l = new n,
					h = new n,
					d = new t,
					f = new a,
					p = new a,
					g = Math.pow(2, 12);
				c.prototype.encode = function (i, r, o, c, h, f, p)
				{
					var g = c.x,
						y = c.y;
					if (this.quantization === u.BITS12)
					{
						(o = a.multiplyByPoint(this.toScaledENU, o, l)).x = s.clamp(o.x, 0, 1), o.y = s.clamp(o.y, 0, 1), o.z = s.clamp(o.z, 0, 1);
						var M = this.maximumHeight - this.minimumHeight,
							v = s.clamp((h - this.minimumHeight) / M, 0, 1);
						t.fromElements(o.x, o.y, d);
						var A = e.compressTextureCoordinates(d);
						t.fromElements(o.z, v, d);
						var E = e.compressTextureCoordinates(d);
						t.fromElements(g, y, d);
						var m = e.compressTextureCoordinates(d);
						if (i[r++] = A, i[r++] = E, i[r++] = m, this.hasWebMercatorT)
						{
							t.fromElements(p, 0, d);
							var w = e.compressTextureCoordinates(d);
							i[r++] = w
						}
					}
					else n.subtract(o, this.center, l), i[r++] = l.x, i[r++] = l.y, i[r++] = l.z, i[r++] = h, i[r++] = g, i[r++] = y, this.hasWebMercatorT && (i[r++] = p);
					return this.hasVertexNormals && (i[r++] = e.octPackFloat(f)), r
				}, c.prototype.decodePosition = function (t, i, r)
				{
					if (o(r) || (r = new n), i *= this.getStride(), this.quantization === u.BITS12)
					{
						var s = e.decompressTextureCoordinates(t[i], d);
						r.x = s.x, r.y = s.y;
						var c = e.decompressTextureCoordinates(t[i + 1], d);
						return r.z = c.x, a.multiplyByPoint(this.fromScaledENU, r, r)
					}
					return r.x = t[i], r.y = t[i + 1], r.z = t[i + 2], n.add(r, this.center, r)
				}, c.prototype.decodeTextureCoordinates = function (n, i, r)
				{
					return o(r) || (r = new t), i *= this.getStride(), this.quantization === u.BITS12 ? e.decompressTextureCoordinates(n[i + 2], r) : t.fromElements(n[i + 4], n[i + 5], r)
				}, c.prototype.decodeHeight = function (t, n)
				{
					return n *= this.getStride(), this.quantization === u.BITS12 ? e.decompressTextureCoordinates(t[n + 1], d).y * (this.maximumHeight - this.minimumHeight) + this.minimumHeight : t[n + 3]
				}, c.prototype.getOctEncodedNormal = function (e, n, i)
				{
					var r = e[n = (n + 1) * this.getStride() - 1] / 256,
						o = Math.floor(r),
						s = 256 * (r - o);
					return t.fromElements(o, s, i)
				}, c.prototype.getStride = function ()
				{
					var e;
					switch (this.quantization)
					{
					case u.BITS12:
						e = 3;
						break;
					default:
						e = 6
					}
					return this.hasWebMercatorT && ++e, this.hasVertexNormals && ++e, e
				};
				var y = {
						position3DAndHeight: 0,
						textureCoordAndEncodedNormals: 1
					},
					M = {
						compressed0: 0,
						compressed1: 1
					};
				return c.prototype.getAttributes = function (e)
				{
					var t, n = i.FLOAT,
						r = i.getSizeInBytes(n);
					if (this.quantization === u.NONE)
					{
						var o = 2;
						return this.hasWebMercatorT && ++o, this.hasVertexNormals && ++o, t = (4 + o) * r, [
						{
							index: y.position3DAndHeight,
							vertexBuffer: e,
							componentDatatype: n,
							componentsPerAttribute: 4,
							offsetInBytes: 0,
							strideInBytes: t
						},
						{
							index: y.textureCoordAndEncodedNormals,
							vertexBuffer: e,
							componentDatatype: n,
							componentsPerAttribute: o,
							offsetInBytes: 4 * r,
							strideInBytes: t
						}]
					}
					var s = 3,
						a = 0;
					return (this.hasWebMercatorT || this.hasVertexNormals) && ++s, this.hasWebMercatorT && this.hasVertexNormals ? (++a, t = (s + a) * r, [
					{
						index: M.compressed0,
						vertexBuffer: e,
						componentDatatype: n,
						componentsPerAttribute: s,
						offsetInBytes: 0,
						strideInBytes: t
					},
					{
						index: M.compressed1,
						vertexBuffer: e,
						componentDatatype: n,
						componentsPerAttribute: a,
						offsetInBytes: s * r,
						strideInBytes: t
					}]) : [
					{
						index: M.compressed0,
						vertexBuffer: e,
						componentDatatype: n,
						componentsPerAttribute: s
					}]
				}, c.prototype.getAttributeLocations = function ()
				{
					return this.quantization === u.NONE ? y : M
				}, c.clone = function (e, t)
				{
					return o(t) || (t = new c), t.quantization = e.quantization, t.minimumHeight = e.minimumHeight, t.maximumHeight = e.maximumHeight, t.center = n.clone(e.center), t.toScaledENU = a.clone(e.toScaledENU), t.fromScaledENU = a.clone(e.fromScaledENU), t.matrix = a.clone(e.matrix), t.hasVertexNormals = e.hasVertexNormals, t.hasWebMercatorT = e.hasWebMercatorT, t
				}, c
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("7e", ["15"], function (e)
			{
				"use strict";

				function t(t, n, i, r, o, s, a, u, c, l, h)
				{
					this.center = t, this.vertices = n, this.stride = e(u, 6), this.indices = i, this.minimumHeight = r, this.maximumHeight = o, this.boundingSphere3D = s, this.occludeePointInScaledSpace = a, this.orientedBoundingBox = c, this.encoding = l, this.exaggeration = h
				}
				return t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("7f", [], function ()
			{
				var e = function (e)
				{
					void 0 == e && (e = (new Date).getTime()), this.N = 624, this.M = 397, this.MATRIX_A = 2567483615, this.UPPER_MASK = 2147483648, this.LOWER_MASK = 2147483647, this.mt = new Array(this.N), this.mti = this.N + 1, this.init_genrand(e)
				};
				return e.prototype.init_genrand = function (e)
				{
					for (this.mt[0] = e >>> 0, this.mti = 1; this.mti < this.N; this.mti++)
					{
						var e = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
						this.mt[this.mti] = (1812433253 * ((4294901760 & e) >>> 16) << 16) + 1812433253 * (65535 & e) + this.mti, this.mt[this.mti] >>>= 0
					}
				}, e.prototype.genrand_int32 = function ()
				{
					var e, t = new Array(0, this.MATRIX_A);
					if (this.mti >= this.N)
					{
						var n;
						for (this.mti == this.N + 1 && this.init_genrand(5489), n = 0; n < this.N - this.M; n++) e = this.mt[n] & this.UPPER_MASK | this.mt[n + 1] & this.LOWER_MASK, this.mt[n] = this.mt[n + this.M] ^ e >>> 1 ^ t[1 & e];
						for (; n < this.N - 1; n++) e = this.mt[n] & this.UPPER_MASK | this.mt[n + 1] & this.LOWER_MASK, this.mt[n] = this.mt[n + (this.M - this.N)] ^ e >>> 1 ^ t[1 & e];
						e = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK, this.mt[this.N - 1] = this.mt[this.M - 1] ^ e >>> 1 ^ t[1 & e], this.mti = 0
					}
					return e = this.mt[this.mti++], e ^= e >>> 11, e ^= e << 7 & 2636928640, e ^= e << 15 & 4022730752, (e ^= e >>> 18) >>> 0
				}, e.prototype.random = function ()
				{
					return this.genrand_int32() * (1 / 4294967296)
				}, e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("11", ["5"], function (e)
			{
				"use strict";
				var t = Object.freeze;
				return e(t) || (t = function (e)
				{
					return e
				}), t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("15", ["11"], function (e)
			{
				"use strict";

				function t(e, t)
				{
					return void 0 !== e && null !== e ? e : t
				}
				return t.EMPTY_OBJECT = e(
				{}), t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("d", ["7f", "15", "5", "7"], function (e, t, n, i)
			{
				"use strict";
				var r = {};
				r.EPSILON1 = .1, r.EPSILON2 = .01, r.EPSILON3 = .001, r.EPSILON4 = 1e-4, r.EPSILON5 = 1e-5, r.EPSILON6 = 1e-6, r.EPSILON7 = 1e-7, r.EPSILON8 = 1e-8, r.EPSILON9 = 1e-9, r.EPSILON10 = 1e-10, r.EPSILON11 = 1e-11, r.EPSILON12 = 1e-12, r.EPSILON13 = 1e-13, r.EPSILON14 = 1e-14, r.EPSILON15 = 1e-15, r.EPSILON16 = 1e-16, r.EPSILON17 = 1e-17, r.EPSILON18 = 1e-18, r.EPSILON19 = 1e-19, r.EPSILON20 = 1e-20, r.GRAVITATIONALPARAMETER = 3986004418e5, r.SOLAR_RADIUS = 6955e5, r.LUNAR_RADIUS = 1737400, r.SIXTY_FOUR_KILOBYTES = 65536, r.sign = function (e)
				{
					return e > 0 ? 1 : e < 0 ? -1 : 0
				}, r.signNotZero = function (e)
				{
					return e < 0 ? -1 : 1
				}, r.toSNorm = function (e, n)
				{
					return n = t(n, 255), Math.round((.5 * r.clamp(e, -1, 1) + .5) * n)
				}, r.fromSNorm = function (e, n)
				{
					return n = t(n, 255), r.clamp(e, 0, n) / n * 2 - 1
				}, r.sinh = function (e)
				{
					return .5 * (Math.pow(Math.E, e) - Math.pow(Math.E, -1 * e))
				}, r.cosh = function (e)
				{
					return .5 * (Math.pow(Math.E, e) + Math.pow(Math.E, -1 * e))
				}, r.lerp = function (e, t, n)
				{
					return (1 - n) * e + n * t
				}, r.PI = Math.PI, r.ONE_OVER_PI = 1 / Math.PI, r.PI_OVER_TWO = .5 * Math.PI, r.PI_OVER_THREE = Math.PI / 3, r.PI_OVER_FOUR = Math.PI / 4, r.PI_OVER_SIX = Math.PI / 6, r.THREE_PI_OVER_TWO = 3 * Math.PI * .5, r.TWO_PI = 2 * Math.PI, r.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), r.RADIANS_PER_DEGREE = Math.PI / 180, r.DEGREES_PER_RADIAN = 180 / Math.PI, r.RADIANS_PER_ARCSECOND = r.RADIANS_PER_DEGREE / 3600, r.toRadians = function (e)
				{
					if (!n(e)) throw new i("degrees is required.");
					return e * r.RADIANS_PER_DEGREE
				}, r.toDegrees = function (e)
				{
					if (!n(e)) throw new i("radians is required.");
					return e * r.DEGREES_PER_RADIAN
				}, r.convertLongitudeRange = function (e)
				{
					if (!n(e)) throw new i("angle is required.");
					var t = r.TWO_PI,
						o = e - Math.floor(e / t) * t;
					return o < -Math.PI ? o + t : o >= Math.PI ? o - t : o
				}, r.clampToLatitudeRange = function (e)
				{
					if (!n(e)) throw new i("angle is required.");
					return r.clamp(e, -1 * r.PI_OVER_TWO, r.PI_OVER_TWO)
				}, r.negativePiToPi = function (e)
				{
					if (!n(e)) throw new i("angle is required.");
					return r.zeroToTwoPi(e + r.PI) - r.PI
				}, r.zeroToTwoPi = function (e)
				{
					if (!n(e)) throw new i("angle is required.");
					var t = r.mod(e, r.TWO_PI);
					return Math.abs(t) < r.EPSILON14 && Math.abs(e) > r.EPSILON14 ? r.TWO_PI : t
				}, r.mod = function (e, t)
				{
					if (!n(e)) throw new i("m is required.");
					if (!n(t)) throw new i("n is required.");
					return (e % t + t) % t
				}, r.equalsEpsilon = function (e, r, o, s)
				{
					if (!n(e)) throw new i("left is required.");
					if (!n(r)) throw new i("right is required.");
					if (!n(o)) throw new i("relativeEpsilon is required.");
					s = t(s, o);
					var a = Math.abs(e - r);
					return a <= s || a <= o * Math.max(Math.abs(e), Math.abs(r))
				};
				var o = [1];
				r.factorial = function (e)
				{
					if ("number" != typeof e || e < 0) throw new i("A number greater than or equal to 0 is required.");
					var t = o.length;
					if (e >= t)
						for (var n = o[t - 1], r = t; r <= e; r++) o.push(n * r);
					return o[e]
				}, r.incrementWrap = function (e, r, o)
				{
					if (o = t(o, 0), !n(e)) throw new i("n is required.");
					if (r <= o) throw new i("maximumValue must be greater than minimumValue.");
					return ++e > r && (e = o), e
				}, r.isPowerOfTwo = function (e)
				{
					if ("number" != typeof e || e < 0) throw new i("A number greater than or equal to 0 is required.");
					return 0 !== e && 0 == (e & e - 1)
				}, r.nextPowerOfTwo = function (e)
				{
					if ("number" != typeof e || e < 0) throw new i("A number greater than or equal to 0 is required.");
					return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e
				}, r.clamp = function (e, t, r)
				{
					if (!n(e)) throw new i("value is required");
					if (!n(t)) throw new i("min is required.");
					if (!n(r)) throw new i("max is required.");
					return e < t ? t : e > r ? r : e
				};
				var s = new e;
				return r.setRandomNumberSeed = function (t)
				{
					if (!n(t)) throw new i("seed is required.");
					s = new e(t)
				}, r.nextRandomNumber = function ()
				{
					return s.random()
				}, r.randomBetween = function (e, t)
				{
					return r.nextRandomNumber() * (t - e) + e
				}, r.acosClamped = function (e)
				{
					if (!n(e)) throw new i("value is required.");
					return Math.acos(r.clamp(e, -1, 1))
				}, r.asinClamped = function (e)
				{
					if (!n(e)) throw new i("value is required.");
					return Math.asin(r.clamp(e, -1, 1))
				}, r.chordLength = function (e, t)
				{
					if (!n(e)) throw new i("angle is required.");
					if (!n(t)) throw new i("radius is required.");
					return 2 * t * Math.sin(.5 * e)
				}, r.logBase = function (e, t)
				{
					if (!n(e)) throw new i("number is required.");
					if (!n(t)) throw new i("base is required.");
					return Math.log(e) / Math.log(t)
				}, r.fog = function (e, t)
				{
					var n = e * t;
					return 1 - Math.exp(-n * n)
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("80", ["5", "6", "7", "d"], function (e, t, n, i)
			{
				"use strict";

				function r()
				{
					n.throwInstantiationError()
				}
				t(r.prototype,
				{
					errorEvent:
					{
						get: n.throwInstantiationError
					},
					credit:
					{
						get: n.throwInstantiationError
					},
					tilingScheme:
					{
						get: n.throwInstantiationError
					},
					ready:
					{
						get: n.throwInstantiationError
					},
					readyPromise:
					{
						get: n.throwInstantiationError
					},
					hasWaterMask:
					{
						get: n.throwInstantiationError
					},
					hasVertexNormals:
					{
						get: n.throwInstantiationError
					},
					availability:
					{
						get: n.throwInstantiationError
					}
				});
				var o = [];
				return r.getRegularGridIndices = function (t, r)
				{
					if (t * r >= i.SIXTY_FOUR_KILOBYTES) throw new n("The total number of vertices (width * height) must be less than 65536.");
					var s = o[t];
					e(s) || (o[t] = s = []);
					var a = s[r];
					if (!e(a))
					{
						a = s[r] = new Uint16Array((t - 1) * (r - 1) * 6);
						for (var u = 0, c = 0, l = 0; l < r - 1; ++l)
						{
							for (var h = 0; h < t - 1; ++h)
							{
								var d = u,
									f = d + t,
									p = f + 1,
									g = d + 1;
								a[c++] = d, a[c++] = f, a[c++] = g, a[c++] = g, a[c++] = f, a[c++] = p, ++u
							}++u
						}
					}
					return a
				}, r.heightmapTerrainQuality = .25, r.getEstimatedLevelZeroGeometricErrorForAHeightmap = function (e, t, n)
				{
					return 2 * e.maximumRadius * Math.PI * r.heightmapTerrainQuality / (t * n)
				}, r.prototype.requestTileGeometry = n.throwInstantiationError, r.prototype.getLevelMaximumGeometricError = n.throwInstantiationError, r.prototype.getTileDataAvailable = n.throwInstantiationError, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("81", ["48", "15", "5", "6", "7", "52", "73", "d", "4f", "78", "74", "7e", "80"], function (e, t, n, i, r, o, s, a, u, c, l, h, d)
			{
				"use strict";

				function f(e)
				{
					if (!n(e) || !n(e.buffer)) throw new r("options.buffer is required.");
					if (!n(e.width)) throw new r("options.width is required.");
					if (!n(e.height)) throw new r("options.height is required.");
					this._buffer = e.buffer, this._width = e.width, this._height = e.height, this._childTileMask = t(e.childTileMask, 15);
					var i = s.DEFAULT_STRUCTURE,
						o = e.structure;
					n(o) ? o !== i && (o.heightScale = t(o.heightScale, i.heightScale), o.heightOffset = t(o.heightOffset, i.heightOffset), o.elementsPerHeight = t(o.elementsPerHeight, i.elementsPerHeight), o.stride = t(o.stride, i.stride), o.elementMultiplier = t(o.elementMultiplier, i.elementMultiplier), o.isBigEndian = t(o.isBigEndian, i.isBigEndian)) : o = i, this._structure = o, this._createdByUpsampling = t(e.createdByUpsampling, !1), this._waterMask = e.waterMask, this._skirtHeight = void 0, this._bufferType = this._buffer.constructor, this._mesh = void 0
				}

				function p(e, t, n, i, r, o, s, a, u, c)
				{
					var l = (u - o.west) * (s - 1) / (o.east - o.west),
						h = (c - o.south) * (a - 1) / (o.north - o.south),
						d = 0 | l,
						f = d + 1;
					f >= s && (f = s - 1, d = s - 2);
					var p = 0 | h,
						g = p + 1;
					return g >= a && (g = a - 1, p = a - 2), g = a - 1 - g, y(l - d, h - p, M(e, t, n, i, r, (p = a - 1 - p) * s + d), M(e, t, n, i, r, p * s + f), M(e, t, n, i, r, g * s + d), M(e, t, n, i, r, g * s + f))
				}

				function g(e, t, n, i, r, o, s, a, u, c, l)
				{
					var h = (u - o.west) * (s - 1) / (o.east - o.west),
						d = (c - o.south) * (a - 1) / (o.north - o.south);
					r > 0 && (h += 1, d += 1, s += 2, a += 2);
					var f = 0 | h,
						p = f + 1;
					p >= (r > 0 ? s - 1 : s) && (p = s - 1, f = s - 2);
					var g = 0 | d,
						M = g + 1;
					M >= (r > 0 ? a - 1 : a) && (M = a - 1, g = a - 2);
					var v = d - g;
					return g = a - 1 - g, M = a - 1 - M, y(h - f, v, (t.decodeHeight(e, g * s + f) / l - n) / i, (t.decodeHeight(e, g * s + p) / l - n) / i, (t.decodeHeight(e, M * s + f) / l - n) / i, (t.decodeHeight(e, M * s + p) / l - n) / i)
				}

				function y(e, t, n, i, r, o)
				{
					return t < e ? n + e * (i - n) + t * (o - i) : n + e * (o - r) + t * (r - n)
				}

				function M(e, t, n, i, r, o)
				{
					o *= i;
					var s, a = 0;
					if (r)
						for (s = 0; s < t; ++s) a = a * n + e[o + s];
					else
						for (s = t - 1; s >= 0; --s) a = a * n + e[o + s];
					return a
				}

				function v(e, t, n, i, r, o, s, a)
				{
					s *= r;
					var u;
					if (o)
						for (u = 0; u < t - 1; ++u) e[s + u] = a / i | 0, a -= e[s + u] * i, i /= n;
					else
						for (u = t - 1; u > 0; --u) e[s + u] = a / i | 0, a -= e[s + u] * i, i /= n;
					e[s + u] = a
				}
				i(f.prototype,
				{
					credits:
					{
						get: function () {}
					},
					waterMask:
					{
						get: function ()
						{
							return this._waterMask
						}
					}
				});
				var A = new c("createVerticesFromHeightmap");
				return f.prototype.createMesh = function (i, s, a, c, f)
				{
					if (!n(i)) throw new r("tilingScheme is required.");
					if (!n(s)) throw new r("x is required.");
					if (!n(a)) throw new r("y is required.");
					if (!n(c)) throw new r("level is required.");
					var p = i.ellipsoid,
						g = i.tileXYToNativeRectangle(s, a, c),
						y = i.tileXYToRectangle(s, a, c);
					f = t(f, 1);
					var M = p.cartographicToCartesian(u.center(y)),
						v = this._structure,
						E = d.getEstimatedLevelZeroGeometricErrorForAHeightmap(p, this._width, i.getNumberOfXTilesAtLevel(0)) / (1 << c);
					this._skirtHeight = Math.min(4 * E, 1e3);
					var m = A.scheduleTask(
					{
						heightmap: this._buffer,
						structure: v,
						includeWebMercatorT: !0,
						width: this._width,
						height: this._height,
						nativeRectangle: g,
						rectangle: y,
						relativeToCenter: M,
						ellipsoid: p,
						skirtHeight: this._skirtHeight,
						isGeographic: i instanceof o,
						exaggeration: f
					});
					if (n(m))
					{
						var w = this;
						return e(m, function (e)
						{
							return w._mesh = new h(M, new Float32Array(e.vertices), d.getRegularGridIndices(e.gridWidth, e.gridHeight), e.minimumHeight, e.maximumHeight, e.boundingSphere3D, e.occludeePointInScaledSpace, e.numberOfAttributes, e.orientedBoundingBox, l.clone(e.encoding), f), w._buffer = void 0, w._mesh
						})
					}
				}, f.prototype.interpolateHeight = function (e, t, i)
				{
					var r = this._width,
						o = this._height,
						s = this._structure,
						a = s.stride,
						u = s.elementsPerHeight,
						c = s.elementMultiplier,
						l = s.isBigEndian,
						h = s.heightOffset,
						d = s.heightScale;
					return n(this._mesh) ? g(this._mesh.vertices, this._mesh.encoding, h, d, this._skirtHeight, e, r, o, t, i, this._mesh.exaggeration) : p(this._buffer, u, c, a, l, e, r, o, t, i) * d + h
				}, f.prototype.upsample = function (e, t, i, o, s, u, c)
				{
					if (!n(e)) throw new r("tilingScheme is required.");
					if (!n(t)) throw new r("thisX is required.");
					if (!n(i)) throw new r("thisY is required.");
					if (!n(o)) throw new r("thisLevel is required.");
					if (!n(s)) throw new r("descendantX is required.");
					if (!n(u)) throw new r("descendantY is required.");
					if (!n(c)) throw new r("descendantLevel is required.");
					if (c - o > 1) throw new r("Upsampling through more than one level at a time is not currently supported.");
					var l = this._width,
						h = this._height,
						d = this._structure,
						p = this._skirtHeight,
						y = d.stride,
						M = new this._bufferType(l * h * y),
						A = this._mesh;
					if (n(A))
					{
						for (var E = A.vertices, m = A.encoding, w = e.tileXYToRectangle(t, i, o), N = e.tileXYToRectangle(s, u, c), D = d.heightOffset, T = d.heightScale, I = A.exaggeration, O = d.elementsPerHeight, S = d.elementMultiplier, _ = d.isBigEndian, L = Math.pow(S, O - 1), j = 0; j < h; ++j)
							for (var x = a.lerp(N.north, N.south, j / (h - 1)), b = 0; b < l; ++b)
							{
								var C = g(E, m, D, T, p, w, l, h, a.lerp(N.west, N.east, b / (l - 1)), x, I);
								v(M, O, S, L, y, _, j * l + b, C = (C = C < d.lowestEncodedHeight ? d.lowestEncodedHeight : C) > d.highestEncodedHeight ? d.highestEncodedHeight : C)
							}
						return new f(
						{
							buffer: M,
							width: l,
							height: h,
							childTileMask: 0,
							structure: this._structure,
							createdByUpsampling: !0
						})
					}
				}, f.prototype.isChildAvailable = function (e, t, i, o)
				{
					if (!n(e)) throw new r("thisX is required.");
					if (!n(t)) throw new r("thisY is required.");
					if (!n(i)) throw new r("childX is required.");
					if (!n(o)) throw new r("childY is required.");
					var s = 2;
					return i !== 2 * e && ++s, o !== 2 * t && (s -= 2), 0 != (this._childTileMask & 1 << s)
				}, f.prototype.wasCreatedByUpsampling = function ()
				{
					return this._createdByUpsampling
				}, f
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("6", ["5"], function (e)
			{
				"use strict";
				var t = function ()
					{
						try
						{
							return "x" in Object.defineProperty(
							{}, "x",
							{})
						}
						catch (e)
						{
							return !1
						}
					}(),
					n = Object.defineProperties;
				return t && e(n) || (n = function (e)
				{
					return e
				}), n
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("82", ["5", "6", "7"], function (e, t, n)
			{
				"use strict";

				function i(t, i, s)
				{
					var a = e(s),
						u = e(i),
						c = e(t);
					if (!c && !u && !a) throw new n("text, imageUrl or link is required");
					c || u || (t = s), this._text = t, this._imageUrl = i, this._link = s, this._hasLink = a, this._hasImage = u;
					var l, h = JSON.stringify([t, i, s]);
					e(o[h]) ? l = o[h] : (l = r++, o[h] = l), this._id = l
				}
				var r = 0,
					o = {};
				return t(i.prototype,
				{
					text:
					{
						get: function ()
						{
							return this._text
						}
					},
					imageUrl:
					{
						get: function ()
						{
							return this._imageUrl
						}
					},
					link:
					{
						get: function ()
						{
							return this._link
						}
					},
					id:
					{
						get: function ()
						{
							return this._id
						}
					}
				}), i.prototype.hasImage = function ()
				{
					return this._hasImage
				}, i.prototype.hasLink = function ()
				{
					return this._hasLink
				}, i.equals = function (t, n)
				{
					return t === n || e(t) && e(n) && t._id === n._id
				}, i.prototype.equals = function (e)
				{
					return i.equals(this, e)
				}, i
			})
		}(),
		function ()
		{
			var i = e.amdDefine;
			! function (e)
			{
				"use strict";
				e("48", [], function ()
				{
					function e(e, n, i, r)
					{
						return t(e).then(n, i, r)
					}

					function t(e)
					{
						var t, n;
						return e instanceof i ? t = e : a(e) ? (n = s(), e.then(function (e)
						{
							n.resolve(e)
						}, function (e)
						{
							n.reject(e)
						}, function (e)
						{
							n.progress(e)
						}), t = n.promise) : t = r(e), t
					}

					function n(t)
					{
						return e(t, o)
					}

					function i(e)
					{
						this.then = e
					}

					function r(e)
					{
						return new i(function (n)
						{
							try
							{
								return t(n ? n(e) : e)
							}
							catch (e)
							{
								return o(e)
							}
						})
					}

					function o(e)
					{
						return new i(function (n, i)
						{
							try
							{
								return i ? t(i(e)) : o(e)
							}
							catch (e)
							{
								return o(e)
							}
						})
					}

					function s()
					{
						function e(e, t, n)
						{
							return d(e, t, n)
						}

						function n(e)
						{
							return p(e)
						}

						function r(e)
						{
							return p(o(e))
						}

						function a(e)
						{
							return f(e)
						}
						var u, c, l, h, d, f, p;
						return c = new i(e), u = {
							then: e,
							resolve: n,
							reject: r,
							progress: a,
							promise: c,
							resolver:
							{
								resolve: n,
								reject: r,
								progress: a
							}
						}, l = [], h = [], d = function (e, t, n)
						{
							var i, r;
							return i = s(), r = "function" == typeof n ? function (e)
							{
								try
								{
									i.progress(n(e))
								}
								catch (e)
								{
									i.progress(e)
								}
							} : function (e)
							{
								i.progress(e)
							}, l.push(function (n)
							{
								n.then(e, t).then(i.resolve, i.reject, r)
							}), h.push(r), i.promise
						}, f = function (e)
						{
							return g(h, e), e
						}, p = function (e)
						{
							return e = t(e), d = e.then, p = t, f = M, g(l, e), h = l = m, e
						}, u
					}

					function a(e)
					{
						return e && "function" == typeof e.then
					}

					function u(t, n, i, r, o)
					{
						return y(2, arguments), e(t, function (t)
						{
							function a(e)
							{
								g(e)
							}

							function u(e)
							{
								p(e)
							}
							var c, l, h, d, f, p, g, y, v, A;
							if (v = t.length >>> 0, c = Math.max(0, Math.min(n, v)), h = [], l = v - c + 1, d = [], f = s(), c)
								for (y = f.progress, g = function (e)
									{
										d.push(e), --l || (p = g = M, f.reject(d))
									}, p = function (e)
									{
										h.push(e), --c || (p = g = M, f.resolve(h))
									}, A = 0; A < v; ++A) A in t && e(t[A], u, a, y);
							else f.resolve(h);
							return f.then(i, r, o)
						})
					}

					function c(e, t, n, i)
					{
						function r(e)
						{
							return t ? t(e[0]) : e[0]
						}
						return u(e, 1, r, n, i)
					}

					function l(e, t, n, i)
					{
						return y(1, arguments), d(e, v).then(t, n, i)
					}

					function h()
					{
						return d(arguments, v)
					}

					function d(t, n)
					{
						return e(t, function (t)
						{
							var i, r, o, a, u, c;
							if (o = r = t.length >>> 0, i = [], c = s(), o)
								for (a = function (t, r)
									{
										e(t, n).then(function (e)
										{
											i[r] = e, --o || c.resolve(i)
										}, c.reject)
									}, u = 0; u < r; u++) u in t ? a(t[u], u) : --o;
							else c.resolve(i);
							return c.promise
						})
					}

					function f(t, n)
					{
						var i = E.call(arguments, 1);
						return e(t, function (t)
						{
							var r;
							return r = t.length, i[0] = function (t, i, o)
							{
								return e(t, function (t)
								{
									return e(i, function (e)
									{
										return n(t, e, o, r)
									})
								})
							}, A.apply(t, i)
						})
					}

					function p(t, n, i)
					{
						var r = arguments.length > 2;
						return e(t, function (e)
						{
							return e = r ? i : e, n.resolve(e), e
						}, function (e)
						{
							return n.reject(e), o(e)
						}, n.progress)
					}

					function g(e, t)
					{
						for (var n, i = 0; n = e[i++];) n(t)
					}

					function y(e, t)
					{
						for (var n, i = t.length; i > e;)
							if (null != (n = t[--i]) && "function" != typeof n) throw new Error("arg " + i + " must be a function")
					}

					function M()
					{}

					function v(e)
					{
						return e
					}
					var A, E, m;
					return e.defer = s, e.resolve = t, e.reject = n, e.join = h, e.all = l, e.map = d, e.reduce = f, e.any = c, e.some = u, e.chain = p, e.isPromise = a, i.prototype = {
						always: function (e, t)
						{
							return this.then(e, e, t)
						},
						otherwise: function (e)
						{
							return this.then(m, e)
						},
						yield: function (e)
						{
							return this.then(function ()
							{
								return e
							})
						},
						spread: function (e)
						{
							return this.then(function (t)
							{
								return l(t, function (t)
								{
									return e.apply(m, t)
								})
							})
						}
					}, E = [].slice, A = [].reduce || function (e)
					{
						var t, n, i, r, o;
						if (o = 0, t = Object(this), r = t.length >>> 0, (n = arguments).length <= 1)
							for (;;)
							{
								if (o in t)
								{
									i = t[o++];
									break
								}
								if (++o >= r) throw new TypeError
							}
						else i = n[1];
						for (; o < r; ++o) o in t && (i = e(i, t[o], o, t));
						return i
					}, e
				})
			}("function" == typeof i && i.amd ? i : function (e)
			{
				"object" == typeof t ? n.exports = e() : this.when = e()
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("5", [], function ()
			{
				"use strict";

				function e(e)
				{
					return void 0 !== e && null !== e
				}
				return e
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("7", ["5"], function (e)
			{
				"use strict";

				function t(e)
				{
					this.name = "DeveloperError", this.message = e;
					var t;
					try
					{
						throw new Error
					}
					catch (e)
					{
						t = e.stack
					}
					this.stack = t
				}
				return e(Object.create) && (t.prototype = Object.create(Error.prototype), t.prototype.constructor = t), t.prototype.toString = function ()
				{
					var t = this.name + ": " + this.message;
					return e(this.stack) && (t += "\n" + this.stack.toString()), t
				}, t.throwInstantiationError = function ()
				{
					throw new t("This function defines an interface and should not be called directly.")
				}, t
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("1e", ["5", "7"], function (e, t)
			{
				"use strict";

				function n(e)
				{
					return e + " is required, actual value was undefined"
				}

				function i(e, t, n)
				{
					return "Expected " + n + " to be typeof " + t + ", actual typeof was " + e
				}
				var r = {};
				return r.typeOf = {}, r.defined = function (i, r)
				{
					if (!e(r)) throw new t(n(i))
				}, r.typeOf.func = function (e, n)
				{
					if ("function" != typeof n) throw new t(i(typeof n, "function", e))
				}, r.typeOf.string = function (e, n)
				{
					if ("string" != typeof n) throw new t(i(typeof n, "string", e))
				}, r.typeOf.number = function (e, n)
				{
					if ("number" != typeof n) throw new t(i(typeof n, "number", e))
				}, r.typeOf.number.lessThan = function (e, n, i)
				{
					if (r.typeOf.number(e, n), n >= i) throw new t("Expected " + e + " to be less than " + i + ", actual value was " + n)
				}, r.typeOf.number.lessThanOrEquals = function (e, n, i)
				{
					if (r.typeOf.number(e, n), n > i) throw new t("Expected " + e + " to be less than or equal to " + i + ", actual value was " + n)
				}, r.typeOf.number.greaterThan = function (e, n, i)
				{
					if (r.typeOf.number(e, n), n <= i) throw new t("Expected " + e + " to be greater than " + i + ", actual value was " + n)
				}, r.typeOf.number.greaterThanOrEquals = function (e, n, i)
				{
					if (r.typeOf.number(e, n), n < i) throw new t("Expected " + e + " to be greater than or equal to" + i + ", actual value was " + n)
				}, r.typeOf.object = function (e, n)
				{
					if ("object" != typeof n) throw new t(i(typeof n, "object", e))
				}, r.typeOf.bool = function (e, n)
				{
					if ("boolean" != typeof n) throw new t(i(typeof n, "boolean", e))
				}, r.typeOf.number.equals = function (e, n, i, o)
				{
					if (r.typeOf.number(e, i), r.typeOf.number(n, o), i !== o) throw new t(e + " must be equal to " + n + ", the actual values are " + i + " and " + o)
				}, r
			})
		}(),
		function ()
		{
			(0, e.amdDefine)("83", ["48", "1e"], function (e, t)
			{
				"use strict";

				function n(n, r, o)
				{
					function s()
					{
						n.ready ? e(i(n, r, o), function (e)
						{
							a.resolve(e)
						}) : setTimeout(s, 10)
					}
					t.typeOf.object("terrainProvider", n), t.typeOf.number("level", r), t.defined("positions", o);
					var a = e.defer();
					return s(), a.promise
				}

				function i(t, n, i)
				{
					var s, a = t.tilingScheme,
						u = [],
						c = {};
					for (s = 0; s < i.length; ++s)
					{
						var l = a.positionToTileXY(i[s], n),
							h = l.toString();
						if (!c.hasOwnProperty(h))
						{
							var d = {
								x: l.x,
								y: l.y,
								level: n,
								tilingScheme: a,
								terrainProvider: t,
								positions: []
							};
							c[h] = d, u.push(d)
						}
						c[h].positions.push(i[s])
					}
					var f = [];
					for (s = 0; s < u.length; ++s)
					{
						var p = u[s],
							g = p.terrainProvider.requestTileGeometry(p.x, p.y, p.level),
							y = e(g, r(p), o(p));
						f.push(y)
					}
					return e.all(f, function ()
					{
						return i
					})
				}

				function r(e)
				{
					var t = e.positions,
						n = e.tilingScheme.tileXYToRectangle(e.x, e.y, e.level);
					return function (e)
					{
						for (var i = 0; i < t.length; ++i)
						{
							var r = t[i];
							r.height = e.interpolateHeight(n, r.longitude, r.latitude)
						}
					}
				}

				function o(e)
				{
					var t = e.positions;
					return function ()
					{
						for (var e = 0; e < t.length; ++e) t[e].height = void 0
					}
				}
				return n
			})
		}(), e.registerDynamic("84", ["85", "86", "87"], !0, function (e, t, n)
		{
			function i(e)
			{
				this.gl = e, this.ctxAttribs = e.getContextAttributes(), this.meshWidth = 20, this.meshHeight = 20, this.bufferScale = WebVRConfig.BUFFER_SCALE, this.bufferWidth = e.drawingBufferWidth, this.bufferHeight = e.drawingBufferHeight, this.realBindFramebuffer = e.bindFramebuffer, this.realEnable = e.enable, this.realDisable = e.disable, this.realColorMask = e.colorMask, this.realClearColor = e.clearColor, this.realViewport = e.viewport, o.isIOS() || (this.realCanvasWidth = Object.getOwnPropertyDescriptor(e.canvas.__proto__, "width"), this.realCanvasHeight = Object.getOwnPropertyDescriptor(e.canvas.__proto__, "height")), this.isPatched = !1, this.lastBoundFramebuffer = null, this.cullFace = !1, this.depthTest = !1, this.blend = !1, this.scissorTest = !1, this.stencilTest = !1, this.viewport = [0, 0, 0, 0], this.colorMask = [!0, !0, !0, !0], this.clearColor = [0, 0, 0, 0], this.attribs = {
					position: 0,
					texCoord: 1
				}, this.program = o.linkProgram(e, a, u, this.attribs), this.uniforms = o.getProgramUniforms(e, this.program), this.viewportOffsetScale = new Float32Array(8), this.setTextureBounds(), this.vertexBuffer = e.createBuffer(), this.indexBuffer = e.createBuffer(), this.indexCount = 0, this.renderTarget = e.createTexture(), this.framebuffer = e.createFramebuffer(), this.depthStencilBuffer = null, this.depthBuffer = null, this.stencilBuffer = null, this.ctxAttribs.depth && this.ctxAttribs.stencil ? this.depthStencilBuffer = e.createRenderbuffer() : this.ctxAttribs.depth ? this.depthBuffer = e.createRenderbuffer() : this.ctxAttribs.stencil && (this.stencilBuffer = e.createRenderbuffer()), this.patch(), this.onResize(), WebVRConfig.CARDBOARD_UI_DISABLED || (this.cardboardUI = new r(e))
			}
			this || self;
			var r = e("85"),
				o = e("86"),
				s = e("87"),
				a = ["attribute vec2 position;", "attribute vec3 texCoord;", "varying vec2 vTexCoord;", "uniform vec4 viewportOffsetScale[2];", "void main() {", "  vec4 viewport = viewportOffsetScale[int(texCoord.z)];", "  vTexCoord = (texCoord.xy * viewport.zw) + viewport.xy;", "  gl_Position = vec4( position, 1.0, 1.0 );", "}"].join("\n"),
				u = ["precision mediump float;", "uniform sampler2D diffuse;", "varying vec2 vTexCoord;", "void main() {", "  gl_FragColor = texture2D(diffuse, vTexCoord);", "}"].join("\n");
			return i.prototype.destroy = function ()
			{
				var e = this.gl;
				this.unpatch(), e.deleteProgram(this.program), e.deleteBuffer(this.vertexBuffer), e.deleteBuffer(this.indexBuffer), e.deleteTexture(this.renderTarget), e.deleteFramebuffer(this.framebuffer), this.depthStencilBuffer && e.deleteRenderbuffer(this.depthStencilBuffer), this.depthBuffer && e.deleteRenderbuffer(this.depthBuffer), this.stencilBuffer && e.deleteRenderbuffer(this.stencilBuffer), this.cardboardUI && this.cardboardUI.destroy()
			}, i.prototype.onResize = function ()
			{
				var e = this.gl,
					t = this,
					n = [e.RENDERBUFFER_BINDING, e.TEXTURE_BINDING_2D, e.TEXTURE0];
				s(e, n, function (e)
				{
					t.realBindFramebuffer.call(e, e.FRAMEBUFFER, null), t.scissorTest && t.realDisable.call(e, e.SCISSOR_TEST), t.realColorMask.call(e, !0, !0, !0, !0), t.realViewport.call(e, 0, 0, e.drawingBufferWidth, e.drawingBufferHeight), t.realClearColor.call(e, 0, 0, 0, 1), e.clear(e.COLOR_BUFFER_BIT), t.realBindFramebuffer.call(e, e.FRAMEBUFFER, t.framebuffer), e.bindTexture(e.TEXTURE_2D, t.renderTarget), e.texImage2D(e.TEXTURE_2D, 0, t.ctxAttribs.alpha ? e.RGBA : e.RGB, t.bufferWidth, t.bufferHeight, 0, t.ctxAttribs.alpha ? e.RGBA : e.RGB, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t.renderTarget, 0), t.ctxAttribs.depth && t.ctxAttribs.stencil ? (e.bindRenderbuffer(e.RENDERBUFFER, t.depthStencilBuffer), e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_STENCIL, t.bufferWidth, t.bufferHeight), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_STENCIL_ATTACHMENT, e.RENDERBUFFER, t.depthStencilBuffer)) : t.ctxAttribs.depth ? (e.bindRenderbuffer(e.RENDERBUFFER, t.depthBuffer), e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_COMPONENT16, t.bufferWidth, t.bufferHeight), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_ATTACHMENT, e.RENDERBUFFER, t.depthBuffer)) : t.ctxAttribs.stencil && (e.bindRenderbuffer(e.RENDERBUFFER, t.stencilBuffer), e.renderbufferStorage(e.RENDERBUFFER, e.STENCIL_INDEX8, t.bufferWidth, t.bufferHeight), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.STENCIL_ATTACHMENT, e.RENDERBUFFER, t.stencilBuffer)), !e.checkFramebufferStatus(e.FRAMEBUFFER) === e.FRAMEBUFFER_COMPLETE && console.error("Framebuffer incomplete!"), t.realBindFramebuffer.call(e, e.FRAMEBUFFER, t.lastBoundFramebuffer), t.scissorTest && t.realEnable.call(e, e.SCISSOR_TEST), t.realColorMask.apply(e, t.colorMask), t.realViewport.apply(e, t.viewport), t.realClearColor.apply(e, t.clearColor)
				}), this.cardboardUI && this.cardboardUI.onResize()
			}, i.prototype.patch = function ()
			{
				if (!this.isPatched)
				{
					var e = this,
						t = this.gl.canvas,
						n = this.gl;
					o.isIOS() || (t.width = o.getScreenWidth() * this.bufferScale, t.height = o.getScreenHeight() * this.bufferScale, Object.defineProperty(t, "width",
					{
						configurable: !0,
						enumerable: !0,
						get: function ()
						{
							return e.bufferWidth
						},
						set: function (t)
						{
							e.bufferWidth = t, e.onResize()
						}
					}), Object.defineProperty(t, "height",
					{
						configurable: !0,
						enumerable: !0,
						get: function ()
						{
							return e.bufferHeight
						},
						set: function (t)
						{
							e.bufferHeight = t, e.onResize()
						}
					})), this.lastBoundFramebuffer = n.getParameter(n.FRAMEBUFFER_BINDING), null == this.lastBoundFramebuffer && (this.lastBoundFramebuffer = this.framebuffer, this.gl.bindFramebuffer(n.FRAMEBUFFER, this.framebuffer)), this.gl.bindFramebuffer = function (t, i)
					{
						e.lastBoundFramebuffer = i || e.framebuffer, e.realBindFramebuffer.call(n, t, e.lastBoundFramebuffer)
					}, this.cullFace = n.getParameter(n.CULL_FACE), this.depthTest = n.getParameter(n.DEPTH_TEST), this.blend = n.getParameter(n.BLEND), this.scissorTest = n.getParameter(n.SCISSOR_TEST), this.stencilTest = n.getParameter(n.STENCIL_TEST), n.enable = function (t)
					{
						switch (t)
						{
						case n.CULL_FACE:
							e.cullFace = !0;
							break;
						case n.DEPTH_TEST:
							e.depthTest = !0;
							break;
						case n.BLEND:
							e.blend = !0;
							break;
						case n.SCISSOR_TEST:
							e.scissorTest = !0;
							break;
						case n.STENCIL_TEST:
							e.stencilTest = !0
						}
						e.realEnable.call(n, t)
					}, n.disable = function (t)
					{
						switch (t)
						{
						case n.CULL_FACE:
							e.cullFace = !1;
							break;
						case n.DEPTH_TEST:
							e.depthTest = !1;
							break;
						case n.BLEND:
							e.blend = !1;
							break;
						case n.SCISSOR_TEST:
							e.scissorTest = !1;
							break;
						case n.STENCIL_TEST:
							e.stencilTest = !1
						}
						e.realDisable.call(n, t)
					}, this.colorMask = n.getParameter(n.COLOR_WRITEMASK), n.colorMask = function (t, i, r, o)
					{
						e.colorMask[0] = t, e.colorMask[1] = i, e.colorMask[2] = r, e.colorMask[3] = o, e.realColorMask.call(n, t, i, r, o)
					}, this.clearColor = n.getParameter(n.COLOR_CLEAR_VALUE), n.clearColor = function (t, i, r, o)
					{
						e.clearColor[0] = t, e.clearColor[1] = i, e.clearColor[2] = r, e.clearColor[3] = o, e.realClearColor.call(n, t, i, r, o)
					}, this.viewport = n.getParameter(n.VIEWPORT), n.viewport = function (t, i, r, o)
					{
						e.viewport[0] = t, e.viewport[1] = i, e.viewport[2] = r, e.viewport[3] = o, e.realViewport.call(n, t, i, r, o)
					}, this.isPatched = !0, o.safariCssSizeWorkaround(t)
				}
			}, i.prototype.unpatch = function ()
			{
				if (this.isPatched)
				{
					var e = this.gl,
						t = this.gl.canvas;
					o.isIOS() || (Object.defineProperty(t, "width", this.realCanvasWidth), Object.defineProperty(t, "height", this.realCanvasHeight)), t.width = this.bufferWidth, t.height = this.bufferHeight, e.bindFramebuffer = this.realBindFramebuffer, e.enable = this.realEnable, e.disable = this.realDisable, e.colorMask = this.realColorMask, e.clearColor = this.realClearColor, e.viewport = this.realViewport, this.lastBoundFramebuffer == this.framebuffer && e.bindFramebuffer(e.FRAMEBUFFER, null), this.isPatched = !1, setTimeout(function ()
					{
						o.safariCssSizeWorkaround(t)
					}, 1)
				}
			}, i.prototype.setTextureBounds = function (e, t)
			{
				e || (e = [0, 0, .5, 1]), t || (t = [.5, 0, .5, 1]), this.viewportOffsetScale[0] = e[0], this.viewportOffsetScale[1] = e[1], this.viewportOffsetScale[2] = e[2], this.viewportOffsetScale[3] = e[3], this.viewportOffsetScale[4] = t[0], this.viewportOffsetScale[5] = t[1], this.viewportOffsetScale[6] = t[2], this.viewportOffsetScale[7] = t[3]
			}, i.prototype.submitFrame = function ()
			{
				var e = this.gl,
					t = this,
					n = [];
				if (WebVRConfig.DIRTY_SUBMIT_FRAME_BINDINGS || n.push(e.CURRENT_PROGRAM, e.ARRAY_BUFFER_BINDING, e.ELEMENT_ARRAY_BUFFER_BINDING, e.TEXTURE_BINDING_2D, e.TEXTURE0), s(e, n, function (e)
					{
						t.realBindFramebuffer.call(e, e.FRAMEBUFFER, null), t.cullFace && t.realDisable.call(e, e.CULL_FACE), t.depthTest && t.realDisable.call(e, e.DEPTH_TEST), t.blend && t.realDisable.call(e, e.BLEND), t.scissorTest && t.realDisable.call(e, e.SCISSOR_TEST), t.stencilTest && t.realDisable.call(e, e.STENCIL_TEST), t.realColorMask.call(e, !0, !0, !0, !0), t.realViewport.call(e, 0, 0, e.drawingBufferWidth, e.drawingBufferHeight), (t.ctxAttribs.alpha || o.isIOS()) && (t.realClearColor.call(e, 0, 0, 0, 1), e.clear(e.COLOR_BUFFER_BIT)), e.useProgram(t.program), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.indexBuffer), e.bindBuffer(e.ARRAY_BUFFER, t.vertexBuffer), e.enableVertexAttribArray(t.attribs.position), e.enableVertexAttribArray(t.attribs.texCoord), e.vertexAttribPointer(t.attribs.position, 2, e.FLOAT, !1, 20, 0), e.vertexAttribPointer(t.attribs.texCoord, 3, e.FLOAT, !1, 20, 8), e.activeTexture(e.TEXTURE0), e.uniform1i(t.uniforms.diffuse, 0), e.bindTexture(e.TEXTURE_2D, t.renderTarget), e.uniform4fv(t.uniforms.viewportOffsetScale, t.viewportOffsetScale), e.drawElements(e.TRIANGLES, t.indexCount, e.UNSIGNED_SHORT, 0), t.cardboardUI && t.cardboardUI.renderNoState(), t.realBindFramebuffer.call(t.gl, e.FRAMEBUFFER, t.framebuffer), t.ctxAttribs.preserveDrawingBuffer || (t.realClearColor.call(e, 0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT)), WebVRConfig.DIRTY_SUBMIT_FRAME_BINDINGS || t.realBindFramebuffer.call(e, e.FRAMEBUFFER, t.lastBoundFramebuffer), t.cullFace && t.realEnable.call(e, e.CULL_FACE), t.depthTest && t.realEnable.call(e, e.DEPTH_TEST), t.blend && t.realEnable.call(e, e.BLEND), t.scissorTest && t.realEnable.call(e, e.SCISSOR_TEST), t.stencilTest && t.realEnable.call(e, e.STENCIL_TEST), t.realColorMask.apply(e, t.colorMask), t.realViewport.apply(e, t.viewport), !t.ctxAttribs.alpha && t.ctxAttribs.preserveDrawingBuffer || t.realClearColor.apply(e, t.clearColor)
					}), o.isIOS())
				{
					var i = e.canvas;
					i.width == t.bufferWidth && i.height == t.bufferHeight || (t.bufferWidth = i.width, t.bufferHeight = i.height, t.onResize())
				}
			}, i.prototype.updateDeviceInfo = function (e)
			{
				var t = this.gl,
					n = this,
					i = [t.ARRAY_BUFFER_BINDING, t.ELEMENT_ARRAY_BUFFER_BINDING];
				s(t, i, function (t)
				{
					var i = n.computeMeshVertices_(n.meshWidth, n.meshHeight, e);
					if (t.bindBuffer(t.ARRAY_BUFFER, n.vertexBuffer), t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW), !n.indexCount)
					{
						var r = n.computeMeshIndices_(n.meshWidth, n.meshHeight);
						t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, n.indexBuffer), t.bufferData(t.ELEMENT_ARRAY_BUFFER, r, t.STATIC_DRAW), n.indexCount = r.length
					}
				})
			}, i.prototype.computeMeshVertices_ = function (e, t, n)
			{
				for (var i = new Float32Array(2 * e * t * 5), r = n.getLeftEyeVisibleTanAngles(), s = n.getLeftEyeNoLensTanAngles(), a = n.getLeftEyeVisibleScreenRect(s), u = 0, c = 0; c < 2; c++)
				{
					for (var l = 0; l < t; l++)
						for (var h = 0; h < e; h++, u++)
						{
							var d = h / (e - 1),
								f = l / (t - 1),
								p = d,
								g = f,
								y = o.lerp(r[0], r[2], d),
								M = o.lerp(r[3], r[1], f),
								v = Math.sqrt(y * y + M * M),
								A = n.distortion.distortInverse(v),
								E = M * A / v;
							d = (y * A / v - s[0]) / (s[2] - s[0]), f = (E - s[3]) / (s[1] - s[3]);
							n.device.widthMeters, n.device.heightMeters;
							d = 2 * (a.x + d * a.width - .5), f = 2 * (a.y + f * a.height - .5), i[5 * u + 0] = d, i[5 * u + 1] = f, i[5 * u + 2] = p, i[5 * u + 3] = g, i[5 * u + 4] = c
						}
					var m = r[2] - r[0];
					r[0] = -(m + r[0]), r[2] = m - r[2], m = s[2] - s[0], s[0] = -(m + s[0]), s[2] = m - s[2], a.x = 1 - (a.x + a.width)
				}
				return i
			}, i.prototype.computeMeshIndices_ = function (e, t)
			{
				for (var n = new Uint16Array(2 * (e - 1) * (t - 1) * 6), i = e / 2, r = t / 2, o = 0, s = 0, a = 0; a < 2; a++)
					for (var u = 0; u < t; u++)
						for (var c = 0; c < e; c++, o++) 0 != c && 0 != u && (c <= i == u <= r ? (n[s++] = o, n[s++] = o - e - 1, n[s++] = o - e, n[s++] = o - e - 1, n[s++] = o, n[s++] = o - 1) : (n[s++] = o - 1, n[s++] = o - e, n[s++] = o, n[s++] = o - e, n[s++] = o - 1, n[s++] = o - e - 1));
				return n
			}, i.prototype.getOwnPropertyDescriptor_ = function (e, t)
			{
				var n = Object.getOwnPropertyDescriptor(e, t);
				return void 0 !== n.get && void 0 !== n.set || (n.configurable = !0, n.enumerable = !0, n.get = function ()
				{
					return this.getAttribute(t)
				}, n.set = function (e)
				{
					this.setAttribute(t, e)
				}), n
			}, n.exports = i, n.exports
		}), e.registerDynamic("87", [], !0, function (e, t, n)
		{
			function i(e, t, n)
			{
				if (t)
				{
					for (var i = [], r = null, o = 0; o < t.length; ++o) switch (s = t[o])
					{
					case e.TEXTURE_BINDING_2D:
					case e.TEXTURE_BINDING_CUBE_MAP:
						if ((u = t[++o]) < e.TEXTURE0 || u > e.TEXTURE31)
						{
							console.error("TEXTURE_BINDING_2D or TEXTURE_BINDING_CUBE_MAP must be followed by a valid texture unit"), i.push(null, null);
							break
						}
						r || (r = e.getParameter(e.ACTIVE_TEXTURE)), e.activeTexture(u), i.push(e.getParameter(s), null);
						break;
					case e.ACTIVE_TEXTURE:
						r = e.getParameter(e.ACTIVE_TEXTURE), i.push(null);
						break;
					default:
						i.push(e.getParameter(s))
					}
					n(e);
					for (o = 0; o < t.length; ++o)
					{
						var s = t[o],
							a = i[o];
						switch (s)
						{
						case e.ACTIVE_TEXTURE:
							break;
						case e.ARRAY_BUFFER_BINDING:
							e.bindBuffer(e.ARRAY_BUFFER, a);
							break;
						case e.COLOR_CLEAR_VALUE:
							e.clearColor(a[0], a[1], a[2], a[3]);
							break;
						case e.COLOR_WRITEMASK:
							e.colorMask(a[0], a[1], a[2], a[3]);
							break;
						case e.CURRENT_PROGRAM:
							e.useProgram(a);
							break;
						case e.ELEMENT_ARRAY_BUFFER_BINDING:
							e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, a);
							break;
						case e.FRAMEBUFFER_BINDING:
							e.bindFramebuffer(e.FRAMEBUFFER, a);
							break;
						case e.RENDERBUFFER_BINDING:
							e.bindRenderbuffer(e.RENDERBUFFER, a);
							break;
						case e.TEXTURE_BINDING_2D:
							if ((u = t[++o]) < e.TEXTURE0 || u > e.TEXTURE31) break;
							e.activeTexture(u), e.bindTexture(e.TEXTURE_2D, a);
							break;
						case e.TEXTURE_BINDING_CUBE_MAP:
							var u = t[++o];
							if (u < e.TEXTURE0 || u > e.TEXTURE31) break;
							e.activeTexture(u), e.bindTexture(e.TEXTURE_CUBE_MAP, a);
							break;
						case e.VIEWPORT:
							e.viewport(a[0], a[1], a[2], a[3]);
							break;
						case e.BLEND:
						case e.CULL_FACE:
						case e.DEPTH_TEST:
						case e.SCISSOR_TEST:
						case e.STENCIL_TEST:
							a ? e.enable(s) : e.disable(s);
							break;
						default:
							console.log("No GL restore behavior for 0x" + s.toString(16))
						}
						r && e.activeTexture(r)
					}
				}
				else n(e)
			}
			this || self;
			return n.exports = i, n.exports
		}), e.registerDynamic("85", ["86", "87"], !0, function (e, t, n)
		{
			function i(e)
			{
				this.gl = e, this.attribs = {
					position: 0
				}, this.program = r.linkProgram(e, s, a, this.attribs), this.uniforms = r.getProgramUniforms(e, this.program), this.vertexBuffer = e.createBuffer(), this.gearOffset = 0, this.gearVertexCount = 0, this.arrowOffset = 0, this.arrowVertexCount = 0, this.projMat = new Float32Array(16), this.listener = null, this.onResize()
			}
			this || self;
			var r = e("86"),
				o = e("87"),
				s = ["attribute vec2 position;", "uniform mat4 projectionMat;", "void main() {", "  gl_Position = projectionMat * vec4( position, -1.0, 1.0 );", "}"].join("\n"),
				a = ["precision mediump float;", "uniform vec4 color;", "void main() {", "  gl_FragColor = color;", "}"].join("\n"),
				u = Math.PI / 180,
				c = .3125;
			return i.prototype.destroy = function ()
			{
				var e = this.gl;
				this.listener && e.canvas.removeEventListener("click", this.listener, !1), e.deleteProgram(this.program), e.deleteBuffer(this.vertexBuffer)
			}, i.prototype.listen = function (e, t)
			{
				var n = this.gl.canvas;
				this.listener = function (i)
				{
					var r = n.clientWidth / 2;
					i.clientX > r - 42 && i.clientX < r + 42 && i.clientY > n.clientHeight - 42 ? e(i) : i.clientX < 42 && i.clientY < 42 && t(i)
				}, n.addEventListener("click", this.listener, !1)
			}, i.prototype.onResize = function ()
			{
				var e = this.gl,
					t = this,
					n = [e.ARRAY_BUFFER_BINDING];
				o(e, n, function (e)
				{
					function n(e, t)
					{
						var n = (90 - e) * u,
							i = Math.cos(n),
							r = Math.sin(n);
						o.push(c * i * d + s, c * r * d + d), o.push(t * i * d + s, t * r * d + d)
					}

					function i(t, n)
					{
						o.push(f + t, e.drawingBufferHeight - f - n)
					}
					var o = [],
						s = e.drawingBufferWidth / 2,
						a = e.drawingBufferWidth / (screen.width * window.devicePixelRatio);
					r.isIOS() || (a *= window.devicePixelRatio);
					var l = 4 * a / 2,
						h = 42 * a,
						d = 28 * a / 2,
						f = 14 * a;
					o.push(s - l, h), o.push(s - l, e.drawingBufferHeight), o.push(s + l, h), o.push(s + l, e.drawingBufferHeight), t.gearOffset = o.length / 2;
					for (var p = 0; p <= 6; p++)
					{
						var g = 60 * p;
						n(g, 1), n(g + 12, 1), n(g + 20, .75), n(g + 40, .75), n(g + 48, 1)
					}
					t.gearVertexCount = o.length / 2 - t.gearOffset, t.arrowOffset = o.length / 2;
					var y = l / Math.sin(45 * u);
					i(0, d), i(d, 0), i(d + y, y), i(y, d + y), i(y, d - y), i(0, d), i(d, 2 * d), i(d + y, 2 * d - y), i(y, d - y), i(0, d), i(y, d - l), i(28 * a, d - l), i(y, d + l), i(28 * a, d + l), t.arrowVertexCount = o.length / 2 - t.arrowOffset, e.bindBuffer(e.ARRAY_BUFFER, t.vertexBuffer), e.bufferData(e.ARRAY_BUFFER, new Float32Array(o), e.STATIC_DRAW)
				})
			}, i.prototype.render = function ()
			{
				var e = this.gl,
					t = this,
					n = [e.CULL_FACE, e.DEPTH_TEST, e.BLEND, e.SCISSOR_TEST, e.STENCIL_TEST, e.COLOR_WRITEMASK, e.VIEWPORT, e.CURRENT_PROGRAM, e.ARRAY_BUFFER_BINDING];
				o(e, n, function (e)
				{
					e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.BLEND), e.disable(e.SCISSOR_TEST), e.disable(e.STENCIL_TEST), e.colorMask(!0, !0, !0, !0), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), t.renderNoState()
				})
			}, i.prototype.renderNoState = function ()
			{
				var e = this.gl;
				e.useProgram(this.program), e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer), e.enableVertexAttribArray(this.attribs.position), e.vertexAttribPointer(this.attribs.position, 2, e.FLOAT, !1, 8, 0), e.uniform4f(this.uniforms.color, 1, 1, 1, 1), r.orthoMatrix(this.projMat, 0, e.drawingBufferWidth, 0, e.drawingBufferHeight, .1, 1024), e.uniformMatrix4fv(this.uniforms.projectionMat, !1, this.projMat), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), e.drawArrays(e.TRIANGLE_STRIP, this.gearOffset, this.gearVertexCount), e.drawArrays(e.TRIANGLE_STRIP, this.arrowOffset, this.arrowVertexCount)
			}, n.exports = i, n.exports
		}), e.registerDynamic("88", [], !0, function (e, t, n)
		{
			this || self;
			var i = {
				format: 1,
				last_updated: "2016-01-20T00:18:35Z",
				devices: [
				{
					type: "android",
					rules: [
					{
						mdmh: "asus/*/Nexus 7/*"
					},
					{
						ua: "Nexus 7"
					}],
					dpi: [320.8, 323],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "asus/*/ASUS_Z00AD/*"
					},
					{
						ua: "ASUS_Z00AD"
					}],
					dpi: [403, 404.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "HTC/*/HTC6435LVW/*"
					},
					{
						ua: "HTC6435LVW"
					}],
					dpi: [449.7, 443.3],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "HTC/*/HTC One XL/*"
					},
					{
						ua: "HTC One XL"
					}],
					dpi: [315.3, 314.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "htc/*/Nexus 9/*"
					},
					{
						ua: "Nexus 9"
					}],
					dpi: 289,
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "HTC/*/HTC One M9/*"
					},
					{
						ua: "HTC One M9"
					}],
					dpi: [442.5, 443.3],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "HTC/*/HTC One_M8/*"
					},
					{
						ua: "HTC One_M8"
					}],
					dpi: [449.7, 447.4],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "HTC/*/HTC One/*"
					},
					{
						ua: "HTC One"
					}],
					dpi: 472.8,
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Huawei/*/Nexus 6P/*"
					},
					{
						ua: "Nexus 6P"
					}],
					dpi: [515.1, 518],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/Nexus 5X/*"
					},
					{
						ua: "Nexus 5X"
					}],
					dpi: [422, 419.9],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/LGMS345/*"
					},
					{
						ua: "LGMS345"
					}],
					dpi: [221.7, 219.1],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/LG-D800/*"
					},
					{
						ua: "LG-D800"
					}],
					dpi: [422, 424.1],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/LG-D850/*"
					},
					{
						ua: "LG-D850"
					}],
					dpi: [537.9, 541.9],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/VS985 4G/*"
					},
					{
						ua: "VS985 4G"
					}],
					dpi: [537.9, 535.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/Nexus 5/*"
					},
					{
						ua: "Nexus 5 "
					}],
					dpi: [442.4, 444.8],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/Nexus 4/*"
					},
					{
						ua: "Nexus 4"
					}],
					dpi: [319.8, 318.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/LG-P769/*"
					},
					{
						ua: "LG-P769"
					}],
					dpi: [240.6, 247.5],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/LGMS323/*"
					},
					{
						ua: "LGMS323"
					}],
					dpi: [206.6, 204.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "LGE/*/LGLS996/*"
					},
					{
						ua: "LGLS996"
					}],
					dpi: [403.4, 401.5],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Micromax/*/4560MMX/*"
					},
					{
						ua: "4560MMX"
					}],
					dpi: [240, 219.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Micromax/*/A250/*"
					},
					{
						ua: "Micromax A250"
					}],
					dpi: [480, 446.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Micromax/*/Micromax AQ4501/*"
					},
					{
						ua: "Micromax AQ4501"
					}],
					dpi: 240,
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/DROID RAZR/*"
					},
					{
						ua: "DROID RAZR"
					}],
					dpi: [368.1, 256.7],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT830C/*"
					},
					{
						ua: "XT830C"
					}],
					dpi: [254, 255.9],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1021/*"
					},
					{
						ua: "XT1021"
					}],
					dpi: [254, 256.7],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1023/*"
					},
					{
						ua: "XT1023"
					}],
					dpi: [254, 256.7],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1028/*"
					},
					{
						ua: "XT1028"
					}],
					dpi: [326.6, 327.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1034/*"
					},
					{
						ua: "XT1034"
					}],
					dpi: [326.6, 328.4],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1053/*"
					},
					{
						ua: "XT1053"
					}],
					dpi: [315.3, 316.1],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1562/*"
					},
					{
						ua: "XT1562"
					}],
					dpi: [403.4, 402.7],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/Nexus 6/*"
					},
					{
						ua: "Nexus 6 "
					}],
					dpi: [494.3, 489.7],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1063/*"
					},
					{
						ua: "XT1063"
					}],
					dpi: [295, 296.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1064/*"
					},
					{
						ua: "XT1064"
					}],
					dpi: [295, 295.6],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1092/*"
					},
					{
						ua: "XT1092"
					}],
					dpi: [422, 424.1],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "motorola/*/XT1095/*"
					},
					{
						ua: "XT1095"
					}],
					dpi: [422, 423.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "OnePlus/*/A0001/*"
					},
					{
						ua: "A0001"
					}],
					dpi: [403.4, 401],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "OnePlus/*/ONE E1005/*"
					},
					{
						ua: "ONE E1005"
					}],
					dpi: [442.4, 441.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "OnePlus/*/ONE A2005/*"
					},
					{
						ua: "ONE A2005"
					}],
					dpi: [391.9, 405.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "OPPO/*/X909/*"
					},
					{
						ua: "X909"
					}],
					dpi: [442.4, 444.1],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-I9082/*"
					},
					{
						ua: "GT-I9082"
					}],
					dpi: [184.7, 185.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G360P/*"
					},
					{
						ua: "SM-G360P"
					}],
					dpi: [196.7, 205.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/Nexus S/*"
					},
					{
						ua: "Nexus S"
					}],
					dpi: [234.5, 229.8],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-I9300/*"
					},
					{
						ua: "GT-I9300"
					}],
					dpi: [304.8, 303.9],
					bw: 5,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-T230NU/*"
					},
					{
						ua: "SM-T230NU"
					}],
					dpi: 216,
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SGH-T399/*"
					},
					{
						ua: "SGH-T399"
					}],
					dpi: [217.7, 231.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-N9005/*"
					},
					{
						ua: "SM-N9005"
					}],
					dpi: [386.4, 387],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SAMSUNG-SM-N900A/*"
					},
					{
						ua: "SAMSUNG-SM-N900A"
					}],
					dpi: [386.4, 387.7],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-I9500/*"
					},
					{
						ua: "GT-I9500"
					}],
					dpi: [442.5, 443.3],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-I9505/*"
					},
					{
						ua: "GT-I9505"
					}],
					dpi: 439.4,
					bw: 4,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G900F/*"
					},
					{
						ua: "SM-G900F"
					}],
					dpi: [415.6, 431.6],
					bw: 5,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G900M/*"
					},
					{
						ua: "SM-G900M"
					}],
					dpi: [415.6, 431.6],
					bw: 5,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G800F/*"
					},
					{
						ua: "SM-G800F"
					}],
					dpi: 326.8,
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G906S/*"
					},
					{
						ua: "SM-G906S"
					}],
					dpi: [562.7, 572.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-I9300/*"
					},
					{
						ua: "GT-I9300"
					}],
					dpi: [306.7, 304.8],
					bw: 5,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-T535/*"
					},
					{
						ua: "SM-T535"
					}],
					dpi: [142.6, 136.4],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-N920C/*"
					},
					{
						ua: "SM-N920C"
					}],
					dpi: [515.1, 518.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-I9300I/*"
					},
					{
						ua: "GT-I9300I"
					}],
					dpi: [304.8, 305.8],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-I9195/*"
					},
					{
						ua: "GT-I9195"
					}],
					dpi: [249.4, 256.7],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SPH-L520/*"
					},
					{
						ua: "SPH-L520"
					}],
					dpi: [249.4, 255.9],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SAMSUNG-SGH-I717/*"
					},
					{
						ua: "SAMSUNG-SGH-I717"
					}],
					dpi: 285.8,
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SPH-D710/*"
					},
					{
						ua: "SPH-D710"
					}],
					dpi: [217.7, 204.2],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/GT-N7100/*"
					},
					{
						ua: "GT-N7100"
					}],
					dpi: 265.1,
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SCH-I605/*"
					},
					{
						ua: "SCH-I605"
					}],
					dpi: 265.1,
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/Galaxy Nexus/*"
					},
					{
						ua: "Galaxy Nexus"
					}],
					dpi: [315.3, 314.2],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-N910H/*"
					},
					{
						ua: "SM-N910H"
					}],
					dpi: [515.1, 518],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-N910C/*"
					},
					{
						ua: "SM-N910C"
					}],
					dpi: [515.2, 520.2],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G130M/*"
					},
					{
						ua: "SM-G130M"
					}],
					dpi: [165.9, 164.8],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G928I/*"
					},
					{
						ua: "SM-G928I"
					}],
					dpi: [515.1, 518.4],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G920F/*"
					},
					{
						ua: "SM-G920F"
					}],
					dpi: 580.6,
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G920P/*"
					},
					{
						ua: "SM-G920P"
					}],
					dpi: [522.5, 577],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G925F/*"
					},
					{
						ua: "SM-G925F"
					}],
					dpi: 580.6,
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "samsung/*/SM-G925V/*"
					},
					{
						ua: "SM-G925V"
					}],
					dpi: [522.5, 576.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Sony/*/C6903/*"
					},
					{
						ua: "C6903"
					}],
					dpi: [442.5, 443.3],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Sony/*/D6653/*"
					},
					{
						ua: "D6653"
					}],
					dpi: [428.6, 427.6],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Sony/*/E6653/*"
					},
					{
						ua: "E6653"
					}],
					dpi: [428.6, 425.7],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Sony/*/E6853/*"
					},
					{
						ua: "E6853"
					}],
					dpi: [403.4, 401.9],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "Sony/*/SGP321/*"
					},
					{
						ua: "SGP321"
					}],
					dpi: [224.7, 224.1],
					bw: 3,
					ac: 500
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "TCT/*/ALCATEL ONE TOUCH Fierce/*"
					},
					{
						ua: "ALCATEL ONE TOUCH Fierce"
					}],
					dpi: [240, 247.5],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "THL/*/thl 5000/*"
					},
					{
						ua: "thl 5000"
					}],
					dpi: [480, 443.3],
					bw: 3,
					ac: 1e3
				},
				{
					type: "android",
					rules: [
					{
						mdmh: "ZTE/*/ZTE Blade L2/*"
					},
					{
						ua: "ZTE Blade L2"
					}],
					dpi: 240,
					bw: 3,
					ac: 500
				},
				{
					type: "ios",
					rules: [
					{
						res: [640, 960]
					}],
					dpi: [325.1, 328.4],
					bw: 4,
					ac: 1e3
				},
				{
					type: "ios",
					rules: [
					{
						res: [640, 960]
					}],
					dpi: [325.1, 328.4],
					bw: 4,
					ac: 1e3
				},
				{
					type: "ios",
					rules: [
					{
						res: [640, 1136]
					}],
					dpi: [317.1, 320.2],
					bw: 3,
					ac: 1e3
				},
				{
					type: "ios",
					rules: [
					{
						res: [640, 1136]
					}],
					dpi: [317.1, 320.2],
					bw: 3,
					ac: 1e3
				},
				{
					type: "ios",
					rules: [
					{
						res: [750, 1334]
					}],
					dpi: 326.4,
					bw: 4,
					ac: 1e3
				},
				{
					type: "ios",
					rules: [
					{
						res: [750, 1334]
					}],
					dpi: 326.4,
					bw: 4,
					ac: 1e3
				},
				{
					type: "ios",
					rules: [
					{
						res: [1242, 2208]
					}],
					dpi: [453.6, 458.4],
					bw: 4,
					ac: 1e3
				},
				{
					type: "ios",
					rules: [
					{
						res: [1242, 2208]
					}],
					dpi: [453.6, 458.4],
					bw: 4,
					ac: 1e3
				}]
			};
			return n.exports = i, n.exports
		}), e.registerDynamic("89", ["88", "86"], !0, function (e, t, n)
		{
			function i(e, t)
			{
				if (this.dpdb = o, this.recalculateDeviceParams_(), e)
				{
					this.onDeviceParamsUpdated = t, console.log("Fetching DPDB...");
					var n = new XMLHttpRequest,
						i = this;
					n.open("GET", a, !0), n.addEventListener("load", function ()
					{
						i.loading = !1, n.status >= 200 && n.status <= 299 ? (console.log("Successfully loaded online DPDB."), i.dpdb = JSON.parse(n.response), i.recalculateDeviceParams_()) : console.error("Error loading online DPDB!")
					}), n.send()
				}
			}

			function r(e)
			{
				this.xdpi = e.xdpi, this.ydpi = e.ydpi, this.bevelMm = e.bevelMm
			}
			this || self;
			var o = e("88"),
				s = e("86"),
				a = "https://storage.googleapis.com/cardboard-dpdb/dpdb.json";
			return i.prototype.getDeviceParams = function ()
			{
				return this.deviceParams
			}, i.prototype.recalculateDeviceParams_ = function ()
			{
				console.log("Recalculating device params.");
				var e = this.calcDeviceParams_();
				console.log("New device parameters:"), console.log(e), e ? (this.deviceParams = e, this.onDeviceParamsUpdated && this.onDeviceParamsUpdated(this.deviceParams)) : console.error("Failed to recalculate device parameters.")
			}, i.prototype.calcDeviceParams_ = function ()
			{
				var e = this.dpdb;
				if (!e) return console.error("DPDB not available."), null;
				if (1 != e.format) return console.error("DPDB has unexpected format version."), null;
				if (!e.devices || !e.devices.length) return console.error("DPDB does not have a devices section."), null;
				var t = navigator.userAgent || navigator.vendor || window.opera,
					n = s.getScreenWidth(),
					i = s.getScreenHeight();
				if (console.log("User agent: " + t), console.log("Pixel width: " + n), console.log("Pixel height: " + i), !e.devices) return console.error("DPDB has no devices section."), null;
				for (var o = 0; o < e.devices.length; o++)
				{
					var a = e.devices[o];
					if (a.rules)
						if ("ios" == a.type || "android" == a.type)
						{
							if (s.isIOS() == ("ios" == a.type))
							{
								for (var u = !1, c = 0; c < a.rules.length; c++)
								{
									var l = a.rules[c];
									if (this.matchRule_(l, t, n, i))
									{
										console.log("Rule matched:"), console.log(l), u = !0;
										break
									}
								}
								if (u) return new r(
								{
									xdpi: a.dpi[0] || a.dpi,
									ydpi: a.dpi[1] || a.dpi,
									bevelMm: a.bw
								})
							}
						}
					else console.warn("Device[" + o + "] has invalid type.");
					else console.warn("Device[" + o + "] has no rules section.")
				}
				return console.warn("No DPDB device match."), null
			}, i.prototype.matchRule_ = function (e, t, n, i)
			{
				if (!e.ua && !e.res) return !1;
				if (e.ua && t.indexOf(e.ua) < 0) return !1;
				if (e.res)
				{
					if (!e.res[0] || !e.res[1]) return !1;
					var r = e.res[0],
						o = e.res[1];
					if (Math.min(n, i) != Math.min(r, o) || Math.max(n, i) != Math.max(r, o)) return !1
				}
				return !0
			}, n.exports = i, n.exports
		}), e.registerDynamic("8a", [], !0, function (e, t, n)
		{
			function i(e, t)
			{
				this.set(e, t)
			}
			this || self;
			return i.prototype.set = function (e, t)
			{
				this.sample = e, this.timestampS = t
			}, i.prototype.copy = function (e)
			{
				this.set(e.sample, e.timestampS)
			}, n.exports = i, n.exports
		}), e.registerDynamic("8b", ["8a", "8c", "86"], !0, function (e, t, n)
		{
			function i(e)
			{
				this.kFilter = e, this.currentAccelMeasurement = new r, this.currentGyroMeasurement = new r, this.previousGyroMeasurement = new r, s.isIOS() ? this.filterQ = new o.Quaternion(-1, 0, 0, 1) : this.filterQ = new o.Quaternion(1, 0, 0, 1), this.previousFilterQ = new o.Quaternion, this.previousFilterQ.copy(this.filterQ), this.accelQ = new o.Quaternion, this.isOrientationInitialized = !1, this.estimatedGravity = new o.Vector3, this.measuredGravity = new o.Vector3, this.gyroIntegralQ = new o.Quaternion
			}
			this || self;
			var r = e("8a"),
				o = e("8c"),
				s = e("86");
			return i.prototype.addAccelMeasurement = function (e, t)
			{
				this.currentAccelMeasurement.set(e, t)
			}, i.prototype.addGyroMeasurement = function (e, t)
			{
				this.currentGyroMeasurement.set(e, t);
				var n = t - this.previousGyroMeasurement.timestampS;
				s.isTimestampDeltaValid(n) && this.run_(), this.previousGyroMeasurement.copy(this.currentGyroMeasurement)
			}, i.prototype.run_ = function ()
			{
				if (!this.isOrientationInitialized) return this.accelQ = this.accelToQuaternion_(this.currentAccelMeasurement.sample), this.previousFilterQ.copy(this.accelQ), void(this.isOrientationInitialized = !0);
				var e = this.currentGyroMeasurement.timestampS - this.previousGyroMeasurement.timestampS,
					t = this.gyroToQuaternionDelta_(this.currentGyroMeasurement.sample, e);
				this.gyroIntegralQ.multiply(t), this.filterQ.copy(this.previousFilterQ), this.filterQ.multiply(t);
				var n = new o.Quaternion;
				n.copy(this.filterQ), n.inverse(), this.estimatedGravity.set(0, 0, -1), this.estimatedGravity.applyQuaternion(n), this.estimatedGravity.normalize(), this.measuredGravity.copy(this.currentAccelMeasurement.sample), this.measuredGravity.normalize();
				var i = new o.Quaternion;
				i.setFromUnitVectors(this.estimatedGravity, this.measuredGravity), i.inverse();
				var r = new o.Quaternion;
				r.copy(this.filterQ), r.multiply(i), this.filterQ.slerp(r, 1 - this.kFilter), this.previousFilterQ.copy(this.filterQ)
			}, i.prototype.getOrientation = function ()
			{
				return this.filterQ
			}, i.prototype.accelToQuaternion_ = function (e)
			{
				var t = new o.Vector3;
				t.copy(e), t.normalize();
				var n = new o.Quaternion;
				return n.setFromUnitVectors(new o.Vector3(0, 0, -1), t), n.inverse(), n
			}, i.prototype.gyroToQuaternionDelta_ = function (e, t)
			{
				var n = new o.Quaternion,
					i = new o.Vector3;
				return i.copy(e), i.normalize(), n.setFromAxisAngle(i, e.length() * t), n
			}, n.exports = i, n.exports
		}), e.registerDynamic("8d", ["8c"], !0, function (e, t, n)
		{
			function i(e)
			{
				this.predictionTimeS = e, this.previousQ = new r.Quaternion, this.previousTimestampS = null, this.deltaQ = new r.Quaternion, this.outQ = new r.Quaternion
			}
			this || self;
			var r = e("8c");
			return i.prototype.getPrediction = function (e, t, n)
			{
				if (!this.previousTimestampS) return this.previousQ.copy(e), this.previousTimestampS = n, e;
				var i = new r.Vector3;
				i.copy(t), i.normalize();
				var o = t.length();
				if (o < 20 * r.degToRad) return this.outQ.copy(e), this.previousQ.copy(e), this.outQ;
				this.previousTimestampS;
				var s = o * this.predictionTimeS;
				return this.deltaQ.setFromAxisAngle(i, s), this.outQ.copy(this.previousQ), this.outQ.multiply(this.deltaQ), this.previousQ.copy(e), this.previousTimestampS = n, this.outQ
			}, n.exports = i, n.exports
		}), e.registerDynamic("8e", ["8c", "86"], !0, function (e, t, n)
		{
			function i()
			{
				window.addEventListener("touchstart", this.onTouchStart_.bind(this)), window.addEventListener("touchmove", this.onTouchMove_.bind(this)), window.addEventListener("touchend", this.onTouchEnd_.bind(this)), this.isTouching = !1, this.rotateStart = new r.Vector2, this.rotateEnd = new r.Vector2, this.rotateDelta = new r.Vector2, this.theta = 0, this.orientation = new r.Quaternion
			}
			this || self;
			var r = e("8c"),
				o = e("86");
			return i.prototype.getOrientation = function ()
			{
				return this.orientation.setFromEulerXYZ(0, 0, this.theta), this.orientation
			}, i.prototype.resetSensor = function ()
			{
				this.theta = 0
			}, i.prototype.onTouchStart_ = function (e)
			{
				1 == e.touches.length && (this.rotateStart.set(e.touches[0].pageX, e.touches[0].pageY), this.isTouching = !0)
			}, i.prototype.onTouchMove_ = function (e)
			{
				if (this.isTouching)
				{
					this.rotateEnd.set(e.touches[0].pageX, e.touches[0].pageY), this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart), this.rotateStart.copy(this.rotateEnd), o.isIOS() && (this.rotateDelta.x *= -1);
					var t = document.body;
					this.theta += 2 * Math.PI * this.rotateDelta.x / t.clientWidth * .5
				}
			}, i.prototype.onTouchEnd_ = function (e)
			{
				this.isTouching = !1
			}, n.exports = i, n.exports
		}), e.registerDynamic("8f", ["8b", "8d", "8e", "8c", "86"], !0, function (e, t, n)
		{
			function i()
			{
				this.deviceId = "webvr-polyfill:fused", this.deviceName = "VR Position Device (webvr-polyfill:fused)", this.accelerometer = new a.Vector3, this.gyroscope = new a.Vector3, window.addEventListener("devicemotion", this.onDeviceMotionChange_.bind(this)), window.addEventListener("orientationchange", this.onScreenOrientationChange_.bind(this)), this.filter = new r(WebVRConfig.K_FILTER), this.posePredictor = new o(WebVRConfig.PREDICTION_TIME_S), this.touchPanner = new s, this.filterToWorldQ = new a.Quaternion, u.isIOS() ? this.filterToWorldQ.setFromAxisAngle(new a.Vector3(1, 0, 0), Math.PI / 2) : this.filterToWorldQ.setFromAxisAngle(new a.Vector3(1, 0, 0), -Math.PI / 2), this.inverseWorldToScreenQ = new a.Quaternion, this.worldToScreenQ = new a.Quaternion, this.originalPoseAdjustQ = new a.Quaternion, this.originalPoseAdjustQ.setFromAxisAngle(new a.Vector3(0, 0, 1), -window.orientation * Math.PI / 180), this.setScreenTransform_(), u.isLandscapeMode() && this.filterToWorldQ.multiply(this.inverseWorldToScreenQ), this.resetQ = new a.Quaternion, this.isFirefoxAndroid = u.isFirefoxAndroid(), this.isIOS = u.isIOS(), this.orientationOut_ = new Float32Array(4)
			}
			this || self;
			var r = e("8b"),
				o = e("8d"),
				s = e("8e"),
				a = e("8c"),
				u = e("86");
			return i.prototype.getPosition = function ()
			{
				return null
			}, i.prototype.getOrientation = function ()
			{
				var e = this.filter.getOrientation();
				this.predictedQ = this.posePredictor.getPrediction(e, this.gyroscope, this.previousTimestampS);
				var t = new a.Quaternion;
				return t.copy(this.filterToWorldQ), t.multiply(this.resetQ), WebVRConfig.TOUCH_PANNER_DISABLED || t.multiply(this.touchPanner.getOrientation()), t.multiply(this.predictedQ), t.multiply(this.worldToScreenQ), WebVRConfig.YAW_ONLY && (t.x = 0, t.z = 0, t.normalize()), this.orientationOut_[0] = t.x, this.orientationOut_[1] = t.y, this.orientationOut_[2] = t.z, this.orientationOut_[3] = t.w, this.orientationOut_
			}, i.prototype.resetPose = function ()
			{
				this.resetQ.copy(this.filter.getOrientation()), this.resetQ.x = 0, this.resetQ.y = 0, this.resetQ.z *= -1, this.resetQ.normalize(), u.isLandscapeMode() && this.resetQ.multiply(this.inverseWorldToScreenQ), this.resetQ.multiply(this.originalPoseAdjustQ), WebVRConfig.TOUCH_PANNER_DISABLED || this.touchPanner.resetSensor()
			}, i.prototype.onDeviceMotionChange_ = function (e)
			{
				var t = e.accelerationIncludingGravity,
					n = e.rotationRate,
					i = e.timeStamp / 1e3;
				this.isFirefoxAndroid && (i /= 1e3);
				var r = i - this.previousTimestampS;
				if (r <= u.MIN_TIMESTEP || r > u.MAX_TIMESTEP) return console.warn("Invalid timestamps detected. Time step between successive gyroscope sensor samples is very small or not monotonic"), void(this.previousTimestampS = i);
				this.accelerometer.set(-t.x, -t.y, -t.z), this.gyroscope.set(n.alpha, n.beta, n.gamma), (this.isIOS || this.isFirefoxAndroid) && this.gyroscope.multiplyScalar(Math.PI / 180), this.filter.addAccelMeasurement(this.accelerometer, i), this.filter.addGyroMeasurement(this.gyroscope, i), this.previousTimestampS = i
			}, i.prototype.onScreenOrientationChange_ = function (e)
			{
				this.setScreenTransform_()
			}, i.prototype.setScreenTransform_ = function ()
			{
				switch (this.worldToScreenQ.set(0, 0, 0, 1), window.orientation)
				{
				case 0:
					break;
				case 90:
					this.worldToScreenQ.setFromAxisAngle(new a.Vector3(0, 0, 1), -Math.PI / 2);
					break;
				case -90:
					this.worldToScreenQ.setFromAxisAngle(new a.Vector3(0, 0, 1), Math.PI / 2)
				}
				this.inverseWorldToScreenQ.copy(this.worldToScreenQ), this.inverseWorldToScreenQ.inverse()
			}, n.exports = i, n.exports
		}), e.registerDynamic("90", ["86"], !0, function (e, t, n)
		{
			function i()
			{
				this.loadIcon_();
				var e = document.createElement("div"),
					t = e.style;
				t.position = "fixed", t.top = 0, t.right = 0, t.bottom = 0, t.left = 0, t.backgroundColor = "gray", t.fontFamily = "sans-serif", t.zIndex = 1e6;
				var n = document.createElement("img");
				n.src = this.icon, (t = n.style).marginLeft = "25%", t.marginTop = "25%", t.width = "50%", e.appendChild(n);
				var i = document.createElement("div");
				(t = i.style).textAlign = "center", t.fontSize = "16px", t.lineHeight = "24px", t.margin = "24px 25%", t.width = "50%", i.innerHTML = "Place your phone into your Cardboard viewer.", e.appendChild(i);
				var r = document.createElement("div");
				(t = r.style).backgroundColor = "#CFD8DC", t.position = "fixed", t.bottom = 0, t.width = "100%", t.height = "48px", t.padding = "14px 24px", t.boxSizing = "border-box", t.color = "#656A6B", e.appendChild(r);
				var o = document.createElement("div");
				o.style.float = "left", o.innerHTML = "No Cardboard viewer?";
				var s = document.createElement("a");
				s.href = "https://www.google.com/get/cardboard/get-cardboard/", s.innerHTML = "get one", s.target = "_blank", (t = s.style).float = "right", t.fontWeight = 600, t.textTransform = "uppercase", t.borderLeft = "1px solid gray", t.paddingLeft = "24px", t.textDecoration = "none", t.color = "#656A6B", r.appendChild(o), r.appendChild(s), this.overlay = e, this.text = i, this.hide()
			}
			this || self;
			var r = e("86");
			return i.prototype.show = function (e)
			{
				e || this.overlay.parentElement ? e && (this.overlay.parentElement && this.overlay.parentElement != e && this.overlay.parentElement.removeChild(this.overlay), e.appendChild(this.overlay)) : document.body.appendChild(this.overlay), this.overlay.style.display = "block";
				var t = this.overlay.querySelector("img").style;
				r.isLandscapeMode() ? (t.width = "20%", t.marginLeft = "40%", t.marginTop = "3%") : (t.width = "50%", t.marginLeft = "25%", t.marginTop = "25%")
			}, i.prototype.hide = function ()
			{
				this.overlay.style.display = "none"
			}, i.prototype.showTemporarily = function (e, t)
			{
				this.show(t), this.timer = setTimeout(this.hide.bind(this), e)
			}, i.prototype.disableShowTemporarily = function ()
			{
				clearTimeout(this.timer)
			}, i.prototype.update = function ()
			{
				this.disableShowTemporarily(), !r.isLandscapeMode() && r.isMobile() ? this.show() : this.hide()
			}, i.prototype.loadIcon_ = function ()
			{
				this.icon = r.base64("image/svg+xml", "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE5OHB4IiBoZWlnaHQ9IjI0MHB4IiB2aWV3Qm94PSIwIDAgMTk4IDI0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuMy4zICgxMjA4MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+dHJhbnNpdGlvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSJ0cmFuc2l0aW9uIiBza2V0Y2g6dHlwZT0iTVNBcnRib2FyZEdyb3VwIj4KICAgICAgICAgICAgPGcgaWQ9IkltcG9ydGVkLUxheWVycy1Db3B5LTQtKy1JbXBvcnRlZC1MYXllcnMtQ29weS0rLUltcG9ydGVkLUxheWVycy1Db3B5LTItQ29weSIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iSW1wb3J0ZWQtTGF5ZXJzLUNvcHktNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDEwNy4wMDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQ5LjYyNSwyLjUyNyBDMTQ5LjYyNSwyLjUyNyAxNTUuODA1LDYuMDk2IDE1Ni4zNjIsNi40MTggTDE1Ni4zNjIsNy4zMDQgQzE1Ni4zNjIsNy40ODEgMTU2LjM3NSw3LjY2NCAxNTYuNCw3Ljg1MyBDMTU2LjQxLDcuOTM0IDE1Ni40Miw4LjAxNSAxNTYuNDI3LDguMDk1IEMxNTYuNTY3LDkuNTEgMTU3LjQwMSwxMS4wOTMgMTU4LjUzMiwxMi4wOTQgTDE2NC4yNTIsMTcuMTU2IEwxNjQuMzMzLDE3LjA2NiBDMTY0LjMzMywxNy4wNjYgMTY4LjcxNSwxNC41MzYgMTY5LjU2OCwxNC4wNDIgQzE3MS4wMjUsMTQuODgzIDE5NS41MzgsMjkuMDM1IDE5NS41MzgsMjkuMDM1IEwxOTUuNTM4LDgzLjAzNiBDMTk1LjUzOCw4My44MDcgMTk1LjE1Miw4NC4yNTMgMTk0LjU5LDg0LjI1MyBDMTk0LjM1Nyw4NC4yNTMgMTk0LjA5NSw4NC4xNzcgMTkzLjgxOCw4NC4wMTcgTDE2OS44NTEsNzAuMTc5IEwxNjkuODM3LDcwLjIwMyBMMTQyLjUxNSw4NS45NzggTDE0MS42NjUsODQuNjU1IEMxMzYuOTM0LDgzLjEyNiAxMzEuOTE3LDgxLjkxNSAxMjYuNzE0LDgxLjA0NSBDMTI2LjcwOSw4MS4wNiAxMjYuNzA3LDgxLjA2OSAxMjYuNzA3LDgxLjA2OSBMMTIxLjY0LDk4LjAzIEwxMTMuNzQ5LDEwMi41ODYgTDExMy43MTIsMTAyLjUyMyBMMTEzLjcxMiwxMzAuMTEzIEMxMTMuNzEyLDEzMC44ODUgMTEzLjMyNiwxMzEuMzMgMTEyLjc2NCwxMzEuMzMgQzExMi41MzIsMTMxLjMzIDExMi4yNjksMTMxLjI1NCAxMTEuOTkyLDEzMS4wOTQgTDY5LjUxOSwxMDYuNTcyIEM2OC41NjksMTA2LjAyMyA2Ny43OTksMTA0LjY5NSA2Ny43OTksMTAzLjYwNSBMNjcuNzk5LDEwMi41NyBMNjcuNzc4LDEwMi42MTcgQzY3LjI3LDEwMi4zOTMgNjYuNjQ4LDEwMi4yNDkgNjUuOTYyLDEwMi4yMTggQzY1Ljg3NSwxMDIuMjE0IDY1Ljc4OCwxMDIuMjEyIDY1LjcwMSwxMDIuMjEyIEM2NS42MDYsMTAyLjIxMiA2NS41MTEsMTAyLjIxNSA2NS40MTYsMTAyLjIxOSBDNjUuMTk1LDEwMi4yMjkgNjQuOTc0LDEwMi4yMzUgNjQuNzU0LDEwMi4yMzUgQzY0LjMzMSwxMDIuMjM1IDYzLjkxMSwxMDIuMjE2IDYzLjQ5OCwxMDIuMTc4IEM2MS44NDMsMTAyLjAyNSA2MC4yOTgsMTAxLjU3OCA1OS4wOTQsMTAwLjg4MiBMMTIuNTE4LDczLjk5MiBMMTIuNTIzLDc0LjAwNCBMMi4yNDUsNTUuMjU0IEMxLjI0NCw1My40MjcgMi4wMDQsNTEuMDM4IDMuOTQzLDQ5LjkxOCBMNTkuOTU0LDE3LjU3MyBDNjAuNjI2LDE3LjE4NSA2MS4zNSwxNy4wMDEgNjIuMDUzLDE3LjAwMSBDNjMuMzc5LDE3LjAwMSA2NC42MjUsMTcuNjYgNjUuMjgsMTguODU0IEw2NS4yODUsMTguODUxIEw2NS41MTIsMTkuMjY0IEw2NS41MDYsMTkuMjY4IEM2NS45MDksMjAuMDAzIDY2LjQwNSwyMC42OCA2Ni45ODMsMjEuMjg2IEw2Ny4yNiwyMS41NTYgQzY5LjE3NCwyMy40MDYgNzEuNzI4LDI0LjM1NyA3NC4zNzMsMjQuMzU3IEM3Ni4zMjIsMjQuMzU3IDc4LjMyMSwyMy44NCA4MC4xNDgsMjIuNzg1IEM4MC4xNjEsMjIuNzg1IDg3LjQ2NywxOC41NjYgODcuNDY3LDE4LjU2NiBDODguMTM5LDE4LjE3OCA4OC44NjMsMTcuOTk0IDg5LjU2NiwxNy45OTQgQzkwLjg5MiwxNy45OTQgOTIuMTM4LDE4LjY1MiA5Mi43OTIsMTkuODQ3IEw5Ni4wNDIsMjUuNzc1IEw5Ni4wNjQsMjUuNzU3IEwxMDIuODQ5LDI5LjY3NCBMMTAyLjc0NCwyOS40OTIgTDE0OS42MjUsMi41MjcgTTE0OS42MjUsMC44OTIgQzE0OS4zNDMsMC44OTIgMTQ5LjA2MiwwLjk2NSAxNDguODEsMS4xMSBMMTAyLjY0MSwyNy42NjYgTDk3LjIzMSwyNC41NDIgTDk0LjIyNiwxOS4wNjEgQzkzLjMxMywxNy4zOTQgOTEuNTI3LDE2LjM1OSA4OS41NjYsMTYuMzU4IEM4OC41NTUsMTYuMzU4IDg3LjU0NiwxNi42MzIgODYuNjQ5LDE3LjE1IEM4My44NzgsMTguNzUgNzkuNjg3LDIxLjE2OSA3OS4zNzQsMjEuMzQ1IEM3OS4zNTksMjEuMzUzIDc5LjM0NSwyMS4zNjEgNzkuMzMsMjEuMzY5IEM3Ny43OTgsMjIuMjU0IDc2LjA4NCwyMi43MjIgNzQuMzczLDIyLjcyMiBDNzIuMDgxLDIyLjcyMiA2OS45NTksMjEuODkgNjguMzk3LDIwLjM4IEw2OC4xNDUsMjAuMTM1IEM2Ny43MDYsMTkuNjcyIDY3LjMyMywxOS4xNTYgNjcuMDA2LDE4LjYwMSBDNjYuOTg4LDE4LjU1OSA2Ni45NjgsMTguNTE5IDY2Ljk0NiwxOC40NzkgTDY2LjcxOSwxOC4wNjUgQzY2LjY5LDE4LjAxMiA2Ni42NTgsMTcuOTYgNjYuNjI0LDE3LjkxMSBDNjUuNjg2LDE2LjMzNyA2My45NTEsMTUuMzY2IDYyLjA1MywxNS4zNjYgQzYxLjA0MiwxNS4zNjYgNjAuMDMzLDE1LjY0IDU5LjEzNiwxNi4xNTggTDMuMTI1LDQ4LjUwMiBDMC40MjYsNTAuMDYxIC0wLjYxMyw1My40NDIgMC44MTEsNTYuMDQgTDExLjA4OSw3NC43OSBDMTEuMjY2LDc1LjExMyAxMS41MzcsNzUuMzUzIDExLjg1LDc1LjQ5NCBMNTguMjc2LDEwMi4yOTggQzU5LjY3OSwxMDMuMTA4IDYxLjQzMywxMDMuNjMgNjMuMzQ4LDEwMy44MDYgQzYzLjgxMiwxMDMuODQ4IDY0LjI4NSwxMDMuODcgNjQuNzU0LDEwMy44NyBDNjUsMTAzLjg3IDY1LjI0OSwxMDMuODY0IDY1LjQ5NCwxMDMuODUyIEM2NS41NjMsMTAzLjg0OSA2NS42MzIsMTAzLjg0NyA2NS43MDEsMTAzLjg0NyBDNjUuNzY0LDEwMy44NDcgNjUuODI4LDEwMy44NDkgNjUuODksMTAzLjg1MiBDNjUuOTg2LDEwMy44NTYgNjYuMDgsMTAzLjg2MyA2Ni4xNzMsMTAzLjg3NCBDNjYuMjgyLDEwNS40NjcgNjcuMzMyLDEwNy4xOTcgNjguNzAyLDEwNy45ODggTDExMS4xNzQsMTMyLjUxIEMxMTEuNjk4LDEzMi44MTIgMTEyLjIzMiwxMzIuOTY1IDExMi43NjQsMTMyLjk2NSBDMTE0LjI2MSwxMzIuOTY1IDExNS4zNDcsMTMxLjc2NSAxMTUuMzQ3LDEzMC4xMTMgTDExNS4zNDcsMTAzLjU1MSBMMTIyLjQ1OCw5OS40NDYgQzEyMi44MTksOTkuMjM3IDEyMy4wODcsOTguODk4IDEyMy4yMDcsOTguNDk4IEwxMjcuODY1LDgyLjkwNSBDMTMyLjI3OSw4My43MDIgMTM2LjU1Nyw4NC43NTMgMTQwLjYwNyw4Ni4wMzMgTDE0MS4xNCw4Ni44NjIgQzE0MS40NTEsODcuMzQ2IDE0MS45NzcsODcuNjEzIDE0Mi41MTYsODcuNjEzIEMxNDIuNzk0LDg3LjYxMyAxNDMuMDc2LDg3LjU0MiAxNDMuMzMzLDg3LjM5MyBMMTY5Ljg2NSw3Mi4wNzYgTDE5Myw4NS40MzMgQzE5My41MjMsODUuNzM1IDE5NC4wNTgsODUuODg4IDE5NC41OSw4NS44ODggQzE5Ni4wODcsODUuODg4IDE5Ny4xNzMsODQuNjg5IDE5Ny4xNzMsODMuMDM2IEwxOTcuMTczLDI5LjAzNSBDMTk3LjE3MywyOC40NTEgMTk2Ljg2MSwyNy45MTEgMTk2LjM1NSwyNy42MTkgQzE5Ni4zNTUsMjcuNjE5IDE3MS44NDMsMTMuNDY3IDE3MC4zODUsMTIuNjI2IEMxNzAuMTMyLDEyLjQ4IDE2OS44NSwxMi40MDcgMTY5LjU2OCwxMi40MDcgQzE2OS4yODUsMTIuNDA3IDE2OS4wMDIsMTIuNDgxIDE2OC43NDksMTIuNjI3IEMxNjguMTQzLDEyLjk3OCAxNjUuNzU2LDE0LjM1NyAxNjQuNDI0LDE1LjEyNSBMMTU5LjYxNSwxMC44NyBDMTU4Ljc5NiwxMC4xNDUgMTU4LjE1NCw4LjkzNyAxNTguMDU0LDcuOTM0IEMxNTguMDQ1LDcuODM3IDE1OC4wMzQsNy43MzkgMTU4LjAyMSw3LjY0IEMxNTguMDA1LDcuNTIzIDE1Ny45OTgsNy40MSAxNTcuOTk4LDcuMzA0IEwxNTcuOTk4LDYuNDE4IEMxNTcuOTk4LDUuODM0IDE1Ny42ODYsNS4yOTUgMTU3LjE4MSw1LjAwMiBDMTU2LjYyNCw0LjY4IDE1MC40NDIsMS4xMTEgMTUwLjQ0MiwxLjExMSBDMTUwLjE4OSwwLjk2NSAxNDkuOTA3LDAuODkyIDE0OS42MjUsMC44OTIiIGlkPSJGaWxsLTEiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTYuMDI3LDI1LjYzNiBMMTQyLjYwMyw1Mi41MjcgQzE0My44MDcsNTMuMjIyIDE0NC41ODIsNTQuMTE0IDE0NC44NDUsNTUuMDY4IEwxNDQuODM1LDU1LjA3NSBMNjMuNDYxLDEwMi4wNTcgTDYzLjQ2LDEwMi4wNTcgQzYxLjgwNiwxMDEuOTA1IDYwLjI2MSwxMDEuNDU3IDU5LjA1NywxMDAuNzYyIEwxMi40ODEsNzMuODcxIEw5Ni4wMjcsMjUuNjM2IiBpZD0iRmlsbC0yIiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYzLjQ2MSwxMDIuMTc0IEM2My40NTMsMTAyLjE3NCA2My40NDYsMTAyLjE3NCA2My40MzksMTAyLjE3MiBDNjEuNzQ2LDEwMi4wMTYgNjAuMjExLDEwMS41NjMgNTguOTk4LDEwMC44NjMgTDEyLjQyMiw3My45NzMgQzEyLjM4Niw3My45NTIgMTIuMzY0LDczLjkxNCAxMi4zNjQsNzMuODcxIEMxMi4zNjQsNzMuODMgMTIuMzg2LDczLjc5MSAxMi40MjIsNzMuNzcgTDk1Ljk2OCwyNS41MzUgQzk2LjAwNCwyNS41MTQgOTYuMDQ5LDI1LjUxNCA5Ni4wODUsMjUuNTM1IEwxNDIuNjYxLDUyLjQyNiBDMTQzLjg4OCw1My4xMzQgMTQ0LjY4Miw1NC4wMzggMTQ0Ljk1Nyw1NS4wMzcgQzE0NC45Nyw1NS4wODMgMTQ0Ljk1Myw1NS4xMzMgMTQ0LjkxNSw1NS4xNjEgQzE0NC45MTEsNTUuMTY1IDE0NC44OTgsNTUuMTc0IDE0NC44OTQsNTUuMTc3IEw2My41MTksMTAyLjE1OCBDNjMuNTAxLDEwMi4xNjkgNjMuNDgxLDEwMi4xNzQgNjMuNDYxLDEwMi4xNzQgTDYzLjQ2MSwxMDIuMTc0IFogTTEyLjcxNCw3My44NzEgTDU5LjExNSwxMDAuNjYxIEM2MC4yOTMsMTAxLjM0MSA2MS43ODYsMTAxLjc4MiA2My40MzUsMTAxLjkzNyBMMTQ0LjcwNyw1NS4wMTUgQzE0NC40MjgsNTQuMTA4IDE0My42ODIsNTMuMjg1IDE0Mi41NDQsNTIuNjI4IEw5Ni4wMjcsMjUuNzcxIEwxMi43MTQsNzMuODcxIEwxMi43MTQsNzMuODcxIFoiIGlkPSJGaWxsLTMiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQ4LjMyNyw1OC40NzEgQzE0OC4xNDUsNTguNDggMTQ3Ljk2Miw1OC40OCAxNDcuNzgxLDU4LjQ3MiBDMTQ1Ljg4Nyw1OC4zODkgMTQ0LjQ3OSw1Ny40MzQgMTQ0LjYzNiw1Ni4zNCBDMTQ0LjY4OSw1NS45NjcgMTQ0LjY2NCw1NS41OTcgMTQ0LjU2NCw1NS4yMzUgTDYzLjQ2MSwxMDIuMDU3IEM2NC4wODksMTAyLjExNSA2NC43MzMsMTAyLjEzIDY1LjM3OSwxMDIuMDk5IEM2NS41NjEsMTAyLjA5IDY1Ljc0MywxMDIuMDkgNjUuOTI1LDEwMi4wOTggQzY3LjgxOSwxMDIuMTgxIDY5LjIyNywxMDMuMTM2IDY5LjA3LDEwNC4yMyBMMTQ4LjMyNyw1OC40NzEiIGlkPSJGaWxsLTQiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNjkuMDcsMTA0LjM0NyBDNjkuMDQ4LDEwNC4zNDcgNjkuMDI1LDEwNC4zNCA2OS4wMDUsMTA0LjMyNyBDNjguOTY4LDEwNC4zMDEgNjguOTQ4LDEwNC4yNTcgNjguOTU1LDEwNC4yMTMgQzY5LDEwMy44OTYgNjguODk4LDEwMy41NzYgNjguNjU4LDEwMy4yODggQzY4LjE1MywxMDIuNjc4IDY3LjEwMywxMDIuMjY2IDY1LjkyLDEwMi4yMTQgQzY1Ljc0MiwxMDIuMjA2IDY1LjU2MywxMDIuMjA3IDY1LjM4NSwxMDIuMjE1IEM2NC43NDIsMTAyLjI0NiA2NC4wODcsMTAyLjIzMiA2My40NSwxMDIuMTc0IEM2My4zOTksMTAyLjE2OSA2My4zNTgsMTAyLjEzMiA2My4zNDcsMTAyLjA4MiBDNjMuMzM2LDEwMi4wMzMgNjMuMzU4LDEwMS45ODEgNjMuNDAyLDEwMS45NTYgTDE0NC41MDYsNTUuMTM0IEMxNDQuNTM3LDU1LjExNiAxNDQuNTc1LDU1LjExMyAxNDQuNjA5LDU1LjEyNyBDMTQ0LjY0Miw1NS4xNDEgMTQ0LjY2OCw1NS4xNyAxNDQuNjc3LDU1LjIwNCBDMTQ0Ljc4MSw1NS41ODUgMTQ0LjgwNiw1NS45NzIgMTQ0Ljc1MSw1Ni4zNTcgQzE0NC43MDYsNTYuNjczIDE0NC44MDgsNTYuOTk0IDE0NS4wNDcsNTcuMjgyIEMxNDUuNTUzLDU3Ljg5MiAxNDYuNjAyLDU4LjMwMyAxNDcuNzg2LDU4LjM1NSBDMTQ3Ljk2NCw1OC4zNjMgMTQ4LjE0Myw1OC4zNjMgMTQ4LjMyMSw1OC4zNTQgQzE0OC4zNzcsNTguMzUyIDE0OC40MjQsNTguMzg3IDE0OC40MzksNTguNDM4IEMxNDguNDU0LDU4LjQ5IDE0OC40MzIsNTguNTQ1IDE0OC4zODUsNTguNTcyIEw2OS4xMjksMTA0LjMzMSBDNjkuMTExLDEwNC4zNDIgNjkuMDksMTA0LjM0NyA2OS4wNywxMDQuMzQ3IEw2OS4wNywxMDQuMzQ3IFogTTY1LjY2NSwxMDEuOTc1IEM2NS43NTQsMTAxLjk3NSA2NS44NDIsMTAxLjk3NyA2NS45MywxMDEuOTgxIEM2Ny4xOTYsMTAyLjAzNyA2OC4yODMsMTAyLjQ2OSA2OC44MzgsMTAzLjEzOSBDNjkuMDY1LDEwMy40MTMgNjkuMTg4LDEwMy43MTQgNjkuMTk4LDEwNC4wMjEgTDE0Ny44ODMsNTguNTkyIEMxNDcuODQ3LDU4LjU5MiAxNDcuODExLDU4LjU5MSAxNDcuNzc2LDU4LjU4OSBDMTQ2LjUwOSw1OC41MzMgMTQ1LjQyMiw1OC4xIDE0NC44NjcsNTcuNDMxIEMxNDQuNTg1LDU3LjA5MSAxNDQuNDY1LDU2LjcwNyAxNDQuNTIsNTYuMzI0IEMxNDQuNTYzLDU2LjAyMSAxNDQuNTUyLDU1LjcxNiAxNDQuNDg4LDU1LjQxNCBMNjMuODQ2LDEwMS45NyBDNjQuMzUzLDEwMi4wMDIgNjQuODY3LDEwMi4wMDYgNjUuMzc0LDEwMS45ODIgQzY1LjQ3MSwxMDEuOTc3IDY1LjU2OCwxMDEuOTc1IDY1LjY2NSwxMDEuOTc1IEw2NS42NjUsMTAxLjk3NSBaIiBpZD0iRmlsbC01IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIuMjA4LDU1LjEzNCBDMS4yMDcsNTMuMzA3IDEuOTY3LDUwLjkxNyAzLjkwNiw0OS43OTcgTDU5LjkxNywxNy40NTMgQzYxLjg1NiwxNi4zMzMgNjQuMjQxLDE2LjkwNyA2NS4yNDMsMTguNzM0IEw2NS40NzUsMTkuMTQ0IEM2NS44NzIsMTkuODgyIDY2LjM2OCwyMC41NiA2Ni45NDUsMjEuMTY1IEw2Ny4yMjMsMjEuNDM1IEM3MC41NDgsMjQuNjQ5IDc1LjgwNiwyNS4xNTEgODAuMTExLDIyLjY2NSBMODcuNDMsMTguNDQ1IEM4OS4zNywxNy4zMjYgOTEuNzU0LDE3Ljg5OSA5Mi43NTUsMTkuNzI3IEw5Ni4wMDUsMjUuNjU1IEwxMi40ODYsNzMuODg0IEwyLjIwOCw1NS4xMzQgWiIgaWQ9IkZpbGwtNiIgZmlsbD0iI0ZBRkFGQSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMi40ODYsNzQuMDAxIEMxMi40NzYsNzQuMDAxIDEyLjQ2NSw3My45OTkgMTIuNDU1LDczLjk5NiBDMTIuNDI0LDczLjk4OCAxMi4zOTksNzMuOTY3IDEyLjM4NCw3My45NCBMMi4xMDYsNTUuMTkgQzEuMDc1LDUzLjMxIDEuODU3LDUwLjg0NSAzLjg0OCw0OS42OTYgTDU5Ljg1OCwxNy4zNTIgQzYwLjUyNSwxNi45NjcgNjEuMjcxLDE2Ljc2NCA2Mi4wMTYsMTYuNzY0IEM2My40MzEsMTYuNzY0IDY0LjY2NiwxNy40NjYgNjUuMzI3LDE4LjY0NiBDNjUuMzM3LDE4LjY1NCA2NS4zNDUsMTguNjYzIDY1LjM1MSwxOC42NzQgTDY1LjU3OCwxOS4wODggQzY1LjU4NCwxOS4xIDY1LjU4OSwxOS4xMTIgNjUuNTkxLDE5LjEyNiBDNjUuOTg1LDE5LjgzOCA2Ni40NjksMjAuNDk3IDY3LjAzLDIxLjA4NSBMNjcuMzA1LDIxLjM1MSBDNjkuMTUxLDIzLjEzNyA3MS42NDksMjQuMTIgNzQuMzM2LDI0LjEyIEM3Ni4zMTMsMjQuMTIgNzguMjksMjMuNTgyIDgwLjA1MywyMi41NjMgQzgwLjA2NCwyMi41NTcgODAuMDc2LDIyLjU1MyA4MC4wODgsMjIuNTUgTDg3LjM3MiwxOC4zNDQgQzg4LjAzOCwxNy45NTkgODguNzg0LDE3Ljc1NiA4OS41MjksMTcuNzU2IEM5MC45NTYsMTcuNzU2IDkyLjIwMSwxOC40NzIgOTIuODU4LDE5LjY3IEw5Ni4xMDcsMjUuNTk5IEM5Ni4xMzgsMjUuNjU0IDk2LjExOCwyNS43MjQgOTYuMDYzLDI1Ljc1NiBMMTIuNTQ1LDczLjk4NSBDMTIuNTI2LDczLjk5NiAxMi41MDYsNzQuMDAxIDEyLjQ4Niw3NC4wMDEgTDEyLjQ4Niw3NC4wMDEgWiBNNjIuMDE2LDE2Ljk5NyBDNjEuMzEyLDE2Ljk5NyA2MC42MDYsMTcuMTkgNTkuOTc1LDE3LjU1NCBMMy45NjUsNDkuODk5IEMyLjA4Myw1MC45ODUgMS4zNDEsNTMuMzA4IDIuMzEsNTUuMDc4IEwxMi41MzEsNzMuNzIzIEw5NS44NDgsMjUuNjExIEw5Mi42NTMsMTkuNzgyIEM5Mi4wMzgsMTguNjYgOTAuODcsMTcuOTkgODkuNTI5LDE3Ljk5IEM4OC44MjUsMTcuOTkgODguMTE5LDE4LjE4MiA4Ny40ODksMTguNTQ3IEw4MC4xNzIsMjIuNzcyIEM4MC4xNjEsMjIuNzc4IDgwLjE0OSwyMi43ODIgODAuMTM3LDIyLjc4NSBDNzguMzQ2LDIzLjgxMSA3Ni4zNDEsMjQuMzU0IDc0LjMzNiwyNC4zNTQgQzcxLjU4OCwyNC4zNTQgNjkuMDMzLDIzLjM0NyA2Ny4xNDIsMjEuNTE5IEw2Ni44NjQsMjEuMjQ5IEM2Ni4yNzcsMjAuNjM0IDY1Ljc3NCwxOS45NDcgNjUuMzY3LDE5LjIwMyBDNjUuMzYsMTkuMTkyIDY1LjM1NiwxOS4xNzkgNjUuMzU0LDE5LjE2NiBMNjUuMTYzLDE4LjgxOSBDNjUuMTU0LDE4LjgxMSA2NS4xNDYsMTguODAxIDY1LjE0LDE4Ljc5IEM2NC41MjUsMTcuNjY3IDYzLjM1NywxNi45OTcgNjIuMDE2LDE2Ljk5NyBMNjIuMDE2LDE2Ljk5NyBaIiBpZD0iRmlsbC03IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTQyLjQzNCw0OC44MDggTDQyLjQzNCw0OC44MDggQzM5LjkyNCw0OC44MDcgMzcuNzM3LDQ3LjU1IDM2LjU4Miw0NS40NDMgQzM0Ljc3MSw0Mi4xMzkgMzYuMTQ0LDM3LjgwOSAzOS42NDEsMzUuNzg5IEw1MS45MzIsMjguNjkxIEM1My4xMDMsMjguMDE1IDU0LjQxMywyNy42NTggNTUuNzIxLDI3LjY1OCBDNTguMjMxLDI3LjY1OCA2MC40MTgsMjguOTE2IDYxLjU3MywzMS4wMjMgQzYzLjM4NCwzNC4zMjcgNjIuMDEyLDM4LjY1NyA1OC41MTQsNDAuNjc3IEw0Ni4yMjMsNDcuNzc1IEM0NS4wNTMsNDguNDUgNDMuNzQyLDQ4LjgwOCA0Mi40MzQsNDguODA4IEw0Mi40MzQsNDguODA4IFogTTU1LjcyMSwyOC4xMjUgQzU0LjQ5NSwyOC4xMjUgNTMuMjY1LDI4LjQ2MSA1Mi4xNjYsMjkuMDk2IEwzOS44NzUsMzYuMTk0IEMzNi41OTYsMzguMDg3IDM1LjMwMiw0Mi4xMzYgMzYuOTkyLDQ1LjIxOCBDMzguMDYzLDQ3LjE3MyA0MC4wOTgsNDguMzQgNDIuNDM0LDQ4LjM0IEM0My42NjEsNDguMzQgNDQuODksNDguMDA1IDQ1Ljk5LDQ3LjM3IEw1OC4yODEsNDAuMjcyIEM2MS41NiwzOC4zNzkgNjIuODUzLDM0LjMzIDYxLjE2NCwzMS4yNDggQzYwLjA5MiwyOS4yOTMgNTguMDU4LDI4LjEyNSA1NS43MjEsMjguMTI1IEw1NS43MjEsMjguMTI1IFoiIGlkPSJGaWxsLTgiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQ5LjU4OCwyLjQwNyBDMTQ5LjU4OCwyLjQwNyAxNTUuNzY4LDUuOTc1IDE1Ni4zMjUsNi4yOTcgTDE1Ni4zMjUsNy4xODQgQzE1Ni4zMjUsNy4zNiAxNTYuMzM4LDcuNTQ0IDE1Ni4zNjIsNy43MzMgQzE1Ni4zNzMsNy44MTQgMTU2LjM4Miw3Ljg5NCAxNTYuMzksNy45NzUgQzE1Ni41Myw5LjM5IDE1Ny4zNjMsMTAuOTczIDE1OC40OTUsMTEuOTc0IEwxNjUuODkxLDE4LjUxOSBDMTY2LjA2OCwxOC42NzUgMTY2LjI0OSwxOC44MTQgMTY2LjQzMiwxOC45MzQgQzE2OC4wMTEsMTkuOTc0IDE2OS4zODIsMTkuNCAxNjkuNDk0LDE3LjY1MiBDMTY5LjU0MywxNi44NjggMTY5LjU1MSwxNi4wNTcgMTY5LjUxNywxNS4yMjMgTDE2OS41MTQsMTUuMDYzIEwxNjkuNTE0LDEzLjkxMiBDMTcwLjc4LDE0LjY0MiAxOTUuNTAxLDI4LjkxNSAxOTUuNTAxLDI4LjkxNSBMMTk1LjUwMSw4Mi45MTUgQzE5NS41MDEsODQuMDA1IDE5NC43MzEsODQuNDQ1IDE5My43ODEsODMuODk3IEwxNTEuMzA4LDU5LjM3NCBDMTUwLjM1OCw1OC44MjYgMTQ5LjU4OCw1Ny40OTcgMTQ5LjU4OCw1Ni40MDggTDE0OS41ODgsMjIuMzc1IiBpZD0iRmlsbC05IiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5NC41NTMsODQuMjUgQzE5NC4yOTYsODQuMjUgMTk0LjAxMyw4NC4xNjUgMTkzLjcyMiw4My45OTcgTDE1MS4yNSw1OS40NzYgQzE1MC4yNjksNTguOTA5IDE0OS40NzEsNTcuNTMzIDE0OS40NzEsNTYuNDA4IEwxNDkuNDcxLDIyLjM3NSBMMTQ5LjcwNSwyMi4zNzUgTDE0OS43MDUsNTYuNDA4IEMxNDkuNzA1LDU3LjQ1OSAxNTAuNDUsNTguNzQ0IDE1MS4zNjYsNTkuMjc0IEwxOTMuODM5LDgzLjc5NSBDMTk0LjI2Myw4NC4wNCAxOTQuNjU1LDg0LjA4MyAxOTQuOTQyLDgzLjkxNyBDMTk1LjIyNyw4My43NTMgMTk1LjM4NCw4My4zOTcgMTk1LjM4NCw4Mi45MTUgTDE5NS4zODQsMjguOTgyIEMxOTQuMTAyLDI4LjI0MiAxNzIuMTA0LDE1LjU0MiAxNjkuNjMxLDE0LjExNCBMMTY5LjYzNCwxNS4yMiBDMTY5LjY2OCwxNi4wNTIgMTY5LjY2LDE2Ljg3NCAxNjkuNjEsMTcuNjU5IEMxNjkuNTU2LDE4LjUwMyAxNjkuMjE0LDE5LjEyMyAxNjguNjQ3LDE5LjQwNSBDMTY4LjAyOCwxOS43MTQgMTY3LjE5NywxOS41NzggMTY2LjM2NywxOS4wMzIgQzE2Ni4xODEsMTguOTA5IDE2NS45OTUsMTguNzY2IDE2NS44MTQsMTguNjA2IEwxNTguNDE3LDEyLjA2MiBDMTU3LjI1OSwxMS4wMzYgMTU2LjQxOCw5LjQzNyAxNTYuMjc0LDcuOTg2IEMxNTYuMjY2LDcuOTA3IDE1Ni4yNTcsNy44MjcgMTU2LjI0Nyw3Ljc0OCBDMTU2LjIyMSw3LjU1NSAxNTYuMjA5LDcuMzY1IDE1Ni4yMDksNy4xODQgTDE1Ni4yMDksNi4zNjQgQzE1NS4zNzUsNS44ODMgMTQ5LjUyOSwyLjUwOCAxNDkuNTI5LDIuNTA4IEwxNDkuNjQ2LDIuMzA2IEMxNDkuNjQ2LDIuMzA2IDE1NS44MjcsNS44NzQgMTU2LjM4NCw2LjE5NiBMMTU2LjQ0Miw2LjIzIEwxNTYuNDQyLDcuMTg0IEMxNTYuNDQyLDcuMzU1IDE1Ni40NTQsNy41MzUgMTU2LjQ3OCw3LjcxNyBDMTU2LjQ4OSw3LjggMTU2LjQ5OSw3Ljg4MiAxNTYuNTA3LDcuOTYzIEMxNTYuNjQ1LDkuMzU4IDE1Ny40NTUsMTAuODk4IDE1OC41NzIsMTEuODg2IEwxNjUuOTY5LDE4LjQzMSBDMTY2LjE0MiwxOC41ODQgMTY2LjMxOSwxOC43MiAxNjYuNDk2LDE4LjgzNyBDMTY3LjI1NCwxOS4zMzYgMTY4LDE5LjQ2NyAxNjguNTQzLDE5LjE5NiBDMTY5LjAzMywxOC45NTMgMTY5LjMyOSwxOC40MDEgMTY5LjM3NywxNy42NDUgQzE2OS40MjcsMTYuODY3IDE2OS40MzQsMTYuMDU0IDE2OS40MDEsMTUuMjI4IEwxNjkuMzk3LDE1LjA2NSBMMTY5LjM5NywxMy43MSBMMTY5LjU3MiwxMy44MSBDMTcwLjgzOSwxNC41NDEgMTk1LjU1OSwyOC44MTQgMTk1LjU1OSwyOC44MTQgTDE5NS42MTgsMjguODQ3IEwxOTUuNjE4LDgyLjkxNSBDMTk1LjYxOCw4My40ODQgMTk1LjQyLDgzLjkxMSAxOTUuMDU5LDg0LjExOSBDMTk0LjkwOCw4NC4yMDYgMTk0LjczNyw4NC4yNSAxOTQuNTUzLDg0LjI1IiBpZD0iRmlsbC0xMCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNDUuNjg1LDU2LjE2MSBMMTY5LjgsNzAuMDgzIEwxNDMuODIyLDg1LjA4MSBMMTQyLjM2LDg0Ljc3NCBDMTM1LjgyNiw4Mi42MDQgMTI4LjczMiw4MS4wNDYgMTIxLjM0MSw4MC4xNTggQzExNi45NzYsNzkuNjM0IDExMi42NzgsODEuMjU0IDExMS43NDMsODMuNzc4IEMxMTEuNTA2LDg0LjQxNCAxMTEuNTAzLDg1LjA3MSAxMTEuNzMyLDg1LjcwNiBDMTEzLjI3LDg5Ljk3MyAxMTUuOTY4LDk0LjA2OSAxMTkuNzI3LDk3Ljg0MSBMMTIwLjI1OSw5OC42ODYgQzEyMC4yNiw5OC42ODUgOTQuMjgyLDExMy42ODMgOTQuMjgyLDExMy42ODMgTDcwLjE2Nyw5OS43NjEgTDE0NS42ODUsNTYuMTYxIiBpZD0iRmlsbC0xMSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05NC4yODIsMTEzLjgxOCBMOTQuMjIzLDExMy43ODUgTDY5LjkzMyw5OS43NjEgTDcwLjEwOCw5OS42NiBMMTQ1LjY4NSw1Ni4wMjYgTDE0NS43NDMsNTYuMDU5IEwxNzAuMDMzLDcwLjA4MyBMMTQzLjg0Miw4NS4yMDUgTDE0My43OTcsODUuMTk1IEMxNDMuNzcyLDg1LjE5IDE0Mi4zMzYsODQuODg4IDE0Mi4zMzYsODQuODg4IEMxMzUuNzg3LDgyLjcxNCAxMjguNzIzLDgxLjE2MyAxMjEuMzI3LDgwLjI3NCBDMTIwLjc4OCw4MC4yMDkgMTIwLjIzNiw4MC4xNzcgMTE5LjY4OSw4MC4xNzcgQzExNS45MzEsODAuMTc3IDExMi42MzUsODEuNzA4IDExMS44NTIsODMuODE5IEMxMTEuNjI0LDg0LjQzMiAxMTEuNjIxLDg1LjA1MyAxMTEuODQyLDg1LjY2NyBDMTEzLjM3Nyw4OS45MjUgMTE2LjA1OCw5My45OTMgMTE5LjgxLDk3Ljc1OCBMMTE5LjgyNiw5Ny43NzkgTDEyMC4zNTIsOTguNjE0IEMxMjAuMzU0LDk4LjYxNyAxMjAuMzU2LDk4LjYyIDEyMC4zNTgsOTguNjI0IEwxMjAuNDIyLDk4LjcyNiBMMTIwLjMxNyw5OC43ODcgQzEyMC4yNjQsOTguODE4IDk0LjU5OSwxMTMuNjM1IDk0LjM0LDExMy43ODUgTDk0LjI4MiwxMTMuODE4IEw5NC4yODIsMTEzLjgxOCBaIE03MC40MDEsOTkuNzYxIEw5NC4yODIsMTEzLjU0OSBMMTE5LjA4NCw5OS4yMjkgQzExOS42Myw5OC45MTQgMTE5LjkzLDk4Ljc0IDEyMC4xMDEsOTguNjU0IEwxMTkuNjM1LDk3LjkxNCBDMTE1Ljg2NCw5NC4xMjcgMTEzLjE2OCw5MC4wMzMgMTExLjYyMiw4NS43NDYgQzExMS4zODIsODUuMDc5IDExMS4zODYsODQuNDA0IDExMS42MzMsODMuNzM4IEMxMTIuNDQ4LDgxLjUzOSAxMTUuODM2LDc5Ljk0MyAxMTkuNjg5LDc5Ljk0MyBDMTIwLjI0Niw3OS45NDMgMTIwLjgwNiw3OS45NzYgMTIxLjM1NSw4MC4wNDIgQzEyOC43NjcsODAuOTMzIDEzNS44NDYsODIuNDg3IDE0Mi4zOTYsODQuNjYzIEMxNDMuMjMyLDg0LjgzOCAxNDMuNjExLDg0LjkxNyAxNDMuNzg2LDg0Ljk2NyBMMTY5LjU2Niw3MC4wODMgTDE0NS42ODUsNTYuMjk1IEw3MC40MDEsOTkuNzYxIEw3MC40MDEsOTkuNzYxIFoiIGlkPSJGaWxsLTEyIiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2Ny4yMywxOC45NzkgTDE2Ny4yMyw2OS44NSBMMTM5LjkwOSw4NS42MjMgTDEzMy40NDgsNzEuNDU2IEMxMzIuNTM4LDY5LjQ2IDEzMC4wMiw2OS43MTggMTI3LjgyNCw3Mi4wMyBDMTI2Ljc2OSw3My4xNCAxMjUuOTMxLDc0LjU4NSAxMjUuNDk0LDc2LjA0OCBMMTE5LjAzNCw5Ny42NzYgTDkxLjcxMiwxMTMuNDUgTDkxLjcxMiw2Mi41NzkgTDE2Ny4yMywxOC45NzkiIGlkPSJGaWxsLTEzIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTkxLjcxMiwxMTMuNTY3IEM5MS42OTIsMTEzLjU2NyA5MS42NzIsMTEzLjU2MSA5MS42NTMsMTEzLjU1MSBDOTEuNjE4LDExMy41MyA5MS41OTUsMTEzLjQ5MiA5MS41OTUsMTEzLjQ1IEw5MS41OTUsNjIuNTc5IEM5MS41OTUsNjIuNTM3IDkxLjYxOCw2Mi40OTkgOTEuNjUzLDYyLjQ3OCBMMTY3LjE3MiwxOC44NzggQzE2Ny4yMDgsMTguODU3IDE2Ny4yNTIsMTguODU3IDE2Ny4yODgsMTguODc4IEMxNjcuMzI0LDE4Ljg5OSAxNjcuMzQ3LDE4LjkzNyAxNjcuMzQ3LDE4Ljk3OSBMMTY3LjM0Nyw2OS44NSBDMTY3LjM0Nyw2OS44OTEgMTY3LjMyNCw2OS45MyAxNjcuMjg4LDY5Ljk1IEwxMzkuOTY3LDg1LjcyNSBDMTM5LjkzOSw4NS43NDEgMTM5LjkwNSw4NS43NDUgMTM5Ljg3Myw4NS43MzUgQzEzOS44NDIsODUuNzI1IDEzOS44MTYsODUuNzAyIDEzOS44MDIsODUuNjcyIEwxMzMuMzQyLDcxLjUwNCBDMTMyLjk2Nyw3MC42ODIgMTMyLjI4LDcwLjIyOSAxMzEuNDA4LDcwLjIyOSBDMTMwLjMxOSw3MC4yMjkgMTI5LjA0NCw3MC45MTUgMTI3LjkwOCw3Mi4xMSBDMTI2Ljg3NCw3My4yIDEyNi4wMzQsNzQuNjQ3IDEyNS42MDYsNzYuMDgyIEwxMTkuMTQ2LDk3LjcwOSBDMTE5LjEzNyw5Ny43MzggMTE5LjExOCw5Ny43NjIgMTE5LjA5Miw5Ny43NzcgTDkxLjc3LDExMy41NTEgQzkxLjc1MiwxMTMuNTYxIDkxLjczMiwxMTMuNTY3IDkxLjcxMiwxMTMuNTY3IEw5MS43MTIsMTEzLjU2NyBaIE05MS44MjksNjIuNjQ3IEw5MS44MjksMTEzLjI0OCBMMTE4LjkzNSw5Ny41OTggTDEyNS4zODIsNzYuMDE1IEMxMjUuODI3LDc0LjUyNSAxMjYuNjY0LDczLjA4MSAxMjcuNzM5LDcxLjk1IEMxMjguOTE5LDcwLjcwOCAxMzAuMjU2LDY5Ljk5NiAxMzEuNDA4LDY5Ljk5NiBDMTMyLjM3Nyw2OS45OTYgMTMzLjEzOSw3MC40OTcgMTMzLjU1NCw3MS40MDcgTDEzOS45NjEsODUuNDU4IEwxNjcuMTEzLDY5Ljc4MiBMMTY3LjExMywxOS4xODEgTDkxLjgyOSw2Mi42NDcgTDkxLjgyOSw2Mi42NDcgWiIgaWQ9IkZpbGwtMTQiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTY4LjU0MywxOS4yMTMgTDE2OC41NDMsNzAuMDgzIEwxNDEuMjIxLDg1Ljg1NyBMMTM0Ljc2MSw3MS42ODkgQzEzMy44NTEsNjkuNjk0IDEzMS4zMzMsNjkuOTUxIDEyOS4xMzcsNzIuMjYzIEMxMjguMDgyLDczLjM3NCAxMjcuMjQ0LDc0LjgxOSAxMjYuODA3LDc2LjI4MiBMMTIwLjM0Niw5Ny45MDkgTDkzLjAyNSwxMTMuNjgzIEw5My4wMjUsNjIuODEzIEwxNjguNTQzLDE5LjIxMyIgaWQ9IkZpbGwtMTUiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTMuMDI1LDExMy44IEM5My4wMDUsMTEzLjggOTIuOTg0LDExMy43OTUgOTIuOTY2LDExMy43ODUgQzkyLjkzMSwxMTMuNzY0IDkyLjkwOCwxMTMuNzI1IDkyLjkwOCwxMTMuNjg0IEw5Mi45MDgsNjIuODEzIEM5Mi45MDgsNjIuNzcxIDkyLjkzMSw2Mi43MzMgOTIuOTY2LDYyLjcxMiBMMTY4LjQ4NCwxOS4xMTIgQzE2OC41MiwxOS4wOSAxNjguNTY1LDE5LjA5IDE2OC42MDEsMTkuMTEyIEMxNjguNjM3LDE5LjEzMiAxNjguNjYsMTkuMTcxIDE2OC42NiwxOS4yMTIgTDE2OC42Niw3MC4wODMgQzE2OC42Niw3MC4xMjUgMTY4LjYzNyw3MC4xNjQgMTY4LjYwMSw3MC4xODQgTDE0MS4yOCw4NS45NTggQzE0MS4yNTEsODUuOTc1IDE0MS4yMTcsODUuOTc5IDE0MS4xODYsODUuOTY4IEMxNDEuMTU0LDg1Ljk1OCAxNDEuMTI5LDg1LjkzNiAxNDEuMTE1LDg1LjkwNiBMMTM0LjY1NSw3MS43MzggQzEzNC4yOCw3MC45MTUgMTMzLjU5Myw3MC40NjMgMTMyLjcyLDcwLjQ2MyBDMTMxLjYzMiw3MC40NjMgMTMwLjM1Nyw3MS4xNDggMTI5LjIyMSw3Mi4zNDQgQzEyOC4xODYsNzMuNDMzIDEyNy4zNDcsNzQuODgxIDEyNi45MTksNzYuMzE1IEwxMjAuNDU4LDk3Ljk0MyBDMTIwLjQ1LDk3Ljk3MiAxMjAuNDMxLDk3Ljk5NiAxMjAuNDA1LDk4LjAxIEw5My4wODMsMTEzLjc4NSBDOTMuMDY1LDExMy43OTUgOTMuMDQ1LDExMy44IDkzLjAyNSwxMTMuOCBMOTMuMDI1LDExMy44IFogTTkzLjE0Miw2Mi44ODEgTDkzLjE0MiwxMTMuNDgxIEwxMjAuMjQ4LDk3LjgzMiBMMTI2LjY5NSw3Ni4yNDggQzEyNy4xNCw3NC43NTggMTI3Ljk3Nyw3My4zMTUgMTI5LjA1Miw3Mi4xODMgQzEzMC4yMzEsNzAuOTQyIDEzMS41NjgsNzAuMjI5IDEzMi43Miw3MC4yMjkgQzEzMy42ODksNzAuMjI5IDEzNC40NTIsNzAuNzMxIDEzNC44NjcsNzEuNjQxIEwxNDEuMjc0LDg1LjY5MiBMMTY4LjQyNiw3MC4wMTYgTDE2OC40MjYsMTkuNDE1IEw5My4xNDIsNjIuODgxIEw5My4xNDIsNjIuODgxIFoiIGlkPSJGaWxsLTE2IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2OS44LDcwLjA4MyBMMTQyLjQ3OCw4NS44NTcgTDEzNi4wMTgsNzEuNjg5IEMxMzUuMTA4LDY5LjY5NCAxMzIuNTksNjkuOTUxIDEzMC4zOTMsNzIuMjYzIEMxMjkuMzM5LDczLjM3NCAxMjguNSw3NC44MTkgMTI4LjA2NCw3Ni4yODIgTDEyMS42MDMsOTcuOTA5IEw5NC4yODIsMTEzLjY4MyBMOTQuMjgyLDYyLjgxMyBMMTY5LjgsMTkuMjEzIEwxNjkuOCw3MC4wODMgWiIgaWQ9IkZpbGwtMTciIGZpbGw9IiNGQUZBRkEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTQuMjgyLDExMy45MTcgQzk0LjI0MSwxMTMuOTE3IDk0LjIwMSwxMTMuOTA3IDk0LjE2NSwxMTMuODg2IEM5NC4wOTMsMTEzLjg0NSA5NC4wNDgsMTEzLjc2NyA5NC4wNDgsMTEzLjY4NCBMOTQuMDQ4LDYyLjgxMyBDOTQuMDQ4LDYyLjczIDk0LjA5Myw2Mi42NTIgOTQuMTY1LDYyLjYxMSBMMTY5LjY4MywxOS4wMSBDMTY5Ljc1NSwxOC45NjkgMTY5Ljg0NCwxOC45NjkgMTY5LjkxNywxOS4wMSBDMTY5Ljk4OSwxOS4wNTIgMTcwLjAzMywxOS4xMjkgMTcwLjAzMywxOS4yMTIgTDE3MC4wMzMsNzAuMDgzIEMxNzAuMDMzLDcwLjE2NiAxNjkuOTg5LDcwLjI0NCAxNjkuOTE3LDcwLjI4NSBMMTQyLjU5NSw4Ni4wNiBDMTQyLjUzOCw4Ni4wOTIgMTQyLjQ2OSw4Ni4xIDE0Mi40MDcsODYuMDggQzE0Mi4zNDQsODYuMDYgMTQyLjI5Myw4Ni4wMTQgMTQyLjI2Niw4NS45NTQgTDEzNS44MDUsNzEuNzg2IEMxMzUuNDQ1LDcwLjk5NyAxMzQuODEzLDcwLjU4IDEzMy45NzcsNzAuNTggQzEzMi45MjEsNzAuNTggMTMxLjY3Niw3MS4yNTIgMTMwLjU2Miw3Mi40MjQgQzEyOS41NCw3My41MDEgMTI4LjcxMSw3NC45MzEgMTI4LjI4Nyw3Ni4zNDggTDEyMS44MjcsOTcuOTc2IEMxMjEuODEsOTguMDM0IDEyMS43NzEsOTguMDgyIDEyMS43Miw5OC4xMTIgTDk0LjM5OCwxMTMuODg2IEM5NC4zNjIsMTEzLjkwNyA5NC4zMjIsMTEzLjkxNyA5NC4yODIsMTEzLjkxNyBMOTQuMjgyLDExMy45MTcgWiBNOTQuNTE1LDYyLjk0OCBMOTQuNTE1LDExMy4yNzkgTDEyMS40MDYsOTcuNzU0IEwxMjcuODQsNzYuMjE1IEMxMjguMjksNzQuNzA4IDEyOS4xMzcsNzMuMjQ3IDEzMC4yMjQsNzIuMTAzIEMxMzEuNDI1LDcwLjgzOCAxMzIuNzkzLDcwLjExMiAxMzMuOTc3LDcwLjExMiBDMTM0Ljk5NSw3MC4xMTIgMTM1Ljc5NSw3MC42MzggMTM2LjIzLDcxLjU5MiBMMTQyLjU4NCw4NS41MjYgTDE2OS41NjYsNjkuOTQ4IEwxNjkuNTY2LDE5LjYxNyBMOTQuNTE1LDYyLjk0OCBMOTQuNTE1LDYyLjk0OCBaIiBpZD0iRmlsbC0xOCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMDkuODk0LDkyLjk0MyBMMTA5Ljg5NCw5Mi45NDMgQzEwOC4xMiw5Mi45NDMgMTA2LjY1Myw5Mi4yMTggMTA1LjY1LDkwLjgyMyBDMTA1LjU4Myw5MC43MzEgMTA1LjU5Myw5MC42MSAxMDUuNjczLDkwLjUyOSBDMTA1Ljc1Myw5MC40NDggMTA1Ljg4LDkwLjQ0IDEwNS45NzQsOTAuNTA2IEMxMDYuNzU0LDkxLjA1MyAxMDcuNjc5LDkxLjMzMyAxMDguNzI0LDkxLjMzMyBDMTEwLjA0Nyw5MS4zMzMgMTExLjQ3OCw5MC44OTQgMTEyLjk4LDkwLjAyNyBDMTE4LjI5MSw4Ni45NiAxMjIuNjExLDc5LjUwOSAxMjIuNjExLDczLjQxNiBDMTIyLjYxMSw3MS40ODkgMTIyLjE2OSw2OS44NTYgMTIxLjMzMyw2OC42OTIgQzEyMS4yNjYsNjguNiAxMjEuMjc2LDY4LjQ3MyAxMjEuMzU2LDY4LjM5MiBDMTIxLjQzNiw2OC4zMTEgMTIxLjU2Myw2OC4yOTkgMTIxLjY1Niw2OC4zNjUgQzEyMy4zMjcsNjkuNTM3IDEyNC4yNDcsNzEuNzQ2IDEyNC4yNDcsNzQuNTg0IEMxMjQuMjQ3LDgwLjgyNiAxMTkuODIxLDg4LjQ0NyAxMTQuMzgyLDkxLjU4NyBDMTEyLjgwOCw5Mi40OTUgMTExLjI5OCw5Mi45NDMgMTA5Ljg5NCw5Mi45NDMgTDEwOS44OTQsOTIuOTQzIFogTTEwNi45MjUsOTEuNDAxIEMxMDcuNzM4LDkyLjA1MiAxMDguNzQ1LDkyLjI3OCAxMDkuODkzLDkyLjI3OCBMMTA5Ljg5NCw5Mi4yNzggQzExMS4yMTUsOTIuMjc4IDExMi42NDcsOTEuOTUxIDExNC4xNDgsOTEuMDg0IEMxMTkuNDU5LDg4LjAxNyAxMjMuNzgsODAuNjIxIDEyMy43OCw3NC41MjggQzEyMy43OCw3Mi41NDkgMTIzLjMxNyw3MC45MjkgMTIyLjQ1NCw2OS43NjcgQzEyMi44NjUsNzAuODAyIDEyMy4wNzksNzIuMDQyIDEyMy4wNzksNzMuNDAyIEMxMjMuMDc5LDc5LjY0NSAxMTguNjUzLDg3LjI4NSAxMTMuMjE0LDkwLjQyNSBDMTExLjY0LDkxLjMzNCAxMTAuMTMsOTEuNzQyIDEwOC43MjQsOTEuNzQyIEMxMDguMDgzLDkxLjc0MiAxMDcuNDgxLDkxLjU5MyAxMDYuOTI1LDkxLjQwMSBMMTA2LjkyNSw5MS40MDEgWiIgaWQ9IkZpbGwtMTkiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEzLjA5Nyw5MC4yMyBDMTE4LjQ4MSw4Ny4xMjIgMTIyLjg0NSw3OS41OTQgMTIyLjg0NSw3My40MTYgQzEyMi44NDUsNzEuMzY1IDEyMi4zNjIsNjkuNzI0IDEyMS41MjIsNjguNTU2IEMxMTkuNzM4LDY3LjMwNCAxMTcuMTQ4LDY3LjM2MiAxMTQuMjY1LDY5LjAyNiBDMTA4Ljg4MSw3Mi4xMzQgMTA0LjUxNyw3OS42NjIgMTA0LjUxNyw4NS44NCBDMTA0LjUxNyw4Ny44OTEgMTA1LDg5LjUzMiAxMDUuODQsOTAuNyBDMTA3LjYyNCw5MS45NTIgMTEwLjIxNCw5MS44OTQgMTEzLjA5Nyw5MC4yMyIgaWQ9IkZpbGwtMjAiIGZpbGw9IiNGQUZBRkEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTA4LjcyNCw5MS42MTQgTDEwOC43MjQsOTEuNjE0IEMxMDcuNTgyLDkxLjYxNCAxMDYuNTY2LDkxLjQwMSAxMDUuNzA1LDkwLjc5NyBDMTA1LjY4NCw5MC43ODMgMTA1LjY2NSw5MC44MTEgMTA1LjY1LDkwLjc5IEMxMDQuNzU2LDg5LjU0NiAxMDQuMjgzLDg3Ljg0MiAxMDQuMjgzLDg1LjgxNyBDMTA0LjI4Myw3OS41NzUgMTA4LjcwOSw3MS45NTMgMTE0LjE0OCw2OC44MTIgQzExNS43MjIsNjcuOTA0IDExNy4yMzIsNjcuNDQ5IDExOC42MzgsNjcuNDQ5IEMxMTkuNzgsNjcuNDQ5IDEyMC43OTYsNjcuNzU4IDEyMS42NTYsNjguMzYyIEMxMjEuNjc4LDY4LjM3NyAxMjEuNjk3LDY4LjM5NyAxMjEuNzEyLDY4LjQxOCBDMTIyLjYwNiw2OS42NjIgMTIzLjA3OSw3MS4zOSAxMjMuMDc5LDczLjQxNSBDMTIzLjA3OSw3OS42NTggMTE4LjY1Myw4Ny4xOTggMTEzLjIxNCw5MC4zMzggQzExMS42NCw5MS4yNDcgMTEwLjEzLDkxLjYxNCAxMDguNzI0LDkxLjYxNCBMMTA4LjcyNCw5MS42MTQgWiBNMTA2LjAwNiw5MC41MDUgQzEwNi43OCw5MS4wMzcgMTA3LjY5NCw5MS4yODEgMTA4LjcyNCw5MS4yODEgQzExMC4wNDcsOTEuMjgxIDExMS40NzgsOTAuODY4IDExMi45OCw5MC4wMDEgQzExOC4yOTEsODYuOTM1IDEyMi42MTEsNzkuNDk2IDEyMi42MTEsNzMuNDAzIEMxMjIuNjExLDcxLjQ5NCAxMjIuMTc3LDY5Ljg4IDEyMS4zNTYsNjguNzE4IEMxMjAuNTgyLDY4LjE4NSAxMTkuNjY4LDY3LjkxOSAxMTguNjM4LDY3LjkxOSBDMTE3LjMxNSw2Ny45MTkgMTE1Ljg4Myw2OC4zNiAxMTQuMzgyLDY5LjIyNyBDMTA5LjA3MSw3Mi4yOTMgMTA0Ljc1MSw3OS43MzMgMTA0Ljc1MSw4NS44MjYgQzEwNC43NTEsODcuNzM1IDEwNS4xODUsODkuMzQzIDEwNi4wMDYsOTAuNTA1IEwxMDYuMDA2LDkwLjUwNSBaIiBpZD0iRmlsbC0yMSIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNDkuMzE4LDcuMjYyIEwxMzkuMzM0LDE2LjE0IEwxNTUuMjI3LDI3LjE3MSBMMTYwLjgxNiwyMS4wNTkgTDE0OS4zMTgsNy4yNjIiIGlkPSJGaWxsLTIyIiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2OS42NzYsMTMuODQgTDE1OS45MjgsMTkuNDY3IEMxNTYuMjg2LDIxLjU3IDE1MC40LDIxLjU4IDE0Ni43ODEsMTkuNDkxIEMxNDMuMTYxLDE3LjQwMiAxNDMuMTgsMTQuMDAzIDE0Ni44MjIsMTEuOSBMMTU2LjMxNyw2LjI5MiBMMTQ5LjU4OCwyLjQwNyBMNjcuNzUyLDQ5LjQ3OCBMMTEzLjY3NSw3NS45OTIgTDExNi43NTYsNzQuMjEzIEMxMTcuMzg3LDczLjg0OCAxMTcuNjI1LDczLjMxNSAxMTcuMzc0LDcyLjgyMyBDMTE1LjAxNyw2OC4xOTEgMTE0Ljc4MSw2My4yNzcgMTE2LjY5MSw1OC41NjEgQzEyMi4zMjksNDQuNjQxIDE0MS4yLDMzLjc0NiAxNjUuMzA5LDMwLjQ5MSBDMTczLjQ3OCwyOS4zODggMTgxLjk4OSwyOS41MjQgMTkwLjAxMywzMC44ODUgQzE5MC44NjUsMzEuMDMgMTkxLjc4OSwzMC44OTMgMTkyLjQyLDMwLjUyOCBMMTk1LjUwMSwyOC43NSBMMTY5LjY3NiwxMy44NCIgaWQ9IkZpbGwtMjMiIGZpbGw9IiNGQUZBRkEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEzLjY3NSw3Ni40NTkgQzExMy41OTQsNzYuNDU5IDExMy41MTQsNzYuNDM4IDExMy40NDIsNzYuMzk3IEw2Ny41MTgsNDkuODgyIEM2Ny4zNzQsNDkuNzk5IDY3LjI4NCw0OS42NDUgNjcuMjg1LDQ5LjQ3OCBDNjcuMjg1LDQ5LjMxMSA2Ny4zNzQsNDkuMTU3IDY3LjUxOSw0OS4wNzMgTDE0OS4zNTUsMi4wMDIgQzE0OS40OTksMS45MTkgMTQ5LjY3NywxLjkxOSAxNDkuODIxLDIuMDAyIEwxNTYuNTUsNS44ODcgQzE1Ni43NzQsNi4wMTcgMTU2Ljg1LDYuMzAyIDE1Ni43MjIsNi41MjYgQzE1Ni41OTIsNi43NDkgMTU2LjMwNyw2LjgyNiAxNTYuMDgzLDYuNjk2IEwxNDkuNTg3LDIuOTQ2IEw2OC42ODcsNDkuNDc5IEwxMTMuNjc1LDc1LjQ1MiBMMTE2LjUyMyw3My44MDggQzExNi43MTUsNzMuNjk3IDExNy4xNDMsNzMuMzk5IDExNi45NTgsNzMuMDM1IEMxMTQuNTQyLDY4LjI4NyAxMTQuMyw2My4yMjEgMTE2LjI1OCw1OC4zODUgQzExOS4wNjQsNTEuNDU4IDEyNS4xNDMsNDUuMTQzIDEzMy44NCw0MC4xMjIgQzE0Mi40OTcsMzUuMTI0IDE1My4zNTgsMzEuNjMzIDE2NS4yNDcsMzAuMDI4IEMxNzMuNDQ1LDI4LjkyMSAxODIuMDM3LDI5LjA1OCAxOTAuMDkxLDMwLjQyNSBDMTkwLjgzLDMwLjU1IDE5MS42NTIsMzAuNDMyIDE5Mi4xODYsMzAuMTI0IEwxOTQuNTY3LDI4Ljc1IEwxNjkuNDQyLDE0LjI0NCBDMTY5LjIxOSwxNC4xMTUgMTY5LjE0MiwxMy44MjkgMTY5LjI3MSwxMy42MDYgQzE2OS40LDEzLjM4MiAxNjkuNjg1LDEzLjMwNiAxNjkuOTA5LDEzLjQzNSBMMTk1LjczNCwyOC4zNDUgQzE5NS44NzksMjguNDI4IDE5NS45NjgsMjguNTgzIDE5NS45NjgsMjguNzUgQzE5NS45NjgsMjguOTE2IDE5NS44NzksMjkuMDcxIDE5NS43MzQsMjkuMTU0IEwxOTIuNjUzLDMwLjkzMyBDMTkxLjkzMiwzMS4zNSAxOTAuODksMzEuNTA4IDE4OS45MzUsMzEuMzQ2IEMxODEuOTcyLDI5Ljk5NSAxNzMuNDc4LDI5Ljg2IDE2NS4zNzIsMzAuOTU0IEMxNTMuNjAyLDMyLjU0MyAxNDIuODYsMzUuOTkzIDEzNC4zMDcsNDAuOTMxIEMxMjUuNzkzLDQ1Ljg0NyAxMTkuODUxLDUyLjAwNCAxMTcuMTI0LDU4LjczNiBDMTE1LjI3LDYzLjMxNCAxMTUuNTAxLDY4LjExMiAxMTcuNzksNzIuNjExIEMxMTguMTYsNzMuMzM2IDExNy44NDUsNzQuMTI0IDExNi45OSw3NC42MTcgTDExMy45MDksNzYuMzk3IEMxMTMuODM2LDc2LjQzOCAxMTMuNzU2LDc2LjQ1OSAxMTMuNjc1LDc2LjQ1OSIgaWQ9IkZpbGwtMjQiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUzLjMxNiwyMS4yNzkgQzE1MC45MDMsMjEuMjc5IDE0OC40OTUsMjAuNzUxIDE0Ni42NjQsMTkuNjkzIEMxNDQuODQ2LDE4LjY0NCAxNDMuODQ0LDE3LjIzMiAxNDMuODQ0LDE1LjcxOCBDMTQzLjg0NCwxNC4xOTEgMTQ0Ljg2LDEyLjc2MyAxNDYuNzA1LDExLjY5OCBMMTU2LjE5OCw2LjA5MSBDMTU2LjMwOSw2LjAyNSAxNTYuNDUyLDYuMDYyIDE1Ni41MTgsNi4xNzMgQzE1Ni41ODMsNi4yODQgMTU2LjU0Nyw2LjQyNyAxNTYuNDM2LDYuNDkzIEwxNDYuOTQsMTIuMTAyIEMxNDUuMjQ0LDEzLjA4MSAxNDQuMzEyLDE0LjM2NSAxNDQuMzEyLDE1LjcxOCBDMTQ0LjMxMiwxNy4wNTggMTQ1LjIzLDE4LjMyNiAxNDYuODk3LDE5LjI4OSBDMTUwLjQ0NiwyMS4zMzggMTU2LjI0LDIxLjMyNyAxNTkuODExLDE5LjI2NSBMMTY5LjU1OSwxMy42MzcgQzE2OS42NywxMy41NzMgMTY5LjgxMywxMy42MTEgMTY5Ljg3OCwxMy43MjMgQzE2OS45NDMsMTMuODM0IDE2OS45MDQsMTMuOTc3IDE2OS43OTMsMTQuMDQyIEwxNjAuMDQ1LDE5LjY3IEMxNTguMTg3LDIwLjc0MiAxNTUuNzQ5LDIxLjI3OSAxNTMuMzE2LDIxLjI3OSIgaWQ9IkZpbGwtMjUiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEzLjY3NSw3NS45OTIgTDY3Ljc2Miw0OS40ODQiIGlkPSJGaWxsLTI2IiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExMy42NzUsNzYuMzQyIEMxMTMuNjE1LDc2LjM0MiAxMTMuNTU1LDc2LjMyNyAxMTMuNSw3Ni4yOTUgTDY3LjU4Nyw0OS43ODcgQzY3LjQxOSw0OS42OSA2Ny4zNjIsNDkuNDc2IDY3LjQ1OSw0OS4zMDkgQzY3LjU1Niw0OS4xNDEgNjcuNzcsNDkuMDgzIDY3LjkzNyw0OS4xOCBMMTEzLjg1LDc1LjY4OCBDMTE0LjAxOCw3NS43ODUgMTE0LjA3NSw3NiAxMTMuOTc4LDc2LjE2NyBDMTEzLjkxNCw3Ni4yNzkgMTEzLjc5Niw3Ni4zNDIgMTEzLjY3NSw3Ni4zNDIiIGlkPSJGaWxsLTI3IiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTY3Ljc2Miw0OS40ODQgTDY3Ljc2MiwxMDMuNDg1IEM2Ny43NjIsMTA0LjU3NSA2OC41MzIsMTA1LjkwMyA2OS40ODIsMTA2LjQ1MiBMMTExLjk1NSwxMzAuOTczIEMxMTIuOTA1LDEzMS41MjIgMTEzLjY3NSwxMzEuMDgzIDExMy42NzUsMTI5Ljk5MyBMMTEzLjY3NSw3NS45OTIiIGlkPSJGaWxsLTI4IiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExMi43MjcsMTMxLjU2MSBDMTEyLjQzLDEzMS41NjEgMTEyLjEwNywxMzEuNDY2IDExMS43OCwxMzEuMjc2IEw2OS4zMDcsMTA2Ljc1NSBDNjguMjQ0LDEwNi4xNDIgNjcuNDEyLDEwNC43MDUgNjcuNDEyLDEwMy40ODUgTDY3LjQxMiw0OS40ODQgQzY3LjQxMiw0OS4yOSA2Ny41NjksNDkuMTM0IDY3Ljc2Miw0OS4xMzQgQzY3Ljk1Niw0OS4xMzQgNjguMTEzLDQ5LjI5IDY4LjExMyw0OS40ODQgTDY4LjExMywxMDMuNDg1IEM2OC4xMTMsMTA0LjQ0NSA2OC44MiwxMDUuNjY1IDY5LjY1NywxMDYuMTQ4IEwxMTIuMTMsMTMwLjY3IEMxMTIuNDc0LDEzMC44NjggMTEyLjc5MSwxMzAuOTEzIDExMywxMzAuNzkyIEMxMTMuMjA2LDEzMC42NzMgMTEzLjMyNSwxMzAuMzgxIDExMy4zMjUsMTI5Ljk5MyBMMTEzLjMyNSw3NS45OTIgQzExMy4zMjUsNzUuNzk4IDExMy40ODIsNzUuNjQxIDExMy42NzUsNzUuNjQxIEMxMTMuODY5LDc1LjY0MSAxMTQuMDI1LDc1Ljc5OCAxMTQuMDI1LDc1Ljk5MiBMMTE0LjAyNSwxMjkuOTkzIEMxMTQuMDI1LDEzMC42NDggMTEzLjc4NiwxMzEuMTQ3IDExMy4zNSwxMzEuMzk5IEMxMTMuMTYyLDEzMS41MDcgMTEyLjk1MiwxMzEuNTYxIDExMi43MjcsMTMxLjU2MSIgaWQ9IkZpbGwtMjkiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEyLjg2LDQwLjUxMiBDMTEyLjg2LDQwLjUxMiAxMTIuODYsNDAuNTEyIDExMi44NTksNDAuNTEyIEMxMTAuNTQxLDQwLjUxMiAxMDguMzYsMzkuOTkgMTA2LjcxNywzOS4wNDEgQzEwNS4wMTIsMzguMDU3IDEwNC4wNzQsMzYuNzI2IDEwNC4wNzQsMzUuMjkyIEMxMDQuMDc0LDMzLjg0NyAxMDUuMDI2LDMyLjUwMSAxMDYuNzU0LDMxLjUwNCBMMTE4Ljc5NSwyNC41NTEgQzEyMC40NjMsMjMuNTg5IDEyMi42NjksMjMuMDU4IDEyNS4wMDcsMjMuMDU4IEMxMjcuMzI1LDIzLjA1OCAxMjkuNTA2LDIzLjU4MSAxMzEuMTUsMjQuNTMgQzEzMi44NTQsMjUuNTE0IDEzMy43OTMsMjYuODQ1IDEzMy43OTMsMjguMjc4IEMxMzMuNzkzLDI5LjcyNCAxMzIuODQxLDMxLjA2OSAxMzEuMTEzLDMyLjA2NyBMMTE5LjA3MSwzOS4wMTkgQzExNy40MDMsMzkuOTgyIDExNS4xOTcsNDAuNTEyIDExMi44Niw0MC41MTIgTDExMi44Niw0MC41MTIgWiBNMTI1LjAwNywyMy43NTkgQzEyMi43OSwyMy43NTkgMTIwLjcwOSwyNC4yNTYgMTE5LjE0NiwyNS4xNTggTDEwNy4xMDQsMzIuMTEgQzEwNS42MDIsMzIuOTc4IDEwNC43NzQsMzQuMTA4IDEwNC43NzQsMzUuMjkyIEMxMDQuNzc0LDM2LjQ2NSAxMDUuNTg5LDM3LjU4MSAxMDcuMDY3LDM4LjQzNCBDMTA4LjYwNSwzOS4zMjMgMTEwLjY2MywzOS44MTIgMTEyLjg1OSwzOS44MTIgTDExMi44NiwzOS44MTIgQzExNS4wNzYsMzkuODEyIDExNy4xNTgsMzkuMzE1IDExOC43MjEsMzguNDEzIEwxMzAuNzYyLDMxLjQ2IEMxMzIuMjY0LDMwLjU5MyAxMzMuMDkyLDI5LjQ2MyAxMzMuMDkyLDI4LjI3OCBDMTMzLjA5MiwyNy4xMDYgMTMyLjI3OCwyNS45OSAxMzAuOCwyNS4xMzYgQzEyOS4yNjEsMjQuMjQ4IDEyNy4yMDQsMjMuNzU5IDEyNS4wMDcsMjMuNzU5IEwxMjUuMDA3LDIzLjc1OSBaIiBpZD0iRmlsbC0zMCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNjUuNjMsMTYuMjE5IEwxNTkuODk2LDE5LjUzIEMxNTYuNzI5LDIxLjM1OCAxNTEuNjEsMjEuMzY3IDE0OC40NjMsMTkuNTUgQzE0NS4zMTYsMTcuNzMzIDE0NS4zMzIsMTQuNzc4IDE0OC40OTksMTIuOTQ5IEwxNTQuMjMzLDkuNjM5IEwxNjUuNjMsMTYuMjE5IiBpZD0iRmlsbC0zMSIgZmlsbD0iI0ZBRkFGQSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNTQuMjMzLDEwLjQ0OCBMMTY0LjIyOCwxNi4yMTkgTDE1OS41NDYsMTguOTIzIEMxNTguMTEyLDE5Ljc1IDE1Ni4xOTQsMjAuMjA2IDE1NC4xNDcsMjAuMjA2IEMxNTIuMTE4LDIwLjIwNiAxNTAuMjI0LDE5Ljc1NyAxNDguODE0LDE4Ljk0MyBDMTQ3LjUyNCwxOC4xOTkgMTQ2LjgxNCwxNy4yNDkgMTQ2LjgxNCwxNi4yNjkgQzE0Ni44MTQsMTUuMjc4IDE0Ny41MzcsMTQuMzE0IDE0OC44NSwxMy41NTYgTDE1NC4yMzMsMTAuNDQ4IE0xNTQuMjMzLDkuNjM5IEwxNDguNDk5LDEyLjk0OSBDMTQ1LjMzMiwxNC43NzggMTQ1LjMxNiwxNy43MzMgMTQ4LjQ2MywxOS41NSBDMTUwLjAzMSwyMC40NTUgMTUyLjA4NiwyMC45MDcgMTU0LjE0NywyMC45MDcgQzE1Ni4yMjQsMjAuOTA3IDE1OC4zMDYsMjAuNDQ3IDE1OS44OTYsMTkuNTMgTDE2NS42MywxNi4yMTkgTDE1NC4yMzMsOS42MzkiIGlkPSJGaWxsLTMyIiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0NS40NDUsNzIuNjY3IEwxNDUuNDQ1LDcyLjY2NyBDMTQzLjY3Miw3Mi42NjcgMTQyLjIwNCw3MS44MTcgMTQxLjIwMiw3MC40MjIgQzE0MS4xMzUsNzAuMzMgMTQxLjE0NSw3MC4xNDcgMTQxLjIyNSw3MC4wNjYgQzE0MS4zMDUsNjkuOTg1IDE0MS40MzIsNjkuOTQ2IDE0MS41MjUsNzAuMDExIEMxNDIuMzA2LDcwLjU1OSAxNDMuMjMxLDcwLjgyMyAxNDQuMjc2LDcwLjgyMiBDMTQ1LjU5OCw3MC44MjIgMTQ3LjAzLDcwLjM3NiAxNDguNTMyLDY5LjUwOSBDMTUzLjg0Miw2Ni40NDMgMTU4LjE2Myw1OC45ODcgMTU4LjE2Myw1Mi44OTQgQzE1OC4xNjMsNTAuOTY3IDE1Ny43MjEsNDkuMzMyIDE1Ni44ODQsNDguMTY4IEMxNTYuODE4LDQ4LjA3NiAxNTYuODI4LDQ3Ljk0OCAxNTYuOTA4LDQ3Ljg2NyBDMTU2Ljk4OCw0Ny43ODYgMTU3LjExNCw0Ny43NzQgMTU3LjIwOCw0Ny44NCBDMTU4Ljg3OCw0OS4wMTIgMTU5Ljc5OCw1MS4yMiAxNTkuNzk4LDU0LjA1OSBDMTU5Ljc5OCw2MC4zMDEgMTU1LjM3Myw2OC4wNDYgMTQ5LjkzMyw3MS4xODYgQzE0OC4zNiw3Mi4wOTQgMTQ2Ljg1LDcyLjY2NyAxNDUuNDQ1LDcyLjY2NyBMMTQ1LjQ0NSw3Mi42NjcgWiBNMTQyLjQ3Niw3MSBDMTQzLjI5LDcxLjY1MSAxNDQuMjk2LDcyLjAwMiAxNDUuNDQ1LDcyLjAwMiBDMTQ2Ljc2Nyw3Mi4wMDIgMTQ4LjE5OCw3MS41NSAxNDkuNyw3MC42ODIgQzE1NS4wMSw2Ny42MTcgMTU5LjMzMSw2MC4xNTkgMTU5LjMzMSw1NC4wNjUgQzE1OS4zMzEsNTIuMDg1IDE1OC44NjgsNTAuNDM1IDE1OC4wMDYsNDkuMjcyIEMxNTguNDE3LDUwLjMwNyAxNTguNjMsNTEuNTMyIDE1OC42Myw1Mi44OTIgQzE1OC42Myw1OS4xMzQgMTU0LjIwNSw2Ni43NjcgMTQ4Ljc2NSw2OS45MDcgQzE0Ny4xOTIsNzAuODE2IDE0NS42ODEsNzEuMjgzIDE0NC4yNzYsNzEuMjgzIEMxNDMuNjM0LDcxLjI4MyAxNDMuMDMzLDcxLjE5MiAxNDIuNDc2LDcxIEwxNDIuNDc2LDcxIFoiIGlkPSJGaWxsLTMzIiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0OC42NDgsNjkuNzA0IEMxNTQuMDMyLDY2LjU5NiAxNTguMzk2LDU5LjA2OCAxNTguMzk2LDUyLjg5MSBDMTU4LjM5Niw1MC44MzkgMTU3LjkxMyw0OS4xOTggMTU3LjA3NCw0OC4wMyBDMTU1LjI4OSw0Ni43NzggMTUyLjY5OSw0Ni44MzYgMTQ5LjgxNiw0OC41MDEgQzE0NC40MzMsNTEuNjA5IDE0MC4wNjgsNTkuMTM3IDE0MC4wNjgsNjUuMzE0IEMxNDAuMDY4LDY3LjM2NSAxNDAuNTUyLDY5LjAwNiAxNDEuMzkxLDcwLjE3NCBDMTQzLjE3Niw3MS40MjcgMTQ1Ljc2NSw3MS4zNjkgMTQ4LjY0OCw2OS43MDQiIGlkPSJGaWxsLTM0IiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0NC4yNzYsNzEuMjc2IEwxNDQuMjc2LDcxLjI3NiBDMTQzLjEzMyw3MS4yNzYgMTQyLjExOCw3MC45NjkgMTQxLjI1Nyw3MC4zNjUgQzE0MS4yMzYsNzAuMzUxIDE0MS4yMTcsNzAuMzMyIDE0MS4yMDIsNzAuMzExIEMxNDAuMzA3LDY5LjA2NyAxMzkuODM1LDY3LjMzOSAxMzkuODM1LDY1LjMxNCBDMTM5LjgzNSw1OS4wNzMgMTQ0LjI2LDUxLjQzOSAxNDkuNyw0OC4yOTggQzE1MS4yNzMsNDcuMzkgMTUyLjc4NCw0Ni45MjkgMTU0LjE4OSw0Ni45MjkgQzE1NS4zMzIsNDYuOTI5IDE1Ni4zNDcsNDcuMjM2IDE1Ny4yMDgsNDcuODM5IEMxNTcuMjI5LDQ3Ljg1NCAxNTcuMjQ4LDQ3Ljg3MyAxNTcuMjYzLDQ3Ljg5NCBDMTU4LjE1Nyw0OS4xMzggMTU4LjYzLDUwLjg2NSAxNTguNjMsNTIuODkxIEMxNTguNjMsNTkuMTMyIDE1NC4yMDUsNjYuNzY2IDE0OC43NjUsNjkuOTA3IEMxNDcuMTkyLDcwLjgxNSAxNDUuNjgxLDcxLjI3NiAxNDQuMjc2LDcxLjI3NiBMMTQ0LjI3Niw3MS4yNzYgWiBNMTQxLjU1OCw3MC4xMDQgQzE0Mi4zMzEsNzAuNjM3IDE0My4yNDUsNzEuMDA1IDE0NC4yNzYsNzEuMDA1IEMxNDUuNTk4LDcxLjAwNSAxNDcuMDMsNzAuNDY3IDE0OC41MzIsNjkuNiBDMTUzLjg0Miw2Ni41MzQgMTU4LjE2Myw1OS4wMzMgMTU4LjE2Myw1Mi45MzkgQzE1OC4xNjMsNTEuMDMxIDE1Ny43MjksNDkuMzg1IDE1Ni45MDcsNDguMjIzIEMxNTYuMTMzLDQ3LjY5MSAxNTUuMjE5LDQ3LjQwOSAxNTQuMTg5LDQ3LjQwOSBDMTUyLjg2Nyw0Ny40MDkgMTUxLjQzNSw0Ny44NDIgMTQ5LjkzMyw0OC43MDkgQzE0NC42MjMsNTEuNzc1IDE0MC4zMDIsNTkuMjczIDE0MC4zMDIsNjUuMzY2IEMxNDAuMzAyLDY3LjI3NiAxNDAuNzM2LDY4Ljk0MiAxNDEuNTU4LDcwLjEwNCBMMTQxLjU1OCw3MC4xMDQgWiIgaWQ9IkZpbGwtMzUiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUwLjcyLDY1LjM2MSBMMTUwLjM1Nyw2NS4wNjYgQzE1MS4xNDcsNjQuMDkyIDE1MS44NjksNjMuMDQgMTUyLjUwNSw2MS45MzggQzE1My4zMTMsNjAuNTM5IDE1My45NzgsNTkuMDY3IDE1NC40ODIsNTcuNTYzIEwxNTQuOTI1LDU3LjcxMiBDMTU0LjQxMiw1OS4yNDUgMTUzLjczMyw2MC43NDUgMTUyLjkxLDYyLjE3MiBDMTUyLjI2Miw2My4yOTUgMTUxLjUyNSw2NC4zNjggMTUwLjcyLDY1LjM2MSIgaWQ9IkZpbGwtMzYiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE1LjkxNyw4NC41MTQgTDExNS41NTQsODQuMjIgQzExNi4zNDQsODMuMjQ1IDExNy4wNjYsODIuMTk0IDExNy43MDIsODEuMDkyIEMxMTguNTEsNzkuNjkyIDExOS4xNzUsNzguMjIgMTE5LjY3OCw3Ni43MTcgTDEyMC4xMjEsNzYuODY1IEMxMTkuNjA4LDc4LjM5OCAxMTguOTMsNzkuODk5IDExOC4xMDYsODEuMzI2IEMxMTcuNDU4LDgyLjQ0OCAxMTYuNzIyLDgzLjUyMSAxMTUuOTE3LDg0LjUxNCIgaWQ9IkZpbGwtMzciIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE0LDEzMC40NzYgTDExNCwxMzAuMDA4IEwxMTQsNzYuMDUyIEwxMTQsNzUuNTg0IEwxMTQsNzYuMDUyIEwxMTQsMTMwLjAwOCBMMTE0LDEzMC40NzYiIGlkPSJGaWxsLTM4IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8ZyBpZD0iSW1wb3J0ZWQtTGF5ZXJzLUNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYyLjAwMDAwMCwgMC4wMDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTkuODIyLDM3LjQ3NCBDMTkuODM5LDM3LjMzOSAxOS43NDcsMzcuMTk0IDE5LjU1NSwzNy4wODIgQzE5LjIyOCwzNi44OTQgMTguNzI5LDM2Ljg3MiAxOC40NDYsMzcuMDM3IEwxMi40MzQsNDAuNTA4IEMxMi4zMDMsNDAuNTg0IDEyLjI0LDQwLjY4NiAxMi4yNDMsNDAuNzkzIEMxMi4yNDUsNDAuOTI1IDEyLjI0NSw0MS4yNTQgMTIuMjQ1LDQxLjM3MSBMMTIuMjQ1LDQxLjQxNCBMMTIuMjM4LDQxLjU0MiBDOC4xNDgsNDMuODg3IDUuNjQ3LDQ1LjMyMSA1LjY0Nyw0NS4zMjEgQzUuNjQ2LDQ1LjMyMSAzLjU3LDQ2LjM2NyAyLjg2LDUwLjUxMyBDMi44Niw1MC41MTMgMS45NDgsNTcuNDc0IDEuOTYyLDcwLjI1OCBDMS45NzcsODIuODI4IDIuNTY4LDg3LjMyOCAzLjEyOSw5MS42MDkgQzMuMzQ5LDkzLjI5MyA2LjEzLDkzLjczNCA2LjEzLDkzLjczNCBDNi40NjEsOTMuNzc0IDYuODI4LDkzLjcwNyA3LjIxLDkzLjQ4NiBMODIuNDgzLDQ5LjkzNSBDODQuMjkxLDQ4Ljg2NiA4NS4xNSw0Ni4yMTYgODUuNTM5LDQzLjY1MSBDODYuNzUyLDM1LjY2MSA4Ny4yMTQsMTAuNjczIDg1LjI2NCwzLjc3MyBDODUuMDY4LDMuMDggODQuNzU0LDIuNjkgODQuMzk2LDIuNDkxIEw4Mi4zMSwxLjcwMSBDODEuNTgzLDEuNzI5IDgwLjg5NCwyLjE2OCA4MC43NzYsMi4yMzYgQzgwLjYzNiwyLjMxNyA0MS44MDcsMjQuNTg1IDIwLjAzMiwzNy4wNzIgTDE5LjgyMiwzNy40NzQiIGlkPSJGaWxsLTEiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNODIuMzExLDEuNzAxIEw4NC4zOTYsMi40OTEgQzg0Ljc1NCwyLjY5IDg1LjA2OCwzLjA4IDg1LjI2NCwzLjc3MyBDODcuMjEzLDEwLjY3MyA4Ni43NTEsMzUuNjYgODUuNTM5LDQzLjY1MSBDODUuMTQ5LDQ2LjIxNiA4NC4yOSw0OC44NjYgODIuNDgzLDQ5LjkzNSBMNy4yMSw5My40ODYgQzYuODk3LDkzLjY2NyA2LjU5NSw5My43NDQgNi4zMTQsOTMuNzQ0IEw2LjEzMSw5My43MzMgQzYuMTMxLDkzLjczNCAzLjM0OSw5My4yOTMgMy4xMjgsOTEuNjA5IEMyLjU2OCw4Ny4zMjcgMS45NzcsODIuODI4IDEuOTYzLDcwLjI1OCBDMS45NDgsNTcuNDc0IDIuODYsNTAuNTEzIDIuODYsNTAuNTEzIEMzLjU3LDQ2LjM2NyA1LjY0Nyw0NS4zMjEgNS42NDcsNDUuMzIxIEM1LjY0Nyw0NS4zMjEgOC4xNDgsNDMuODg3IDEyLjIzOCw0MS41NDIgTDEyLjI0NSw0MS40MTQgTDEyLjI0NSw0MS4zNzEgQzEyLjI0NSw0MS4yNTQgMTIuMjQ1LDQwLjkyNSAxMi4yNDMsNDAuNzkzIEMxMi4yNCw0MC42ODYgMTIuMzAyLDQwLjU4MyAxMi40MzQsNDAuNTA4IEwxOC40NDYsMzcuMDM2IEMxOC41NzQsMzYuOTYyIDE4Ljc0NiwzNi45MjYgMTguOTI3LDM2LjkyNiBDMTkuMTQ1LDM2LjkyNiAxOS4zNzYsMzYuOTc5IDE5LjU1NCwzNy4wODIgQzE5Ljc0NywzNy4xOTQgMTkuODM5LDM3LjM0IDE5LjgyMiwzNy40NzQgTDIwLjAzMywzNy4wNzIgQzQxLjgwNiwyNC41ODUgODAuNjM2LDIuMzE4IDgwLjc3NywyLjIzNiBDODAuODk0LDIuMTY4IDgxLjU4MywxLjcyOSA4Mi4zMTEsMS43MDEgTTgyLjMxMSwwLjcwNCBMODIuMjcyLDAuNzA1IEM4MS42NTQsMC43MjggODAuOTg5LDAuOTQ5IDgwLjI5OCwxLjM2MSBMODAuMjc3LDEuMzczIEM4MC4xMjksMS40NTggNTkuNzY4LDEzLjEzNSAxOS43NTgsMzYuMDc5IEMxOS41LDM1Ljk4MSAxOS4yMTQsMzUuOTI5IDE4LjkyNywzNS45MjkgQzE4LjU2MiwzNS45MjkgMTguMjIzLDM2LjAxMyAxNy45NDcsMzYuMTczIEwxMS45MzUsMzkuNjQ0IEMxMS40OTMsMzkuODk5IDExLjIzNiw0MC4zMzQgMTEuMjQ2LDQwLjgxIEwxMS4yNDcsNDAuOTYgTDUuMTY3LDQ0LjQ0NyBDNC43OTQsNDQuNjQ2IDIuNjI1LDQ1Ljk3OCAxLjg3Nyw1MC4zNDUgTDEuODcxLDUwLjM4NCBDMS44NjIsNTAuNDU0IDAuOTUxLDU3LjU1NyAwLjk2NSw3MC4yNTkgQzAuOTc5LDgyLjg3OSAxLjU2OCw4Ny4zNzUgMi4xMzcsOTEuNzI0IEwyLjEzOSw5MS43MzkgQzIuNDQ3LDk0LjA5NCA1LjYxNCw5NC42NjIgNS45NzUsOTQuNzE5IEw2LjAwOSw5NC43MjMgQzYuMTEsOTQuNzM2IDYuMjEzLDk0Ljc0MiA2LjMxNCw5NC43NDIgQzYuNzksOTQuNzQyIDcuMjYsOTQuNjEgNy43MSw5NC4zNSBMODIuOTgzLDUwLjc5OCBDODQuNzk0LDQ5LjcyNyA4NS45ODIsNDcuMzc1IDg2LjUyNSw0My44MDEgQzg3LjcxMSwzNS45ODcgODguMjU5LDEwLjcwNSA4Ni4yMjQsMy41MDIgQzg1Ljk3MSwyLjYwOSA4NS41MiwxLjk3NSA4NC44ODEsMS42MiBMODQuNzQ5LDEuNTU4IEw4Mi42NjQsMC43NjkgQzgyLjU1MSwwLjcyNSA4Mi40MzEsMC43MDQgODIuMzExLDAuNzA0IiBpZD0iRmlsbC0yIiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTY2LjI2NywxMS41NjUgTDY3Ljc2MiwxMS45OTkgTDExLjQyMyw0NC4zMjUiIGlkPSJGaWxsLTMiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuMjAyLDkwLjU0NSBDMTIuMDI5LDkwLjU0NSAxMS44NjIsOTAuNDU1IDExLjc2OSw5MC4yOTUgQzExLjYzMiw5MC4wNTcgMTEuNzEzLDg5Ljc1MiAxMS45NTIsODkuNjE0IEwzMC4zODksNzguOTY5IEMzMC42MjgsNzguODMxIDMwLjkzMyw3OC45MTMgMzEuMDcxLDc5LjE1MiBDMzEuMjA4LDc5LjM5IDMxLjEyNyw3OS42OTYgMzAuODg4LDc5LjgzMyBMMTIuNDUxLDkwLjQ3OCBMMTIuMjAyLDkwLjU0NSIgaWQ9IkZpbGwtNCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy43NjQsNDIuNjU0IEwxMy42NTYsNDIuNTkyIEwxMy43MDIsNDIuNDIxIEwxOC44MzcsMzkuNDU3IEwxOS4wMDcsMzkuNTAyIEwxOC45NjIsMzkuNjczIEwxMy44MjcsNDIuNjM3IEwxMy43NjQsNDIuNjU0IiBpZD0iRmlsbC01IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguNTIsOTAuMzc1IEw4LjUyLDQ2LjQyMSBMOC41ODMsNDYuMzg1IEw3NS44NCw3LjU1NCBMNzUuODQsNTEuNTA4IEw3NS43NzgsNTEuNTQ0IEw4LjUyLDkwLjM3NSBMOC41Miw5MC4zNzUgWiBNOC43Nyw0Ni41NjQgTDguNzcsODkuOTQ0IEw3NS41OTEsNTEuMzY1IEw3NS41OTEsNy45ODUgTDguNzcsNDYuNTY0IEw4Ljc3LDQ2LjU2NCBaIiBpZD0iRmlsbC02IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI0Ljk4Niw4My4xODIgQzI0Ljc1Niw4My4zMzEgMjQuMzc0LDgzLjU2NiAyNC4xMzcsODMuNzA1IEwxMi42MzIsOTAuNDA2IEMxMi4zOTUsOTAuNTQ1IDEyLjQyNiw5MC42NTggMTIuNyw5MC42NTggTDEzLjI2NSw5MC42NTggQzEzLjU0LDkwLjY1OCAxMy45NTgsOTAuNTQ1IDE0LjE5NSw5MC40MDYgTDI1LjcsODMuNzA1IEMyNS45MzcsODMuNTY2IDI2LjEyOCw4My40NTIgMjYuMTI1LDgzLjQ0OSBDMjYuMTIyLDgzLjQ0NyAyNi4xMTksODMuMjIgMjYuMTE5LDgyLjk0NiBDMjYuMTE5LDgyLjY3MiAyNS45MzEsODIuNTY5IDI1LjcwMSw4Mi43MTkgTDI0Ljk4Niw4My4xODIiIGlkPSJGaWxsLTciIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuMjY2LDkwLjc4MiBMMTIuNyw5MC43ODIgQzEyLjUsOTAuNzgyIDEyLjM4NCw5MC43MjYgMTIuMzU0LDkwLjYxNiBDMTIuMzI0LDkwLjUwNiAxMi4zOTcsOTAuMzk5IDEyLjU2OSw5MC4yOTkgTDI0LjA3NCw4My41OTcgQzI0LjMxLDgzLjQ1OSAyNC42ODksODMuMjI2IDI0LjkxOCw4My4wNzggTDI1LjYzMyw4Mi42MTQgQzI1LjcyMyw4Mi41NTUgMjUuODEzLDgyLjUyNSAyNS44OTksODIuNTI1IEMyNi4wNzEsODIuNTI1IDI2LjI0NCw4Mi42NTUgMjYuMjQ0LDgyLjk0NiBDMjYuMjQ0LDgzLjE2IDI2LjI0NSw4My4zMDkgMjYuMjQ3LDgzLjM4MyBMMjYuMjUzLDgzLjM4NyBMMjYuMjQ5LDgzLjQ1NiBDMjYuMjQ2LDgzLjUzMSAyNi4yNDYsODMuNTMxIDI1Ljc2Myw4My44MTIgTDE0LjI1OCw5MC41MTQgQzE0LDkwLjY2NSAxMy41NjQsOTAuNzgyIDEzLjI2Niw5MC43ODIgTDEzLjI2Niw5MC43ODIgWiBNMTIuNjY2LDkwLjUzMiBMMTIuNyw5MC41MzMgTDEzLjI2Niw5MC41MzMgQzEzLjUxOCw5MC41MzMgMTMuOTE1LDkwLjQyNSAxNC4xMzIsOTAuMjk5IEwyNS42MzcsODMuNTk3IEMyNS44MDUsODMuNDk5IDI1LjkzMSw4My40MjQgMjUuOTk4LDgzLjM4MyBDMjUuOTk0LDgzLjI5OSAyNS45OTQsODMuMTY1IDI1Ljk5NCw4Mi45NDYgTDI1Ljg5OSw4Mi43NzUgTDI1Ljc2OCw4Mi44MjQgTDI1LjA1NCw4My4yODcgQzI0LjgyMiw4My40MzcgMjQuNDM4LDgzLjY3MyAyNC4yLDgzLjgxMiBMMTIuNjk1LDkwLjUxNCBMMTIuNjY2LDkwLjUzMiBMMTIuNjY2LDkwLjUzMiBaIiBpZD0iRmlsbC04IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEzLjI2Niw4OS44NzEgTDEyLjcsODkuODcxIEMxMi41LDg5Ljg3MSAxMi4zODQsODkuODE1IDEyLjM1NCw4OS43MDUgQzEyLjMyNCw4OS41OTUgMTIuMzk3LDg5LjQ4OCAxMi41NjksODkuMzg4IEwyNC4wNzQsODIuNjg2IEMyNC4zMzIsODIuNTM1IDI0Ljc2OCw4Mi40MTggMjUuMDY3LDgyLjQxOCBMMjUuNjMyLDgyLjQxOCBDMjUuODMyLDgyLjQxOCAyNS45NDgsODIuNDc0IDI1Ljk3OCw4Mi41ODQgQzI2LjAwOCw4Mi42OTQgMjUuOTM1LDgyLjgwMSAyNS43NjMsODIuOTAxIEwxNC4yNTgsODkuNjAzIEMxNCw4OS43NTQgMTMuNTY0LDg5Ljg3MSAxMy4yNjYsODkuODcxIEwxMy4yNjYsODkuODcxIFogTTEyLjY2Niw4OS42MjEgTDEyLjcsODkuNjIyIEwxMy4yNjYsODkuNjIyIEMxMy41MTgsODkuNjIyIDEzLjkxNSw4OS41MTUgMTQuMTMyLDg5LjM4OCBMMjUuNjM3LDgyLjY4NiBMMjUuNjY3LDgyLjY2OCBMMjUuNjMyLDgyLjY2NyBMMjUuMDY3LDgyLjY2NyBDMjQuODE1LDgyLjY2NyAyNC40MTgsODIuNzc1IDI0LjIsODIuOTAxIEwxMi42OTUsODkuNjAzIEwxMi42NjYsODkuNjIxIEwxMi42NjYsODkuNjIxIFoiIGlkPSJGaWxsLTkiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuMzcsOTAuODAxIEwxMi4zNyw4OS41NTQgTDEyLjM3LDkwLjgwMSIgaWQ9IkZpbGwtMTAiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi4xMyw5My45MDEgQzUuMzc5LDkzLjgwOCA0LjgxNiw5My4xNjQgNC42OTEsOTIuNTI1IEMzLjg2LDg4LjI4NyAzLjU0LDgzLjc0MyAzLjUyNiw3MS4xNzMgQzMuNTExLDU4LjM4OSA0LjQyMyw1MS40MjggNC40MjMsNTEuNDI4IEM1LjEzNCw0Ny4yODIgNy4yMSw0Ni4yMzYgNy4yMSw0Ni4yMzYgQzcuMjEsNDYuMjM2IDgxLjY2NywzLjI1IDgyLjA2OSwzLjAxNyBDODIuMjkyLDIuODg4IDg0LjU1NiwxLjQzMyA4NS4yNjQsMy45NCBDODcuMjE0LDEwLjg0IDg2Ljc1MiwzNS44MjcgODUuNTM5LDQzLjgxOCBDODUuMTUsNDYuMzgzIDg0LjI5MSw0OS4wMzMgODIuNDgzLDUwLjEwMSBMNy4yMSw5My42NTMgQzYuODI4LDkzLjg3NCA2LjQ2MSw5My45NDEgNi4xMyw5My45MDEgQzYuMTMsOTMuOTAxIDMuMzQ5LDkzLjQ2IDMuMTI5LDkxLjc3NiBDMi41NjgsODcuNDk1IDEuOTc3LDgyLjk5NSAxLjk2Miw3MC40MjUgQzEuOTQ4LDU3LjY0MSAyLjg2LDUwLjY4IDIuODYsNTAuNjggQzMuNTcsNDYuNTM0IDUuNjQ3LDQ1LjQ4OSA1LjY0Nyw0NS40ODkgQzUuNjQ2LDQ1LjQ4OSA4LjA2NSw0NC4wOTIgMTIuMjQ1LDQxLjY3OSBMMTMuMTE2LDQxLjU2IEwxOS43MTUsMzcuNzMgTDE5Ljc2MSwzNy4yNjkgTDYuMTMsOTMuOTAxIiBpZD0iRmlsbC0xMSIgZmlsbD0iI0ZBRkFGQSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02LjMxNyw5NC4xNjEgTDYuMTAyLDk0LjE0OCBMNi4xMDEsOTQuMTQ4IEw1Ljg1Nyw5NC4xMDEgQzUuMTM4LDkzLjk0NSAzLjA4NSw5My4zNjUgMi44ODEsOTEuODA5IEMyLjMxMyw4Ny40NjkgMS43MjcsODIuOTk2IDEuNzEzLDcwLjQyNSBDMS42OTksNTcuNzcxIDIuNjA0LDUwLjcxOCAyLjYxMyw1MC42NDggQzMuMzM4LDQ2LjQxNyA1LjQ0NSw0NS4zMSA1LjUzNSw0NS4yNjYgTDEyLjE2Myw0MS40MzkgTDEzLjAzMyw0MS4zMiBMMTkuNDc5LDM3LjU3OCBMMTkuNTEzLDM3LjI0NCBDMTkuNTI2LDM3LjEwNyAxOS42NDcsMzcuMDA4IDE5Ljc4NiwzNy4wMjEgQzE5LjkyMiwzNy4wMzQgMjAuMDIzLDM3LjE1NiAyMC4wMDksMzcuMjkzIEwxOS45NSwzNy44ODIgTDEzLjE5OCw0MS44MDEgTDEyLjMyOCw0MS45MTkgTDUuNzcyLDQ1LjcwNCBDNS43NDEsNDUuNzIgMy43ODIsNDYuNzcyIDMuMTA2LDUwLjcyMiBDMy4wOTksNTAuNzgyIDIuMTk4LDU3LjgwOCAyLjIxMiw3MC40MjQgQzIuMjI2LDgyLjk2MyAyLjgwOSw4Ny40MiAzLjM3Myw5MS43MjkgQzMuNDY0LDkyLjQyIDQuMDYyLDkyLjg4MyA0LjY4Miw5My4xODEgQzQuNTY2LDkyLjk4NCA0LjQ4Niw5Mi43NzYgNC40NDYsOTIuNTcyIEMzLjY2NSw4OC41ODggMy4yOTEsODQuMzcgMy4yNzYsNzEuMTczIEMzLjI2Miw1OC41MiA0LjE2Nyw1MS40NjYgNC4xNzYsNTEuMzk2IEM0LjkwMSw0Ny4xNjUgNy4wMDgsNDYuMDU5IDcuMDk4LDQ2LjAxNCBDNy4wOTQsNDYuMDE1IDgxLjU0MiwzLjAzNCA4MS45NDQsMi44MDIgTDgxLjk3MiwyLjc4NSBDODIuODc2LDIuMjQ3IDgzLjY5MiwyLjA5NyA4NC4zMzIsMi4zNTIgQzg0Ljg4NywyLjU3MyA4NS4yODEsMy4wODUgODUuNTA0LDMuODcyIEM4Ny41MTgsMTEgODYuOTY0LDM2LjA5MSA4NS43ODUsNDMuODU1IEM4NS4yNzgsNDcuMTk2IDg0LjIxLDQ5LjM3IDgyLjYxLDUwLjMxNyBMNy4zMzUsOTMuODY5IEM2Ljk5OSw5NC4wNjMgNi42NTgsOTQuMTYxIDYuMzE3LDk0LjE2MSBMNi4zMTcsOTQuMTYxIFogTTYuMTcsOTMuNjU0IEM2LjQ2Myw5My42OSA2Ljc3NCw5My42MTcgNy4wODUsOTMuNDM3IEw4Mi4zNTgsNDkuODg2IEM4NC4xODEsNDguODA4IDg0Ljk2LDQ1Ljk3MSA4NS4yOTIsNDMuNzggQzg2LjQ2NiwzNi4wNDkgODcuMDIzLDExLjA4NSA4NS4wMjQsNC4wMDggQzg0Ljg0NiwzLjM3NyA4NC41NTEsMi45NzYgODQuMTQ4LDIuODE2IEM4My42NjQsMi42MjMgODIuOTgyLDIuNzY0IDgyLjIyNywzLjIxMyBMODIuMTkzLDMuMjM0IEM4MS43OTEsMy40NjYgNy4zMzUsNDYuNDUyIDcuMzM1LDQ2LjQ1MiBDNy4zMDQsNDYuNDY5IDUuMzQ2LDQ3LjUyMSA0LjY2OSw1MS40NzEgQzQuNjYyLDUxLjUzIDMuNzYxLDU4LjU1NiAzLjc3NSw3MS4xNzMgQzMuNzksODQuMzI4IDQuMTYxLDg4LjUyNCA0LjkzNiw5Mi40NzYgQzUuMDI2LDkyLjkzNyA1LjQxMiw5My40NTkgNS45NzMsOTMuNjE1IEM2LjA4Nyw5My42NCA2LjE1OCw5My42NTIgNi4xNjksOTMuNjU0IEw2LjE3LDkzLjY1NCBMNi4xNyw5My42NTQgWiIgaWQ9IkZpbGwtMTIiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy4zMTcsNjguOTgyIEM3LjgwNiw2OC43MDEgOC4yMDIsNjguOTI2IDguMjAyLDY5LjQ4NyBDOC4yMDIsNzAuMDQ3IDcuODA2LDcwLjczIDcuMzE3LDcxLjAxMiBDNi44MjksNzEuMjk0IDYuNDMzLDcxLjA2OSA2LjQzMyw3MC41MDggQzYuNDMzLDY5Ljk0OCA2LjgyOSw2OS4yNjUgNy4zMTcsNjguOTgyIiBpZD0iRmlsbC0xMyIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02LjkyLDcxLjEzMyBDNi42MzEsNzEuMTMzIDYuNDMzLDcwLjkwNSA2LjQzMyw3MC41MDggQzYuNDMzLDY5Ljk0OCA2LjgyOSw2OS4yNjUgNy4zMTcsNjguOTgyIEM3LjQ2LDY4LjkgNy41OTUsNjguODYxIDcuNzE0LDY4Ljg2MSBDOC4wMDMsNjguODYxIDguMjAyLDY5LjA5IDguMjAyLDY5LjQ4NyBDOC4yMDIsNzAuMDQ3IDcuODA2LDcwLjczIDcuMzE3LDcxLjAxMiBDNy4xNzQsNzEuMDk0IDcuMDM5LDcxLjEzMyA2LjkyLDcxLjEzMyBNNy43MTQsNjguNjc0IEM3LjU1Nyw2OC42NzQgNy4zOTIsNjguNzIzIDcuMjI0LDY4LjgyMSBDNi42NzYsNjkuMTM4IDYuMjQ2LDY5Ljg3OSA2LjI0Niw3MC41MDggQzYuMjQ2LDcwLjk5NCA2LjUxNyw3MS4zMiA2LjkyLDcxLjMyIEM3LjA3OCw3MS4zMiA3LjI0Myw3MS4yNzEgNy40MTEsNzEuMTc0IEM3Ljk1OSw3MC44NTcgOC4zODksNzAuMTE3IDguMzg5LDY5LjQ4NyBDOC4zODksNjkuMDAxIDguMTE3LDY4LjY3NCA3LjcxNCw2OC42NzQiIGlkPSJGaWxsLTE0IiBmaWxsPSIjODA5N0EyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYuOTIsNzAuOTQ3IEM2LjY0OSw3MC45NDcgNi42MjEsNzAuNjQgNi42MjEsNzAuNTA4IEM2LjYyMSw3MC4wMTcgNi45ODIsNjkuMzkyIDcuNDExLDY5LjE0NSBDNy41MjEsNjkuMDgyIDcuNjI1LDY5LjA0OSA3LjcxNCw2OS4wNDkgQzcuOTg2LDY5LjA0OSA4LjAxNSw2OS4zNTUgOC4wMTUsNjkuNDg3IEM4LjAxNSw2OS45NzggNy42NTIsNzAuNjAzIDcuMjI0LDcwLjg1MSBDNy4xMTUsNzAuOTE0IDcuMDEsNzAuOTQ3IDYuOTIsNzAuOTQ3IE03LjcxNCw2OC44NjEgQzcuNTk1LDY4Ljg2MSA3LjQ2LDY4LjkgNy4zMTcsNjguOTgyIEM2LjgyOSw2OS4yNjUgNi40MzMsNjkuOTQ4IDYuNDMzLDcwLjUwOCBDNi40MzMsNzAuOTA1IDYuNjMxLDcxLjEzMyA2LjkyLDcxLjEzMyBDNy4wMzksNzEuMTMzIDcuMTc0LDcxLjA5NCA3LjMxNyw3MS4wMTIgQzcuODA2LDcwLjczIDguMjAyLDcwLjA0NyA4LjIwMiw2OS40ODcgQzguMjAyLDY5LjA5IDguMDAzLDY4Ljg2MSA3LjcxNCw2OC44NjEiIGlkPSJGaWxsLTE1IiBmaWxsPSIjODA5N0EyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcuNDQ0LDg1LjM1IEM3LjcwOCw4NS4xOTggNy45MjEsODUuMzE5IDcuOTIxLDg1LjYyMiBDNy45MjEsODUuOTI1IDcuNzA4LDg2LjI5MiA3LjQ0NCw4Ni40NDQgQzcuMTgxLDg2LjU5NyA2Ljk2Nyw4Ni40NzUgNi45NjcsODYuMTczIEM2Ljk2Nyw4NS44NzEgNy4xODEsODUuNTAyIDcuNDQ0LDg1LjM1IiBpZD0iRmlsbC0xNiIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik03LjIzLDg2LjUxIEM3LjA3NCw4Ni41MSA2Ljk2Nyw4Ni4zODcgNi45NjcsODYuMTczIEM2Ljk2Nyw4NS44NzEgNy4xODEsODUuNTAyIDcuNDQ0LDg1LjM1IEM3LjUyMSw4NS4zMDUgNy41OTQsODUuMjg0IDcuNjU4LDg1LjI4NCBDNy44MTQsODUuMjg0IDcuOTIxLDg1LjQwOCA3LjkyMSw4NS42MjIgQzcuOTIxLDg1LjkyNSA3LjcwOCw4Ni4yOTIgNy40NDQsODYuNDQ0IEM3LjM2Nyw4Ni40ODkgNy4yOTQsODYuNTEgNy4yMyw4Ni41MSBNNy42NTgsODUuMDk4IEM3LjU1OCw4NS4wOTggNy40NTUsODUuMTI3IDcuMzUxLDg1LjE4OCBDNy4wMzEsODUuMzczIDYuNzgxLDg1LjgwNiA2Ljc4MSw4Ni4xNzMgQzYuNzgxLDg2LjQ4MiA2Ljk2Niw4Ni42OTcgNy4yMyw4Ni42OTcgQzcuMzMsODYuNjk3IDcuNDMzLDg2LjY2NiA3LjUzOCw4Ni42MDcgQzcuODU4LDg2LjQyMiA4LjEwOCw4NS45ODkgOC4xMDgsODUuNjIyIEM4LjEwOCw4NS4zMTMgNy45MjMsODUuMDk4IDcuNjU4LDg1LjA5OCIgaWQ9IkZpbGwtMTciIGZpbGw9IiM4MDk3QTIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy4yMyw4Ni4zMjIgTDcuMTU0LDg2LjE3MyBDNy4xNTQsODUuOTM4IDcuMzMzLDg1LjYyOSA3LjUzOCw4NS41MTIgTDcuNjU4LDg1LjQ3MSBMNy43MzQsODUuNjIyIEM3LjczNCw4NS44NTYgNy41NTUsODYuMTY0IDcuMzUxLDg2LjI4MiBMNy4yMyw4Ni4zMjIgTTcuNjU4LDg1LjI4NCBDNy41OTQsODUuMjg0IDcuNTIxLDg1LjMwNSA3LjQ0NCw4NS4zNSBDNy4xODEsODUuNTAyIDYuOTY3LDg1Ljg3MSA2Ljk2Nyw4Ni4xNzMgQzYuOTY3LDg2LjM4NyA3LjA3NCw4Ni41MSA3LjIzLDg2LjUxIEM3LjI5NCw4Ni41MSA3LjM2Nyw4Ni40ODkgNy40NDQsODYuNDQ0IEM3LjcwOCw4Ni4yOTIgNy45MjEsODUuOTI1IDcuOTIxLDg1LjYyMiBDNy45MjEsODUuNDA4IDcuODE0LDg1LjI4NCA3LjY1OCw4NS4yODQiIGlkPSJGaWxsLTE4IiBmaWxsPSIjODA5N0EyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTc3LjI3OCw3Ljc2OSBMNzcuMjc4LDUxLjQzNiBMMTAuMjA4LDkwLjE2IEwxMC4yMDgsNDYuNDkzIEw3Ny4yNzgsNy43NjkiIGlkPSJGaWxsLTE5IiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwLjA4Myw5MC4zNzUgTDEwLjA4Myw0Ni40MjEgTDEwLjE0Niw0Ni4zODUgTDc3LjQwMyw3LjU1NCBMNzcuNDAzLDUxLjUwOCBMNzcuMzQxLDUxLjU0NCBMMTAuMDgzLDkwLjM3NSBMMTAuMDgzLDkwLjM3NSBaIE0xMC4zMzMsNDYuNTY0IEwxMC4zMzMsODkuOTQ0IEw3Ny4xNTQsNTEuMzY1IEw3Ny4xNTQsNy45ODUgTDEwLjMzMyw0Ni41NjQgTDEwLjMzMyw0Ni41NjQgWiIgaWQ9IkZpbGwtMjAiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMjUuNzM3LDg4LjY0NyBMMTE4LjA5OCw5MS45ODEgTDExOC4wOTgsODQgTDEwNi42MzksODguNzEzIEwxMDYuNjM5LDk2Ljk4MiBMOTksMTAwLjMxNSBMMTEyLjM2OSwxMDMuOTYxIEwxMjUuNzM3LDg4LjY0NyIgaWQ9IkltcG9ydGVkLUxheWVycy1Db3B5LTIiIGZpbGw9IiM0NTVBNjQiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+")
			}, n.exports = i, n.exports
		}), e.registerDynamic("91", [], !0, function (e, t, n)
		{
			function i()
			{
				this.callbacks = {}
			}
			this || self;
			return i.prototype.emit = function (e)
			{
				var t = this.callbacks[e];
				if (t)
				{
					var n = [].slice.call(arguments);
					n.shift();
					for (var i = 0; i < t.length; i++) t[i].apply(this, n)
				}
			}, i.prototype.on = function (e, t)
			{
				e in this.callbacks ? this.callbacks[e].push(t) : this.callbacks[e] = [t]
			}, n.exports = i, n.exports
		}), e.registerDynamic("92", [], !0, function (e, t, n)
		{
			function i(e)
			{
				this.coefficients = e
			}
			this || self;
			return i.prototype.distortInverse = function (e)
			{
				for (var t = 0, n = 1, i = e - this.distort(t); Math.abs(n - t) > 1e-4;)
				{
					var r = e - this.distort(n),
						o = n - r * ((n - t) / (r - i));
					t = n, n = o, i = r
				}
				return n
			}, i.prototype.distort = function (e)
			{
				for (var t = e * e, n = 0, i = 0; i < this.coefficients.length; i++) n = t * (n + this.coefficients[i]);
				return (n + 1) * e
			}, i.prototype.solveLinear_ = function (e, t)
			{
				for (var n = e.length, i = 0; i < n - 1; ++i)
					for (var r = i + 1; r < n; ++r)
					{
						for (var o = e[i][r] / e[i][i], s = i + 1; s < n; ++s) e[s][r] -= o * e[s][i];
						t[r] -= o * t[i]
					}
				for (var a = new Array(n), i = n - 1; i >= 0; --i)
				{
					for (var u = t[i], s = i + 1; s < n; ++s) u -= e[s][i] * a[s];
					a[i] = u / e[i][i]
				}
				return a
			}, i.prototype.solveLeastSquares_ = function (e, t)
			{
				var n, i, r, o, s = e.length,
					a = e[0].length;
				if (s != t.Length) throw new Error("Matrix / vector dimension mismatch");
				var u = new Array(a);
				for (r = 0; r < a; ++r)
					for (u[r] = new Array(a), i = 0; i < a; ++i)
					{
						for (o = 0, n = 0; n < s; ++n) o += e[i][n] * e[r][n];
						u[r][i] = o
					}
				var c = new Array(a);
				for (i = 0; i < a; ++i)
				{
					for (o = 0, n = 0; n < s; ++n) o += e[i][n] * t[n];
					c[i] = o
				}
				return this.solveLinear_(u, c)
			}, i.prototype.approximateInverse = function (e, t)
			{
				e = e || 1, t = t || 100;
				var n, r, o = new Array(6);
				for (r = 0; r < 6; ++r) o[r] = new Array(t);
				var s = new Array(t);
				for (n = 0; n < t; ++n)
				{
					var a = e * (n + 1) / t,
						u = this.distort(a),
						c = u;
					for (r = 0; r < 6; ++r) c *= u * u, o[r][n] = c;
					s[n] = a - u
				}
				return new i(this.solveLeastSquares_(o, s))
			}, n.exports = i, n.exports
		}), e.registerDynamic("93", ["92", "8c", "86"], !0, function (e, t, n)
		{
			function i(e)
			{
				this.width = e.width || u.getScreenWidth(), this.height = e.height || u.getScreenHeight(), this.widthMeters = e.widthMeters, this.heightMeters = e.heightMeters, this.bevelMeters = e.bevelMeters
			}

			function r(e)
			{
				this.viewer = h.CardboardV2, this.updateDeviceParams(e), this.distortion = new s(this.viewer.distortionCoefficients)
			}

			function o(e)
			{
				this.id = e.id, this.label = e.label, this.fov = e.fov, this.interLensDistance = e.interLensDistance, this.baselineLensDistance = e.baselineLensDistance, this.screenLensDistance = e.screenLensDistance, this.distortionCoefficients = e.distortionCoefficients, this.inverseCoefficients = e.inverseCoefficients
			}
			this || self;
			var s = e("92"),
				a = e("8c"),
				u = e("86"),
				c = new i(
				{
					widthMeters: .11,
					heightMeters: .062,
					bevelMeters: .004
				}),
				l = new i(
				{
					widthMeters: .1038,
					heightMeters: .0584,
					bevelMeters: .004
				}),
				h = {
					CardboardV1: new o(
					{
						id: "CardboardV1",
						label: "Cardboard I/O 2014",
						fov: 40,
						interLensDistance: .06,
						baselineLensDistance: .035,
						screenLensDistance: .042,
						distortionCoefficients: [.441, .156],
						inverseCoefficients: [-.4410035, .42756155, -.4804439, .5460139, -.58821183, .5733938, -.48303202, .33299083, -.17573841, .0651772, -.01488963, .001559834]
					}),
					CardboardV2: new o(
					{
						id: "CardboardV2",
						label: "Cardboard I/O 2015",
						fov: 60,
						interLensDistance: .064,
						baselineLensDistance: .035,
						screenLensDistance: .039,
						distortionCoefficients: [.34, .55],
						inverseCoefficients: [-.33836704, -.18162185, .862655, -1.2462051, 1.0560602, -.58208317, .21609078, -.05444823, .009177956, -.0009904169, 6183535e-11, -16981803e-13]
					})
				};
			return r.prototype.updateDeviceParams = function (e)
			{
				this.device = this.determineDevice_(e) || this.device
			}, r.prototype.getDevice = function ()
			{
				return this.device
			}, r.prototype.setViewer = function (e)
			{
				this.viewer = e, this.distortion = new s(this.viewer.distortionCoefficients)
			}, r.prototype.determineDevice_ = function (e)
			{
				if (!e) return u.isIOS() ? (console.warn("Using fallback iOS device measurements."), l) : (console.warn("Using fallback Android device measurements."), c);
				var t = .0254 / e.xdpi,
					n = .0254 / e.ydpi;
				return new i(
				{
					widthMeters: t * u.getScreenWidth(),
					heightMeters: n * u.getScreenHeight(),
					bevelMeters: .001 * e.bevelMm
				})
			}, r.prototype.getDistortedFieldOfViewLeftEye = function ()
			{
				var e = this.viewer,
					t = this.device,
					n = this.distortion,
					i = e.screenLensDistance,
					r = (t.widthMeters - e.interLensDistance) / 2,
					o = e.interLensDistance / 2,
					s = e.baselineLensDistance - t.bevelMeters,
					u = t.heightMeters - s,
					c = a.radToDeg * Math.atan(n.distort(r / i)),
					l = a.radToDeg * Math.atan(n.distort(o / i)),
					h = a.radToDeg * Math.atan(n.distort(s / i)),
					d = a.radToDeg * Math.atan(n.distort(u / i));
				return {
					leftDegrees: Math.min(c, e.fov),
					rightDegrees: Math.min(l, e.fov),
					downDegrees: Math.min(h, e.fov),
					upDegrees: Math.min(d, e.fov)
				}
			}, r.prototype.getLeftEyeVisibleTanAngles = function ()
			{
				var e = this.viewer,
					t = this.device,
					n = this.distortion,
					i = Math.tan(-a.degToRad * e.fov),
					r = Math.tan(a.degToRad * e.fov),
					o = Math.tan(a.degToRad * e.fov),
					s = Math.tan(-a.degToRad * e.fov),
					u = t.widthMeters / 4,
					c = t.heightMeters / 2,
					l = e.baselineLensDistance - t.bevelMeters - c,
					h = e.interLensDistance / 2 - u,
					d = -l,
					f = e.screenLensDistance,
					p = n.distort((h - u) / f),
					g = n.distort((d + c) / f),
					y = n.distort((h + u) / f),
					M = n.distort((d - c) / f),
					v = new Float32Array(4);
				return v[0] = Math.max(i, p), v[1] = Math.min(r, g), v[2] = Math.min(o, y), v[3] = Math.max(s, M), v
			}, r.prototype.getLeftEyeNoLensTanAngles = function ()
			{
				var e = this.viewer,
					t = this.device,
					n = this.distortion,
					i = new Float32Array(4),
					r = n.distortInverse(Math.tan(-a.degToRad * e.fov)),
					o = n.distortInverse(Math.tan(a.degToRad * e.fov)),
					s = n.distortInverse(Math.tan(a.degToRad * e.fov)),
					u = n.distortInverse(Math.tan(-a.degToRad * e.fov)),
					c = t.widthMeters / 4,
					l = t.heightMeters / 2,
					h = e.baselineLensDistance - t.bevelMeters - l,
					d = e.interLensDistance / 2 - c,
					f = -h,
					p = e.screenLensDistance,
					g = (d - c) / p,
					y = (f + l) / p,
					M = (d + c) / p,
					v = (f - l) / p;
				return i[0] = Math.max(r, g), i[1] = Math.min(o, y), i[2] = Math.min(s, M), i[3] = Math.max(u, v), i
			}, r.prototype.getLeftEyeVisibleScreenRect = function (e)
			{
				var t = this.viewer,
					n = this.device,
					i = t.screenLensDistance,
					r = (n.widthMeters - t.interLensDistance) / 2,
					o = t.baselineLensDistance - n.bevelMeters,
					s = (e[0] * i + r) / n.widthMeters,
					a = (e[1] * i + o) / n.heightMeters,
					u = (e[2] * i + r) / n.widthMeters,
					c = (e[3] * i + o) / n.heightMeters;
				return {
					x: s,
					y: c,
					width: u - s,
					height: a - c
				}
			}, r.prototype.getFieldOfViewLeftEye = function (e)
			{
				return e ? this.getUndistortedFieldOfViewLeftEye() : this.getDistortedFieldOfViewLeftEye()
			}, r.prototype.getFieldOfViewRightEye = function (e)
			{
				var t = this.getFieldOfViewLeftEye(e);
				return {
					leftDegrees: t.rightDegrees,
					rightDegrees: t.leftDegrees,
					upDegrees: t.upDegrees,
					downDegrees: t.downDegrees
				}
			}, r.prototype.getUndistortedFieldOfViewLeftEye = function ()
			{
				var e = this.getUndistortedParams_();
				return {
					leftDegrees: a.radToDeg * Math.atan(e.outerDist),
					rightDegrees: a.radToDeg * Math.atan(e.innerDist),
					downDegrees: a.radToDeg * Math.atan(e.bottomDist),
					upDegrees: a.radToDeg * Math.atan(e.topDist)
				}
			}, r.prototype.getUndistortedViewportLeftEye = function ()
			{
				var e = this.getUndistortedParams_(),
					t = this.viewer,
					n = this.device,
					i = t.screenLensDistance,
					r = n.widthMeters / i,
					o = n.heightMeters / i,
					s = n.width / r,
					a = n.height / o,
					u = Math.round((e.eyePosX - e.outerDist) * s),
					c = Math.round((e.eyePosY - e.bottomDist) * a);
				return {
					x: u,
					y: c,
					width: Math.round((e.eyePosX + e.innerDist) * s) - u,
					height: Math.round((e.eyePosY + e.topDist) * a) - c
				}
			}, r.prototype.getUndistortedParams_ = function ()
			{
				var e = this.viewer,
					t = this.device,
					n = this.distortion,
					i = e.screenLensDistance,
					r = e.interLensDistance / 2 / i,
					o = t.widthMeters / i,
					s = t.heightMeters / i,
					u = o / 2 - r,
					c = (e.baselineLensDistance - t.bevelMeters) / i,
					l = e.fov,
					h = n.distortInverse(Math.tan(a.degToRad * l)),
					d = Math.min(u, h),
					f = Math.min(r, h),
					p = Math.min(c, h);
				return {
					outerDist: d,
					innerDist: f,
					topDist: Math.min(s - c, h),
					bottomDist: p,
					eyePosX: u,
					eyePosY: c
				}
			}, r.Viewers = h, n.exports = r, n.exports
		}), e.registerDynamic("94", ["91", "86", "93"], !0, function (e, t, n)
		{
			function i()
			{
				try
				{
					this.selectedKey = localStorage.getItem(a) || s
				}
				catch (e)
				{
					console.error("Failed to load viewer profile: %s", e)
				}
				this.dialog = this.createDialog_(o.Viewers), this.root = null
			}
			this || self;
			var r = e("91"),
				o = (e("86"), e("93")),
				s = "CardboardV1",
				a = "WEBVR_CARDBOARD_VIEWER";
			return i.prototype = new r, i.prototype.show = function (e)
			{
				this.root = e, e.appendChild(this.dialog), this.dialog.querySelector("#" + this.selectedKey).checked = !0, this.dialog.style.display = "block"
			}, i.prototype.hide = function ()
			{
				this.root && this.root.contains(this.dialog) && this.root.removeChild(this.dialog), this.dialog.style.display = "none"
			}, i.prototype.getCurrentViewer = function ()
			{
				return o.Viewers[this.selectedKey]
			}, i.prototype.getSelectedKey_ = function ()
			{
				var e = this.dialog.querySelector("input[name=field]:checked");
				return e ? e.id : null
			}, i.prototype.onSave_ = function ()
			{
				if (this.selectedKey = this.getSelectedKey_(), this.selectedKey && o.Viewers[this.selectedKey])
				{
					this.emit("change", o.Viewers[this.selectedKey]);
					try
					{
						localStorage.setItem(a, this.selectedKey)
					}
					catch (e)
					{
						console.error("Failed to save viewer profile: %s", e)
					}
					this.hide()
				}
				else console.error("ViewerSelector.onSave_: this should never happen!")
			}, i.prototype.createDialog_ = function (e)
			{
				var t = document.createElement("div");
				t.classList.add("webvr-polyfill-viewer-selector"), t.style.display = "none";
				var n = document.createElement("div"),
					i = n.style;
				i.position = "fixed", i.left = 0, i.top = 0, i.width = "100%", i.height = "100%", i.background = "rgba(0, 0, 0, 0.3)", n.addEventListener("click", this.hide.bind(this));
				var r = document.createElement("div");
				(i = r.style).boxSizing = "border-box", i.position = "fixed", i.top = "24px", i.left = "50%", i.marginLeft = "-140px", i.width = "280px", i.padding = "24px", i.overflow = "hidden", i.background = "#fafafa", i.fontFamily = "'Roboto', sans-serif", i.boxShadow = "0px 5px 20px #666", r.appendChild(this.createH1_("Select your viewer"));
				for (var o in e) r.appendChild(this.createChoice_(o, e[o].label));
				return r.appendChild(this.createButton_("Save", this.onSave_.bind(this))), t.appendChild(n), t.appendChild(r), t
			}, i.prototype.createH1_ = function (e)
			{
				var t = document.createElement("h1"),
					n = t.style;
				return n.color = "black", n.fontSize = "20px", n.fontWeight = "bold", n.marginTop = 0, n.marginBottom = "24px", t.innerHTML = e, t
			}, i.prototype.createChoice_ = function (e, t)
			{
				var n = document.createElement("div");
				n.style.marginTop = "8px", n.style.color = "black";
				var i = document.createElement("input");
				i.style.fontSize = "30px", i.setAttribute("id", e), i.setAttribute("type", "radio"), i.setAttribute("value", e), i.setAttribute("name", "field");
				var r = document.createElement("label");
				return r.style.marginLeft = "4px", r.setAttribute("for", e), r.innerHTML = t, n.appendChild(i), n.appendChild(r), n
			}, i.prototype.createButton_ = function (e, t)
			{
				var n = document.createElement("button");
				n.innerHTML = e;
				var i = n.style;
				return i.float = "right", i.textTransform = "uppercase", i.color = "#1094f7", i.fontSize = "14px", i.letterSpacing = 0, i.border = 0, i.background = "none", i.marginTop = "16px", n.addEventListener("click", t), n
			}, n.exports = i, n.exports
		}), e.registerDynamic("95", ["84", "85", "93", "89", "8f", "90", "94", "96", "86"], !0, function (e, t, n)
		{
			function i()
			{
				this.displayName = "Cardboard VRDisplay (webvr-polyfill)", this.capabilities.hasOrientation = !0, this.capabilities.canPresent = !0, this.bufferScale_ = WebVRConfig.BUFFER_SCALE, this.poseSensor_ = new u, this.distorter_ = null, this.cardboardUI_ = null, this.dpdb_ = new a(!0, this.onDeviceParamsUpdated_.bind(this)), this.deviceInfo_ = new s(this.dpdb_.getDeviceParams()), this.viewerSelector_ = new l, this.viewerSelector_.on("change", this.onViewerChanged_.bind(this)), this.deviceInfo_.setViewer(this.viewerSelector_.getCurrentViewer()), WebVRConfig.ROTATE_INSTRUCTIONS_DISABLED || (this.rotateInstructions_ = new c), d.isIOS() && window.addEventListener("resize", this.onResize_.bind(this))
			}
			this || self;
			var r = e("84"),
				o = e("85"),
				s = e("93"),
				a = e("89"),
				u = e("8f"),
				c = e("90"),
				l = e("94"),
				h = e("96").VRDisplay,
				d = e("86"),
				f = {
					LEFT: "left",
					RIGHT: "right"
				};
			return i.prototype = new h, i.prototype.getImmediatePose = function ()
			{
				return {
					position: this.poseSensor_.getPosition(),
					orientation: this.poseSensor_.getOrientation(),
					linearVelocity: null,
					linearAcceleration: null,
					angularVelocity: null,
					angularAcceleration: null
				}
			}, i.prototype.resetPose = function ()
			{
				this.poseSensor_.resetPose()
			}, i.prototype.getEyeParameters = function (e)
			{
				var t, n = [.5 * this.deviceInfo_.viewer.interLensDistance, 0, 0];
				if (e == f.LEFT) n[0] *= -1, t = this.deviceInfo_.getFieldOfViewLeftEye();
				else
				{
					if (e != f.RIGHT) return console.error("Invalid eye provided: %s", e), null;
					t = this.deviceInfo_.getFieldOfViewRightEye()
				}
				return {
					fieldOfView: t,
					offset: n,
					renderWidth: .5 * this.deviceInfo_.device.width * this.bufferScale_,
					renderHeight: this.deviceInfo_.device.height * this.bufferScale_
				}
			}, i.prototype.onDeviceParamsUpdated_ = function (e)
			{
				console.log("DPDB reported that device params were updated."), this.deviceInfo_.updateDeviceParams(e), this.distorter_ && this.distorter_.updateDeviceInfo(this.deviceInfo_)
			}, i.prototype.updateBounds_ = function ()
			{
				this.layer_ && this.distorter_ && (this.layer_.leftBounds || this.layer_.rightBounds) && this.distorter_.setTextureBounds(this.layer_.leftBounds, this.layer_.rightBounds)
			}, i.prototype.beginPresent_ = function ()
			{
				var e = this.layer_.source.getContext("webgl");
				e || (e = this.layer_.source.getContext("experimental-webgl")), e || (e = this.layer_.source.getContext("webgl2")), e && (this.layer_.predistorted ? WebVRConfig.CARDBOARD_UI_DISABLED || (e.canvas.width = d.getScreenWidth() * this.bufferScale_, e.canvas.height = d.getScreenHeight() * this.bufferScale_, this.cardboardUI_ = new o(e)) : (this.distorter_ = new r(e), this.distorter_.updateDeviceInfo(this.deviceInfo_), this.cardboardUI_ = this.distorter_.cardboardUI), this.cardboardUI_ && this.cardboardUI_.listen(function (e)
				{
					this.viewerSelector_.show(this.layer_.source.parentElement), e.stopPropagation(), e.preventDefault()
				}.bind(this), function (e)
				{
					this.exitPresent(), e.stopPropagation(), e.preventDefault()
				}.bind(this)), this.rotateInstructions_ && (d.isLandscapeMode() && d.isMobile() ? this.rotateInstructions_.showTemporarily(3e3, this.layer_.source.parentElement) : this.rotateInstructions_.update()), this.orientationHandler = this.onOrientationChange_.bind(this), window.addEventListener("orientationchange", this.orientationHandler), this.vrdisplaypresentchangeHandler = this.updateBounds_.bind(this), window.addEventListener("vrdisplaypresentchange", this.vrdisplaypresentchangeHandler), this.fireVRDisplayDeviceParamsChange_())
			}, i.prototype.endPresent_ = function ()
			{
				this.distorter_ && (this.distorter_.destroy(), this.distorter_ = null), this.cardboardUI_ && (this.cardboardUI_.destroy(), this.cardboardUI_ = null), this.rotateInstructions_ && this.rotateInstructions_.hide(), this.viewerSelector_.hide(), window.removeEventListener("orientationchange", this.orientationHandler), window.removeEventListener("vrdisplaypresentchange", this.vrdisplaypresentchangeHandler)
			}, i.prototype.submitFrame = function (e)
			{
				if (this.distorter_) this.distorter_.submitFrame();
				else if (this.cardboardUI_ && this.layer_)
				{
					var t = this.layer_.source.getContext("webgl").canvas;
					t.width == this.lastWidth && t.height == this.lastHeight || this.cardboardUI_.onResize(), this.lastWidth = t.width, this.lastHeight = t.height, this.cardboardUI_.render()
				}
			}, i.prototype.onOrientationChange_ = function (e)
			{
				console.log("onOrientationChange_"), this.viewerSelector_.hide(), this.rotateInstructions_ && this.rotateInstructions_.update(), this.onResize_()
			}, i.prototype.onResize_ = function (e)
			{
				if (this.layer_)
				{
					var t = this.layer_.source.getContext("webgl"),
						n = ["position: absolute", "top: 0", "left: 0", "width: " + Math.max(screen.width, screen.height) + "px", "height: " + Math.min(screen.height, screen.width) + "px", "border: 0", "margin: 0", "padding: 0 10px 10px 0"];
					t.canvas.setAttribute("style", n.join("; ") + ";"), d.safariCssSizeWorkaround(t.canvas)
				}
			}, i.prototype.onViewerChanged_ = function (e)
			{
				this.deviceInfo_.setViewer(e), this.distorter_ && this.distorter_.updateDeviceInfo(this.deviceInfo_), this.fireVRDisplayDeviceParamsChange_()
			}, i.prototype.fireVRDisplayDeviceParamsChange_ = function ()
			{
				var e = new CustomEvent("vrdisplaydeviceparamschange",
				{
					detail:
					{
						vrdisplay: this,
						deviceInfo: this.deviceInfo_
					}
				});
				window.dispatchEvent(e)
			}, n.exports = i, n.exports
		}), e.registerDynamic("8c", [], !0, function (e, t, n)
		{
			this || self;
			var i = window.MathUtil ||
			{};
			return i.degToRad = Math.PI / 180, i.radToDeg = 180 / Math.PI, i.Vector2 = function (e, t)
			{
				this.x = e || 0, this.y = t || 0
			}, i.Vector2.prototype = {
				constructor: i.Vector2,
				set: function (e, t)
				{
					return this.x = e, this.y = t, this
				},
				copy: function (e)
				{
					return this.x = e.x, this.y = e.y, this
				},
				subVectors: function (e, t)
				{
					return this.x = e.x - t.x, this.y = e.y - t.y, this
				}
			}, i.Vector3 = function (e, t, n)
			{
				this.x = e || 0, this.y = t || 0, this.z = n || 0
			}, i.Vector3.prototype = {
				constructor: i.Vector3,
				set: function (e, t, n)
				{
					return this.x = e, this.y = t, this.z = n, this
				},
				copy: function (e)
				{
					return this.x = e.x, this.y = e.y, this.z = e.z, this
				},
				length: function ()
				{
					return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
				},
				normalize: function ()
				{
					var e = this.length();
					if (0 !== e)
					{
						var t = 1 / e;
						this.multiplyScalar(t)
					}
					else this.x = 0, this.y = 0, this.z = 0;
					return this
				},
				multiplyScalar: function (e)
				{
					this.x *= e, this.y *= e, this.z *= e
				},
				applyQuaternion: function (e)
				{
					var t = this.x,
						n = this.y,
						i = this.z,
						r = e.x,
						o = e.y,
						s = e.z,
						a = e.w,
						u = a * t + o * i - s * n,
						c = a * n + s * t - r * i,
						l = a * i + r * n - o * t,
						h = -r * t - o * n - s * i;
					return this.x = u * a + h * -r + c * -s - l * -o, this.y = c * a + h * -o + l * -r - u * -s, this.z = l * a + h * -s + u * -o - c * -r, this
				},
				dot: function (e)
				{
					return this.x * e.x + this.y * e.y + this.z * e.z
				},
				crossVectors: function (e, t)
				{
					var n = e.x,
						i = e.y,
						r = e.z,
						o = t.x,
						s = t.y,
						a = t.z;
					return this.x = i * a - r * s, this.y = r * o - n * a, this.z = n * s - i * o, this
				}
			}, i.Quaternion = function (e, t, n, i)
			{
				this.x = e || 0, this.y = t || 0, this.z = n || 0, this.w = void 0 !== i ? i : 1
			}, i.Quaternion.prototype = {
				constructor: i.Quaternion,
				set: function (e, t, n, i)
				{
					return this.x = e, this.y = t, this.z = n, this.w = i, this
				},
				copy: function (e)
				{
					return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w, this
				},
				setFromEulerXYZ: function (e, t, n)
				{
					var i = Math.cos(e / 2),
						r = Math.cos(t / 2),
						o = Math.cos(n / 2),
						s = Math.sin(e / 2),
						a = Math.sin(t / 2),
						u = Math.sin(n / 2);
					return this.x = s * r * o + i * a * u, this.y = i * a * o - s * r * u, this.z = i * r * u + s * a * o, this.w = i * r * o - s * a * u, this
				},
				setFromEulerYXZ: function (e, t, n)
				{
					var i = Math.cos(e / 2),
						r = Math.cos(t / 2),
						o = Math.cos(n / 2),
						s = Math.sin(e / 2),
						a = Math.sin(t / 2),
						u = Math.sin(n / 2);
					return this.x = s * r * o + i * a * u, this.y = i * a * o - s * r * u, this.z = i * r * u - s * a * o, this.w = i * r * o + s * a * u, this
				},
				setFromAxisAngle: function (e, t)
				{
					var n = t / 2,
						i = Math.sin(n);
					return this.x = e.x * i, this.y = e.y * i, this.z = e.z * i, this.w = Math.cos(n), this
				},
				multiply: function (e)
				{
					return this.multiplyQuaternions(this, e)
				},
				multiplyQuaternions: function (e, t)
				{
					var n = e.x,
						i = e.y,
						r = e.z,
						o = e.w,
						s = t.x,
						a = t.y,
						u = t.z,
						c = t.w;
					return this.x = n * c + o * s + i * u - r * a, this.y = i * c + o * a + r * s - n * u, this.z = r * c + o * u + n * a - i * s, this.w = o * c - n * s - i * a - r * u, this
				},
				inverse: function ()
				{
					return this.x *= -1, this.y *= -1, this.z *= -1, this.normalize(), this
				},
				normalize: function ()
				{
					var e = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
					return 0 === e ? (this.x = 0, this.y = 0, this.z = 0, this.w = 1) : (e = 1 / e, this.x = this.x * e, this.y = this.y * e, this.z = this.z * e, this.w = this.w * e), this
				},
				slerp: function (e, t)
				{
					if (0 === t) return this;
					if (1 === t) return this.copy(e);
					var n = this.x,
						i = this.y,
						r = this.z,
						o = this.w,
						s = o * e.w + n * e.x + i * e.y + r * e.z;
					if (s < 0 ? (this.w = -e.w, this.x = -e.x, this.y = -e.y, this.z = -e.z, s = -s) : this.copy(e), s >= 1) return this.w = o, this.x = n, this.y = i, this.z = r, this;
					var a = Math.acos(s),
						u = Math.sqrt(1 - s * s);
					if (Math.abs(u) < .001) return this.w = .5 * (o + this.w), this.x = .5 * (n + this.x), this.y = .5 * (i + this.y), this.z = .5 * (r + this.z), this;
					var c = Math.sin((1 - t) * a) / u,
						l = Math.sin(t * a) / u;
					return this.w = o * c + this.w * l, this.x = n * c + this.x * l, this.y = i * c + this.y * l, this.z = r * c + this.z * l, this
				},
				setFromUnitVectors: function ()
				{
					var e, t;
					return function (n, r)
					{
						return void 0 === e && (e = new i.Vector3), t = n.dot(r) + 1, t < 1e-6 ? (t = 0, Math.abs(n.x) > Math.abs(n.z) ? e.set(-n.y, n.x, 0) : e.set(0, -n.z, n.y)) : e.crossVectors(n, r), this.x = e.x, this.y = e.y, this.z = e.z, this.w = t, this.normalize(), this
					}
				}()
			}, n.exports = i, n.exports
		}), e.registerDynamic("97", ["96", "8c", "86"], !0, function (e, t, n)
		{
			function i()
			{
				this.displayName = "Mouse and Keyboard VRDisplay (webvr-polyfill)", this.capabilities.hasOrientation = !0, window.addEventListener("keydown", this.onKeyDown_.bind(this)), window.addEventListener("mousemove", this.onMouseMove_.bind(this)), window.addEventListener("mousedown", this.onMouseDown_.bind(this)), window.addEventListener("mouseup", this.onMouseUp_.bind(this)), this.phi_ = 0, this.theta_ = 0, this.targetAngle_ = null, this.angleAnimation_ = null, this.orientation_ = new o.Quaternion, this.rotateStart_ = new o.Vector2, this.rotateEnd_ = new o.Vector2, this.rotateDelta_ = new o.Vector2, this.isDragging_ = !1, this.orientationOut_ = new Float32Array(4)
			}
			this || self;
			var r = e("96").VRDisplay,
				o = e("8c"),
				s = e("86");
			return i.prototype = new r, i.prototype.getImmediatePose = function ()
			{
				return this.orientation_.setFromEulerYXZ(this.phi_, this.theta_, 0), this.orientationOut_[0] = this.orientation_.x, this.orientationOut_[1] = this.orientation_.y, this.orientationOut_[2] = this.orientation_.z, this.orientationOut_[3] = this.orientation_.w,
				{
					position: null,
					orientation: this.orientationOut_,
					linearVelocity: null,
					linearAcceleration: null,
					angularVelocity: null,
					angularAcceleration: null
				}
			}, i.prototype.onKeyDown_ = function (e)
			{
				38 == e.keyCode ? this.animatePhi_(this.phi_ + .15) : 39 == e.keyCode ? this.animateTheta_(this.theta_ - .15) : 40 == e.keyCode ? this.animatePhi_(this.phi_ - .15) : 37 == e.keyCode && this.animateTheta_(this.theta_ + .15)
			}, i.prototype.animateTheta_ = function (e)
			{
				this.animateKeyTransitions_("theta_", e)
			}, i.prototype.animatePhi_ = function (e)
			{
				e = s.clamp(e, -Math.PI / 2, Math.PI / 2), this.animateKeyTransitions_("phi_", e)
			}, i.prototype.animateKeyTransitions_ = function (e, t)
			{
				this.angleAnimation_ && cancelAnimationFrame(this.angleAnimation_);
				var n = this[e],
					i = new Date;
				this.angleAnimation_ = requestAnimationFrame(function r()
				{
					var o = new Date - i;
					if (o >= 80) return this[e] = t, void cancelAnimationFrame(this.angleAnimation_);
					this.angleAnimation_ = requestAnimationFrame(r.bind(this));
					var s = o / 80;
					this[e] = n + (t - n) * s
				}.bind(this))
			}, i.prototype.onMouseDown_ = function (e)
			{
				this.rotateStart_.set(e.clientX, e.clientY), this.isDragging_ = !0
			}, i.prototype.onMouseMove_ = function (e)
			{
				if (this.isDragging_ || this.isPointerLocked_())
				{
					if (this.isPointerLocked_())
					{
						var t = e.movementX || e.mozMovementX || 0,
							n = e.movementY || e.mozMovementY || 0;
						this.rotateEnd_.set(this.rotateStart_.x - t, this.rotateStart_.y - n)
					}
					else this.rotateEnd_.set(e.clientX, e.clientY);
					this.rotateDelta_.subVectors(this.rotateEnd_, this.rotateStart_), this.rotateStart_.copy(this.rotateEnd_), this.phi_ += 2 * Math.PI * this.rotateDelta_.y / screen.height * .3, this.theta_ += 2 * Math.PI * this.rotateDelta_.x / screen.width * .5, this.phi_ = s.clamp(this.phi_, -Math.PI / 2, Math.PI / 2)
				}
			}, i.prototype.onMouseUp_ = function (e)
			{
				this.isDragging_ = !1
			}, i.prototype.isPointerLocked_ = function ()
			{
				return void 0 !== (document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement)
			}, i.prototype.resetPose = function ()
			{
				this.phi_ = 0, this.theta_ = 0
			}, n.exports = i, n.exports
		}), e.registerDynamic("98", [], !0, function (e, t, n)
		{
			"use strict";

			function i(e)
			{
				if (null === e || void 0 === e) throw new TypeError("Object.assign cannot be called with null or undefined");
				return Object(e)
			}
			this || self;
			var r = Object.prototype.hasOwnProperty,
				o = Object.prototype.propertyIsEnumerable;
			return n.exports = function ()
			{
				try
				{
					if (!Object.assign) return !1;
					var e = new String("abc");
					if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;
					for (var t = {}, n = 0; n < 10; n++) t["_" + String.fromCharCode(n)] = n;
					if ("0123456789" !== Object.getOwnPropertyNames(t).map(function (e)
						{
							return t[e]
						}).join("")) return !1;
					var i = {};
					return "abcdefghijklmnopqrst".split("").forEach(function (e)
					{
						i[e] = e
					}), "abcdefghijklmnopqrst" === Object.keys(Object.assign(
					{}, i)).join("")
				}
				catch (e)
				{
					return !1
				}
			}() ? Object.assign : function (e, t)
			{
				for (var n, s, a = i(e), u = 1; u < arguments.length; u++)
				{
					n = Object(arguments[u]);
					for (var c in n) r.call(n, c) && (a[c] = n[c]);
					if (Object.getOwnPropertySymbols)
					{
						s = Object.getOwnPropertySymbols(n);
						for (var l = 0; l < s.length; l++) o.call(n, s[l]) && (a[s[l]] = n[s[l]])
					}
				}
				return a
			}, n.exports
		}), e.registerDynamic("86", ["98"], !0, function (e, t, n)
		{
			this || self;
			var i = e("98"),
				r = window.Util ||
				{};
			return r.MIN_TIMESTEP = .001, r.MAX_TIMESTEP = 1, r.base64 = function (e, t)
			{
				return "data:" + e + ";base64," + t
			}, r.clamp = function (e, t, n)
			{
				return Math.min(Math.max(t, e), n)
			}, r.lerp = function (e, t, n)
			{
				return e + (t - e) * n
			}, r.isIOS = function ()
			{
				var e = /iPad|iPhone|iPod/.test(navigator.platform);
				return function ()
				{
					return e
				}
			}(), r.isSafari = function ()
			{
				var e = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
				return function ()
				{
					return e
				}
			}(), r.isFirefoxAndroid = function ()
			{
				var e = -1 !== navigator.userAgent.indexOf("Firefox") && -1 !== navigator.userAgent.indexOf("Android");
				return function ()
				{
					return e
				}
			}(), r.isLandscapeMode = function ()
			{
				return 90 == window.orientation || -90 == window.orientation
			}, r.isTimestampDeltaValid = function (e)
			{
				return !isNaN(e) && (!(e <= r.MIN_TIMESTEP) && !(e > r.MAX_TIMESTEP))
			}, r.getScreenWidth = function ()
			{
				return Math.max(window.screen.width, window.screen.height) * window.devicePixelRatio
			}, r.getScreenHeight = function ()
			{
				return Math.min(window.screen.width, window.screen.height) * window.devicePixelRatio
			}, r.requestFullscreen = function (e)
			{
				if (e.requestFullscreen) e.requestFullscreen();
				else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
				else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
				else
				{
					if (!e.msRequestFullscreen) return !1;
					e.msRequestFullscreen()
				}
				return !0
			}, r.exitFullscreen = function ()
			{
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else
				{
					if (!document.msExitFullscreen) return !1;
					document.msExitFullscreen()
				}
				return !0
			}, r.getFullscreenElement = function ()
			{
				return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
			}, r.linkProgram = function (e, t, n, i)
			{
				var r = e.createShader(e.VERTEX_SHADER);
				e.shaderSource(r, t), e.compileShader(r);
				var o = e.createShader(e.FRAGMENT_SHADER);
				e.shaderSource(o, n), e.compileShader(o);
				var s = e.createProgram();
				e.attachShader(s, r), e.attachShader(s, o);
				for (var a in i) e.bindAttribLocation(s, i[a], a);
				return e.linkProgram(s), e.deleteShader(r), e.deleteShader(o), s
			}, r.getProgramUniforms = function (e, t)
			{
				for (var n = {}, i = e.getProgramParameter(t, e.ACTIVE_UNIFORMS), r = "", o = 0; o < i; o++) n[r = e.getActiveUniform(t, o).name.replace("[0]", "")] = e.getUniformLocation(t, r);
				return n
			}, r.orthoMatrix = function (e, t, n, i, r, o, s)
			{
				var a = 1 / (t - n),
					u = 1 / (i - r),
					c = 1 / (o - s);
				return e[0] = -2 * a, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * u, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * c, e[11] = 0, e[12] = (t + n) * a, e[13] = (r + i) * u, e[14] = (s + o) * c, e[15] = 1, e
			}, r.isMobile = function ()
			{
				var e = !1;
				return function (t)
				{
					(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
				}(navigator.userAgent || navigator.vendor || window.opera), e
			}, r.extend = i, r.safariCssSizeWorkaround = function (e)
			{
				if (r.isIOS())
				{
					var t = e.style.width,
						n = e.style.height;
					e.style.width = parseInt(t) + 1 + "px", e.style.height = parseInt(n) + "px", console.log("Resetting width to...", t), setTimeout(function ()
					{
						console.log("Done. Width is now", t), e.style.width = t, e.style.height = n
					}, 100)
				}
				window.Util = r, window.canvas = e
			}, r.frameDataFromPose = function ()
			{
				function e(e, t, n, i)
				{
					var s = Math.tan(t ? t.upDegrees * r : o),
						a = Math.tan(t ? t.downDegrees * r : o),
						u = Math.tan(t ? t.leftDegrees * r : o),
						c = Math.tan(t ? t.rightDegrees * r : o),
						l = 2 / (u + c),
						h = 2 / (s + a);
					return e[0] = l, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = h, e[6] = 0, e[7] = 0, e[8] = -(u - c) * l * .5, e[9] = (s - a) * h * .5, e[10] = i / (n - i), e[11] = -1, e[12] = 0, e[13] = 0, e[14] = i * n / (n - i), e[15] = 0, e
				}

				function t(e, t, n)
				{
					var i = t[0],
						r = t[1],
						o = t[2],
						s = t[3],
						a = i + i,
						u = r + r,
						c = o + o,
						l = i * a,
						h = i * u,
						d = i * c,
						f = r * u,
						p = r * c,
						g = o * c,
						y = s * a,
						M = s * u,
						v = s * c;
					return e[0] = 1 - (f + g), e[1] = h + v, e[2] = d - M, e[3] = 0, e[4] = h - v, e[5] = 1 - (l + g), e[6] = p + y, e[7] = 0, e[8] = d + M, e[9] = p - y, e[10] = 1 - (l + f), e[11] = 0, e[12] = n[0], e[13] = n[1], e[14] = n[2], e[15] = 1, e
				}

				function n(e, t, n)
				{
					var i, r, o, s, a, u, c, l, h, d, f, p, g = n[0],
						y = n[1],
						M = n[2];
					return t === e ? (e[12] = t[0] * g + t[4] * y + t[8] * M + t[12], e[13] = t[1] * g + t[5] * y + t[9] * M + t[13], e[14] = t[2] * g + t[6] * y + t[10] * M + t[14], e[15] = t[3] * g + t[7] * y + t[11] * M + t[15]) : (i = t[0], r = t[1], o = t[2], s = t[3], a = t[4], u = t[5], c = t[6], l = t[7], h = t[8], d = t[9], f = t[10], p = t[11], e[0] = i, e[1] = r, e[2] = o, e[3] = s, e[4] = a, e[5] = u, e[6] = c, e[7] = l, e[8] = h, e[9] = d, e[10] = f, e[11] = p, e[12] = i * g + a * y + h * M + t[12], e[13] = r * g + u * y + d * M + t[13], e[14] = o * g + c * y + f * M + t[14], e[15] = s * g + l * y + p * M + t[15]), e
				}

				function i(i, r, o, u, c)
				{
					e(i, u ? u.fieldOfView : null, c.depthNear, c.depthFar), t(r, o.orientation || s, o.position || a), u && n(r, r, u.offset), mat4_invert(r, r)
				}
				var r = Math.PI / 180,
					o = .25 * Math.PI;
				mat4_invert = function (e, t)
				{
					var n = t[0],
						i = t[1],
						r = t[2],
						o = t[3],
						s = t[4],
						a = t[5],
						u = t[6],
						c = t[7],
						l = t[8],
						h = t[9],
						d = t[10],
						f = t[11],
						p = t[12],
						g = t[13],
						y = t[14],
						M = t[15],
						v = n * a - i * s,
						A = n * u - r * s,
						E = n * c - o * s,
						m = i * u - r * a,
						w = i * c - o * a,
						N = r * c - o * u,
						D = l * g - h * p,
						T = l * y - d * p,
						I = l * M - f * p,
						O = h * y - d * g,
						S = h * M - f * g,
						_ = d * M - f * y,
						L = v * _ - A * S + E * O + m * I - w * T + N * D;
					return L ? (L = 1 / L, e[0] = (a * _ - u * S + c * O) * L, e[1] = (r * S - i * _ - o * O) * L, e[2] = (g * N - y * w + M * m) * L, e[3] = (d * w - h * N - f * m) * L, e[4] = (u * I - s * _ - c * T) * L, e[5] = (n * _ - r * I + o * T) * L, e[6] = (y * E - p * N - M * A) * L, e[7] = (l * N - d * E + f * A) * L, e[8] = (s * S - a * I + c * D) * L, e[9] = (i * I - n * S - o * D) * L, e[10] = (p * w - g * E + M * v) * L, e[11] = (h * E - l * w - f * v) * L, e[12] = (a * T - s * O - u * D) * L, e[13] = (n * O - i * T + r * D) * L, e[14] = (g * A - p * m - y * v) * L, e[15] = (l * m - h * A + d * v) * L, e) : null
				};
				var s = new Float32Array([0, 0, 0, 1]),
					a = new Float32Array([0, 0, 0]);
				return function (e, t, n)
				{
					return !(!e || !t) && (e.pose = t, e.timestamp = t.timestamp, i(e.leftProjectionMatrix, e.leftViewMatrix, t, n.getEyeParameters("left"), n), i(e.rightProjectionMatrix, e.rightViewMatrix, t, n.getEyeParameters("right"), n), !0)
				}
			}(), n.exports = r, n.exports
		}), e.registerDynamic("99", ["86"], !0, function (e, t, n)
		{
			function i()
			{
				var e = document.createElement("video");
				e.addEventListener("ended", function ()
				{
					e.play()
				}), this.request = function ()
				{
					e.paused && (e.src = o.base64("video/mp4", "AAAAGGZ0eXBpc29tAAAAAG1wNDFhdmMxAAAIA21vb3YAAABsbXZoZAAAAADSa9v60mvb+gABX5AAlw/gAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAdkdHJhawAAAFx0a2hkAAAAAdJr2/rSa9v6AAAAAQAAAAAAlw/gAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAQAAAAHAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAJcP4AAAAAAAAQAAAAAG3G1kaWEAAAAgbWRoZAAAAADSa9v60mvb+gAPQkAGjneAFccAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAABodtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAZHc3RibAAAAJdzdHNkAAAAAAAAAAEAAACHYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAMABwASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAADFhdmNDAWQAC//hABlnZAALrNlfllw4QAAAAwBAAAADAKPFCmWAAQAFaOvssiwAAAAYc3R0cwAAAAAAAAABAAAAbgAPQkAAAAAUc3RzcwAAAAAAAAABAAAAAQAAA4BjdHRzAAAAAAAAAG4AAAABAD0JAAAAAAEAehIAAAAAAQA9CQAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEATEtAAAAAAQAehIAAAAABAAAAAAAAAAEAD0JAAAAAAQBMS0AAAAABAB6EgAAAAAEAAAAAAAAAAQAPQkAAAAABAExLQAAAAAEAHoSAAAAAAQAAAAAAAAABAA9CQAAAAAEALcbAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAABuAAAAAQAAAcxzdHN6AAAAAAAAAAAAAABuAAADCQAAABgAAAAOAAAADgAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABIAAAAOAAAADAAAAAwAAAASAAAADgAAAAwAAAAMAAAAEgAAAA4AAAAMAAAADAAAABMAAAAUc3RjbwAAAAAAAAABAAAIKwAAACt1ZHRhAAAAI6llbmMAFwAAdmxjIDIuMi4xIHN0cmVhbSBvdXRwdXQAAAAId2lkZQAACRRtZGF0AAACrgX//6vcRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTQyIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9MTIgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1hYnIgbWJ0cmVlPTEgYml0cmF0ZT0xMDAgcmF0ZXRvbD0xLjAgcWNvbXA9MC42MCBxcG1pbj0xMCBxcG1heD01MSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAU2WIhAAQ/8ltlOe+cTZuGkKg+aRtuivcDZ0pBsfsEi9p/i1yU9DxS2lq4dXTinViF1URBKXgnzKBd/Uh1bkhHtMrwrRcOJslD01UB+fyaL6ef+DBAAAAFEGaJGxBD5B+v+a+4QqF3MgBXz9MAAAACkGeQniH/+94r6EAAAAKAZ5hdEN/8QytwAAAAAgBnmNqQ3/EgQAAAA5BmmhJqEFomUwIIf/+4QAAAApBnoZFESw//76BAAAACAGepXRDf8SBAAAACAGep2pDf8SAAAAADkGarEmoQWyZTAgh//7gAAAACkGeykUVLD//voEAAAAIAZ7pdEN/xIAAAAAIAZ7rakN/xIAAAAAOQZrwSahBbJlMCCH//uEAAAAKQZ8ORRUsP/++gQAAAAgBny10Q3/EgQAAAAgBny9qQ3/EgAAAAA5BmzRJqEFsmUwIIf/+4AAAAApBn1JFFSw//76BAAAACAGfcXRDf8SAAAAACAGfc2pDf8SAAAAADkGbeEmoQWyZTAgh//7hAAAACkGflkUVLD//voAAAAAIAZ+1dEN/xIEAAAAIAZ+3akN/xIEAAAAOQZu8SahBbJlMCCH//uAAAAAKQZ/aRRUsP/++gQAAAAgBn/l0Q3/EgAAAAAgBn/tqQ3/EgQAAAA5Bm+BJqEFsmUwIIf/+4QAAAApBnh5FFSw//76AAAAACAGePXRDf8SAAAAACAGeP2pDf8SBAAAADkGaJEmoQWyZTAgh//7gAAAACkGeQkUVLD//voEAAAAIAZ5hdEN/xIAAAAAIAZ5jakN/xIEAAAAOQZpoSahBbJlMCCH//uEAAAAKQZ6GRRUsP/++gQAAAAgBnqV0Q3/EgQAAAAgBnqdqQ3/EgAAAAA5BmqxJqEFsmUwIIf/+4AAAAApBnspFFSw//76BAAAACAGe6XRDf8SAAAAACAGe62pDf8SAAAAADkGa8EmoQWyZTAgh//7hAAAACkGfDkUVLD//voEAAAAIAZ8tdEN/xIEAAAAIAZ8vakN/xIAAAAAOQZs0SahBbJlMCCH//uAAAAAKQZ9SRRUsP/++gQAAAAgBn3F0Q3/EgAAAAAgBn3NqQ3/EgAAAAA5Bm3hJqEFsmUwIIf/+4QAAAApBn5ZFFSw//76AAAAACAGftXRDf8SBAAAACAGft2pDf8SBAAAADkGbvEmoQWyZTAgh//7gAAAACkGf2kUVLD//voEAAAAIAZ/5dEN/xIAAAAAIAZ/7akN/xIEAAAAOQZvgSahBbJlMCCH//uEAAAAKQZ4eRRUsP/++gAAAAAgBnj10Q3/EgAAAAAgBnj9qQ3/EgQAAAA5BmiRJqEFsmUwIIf/+4AAAAApBnkJFFSw//76BAAAACAGeYXRDf8SAAAAACAGeY2pDf8SBAAAADkGaaEmoQWyZTAgh//7hAAAACkGehkUVLD//voEAAAAIAZ6ldEN/xIEAAAAIAZ6nakN/xIAAAAAOQZqsSahBbJlMCCH//uAAAAAKQZ7KRRUsP/++gQAAAAgBnul0Q3/EgAAAAAgBnutqQ3/EgAAAAA5BmvBJqEFsmUwIIf/+4QAAAApBnw5FFSw//76BAAAACAGfLXRDf8SBAAAACAGfL2pDf8SAAAAADkGbNEmoQWyZTAgh//7gAAAACkGfUkUVLD//voEAAAAIAZ9xdEN/xIAAAAAIAZ9zakN/xIAAAAAOQZt4SahBbJlMCCH//uEAAAAKQZ+WRRUsP/++gAAAAAgBn7V0Q3/EgQAAAAgBn7dqQ3/EgQAAAA5Bm7xJqEFsmUwIIf/+4AAAAApBn9pFFSw//76BAAAACAGf+XRDf8SAAAAACAGf+2pDf8SBAAAADkGb4EmoQWyZTAgh//7hAAAACkGeHkUVLD//voAAAAAIAZ49dEN/xIAAAAAIAZ4/akN/xIEAAAAOQZokSahBbJlMCCH//uAAAAAKQZ5CRRUsP/++gQAAAAgBnmF0Q3/EgAAAAAgBnmNqQ3/EgQAAAA5BmmhJqEFsmUwIIf/+4QAAAApBnoZFFSw//76BAAAACAGepXRDf8SBAAAACAGep2pDf8SAAAAADkGarEmoQWyZTAgh//7gAAAACkGeykUVLD//voEAAAAIAZ7pdEN/xIAAAAAIAZ7rakN/xIAAAAAPQZruSahBbJlMFEw3//7B"), e.play())
				}, this.release = function ()
				{
					e.pause(), e.src = ""
				}
			}

			function r()
			{
				var e = null;
				this.request = function ()
				{
					e || (e = setInterval(function ()
					{
						window.location = window.location, setTimeout(window.stop, 0)
					}, 3e4))
				}, this.release = function ()
				{
					e && (clearInterval(e), e = null)
				}
			}
			this || self;
			var o = e("86");
			return n.exports = function ()
			{
				var e = navigator.userAgent || navigator.vendor || window.opera;
				return e.match(/iPhone/i) || e.match(/iPod/i) ? r : i
			}(), n.exports
		}), e.registerDynamic("96", ["86", "99"], !0, function (e, t, n)
		{
			function i()
			{
				this.leftProjectionMatrix = new Float32Array(16), this.leftViewMatrix = new Float32Array(16), this.rightProjectionMatrix = new Float32Array(16), this.rightViewMatrix = new Float32Array(16), this.pose = null
			}

			function r()
			{
				this.isPolyfilled = !0, this.displayId = l++, this.displayName = "webvr-polyfill displayName", this.depthNear = .01, this.depthFar = 1e4, this.isConnected = !0, this.isPresenting = !1, this.capabilities = {
					hasPosition: !1,
					hasOrientation: !1,
					hasExternalDisplay: !1,
					canPresent: !1,
					maxLayers: 1
				}, this.stageParameters = null, this.waitingForPresent_ = !1, this.layer_ = null, this.fullscreenElement_ = null, this.fullscreenWrapper_ = null, this.fullscreenElementCachedStyle_ = null, this.fullscreenEventTarget_ = null, this.fullscreenChangeHandler_ = null, this.fullscreenErrorHandler_ = null, this.wakelock_ = new c
			}

			function o()
			{
				this.isPolyfilled = !0, this.hardwareUnitId = "webvr-polyfill hardwareUnitId", this.deviceId = "webvr-polyfill deviceId", this.deviceName = "webvr-polyfill deviceName"
			}

			function s()
			{}

			function a()
			{}
			this || self;
			var u = e("86"),
				c = e("99"),
				l = 1e3,
				h = !1,
				d = [0, 0, .5, 1],
				f = [.5, 0, .5, 1];
			return r.prototype.getFrameData = function (e)
			{
				return u.frameDataFromPose(e, this.getPose(), this)
			}, r.prototype.getPose = function ()
			{
				return this.getImmediatePose()
			}, r.prototype.requestAnimationFrame = function (e)
			{
				return window.requestAnimationFrame(e)
			}, r.prototype.cancelAnimationFrame = function (e)
			{
				return window.cancelAnimationFrame(e)
			}, r.prototype.wrapForFullscreen = function (e)
			{
				if (u.isIOS()) return e;
				if (!this.fullscreenWrapper_)
				{
					this.fullscreenWrapper_ = document.createElement("div");
					var t = ["height: " + Math.min(screen.height, screen.width) + "px !important", "top: 0 !important", "left: 0 !important", "right: 0 !important", "border: 0", "margin: 0", "padding: 0", "z-index: 999999 !important", "position: fixed"];
					this.fullscreenWrapper_.setAttribute("style", t.join("; ") + ";"), this.fullscreenWrapper_.classList.add("webvr-polyfill-fullscreen-wrapper")
				}
				if (this.fullscreenElement_ == e) return this.fullscreenWrapper_;
				this.removeFullscreenWrapper(), this.fullscreenElement_ = e;
				var n = this.fullscreenElement_.parentElement;
				n.insertBefore(this.fullscreenWrapper_, this.fullscreenElement_), n.removeChild(this.fullscreenElement_), this.fullscreenWrapper_.insertBefore(this.fullscreenElement_, this.fullscreenWrapper_.firstChild), this.fullscreenElementCachedStyle_ = this.fullscreenElement_.getAttribute("style");
				var i = this;
				return function ()
				{
					if (i.fullscreenElement_)
					{
						var e = ["position: absolute", "top: 0", "left: 0", "width: " + Math.max(screen.width, screen.height) + "px", "height: " + Math.min(screen.height, screen.width) + "px", "border: 0", "margin: 0", "padding: 0"];
						i.fullscreenElement_.setAttribute("style", e.join("; ") + ";")
					}
				}(), this.fullscreenWrapper_
			}, r.prototype.removeFullscreenWrapper = function ()
			{
				if (this.fullscreenElement_)
				{
					var e = this.fullscreenElement_;
					this.fullscreenElementCachedStyle_ ? e.setAttribute("style", this.fullscreenElementCachedStyle_) : e.removeAttribute("style"), this.fullscreenElement_ = null, this.fullscreenElementCachedStyle_ = null;
					var t = this.fullscreenWrapper_.parentElement;
					return this.fullscreenWrapper_.removeChild(e), t.insertBefore(e, this.fullscreenWrapper_), t.removeChild(this.fullscreenWrapper_), e
				}
			}, r.prototype.requestPresent = function (e)
			{
				var t = this.isPresenting,
					n = this;
				return e instanceof Array || (h || (console.warn("Using a deprecated form of requestPresent. Should pass in an array of VRLayers."), h = !0), e = [e]), new Promise(function (i, r)
				{
					function o()
					{
						var e = u.getFullscreenElement();
						n.isPresenting = y === e, n.isPresenting ? (screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape-primary").catch(function (e)
						{
							console.error("screen.orientation.lock() failed due to", e.message)
						}), n.waitingForPresent_ = !1, n.beginPresent_(), i()) : (screen.orientation && screen.orientation.unlock && screen.orientation.unlock(), n.removeFullscreenWrapper(), n.wakelock_.release(), n.endPresent_(), n.removeFullscreenListeners_()), n.fireVRDisplayPresentChange_()
					}

					function s()
					{
						n.waitingForPresent_ && (n.removeFullscreenWrapper(), n.removeFullscreenListeners_(), n.wakelock_.release(), n.waitingForPresent_ = !1, n.isPresenting = !1, r(new Error("Unable to present.")))
					}
					if (n.capabilities.canPresent)
						if (0 == e.length || e.length > n.capabilities.maxLayers) r(new Error("Invalid number of layers."));
						else
						{
							var a = e[0];
							if (a.source)
							{
								var c = a.leftBounds || d,
									l = a.rightBounds || f;
								if (t)
								{
									var h = !1,
										p = n.layer_;
									p.source !== a.source && (p.source = a.source, h = !0);
									for (var g = 0; g < 4; g++) p.leftBounds[g] !== c[g] && (p.leftBounds[g] = c[g], h = !0), p.rightBounds[g] !== l[g] && (p.rightBounds[g] = l[g], h = !0);
									return h && n.fireVRDisplayPresentChange_(), void i()
								}
								if (n.layer_ = {
										predistorted: a.predistorted,
										source: a.source,
										leftBounds: c.slice(0),
										rightBounds: l.slice(0)
									}, n.waitingForPresent_ = !1, n.layer_ && n.layer_.source)
								{
									var y = n.wrapForFullscreen(n.layer_.source);
									n.addFullscreenListeners_(y, o, s), u.requestFullscreen(y) ? (n.wakelock_.request(), n.waitingForPresent_ = !0) : u.isIOS() && (n.wakelock_.request(), n.isPresenting = !0, n.beginPresent_(), n.fireVRDisplayPresentChange_(), i())
								}
								n.waitingForPresent_ || u.isIOS() || (u.exitFullscreen(), r(new Error("Unable to present.")))
							}
							else i()
						}
					else r(new Error("VRDisplay is not capable of presenting."))
				})
			}, r.prototype.exitPresent = function ()
			{
				var e = this.isPresenting,
					t = this;
				return this.isPresenting = !1, this.layer_ = null, this.wakelock_.release(), new Promise(function (n, i)
				{
					e ? (!u.exitFullscreen() && u.isIOS() && (t.endPresent_(), t.fireVRDisplayPresentChange_()), n()) : i(new Error("Was not presenting to VRDisplay."))
				})
			}, r.prototype.getLayers = function ()
			{
				return this.layer_ ? [this.layer_] : []
			}, r.prototype.fireVRDisplayPresentChange_ = function ()
			{
				var e = new CustomEvent("vrdisplaypresentchange",
				{
					detail:
					{
						vrdisplay: this
					}
				});
				window.dispatchEvent(e)
			}, r.prototype.addFullscreenListeners_ = function (e, t, n)
			{
				this.removeFullscreenListeners_(), this.fullscreenEventTarget_ = e, this.fullscreenChangeHandler_ = t, this.fullscreenErrorHandler_ = n, t && (document.fullscreenEnabled ? e.addEventListener("fullscreenchange", t, !1) : document.webkitFullscreenEnabled ? e.addEventListener("webkitfullscreenchange", t, !1) : document.mozFullScreenEnabled ? document.addEventListener("mozfullscreenchange", t, !1) : document.msFullscreenEnabled && e.addEventListener("msfullscreenchange", t, !1)), n && (document.fullscreenEnabled ? e.addEventListener("fullscreenerror", n, !1) : document.webkitFullscreenEnabled ? e.addEventListener("webkitfullscreenerror", n, !1) : document.mozFullScreenEnabled ? document.addEventListener("mozfullscreenerror", n, !1) : document.msFullscreenEnabled && e.addEventListener("msfullscreenerror", n, !1))
			}, r.prototype.removeFullscreenListeners_ = function ()
			{
				if (this.fullscreenEventTarget_)
				{
					var e = this.fullscreenEventTarget_;
					if (this.fullscreenChangeHandler_)
					{
						var t = this.fullscreenChangeHandler_;
						e.removeEventListener("fullscreenchange", t, !1), e.removeEventListener("webkitfullscreenchange", t, !1), document.removeEventListener("mozfullscreenchange", t, !1), e.removeEventListener("msfullscreenchange", t, !1)
					}
					if (this.fullscreenErrorHandler_)
					{
						var n = this.fullscreenErrorHandler_;
						e.removeEventListener("fullscreenerror", n, !1), e.removeEventListener("webkitfullscreenerror", n, !1), document.removeEventListener("mozfullscreenerror", n, !1), e.removeEventListener("msfullscreenerror", n, !1)
					}
					this.fullscreenEventTarget_ = null, this.fullscreenChangeHandler_ = null, this.fullscreenErrorHandler_ = null
				}
			}, r.prototype.beginPresent_ = function () {}, r.prototype.endPresent_ = function () {}, r.prototype.submitFrame = function (e) {}, r.prototype.getEyeParameters = function (e)
			{
				return null
			}, s.prototype = new o, a.prototype = new o, n.exports.VRFrameData = i, n.exports.VRDisplay = r, n.exports.VRDevice = o, n.exports.HMDVRDevice = s, n.exports.PositionSensorVRDevice = a, n.exports
		}), e.registerDynamic("9a", ["96"], !0, function (e, t, n)
		{
			function i(e)
			{
				this.display = e, this.hardwareUnitId = e.displayId, this.deviceId = "webvr-polyfill:HMD:" + e.displayId, this.deviceName = e.displayName + " (HMD)"
			}

			function r(e)
			{
				this.display = e, this.hardwareUnitId = e.displayId, this.deviceId = "webvr-polyfill:PositionSensor: " + e.displayId, this.deviceName = e.displayName + " (PositionSensor)"
			}
			this || self, e("96").VRDisplay;
			var o = e("96").HMDVRDevice,
				s = e("96").PositionSensorVRDevice;
			return i.prototype = new o, i.prototype.getEyeParameters = function (e)
			{
				var t = this.display.getEyeParameters(e);
				return {
					currentFieldOfView: t.fieldOfView,
					maximumFieldOfView: t.fieldOfView,
					minimumFieldOfView: t.fieldOfView,
					recommendedFieldOfView: t.fieldOfView,
					eyeTranslation:
					{
						x: t.offset[0],
						y: t.offset[1],
						z: t.offset[2]
					},
					renderRect:
					{
						x: "right" == e ? t.renderWidth : 0,
						y: 0,
						width: t.renderWidth,
						height: t.renderHeight
					}
				}
			}, i.prototype.setFieldOfView = function (e, t, n, i) {}, r.prototype = new s, r.prototype.getState = function ()
			{
				var e = this.display.getPose();
				return {
					position: e.position ?
					{
						x: e.position[0],
						y: e.position[1],
						z: e.position[2]
					} : null,
					orientation: e.orientation ?
					{
						x: e.orientation[0],
						y: e.orientation[1],
						z: e.orientation[2],
						w: e.orientation[3]
					} : null,
					linearVelocity: null,
					linearAcceleration: null,
					angularVelocity: null,
					angularAcceleration: null
				}
			}, r.prototype.resetState = function ()
			{
				return this.positionDevice.resetPose()
			}, n.exports.VRDisplayHMDDevice = i, n.exports.VRDisplayPositionSensorDevice = r, n.exports
		}), e.registerDynamic("9b", ["86", "95", "97", "96", "9a"], !0, function (e, t, n)
		{
			function i()
			{
				this.displays = [], this.devices = [], this.devicesPopulated = !1, this.nativeWebVRAvailable = this.isWebVRAvailable(), this.nativeLegacyWebVRAvailable = this.isDeprecatedWebVRAvailable(), this.nativeLegacyWebVRAvailable || (this.nativeWebVRAvailable || this.enablePolyfill(), WebVRConfig.ENABLE_DEPRECATED_API && this.enableDeprecatedPolyfill()), r()
			}

			function r()
			{
				"VRDisplay" in window && !("VRFrameData" in window) && (window.VRFrameData = c, "depthNear" in window.VRDisplay.prototype || (window.VRDisplay.prototype.depthNear = .01), "depthFar" in window.VRDisplay.prototype || (window.VRDisplay.prototype.depthFar = 1e4), window.VRDisplay.prototype.getFrameData = function (e)
				{
					return o.frameDataFromPose(e, this.getPose(), this)
				})
			}
			this || self;
			var o = e("86"),
				s = e("95"),
				a = e("97"),
				u = e("96").VRDisplay,
				c = e("96").VRFrameData,
				l = e("96").HMDVRDevice,
				h = e("96").PositionSensorVRDevice,
				d = e("9a").VRDisplayHMDDevice,
				f = e("9a").VRDisplayPositionSensorDevice;
			return i.prototype.isWebVRAvailable = function ()
			{
				return "getVRDisplays" in navigator
			}, i.prototype.isDeprecatedWebVRAvailable = function ()
			{
				return "getVRDevices" in navigator || "mozGetVRDevices" in navigator
			}, i.prototype.populateDevices = function ()
			{
				if (!this.devicesPopulated)
				{
					var e = null;
					this.isCardboardCompatible() && (e = new s, this.displays.push(e), WebVRConfig.ENABLE_DEPRECATED_API && (this.devices.push(new d(e)), this.devices.push(new f(e)))), this.isMobile() || WebVRConfig.MOUSE_KEYBOARD_CONTROLS_DISABLED || (e = new a, this.displays.push(e), WebVRConfig.ENABLE_DEPRECATED_API && (this.devices.push(new d(e)), this.devices.push(new f(e)))), this.devicesPopulated = !0
				}
			}, i.prototype.enablePolyfill = function ()
			{
				navigator.getVRDisplays = this.getVRDisplays.bind(this), window.VRDisplay = u;
				var e = this;
				Object.defineProperty(navigator, "vrEnabled",
				{
					get: function ()
					{
						return e.isCardboardCompatible() && (document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || !1)
					}
				}), window.VRFrameData = c
			}, i.prototype.enableDeprecatedPolyfill = function ()
			{
				navigator.getVRDevices = this.getVRDevices.bind(this), window.HMDVRDevice = l, window.PositionSensorVRDevice = h
			}, i.prototype.getVRDisplays = function ()
			{
				this.populateDevices();
				var e = this.displays;
				return new Promise(function (t, n)
				{
					try
					{
						t(e)
					}
					catch (e)
					{
						n(e)
					}
				})
			}, i.prototype.getVRDevices = function ()
			{
				console.warn("getVRDevices is deprecated. Please update your code to use getVRDisplays instead.");
				var e = this;
				return new Promise(function (t, n)
				{
					try
					{
						if (!e.devicesPopulated)
						{
							if (e.nativeWebVRAvailable) return navigator.getVRDisplays(function (n)
							{
								for (var i = 0; i < n.length; ++i) e.devices.push(new d(n[i])), e.devices.push(new f(n[i]));
								e.devicesPopulated = !0, t(e.devices)
							}, n);
							if (e.nativeLegacyWebVRAvailable) return (navigator.getVRDDevices || navigator.mozGetVRDevices)(function (n)
							{
								for (var i = 0; i < n.length; ++i) n[i] instanceof l && e.devices.push(n[i]), n[i] instanceof h && e.devices.push(n[i]);
								e.devicesPopulated = !0, t(e.devices)
							}, n)
						}
						e.populateDevices(), t(e.devices)
					}
					catch (e)
					{
						n(e)
					}
				})
			}, i.prototype.isMobile = function ()
			{
				return /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent)
			}, i.prototype.isCardboardCompatible = function ()
			{
				return this.isMobile() || WebVRConfig.FORCE_ENABLE_VR
			}, n.exports.WebVRPolyfill = i, n.exports
		}), e.registerDynamic("9c", ["86", "9b"], !0, function (e, t, n)
		{
			this || self;
			var i = e("86"),
				r = e("9b").WebVRPolyfill;
			return window.WebVRConfig = i.extend(
			{
				FORCE_ENABLE_VR: !1,
				K_FILTER: .98,
				PREDICTION_TIME_S: .04,
				TOUCH_PANNER_DISABLED: !0,
				CARDBOARD_UI_DISABLED: !1,
				ROTATE_INSTRUCTIONS_DISABLED: !1,
				YAW_ONLY: !1,
				MOUSE_KEYBOARD_CONTROLS_DISABLED: !1,
				DEFER_INITIALIZATION: !1,
				ENABLE_DEPRECATED_API: !1,
				BUFFER_SCALE: .5,
				DIRTY_SUBMIT_FRAME_BINDINGS: !1
			}, window.WebVRConfig), window.WebVRConfig.DEFER_INITIALIZATION ? window.InitializeWebVRPolyfill = function ()
			{
				new r
			} : new r, n.exports
		}), e.register("1", ["2", "3", "3c", "4", "9", "10", "a", "20", "33", "42", "13", "14", "18", "1f", "25", "15", "5", "7", "43", "1a", "1b", "8", "3a", "3d", "53", "72", "2e", "17", "d", "28", "29", "2f", "30", "31", "22", "27", "2a", "36", "21", "37", "38", "39", "e", "f", "2b", "3e", "45", "80", "47", "4e", "51", "81", "82", "83", "85", "9c"], function (e, t)
		{
			"use strict";

			function n()
			{
				return !0
			}

			function i()
			{}

			function r(e)
			{
				return void 0 === e ? e = {} : "function" == typeof e && (e = {
					validate: e
				}), e.validate || (e.validate = n), e.compose || (e.compose = i), e
			}

			function o(e)
			{
				return function (t)
				{
					return !0 === e(t)
				}
			}

			function s(e, t)
			{
				return function (n)
				{
					var i = t(n);
					if (!0 !== i) throw new Error(i || e + " was not correctly implemented.")
				}
			}

			function a(e, t)
			{
				t = r(t);
				var n = function n(i)
				{
					var r = "function" == typeof i ? i.prototype : i;
					t.compose(r), n.assert(r), Object.defineProperty(r, "protocol:" + e,
					{
						enumerable: !1,
						configurable: !1,
						writable: !1,
						value: !0
					})
				};
				return n.validate = o(t.validate), n.assert = s(e, t.validate), n
			}

			function u(e, t)
			{
				var n = e.inject;
				if ("function" == typeof n) throw new Error("Decorator " + t + ' cannot be used with "inject()".  Please use an array instead.');
				return n || (n = nt.getOwn(nt.paramTypes, e).slice(), e.inject = n), n
			}

			function c(e)
			{
				return function (t, n, i)
				{
					u(t, "lazy")[i] = wt.of(e)
				}
			}

			function l(e)
			{
				return function (t, n, i)
				{
					u(t, "all")[i] = Nt.of(e)
				}
			}

			function h()
			{
				var e = arguments.length <= 0 || void 0 === arguments[0] || arguments[0],
					t = function (e)
					{
						return function (t, n, i)
						{
							var r = u(t, "optional");
							r[i] = Dt.of(r[i], e)
						}
					};
				return t("boolean" == typeof e ? e : !0)
			}

			function d(e, t, n)
			{
				var i = u(e, "parent");
				i[n] = Tt.of(i[n])
			}

			function f(e, t)
			{
				return function (n, i, r)
				{
					var o = u(n, "factory"),
						s = Ot.of(e);
					o[r] = t ? s.as(t) : s
				}
			}

			function p(e)
			{
				for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
				var r = function (e)
				{
					return function (t, i, r)
					{
						var o = u(t, "newInstance");
						o[r] = St.of.apply(St, [o[r]].concat(n)), e && o[r].as(e)
					}
				};
				return arguments.length >= 1 ? r(e) : r()
			}

			function g(e)
			{
				return function (t)
				{
					nt.define(nt.invoker, e, t)
				}
			}

			function y(e)
			{
				var t = function (e)
				{
					nt.define(nt.invoker, _t.instance, e)
				};
				return e ? t(e) : t
			}

			function M(e)
			{
				return function (t)
				{
					nt.define(nt.registration, e, t)
				}
			}

			function v(e)
			{
				return M(new Lt(e))
			}

			function A(e)
			{
				var t = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1];
				return M(new jt(e, t))
			}

			function E(e)
			{
				if (null === e || void 0 === e) throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")
			}

			function m(e, t, n, i)
			{
				for (var r = n.length, o = new Array(r); r--;) o[r] = e.get(n[r]);
				return void 0 !== i && (o = o.concat(i)), Reflect.construct(t, o)
			}

			function w(e)
			{
				return e.hasOwnProperty("inject") ? "function" == typeof e.inject ? e.inject() : e.inject : []
			}

			function N(e)
			{
				var t = function (e)
				{
					var t = e.inject,
						n = nt.getOwn(nt.paramTypes, e) || xt;
					if (t)
						for (var i = 0; i < n.length; i++)
							if (t[i] && t[i] !== n[i])
							{
								var r = t.indexOf(n[i]);
								r > -1 && t.splice(r, 1), t.splice(r > -1 && r < i ? i - 1 : i, 0, n[i])
							}
					else t[i] || (t[i] = n[i]);
					else e.inject = n
				};
				return e ? t(e) : t
			}

			function D()
			{
				for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
				return function (e, n, i)
				{
					if ("number" == typeof i && 1 === t.length)
					{
						var r = e.inject;
						if ("function" == typeof r) throw new Error('Decorator inject cannot be used with "inject()".  Please use an array instead.');
						return r || (r = nt.getOwn(nt.paramTypes, e).slice(), e.inject = r), void(r[i] = t[0])
					}
					i ? i.value.inject = t : e.inject = t
				}
			}

			function T(e, t)
			{
				var n = e._times,
					i = ~te(n, t, Ie.compare);
				i > 0 && (n.splice(0, i), e._values.splice(0, i * e._innerType.packedLength), e._updateTableLength = !0, e._definitionChanged.raiseEvent(e))
			}

			function I(e, t)
			{
				if (void 0 !== t)
				{
					var n = e._times.length - t;
					n > 0 && (e._times.splice(0, n), e._values.splice(0, n * e._innerType.packedLength), e._updateTableLength = !0)
				}
			}

			function O()
			{
				var e = 4294967295 * Math.random() | 0,
					t = 4294967295 * Math.random() | 0,
					n = 4294967295 * Math.random() | 0,
					i = 4294967295 * Math.random() | 0;
				return Bt[255 & e] + Bt[e >> 8 & 255] + Bt[e >> 16 & 255] + Bt[e >> 24 & 255] + "-" + Bt[255 & t] + Bt[t >> 8 & 255] + "-" + Bt[t >> 16 & 15 | 64] + Bt[t >> 24 & 255] + "-" + Bt[63 & n | 128] + Bt[n >> 8 & 255] + "-" + Bt[n >> 16 & 255] + Bt[n >> 24 & 255] + Bt[255 & i] + Bt[i >> 8 & 255] + Bt[i >> 16 & 255] + Bt[i >> 24 & 255]
			}

			function S(e)
			{
				this._token = e.token, this._url = e.url, this._tilingScheme = e.tilingScheme, ge(this._tilingScheme) || (this._tilingScheme = new We(
				{
					numberOfLevelZeroTilesX: 1,
					numberOfLevelZeroTilesY: 1,
					ellipsoid: pe(e.ellipsoid, Me.WGS84)
				})), this._heightmapWidth = 64, this._levelZeroMaximumGeometricError = qe.getEstimatedLevelZeroGeometricErrorForAHeightmap(this._tilingScheme.ellipsoid, this._heightmapWidth, this._tilingScheme.getNumberOfXTilesAtLevel(0)), this._proxy = e.proxy, this._terrainDataStructure = {
					heightScale: 1 / 256,
					heightOffset: -32768,
					elementsPerHeight: 3,
					stride: 4,
					elementMultiplier: 256,
					isBigEndian: !0,
					lowestEncodedHeight: 0,
					highestEncodedHeight: 16777215
				}, this._errorEvent = new Ee;
				var t = e.credit;
				"string" == typeof t && (t = new Ke(t)), this._credit = t, this._readyPromise = Promise.resolve(!0), this._terrainPromises = {}
			}

			function _()
			{
				if (hn) return hn;
				var e, t = function (e, t, n)
					{
						if (e)
						{
							var i = {
								view: n.view,
								clientX: n.clientX,
								clientY: n.clientY,
								screenX: n.screenX,
								screenY: n.screenY,
								relatedTarget: t
							};
							i.bubbles = !0, e.dispatchEvent(new MouseEvent("mouseout", i)), i.bubbles = !1;
							var r = e;
							do {
								r.dispatchEvent(new MouseEvent("mouseleave", i)), r = r.parentElement
							} while (r)
						}
					},
					n = function (e, t, n)
					{
						var i = {
							view: n.view,
							clientX: n.clientX,
							clientY: n.clientY,
							screenX: n.screenX,
							screenY: n.screenY,
							relatedTarget: t
						};
						i.bubbles = !0, e.dispatchEvent(new MouseEvent("mouseover", i)), i.bubbles = !1;
						var r = e;
						do {
							r.dispatchEvent(new MouseEvent("mouseenter", i)), r = r.parentElement
						} while (r)
					},
					i = function (e, t, n)
					{
						var i = n.bubbles;
						n.bubbles = !0, e.dispatchEvent(new PointerEvent("pointerover", n)), n.bubbles = !1;
						var r = e;
						do {
							r.dispatchEvent(new PointerEvent("pointerenter", n)), r = r.parentElement
						} while (r);
						n.bubbles = i
					},
					r = function (e, t, n)
					{
						if (e)
						{
							n.bubbles = !0, e.dispatchEvent(new PointerEvent("pointerout", n)), n.bubbles = !1;
							var i = e;
							do {
								i.dispatchEvent(new PointerEvent("pointerleave", n)), i = i.parentElement
							} while (i)
						}
					},
					o = function (e, t, n)
					{
						return e.forEach(function (i, r)
						{
							document.createTouch ? e[r] = document.createTouch(n.view, t, i.identifier, i.clientX, i.clientY, i.screenX, i.screenY) : void 0 !== typeof Touch && (i.target = t, e[r] = new Touch(i))
						}), e
					},
					s = {},
					a = {},
					u = {},
					c = {};
				return document.documentElement.addEventListener("gotpointercapture", function (e)
				{
					c[e.pointerId] = e.target
				}), document.documentElement.addEventListener("lostpointercapture", function (e)
				{
					delete c[e.pointerId]
				}), Element.prototype.setPointerCapture = function (e)
				{
					c[e] = this
				}, Element.prototype.releasePointerCapture = function (e)
				{
					c[e] = null
				}, hn = function (l)
				{
					l.view = window;
					var h;
					switch (l.type)
					{
					case "wheel":
						(h = document.elementFromPoint(l.clientX, l.clientY) || window).dispatchEvent(new WheelEvent(l.type, l));
						break;
					case "mouseleave":
						h = document.elementFromPoint(l.clientX, l.clientY) || window, t(e, void 0, l), e = void 0;
						break;
					case "mouseenter":
						h = document.elementFromPoint(l.clientX, l.clientY) || window, n(h, void 0, l), e = h;
						break;
					case "mousemove":
						(h = document.elementFromPoint(l.clientX, l.clientY) || window) !== e && (t(e, h, l), n(h, e, l), e = h), h.dispatchEvent(new MouseEvent(l.type, l));
						break;
					case "touchstart":
						var d = l.changedTouches[0];
						h = document.elementFromPoint(d.clientX, d.clientY) || window;
						for (var f = 0, p = l.changedTouches; f < p.length; f++)
						{
							w = p[f];
							s[w.identifier] = h, a[w.identifier] = performance.now()
						}
					case "touchmove":
					case "touchend":
					case "touchcancel":
						h = s[l.changedTouches[0].identifier];
						var g = document.createEvent("TouchEvent"),
							y = o(l.touches, h, l),
							M = o(l.targetTouches, h, l),
							v = o(l.changedTouches, h, l);
						if (document.createTouchList && (y = document.createTouchList.apply(document, y), M = document.createTouchList.apply(document, M), v = document.createTouchList.apply(document, v)), "function" == typeof g.initTouchEvent ? g.initTouchEvent(l.type, l.bubbles, l.cancelable, l.view, l.detail, l.screenX, l.screenY, l.clientX, l.clientY, l.ctrlKey, l.altKey, l.shiftKey, l.metaKey, y, M, v, 1, 0) : "TouchEvent" in window && TouchEvent.length > 0 ? g = new TouchEvent(l.type,
							{
								cancelable: l.cancelable,
								bubbles: l.bubbles,
								touches: y,
								targetTouches: M,
								changedTouches: v
							}) : (g.initUIEvent(l.type, l.bubbles, l.cancelable, l.view, l.detail), g.touches = y, g.targetTouches = M, g.changedTouches = v), "touchend" === l.type || "touchcancel" == l.type)
						{
							h.dispatchEvent(g);
							var A = v[0];
							l.clientX = A.clientX, l.clientY = A.clientY, l.screenX = A.screenX, l.screenY = A.screenY, l.button = 0, l.detail = 1, "touchend" === l.type ? performance.now() - a[A.identifier] < 300 && !g.defaultPrevented && (h.dispatchEvent(new MouseEvent("mousedown", l)), h.dispatchEvent(new MouseEvent("mouseup", l)), h.dispatchEvent(new MouseEvent("click", l))) : h.dispatchEvent(new MouseEvent("mouseout", l));
							for (var E = 0, m = l.changedTouches; E < m.length; E++)
							{
								var w = m[E];
								delete s[w.identifier], delete a[w.identifier]
							}
						}
						else h.dispatchEvent(g);
						break;
					case "pointerenter":
					case "pointerleave":
					case "pointermove":
					case "pointercancel":
					case "pointerdown":
					case "pointerup":
						var N = u[l.pointerId],
							D = h = c[l.pointerId],
							T = "pointerleave" === l.type || "pointercancel" === l.type,
							I = new PointerEvent(l.type, l);
						D ? D.dispatchEvent(I) : ((h = document.elementFromPoint(l.clientX, l.clientY) || window) !== N && (r(N, 0, l), T || i(h, 0, l)), h.dispatchEvent(I)), T ? delete u[l.pointerId] : u[l.pointerId] = h;
						break;
					default:
						(h = document.elementFromPoint(l.clientX, l.clientY) || window).dispatchEvent(new MouseEvent(l.type, l))
					}
				}
			}

			function L(e, t)
			{
				var n = !1,
					i = {
						event: UIEvent = void 0,
						forwardEvent: function ()
						{
							n = !0
						}
					},
					r = {},
					o = function (o)
					{
						var s = o.target instanceof HTMLElement ? o.target : void 0,
							a = s && s.clientWidth,
							u = s && s.clientHeight;
						if (("wheel" === o.type || Ln && "touchmove" === o.type && 2 === o.touches.length) && o.preventDefault(), o.stopPropagation(), o.target === e.element || a && Math.abs(a - e.element.clientWidth) < 15 && u && Math.abs(u - e.element.clientHeight) < 15)
						{
							if (e.uiEvent.numberOfListeners > 0 && (n = !1, i.event = o, e.uiEvent.raiseEvent(i), !n)) return void o.stopImmediatePropagation();
							"touchstart" === o.type && o.preventDefault();
							var c = e.element.getBoundingClientRect(),
								l = pn(o.touches, c),
								h = pn(o.changedTouches, c),
								d = pn(o.targetTouches, c);
							r.timeStamp = o.timeStamp, r.type = o.type, r.bubbles = o.bubbles, r.cancelable = o.cancelable, r.which = o.which, r.detail = o.detail, r.composed = o.composed, r.timeStamp = o.timeStamp, r.altKey = o.altKey, r.ctrlKey = o.ctrlKey, r.metaKey = o.metaKey, r.button = o.button, r.buttons = o.buttons, r.clientX = o.clientX - c.left, r.clientY = o.clientY - c.top, r.screenX = o.screenX, r.screenY = o.screenY, r.movementX = o.movementX, r.movementY = o.movementY, r.deltaX = o.deltaX, r.deltaY = o.deltaY, r.deltaZ = o.deltaZ, r.deltaMode = o.deltaMode, r.wheelDelta = o.wheelDelta, r.wheelDeltaX = o.wheelDeltaX, r.wheelDeltaY = o.wheelDeltaY, r.touches = l, r.changedTouches = h, r.targetTouches = d, r.pointerId = o.pointerId, r.pointerType = o.pointerType, r.width = o.width, r.height = o.height, r.pressure = o.pressure, r.tiltX = o.tiltX, r.tiltY = o.tiltY, r.isPrimary = o.isPrimary, t(r)
						}
						else o.stopImmediatePropagation()
					},
					s = ["wheel", "click", "dblclick", "contextmenu"];
				s.push("pointerenter", "pointerleave", "pointerdown", "pointermove", "pointerup", "pointercancel"), s.push("mouseenter", "mouseleave", "mousedown", "mousemove", "mouseup", "touchstart", "touchend", "touchmove", "touchcancel"), s.forEach(function (t)
				{
					e.element.addEventListener(t, o, !1)
				})
			}

			function j(e)
			{
				return "function" == typeof e && gn.test(Function.prototype.toString.call(e))
			}

			function x(e)
			{
				var t = e;
				return ge(t.id) ? t.id : "" + t
			}

			function b(e, t)
			{
				return JSON.stringify(e) === JSON.stringify(t)
			}

			function C(e, t)
			{
				void 0 === t && (t = []);
				var n = t;
				n.length = 0;
				var i = e;
				do {
					var r = i.position;
					i = r && r.referenceFrame, ge(i) && n.unshift(i)
				} while (ge(i));
				return n
			}

			function R(e, t, n)
			{
				void 0 === n && (n = []);
				var i = n;
				i.length = 0;
				var r = e,
					o = !1;
				do {
					var s = r.position,
						a = r && r.orientation;
					r = s && s.referenceFrame;
					var u = ge(r),
						c = u && s && s.getValueInReferenceFrame(t, r, An),
						l = u && c && a && a.getValue(t, En);
					(o = c && l) && i.unshift(r)
				} while (o);
				return i
			}

			function z(e, t, n, i)
			{
				return e.position && e.position.getValueInReferenceFrame(t, n, i)
			}

			function P(e, t, n, i)
			{
				var r = e.position && e.position.referenceFrame;
				if (ge(r))
				{
					var o = e.orientation && e.orientation.getValue(t, i);
					if (ge(o)) return Le.convertToReferenceFrame(t, o, r, n, i)
				}
			}

			function U(e, t, n)
			{
				if (ge(n) || (n = R(e, t, Nn)[0]), !ge(n)) return null;
				if (e === n) return null;
				var i = e.id + "@" + (n.id ? n.id : n),
					r = Dn[i];
				r || (r = {}, Dn[i] = r);
				var o = z(e, t, n, r.p ||
				{});
				if (!o) return null;
				var s = P(e, t, n, r.o ||
				{});
				return s && o && s ? (r.p = o, r.o = s, r.r = "number" == typeof n ? n : n.id, r.meta = e.meta, r) : null
			}

			function k(e)
			{
				if (!Tn) throw new Error("resolveURL requires DOM api");
				if (void 0 === e) throw new Error("Expected inURL");
				return Tn.href = "", Tn.href = e, Tn.href
			}

			function B(e)
			{
				if (!Tn) throw new Error("parseURL requires DOM api");
				if (void 0 === e) throw new Error("Expected inURL");
				return Tn.href = "", Tn.href = e,
				{
					href: Tn.href,
					protocol: Tn.protocol,
					hostname: Tn.hostname,
					port: Tn.port,
					pathname: Tn.pathname,
					search: Tn.search,
					hash: Tn.hash,
					host: Tn.host
				}
			}

			function F(e)
			{
				return e instanceof HTMLElement ? Promise.resolve(e) : new Promise(function (t, n)
				{
					var i = function ()
					{
						var i = document.querySelector("" + e);
						i ? t(i) : n(new Error("Unable to resolve element id " + e))
					};
					"loading" == document.readyState ? document.addEventListener("DOMContentLoaded", i) : i()
				})
			}

			function Q(e, t)
			{
				var n = e[_e.COLUMN0ROW0],
					i = e[_e.COLUMN1ROW1],
					r = e[_e.COLUMN2ROW0],
					o = e[_e.COLUMN2ROW1],
					s = e[_e.COLUMN2ROW2],
					a = e[_e.COLUMN3ROW2],
					u = t.near = a / (s - 1);
				return t.far = a / (s + 1), t.bottom = u * (o - 1) / i, t.top = u * (o + 1) / i, t.left = u * (r - 1) / n, t.right = u * (r + 1) / n, t
			}

			function Y(e, t)
			{
				var n, i = Q(e, In),
					r = (i.left + i.right) / 2,
					o = (i.top + i.bottom) / 2,
					s = i.near,
					a = i.far,
					u = i.right - r,
					c = i.top - o,
					l = u / c,
					h = 2 * Math.atan(c / s);
				return n = l < 1 ? h : 2 * Math.atan(Math.tan(.5 * h) * l), t.near = s, t.far = a, t.fov = n, t.aspectRatio = l, t.xOffset = r, t.yOffset = o, t
			}

			function G(e, t, n)
			{
				var i = e.position,
					r = e.orientation;
				return i.referenceFrame === n || !!(i && i.setValue && r && r.setValue) && (!!z(e, t, n, On) && (!!P(e, t, n, Sn) && (i.setValue(On, n), r.setValue(Sn), !0)))
			}

			function V()
			{
				Ln ? window.location.href = "https://itunes.apple.com/us/app/argon4/id1089308600?mt=8" : jn && (window.location.href = "http://play.google.com/store/apps/details?id=edu.gatech.argon4")
			}

			function q()
			{
				Ln ? window.location.href = "argon4://open?url=" + encodeURIComponent(window.location.href) : jn && (window.location.href = "intent:/#Intent;scheme=argon4;package=edu.gatech.argon4;S.url=" + encodeURIComponent(window.location.href) + ";end")
			}

			function H(e)
			{
				var t = !1;
				return function (n, i, r)
				{
					var o = r.get || r.value,
						s = 'The "' + i + '" ' + ("function" == typeof r.value ? "function" : "property") + " is deprecated. ";
					if (e)
					{
						var a = "function" == typeof n[e] ? "function" : "property";
						s += 'Please use the "' + e + '" ' + a + " instead."
					}
					var u = function ()
					{
						return t || (console.warn(s), t = !0), o.apply(this, arguments)
					};
					return r.value ? r.value = u : r.get = u, r
				}
			}

			function W(e)
			{
				return Promise.resolve(Je(Rn, 15, [e]).then(X))
			}

			function X(e)
			{
				return e[0]
			}

			function Z(e)
			{
				for (var t = e.split("."), n = 0, i = t.length; n < i; ++n) t[n] = parseInt(t[n], 10);
				return t
			}

			function K(e, t, n)
			{
				if (ns.instance) throw new Error("A shared ArgonSystem instance already exists");
				var i, r;
				if (t instanceof zt ? (r = e, n = t) : (i = e, r = t), i && (i.configuration || i.container))
				{
					var o = i;
					!r && o.configuration && (r = o.configuration), !r && o.container && (n = o.container), i = void 0
				}
				if (r || (r = {}), !r.role)
				{
					var s = void 0;
					s = "undefined" == typeof HTMLElement ? Kt.REALITY_MANAGER : navigator.userAgent.indexOf("Argon") > 0 || window.top !== window ? Kt.APPLICATION : Kt.REALITY_MANAGER, r.role = s
				}
				return n || (n = new zt), new is(r, n, i).app
			}

			function J(e, t)
			{
				if (void 0 === e && (e = {}), void 0 === t && (t = new zt), ns.instance) throw new Error("A shared ArgonSystem instance already exists");
				return e.role = Kt.REALITY_VIEW, e.supportsCustomProtocols = !0, e["reality.supportsControlPort"] = !0, e.protocols = e.protocols || [], e.protocols.push("ar.uievent"), new is(e, t).app
			}
			var $, ee, te, ne, ie, re, oe, se, ae, ue, ce, le, he, de, fe, pe, ge, ye, Me, ve, Ae, Ee, me, we, Ne, De, Te, Ie, Oe, Se, _e, Le, je, xe, be, Ce, Re, ze, Pe, Ue, ke, Be, Fe, Qe, Ye, Ge, Ve, qe, He, We, Xe, Ze, Ke, Je, $e, et, tt, nt, it, rt, ot, st, at, ut, ct, lt, ht, dt, ft, pt, gt, yt, Mt, vt, At, Et, mt, wt, Nt, Dt, Tt, It, Ot, St, _t, Lt, jt, xt, bt, Ct, Rt, zt, Pt, Ut, kt, Bt, Ft, Qt, Yt, Gt, Vt, qt, Ht, Wt, Xt, Zt, Kt, Jt, $t, en, tn, nn, rn, on, sn, an, un, cn, ln, hn, dn, fn, pn, gn, yn, Mn, vn, An, En, mn, wn, Nn, Dn, Tn, In, On, Sn, _n, Ln, jn, xn, bn, Cn, Rn, zn, Pn, Un, kn, Bn, Fn, Qn, Yn, Gn, Vn, qn, Hn, Wn, Xn, Zn, Kn, Jn, $n, ei, ti, ni, ii, ri, oi, si, ai, ui, ci, li, hi, di, fi, pi, gi, yi, Mi, vi, Ai, Ei, mi, wi, Ni, Di, Ti, Ii, Oi, Si, _i, Li, ji, xi, bi, Ci, Ri, zi, Pi, Ui, ki, Bi, Fi, Qi, Yi, Gi, Vi, qi, Hi, Wi, Xi, Zi, Ki, Ji, $i, er, tr, nr, ir, rr, or, sr, ar, ur, cr, lr, hr, dr, fr, pr, gr, yr, Mr, vr, Ar, Er, mr, wr, Nr, Dr, Tr, Ir, Or, Sr, _r, Lr, jr, xr, br, Cr, Rr, zr, Pr, Ur, kr, Br, Fr, Qr, Yr, Gr, Vr, qr, Hr, Wr, Xr, Zr, Kr, Jr, $r, eo, to, no, io, ro, oo, so, ao, uo, co, lo, ho, fo, po, go, yo, Mo, vo, Ao, Eo, mo, wo, No, Do, To, Io, Oo, So, _o, Lo, jo, xo, bo, Co, Ro, zo, Po, Uo, ko, Bo, Fo, Qo, Yo, Go, Vo, qo, Ho, Wo, Xo, Zo, Ko, Jo, $o, es, ts, ns, is, rs, os, ss, as, us, cs, ls, hs, ds, fs, ps, gs, ys, Ms, vs, As, Es, ms, ws, Ns, Ds, Ts, Is, Os;
			return {
				setters: [function (e) {}, function (e)
				{
					$ = e.AggregateError, ee = e.PLATFORM
				}, function (e)
				{
					te = e.default
				}, function (e)
				{
					ne = e.default
				}, function (e)
				{
					ie = e.default
				}, function (e)
				{
					re = e.default
				}, function (e)
				{
					oe = e.default
				}, function (e)
				{
					se = e.default
				}, function (e)
				{
					ae = e.default
				}, function (e)
				{
					ue = e.default
				}, function (e)
				{
					ce = e.default
				}, function (e)
				{
					le = e.default
				}, function (e)
				{
					he = e.default
				}, function (e)
				{
					de = e.default
				}, function (e)
				{
					fe = e.default
				}, function (e)
				{
					pe = e.default
				}, function (e)
				{
					ge = e.default
				}, function (e)
				{
					ye = e.default
				}, function (e)
				{
					Me = e.default
				}, function (e)
				{
					ve = e.default
				}, function (e)
				{
					Ae = e.default
				}, function (e)
				{
					Ee = e.default
				}, function (e)
				{
					me = e.default
				}, function (e)
				{
					we = e.default
				}, function (e)
				{
					Ne = e.default
				}, function (e)
				{
					De = e.default
				}, function (e)
				{
					Te = e.default
				}, function (e)
				{
					Ie = e.default
				}, function (e)
				{
					Oe = e.default
				}, function (e)
				{
					Se = e.default
				}, function (e)
				{
					_e = e.default
				}, function (e)
				{
					Le = e.default
				}, function (e)
				{
					je = e.default
				}, function (e)
				{
					xe = e.default
				}, function (e)
				{
					be = e.default
				}, function (e)
				{
					Ce = e.default
				}, function (e)
				{
					Re = e.default
				}, function (e)
				{
					ze = e.default
				}, function (e)
				{
					Pe = e.default
				}, function (e)
				{
					Ue = e.default
				}, function (e)
				{
					ke = e.default
				}, function (e)
				{
					Be = e.default
				}, function (e)
				{
					Fe = e.default
				}, function (e)
				{
					Qe = e.default
				}, function (e)
				{
					Ye = e.default
				}, function (e)
				{
					Ge = e.default
				}, function (e)
				{
					Ve = e.default
				}, function (e)
				{
					qe = e.default
				}, function (e)
				{
					He = e.default
				}, function (e)
				{
					We = e.default
				}, function (e)
				{
					Xe = e.default
				}, function (e)
				{
					Ze = e.default
				}, function (e)
				{
					Ke = e.default
				}, function (e)
				{
					Je = e.default
				}, function (e)
				{
					$e = e.default
				}, function (e) {}],
				execute: function ()
				{
					for (et = Object.assign || function (e)
						{
							for (var t = 1; t < arguments.length; t++)
							{
								var n = arguments[t];
								for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
							}
							return e
						}, tt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e)
						{
							return typeof e
						} : function (e)
						{
							return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
						}, nt = {
							resource: "aurelia:resource",
							paramTypes: "design:paramtypes",
							propertyType: "design:type",
							properties: "design:properties",
							get: function (e, t, n)
							{
								if (t)
								{
									var i = nt.getOwn(e, t, n);
									return void 0 === i ? nt.get(e, Object.getPrototypeOf(t), n) : i
								}
							},
							getOwn: function (e, t, n)
							{
								if (t) return Reflect.getOwnMetadata(e, t, n)
							},
							define: function (e, t, n, i)
							{
								Reflect.defineMetadata(e, t, n, i)
							},
							getOrCreateOwn: function (e, t, n, i)
							{
								var r = nt.getOwn(e, n, i);
								return void 0 === r && (r = new t, Reflect.defineMetadata(e, r, n, i)), r
							}
						}, it = new Map, rt = Object.freeze(
						{
							moduleId: void 0,
							moduleMember: void 0
						}), ot = function ()
						{
							function e(e, t)
							{
								this.moduleId = e, this.moduleMember = t
							}
							return e.get = function (t)
							{
								var n = it.get(t);
								return void 0 === n && ee.eachModule(function (i, r)
								{
									if ("object" === (void 0 === r ? "undefined" : tt(r)))
										for (var o in r)
											if (r[o] === t) return it.set(t, n = new e(i, o)), !0;
									return r === t && (it.set(t, n = new e(i, "default")), !0)
								}), n || rt
							}, e.set = function (e, t)
							{
								it.set(e, t)
							}, e
						}(), mt = (a.create = function (e, t)
						{
							t = r(t);
							var n = "protocol:" + e,
								i = function (n)
								{
									var i = a(e, t);
									return n ? i(n) : i
								};
							return i.decorates = function (e)
							{
								return !0 === e[n]
							}, i.validate = o(t.validate), i.assert = s(e, t.validate), i
						})("aurelia:resolver", function (e)
						{
							return "function" == typeof e.get || "Resolvers must implement: get(container: Container, key: any): any"
						}), wt = (st = mt())(at = function ()
						{
							function e(e)
							{
								this._key = e
							}
							return e.prototype.get = function (e)
							{
								var t = this;
								return function ()
								{
									return e.get(t._key)
								}
							}, e.of = function (t)
							{
								return new e(t)
							}, e
						}()) || at, Nt = (ut = mt())(ct = function ()
						{
							function e(e)
							{
								this._key = e
							}
							return e.prototype.get = function (e)
							{
								return e.getAll(this._key)
							}, e.of = function (t)
							{
								return new e(t)
							}, e
						}()) || ct, Dt = (lt = mt())(ht = function ()
						{
							function e(e)
							{
								var t = arguments.length <= 1 || void 0 === arguments[1] || arguments[1];
								this._key = e, this._checkParent = t
							}
							return e.prototype.get = function (e)
							{
								return e.hasResolver(this._key, this._checkParent) ? e.get(this._key) : null
							}, e.of = function (t)
							{
								return new e(t, arguments.length <= 1 || void 0 === arguments[1] || arguments[1])
							}, e
						}()) || ht, Tt = (dt = mt())(ft = function ()
						{
							function e(e)
							{
								this._key = e
							}
							return e.prototype.get = function (e)
							{
								return e.parent ? e.parent.get(this._key) : null
							}, e.of = function (t)
							{
								return new e(t)
							}, e
						}()) || ft, It = (pt = mt())(gt = function ()
						{
							function e(e, t)
							{
								this.strategy = e, this.state = t
							}
							return e.prototype.get = function (e, t)
							{
								switch (this.strategy)
								{
								case 0:
									return this.state;
								case 1:
									var n = e.invoke(this.state);
									return this.state = n, this.strategy = 0, n;
								case 2:
									return e.invoke(this.state);
								case 3:
									return this.state(e, t, this);
								case 4:
									return this.state[0].get(e, t);
								case 5:
									return e.get(this.state);
								default:
									throw new Error("Invalid strategy: " + this.strategy)
								}
							}, e
						}()) || gt, Ot = (yt = mt())(Mt = function ()
						{
							function e(e)
							{
								this._key = e
							}
							return e.prototype.get = function (e)
							{
								var t = this;
								return function ()
								{
									for (var n = arguments.length, i = Array(n), r = 0; r < n; r++) i[r] = arguments[r];
									return e.invoke(t._key, i)
								}
							}, e.of = function (t)
							{
								return new e(t)
							}, e
						}()) || Mt, St = (vt = mt())(At = function ()
						{
							function e(e)
							{
								this.key = e, this.asKey = e;
								for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
								this.dynamicDependencies = n
							}
							return e.prototype.get = function (e)
							{
								var t = this.dynamicDependencies.length > 0 ? this.dynamicDependencies.map(function (t)
									{
										return t["protocol:aurelia:resolver"] ? t.get(e) : e.get(t)
									}) : void 0,
									n = e.invoke(this.key, t);
								return e.registerInstance(this.asKey, n), n
							}, e.prototype.as = function (e)
							{
								return this.asKey = e, this
							}, e.of = function (t)
							{
								for (var n = arguments.length, i = Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
								return new(Function.prototype.bind.apply(e, [null].concat([t], i)))
							}, e
						}()) || At, (_t = function ()
						{
							function e()
							{}
							return e.prototype.invoke = function (e, t, n)
							{
								for (var i = n.length, r = new Array(i); i--;) r[i] = e.get(n[i]);
								return t.apply(void 0, r)
							}, e.prototype.invokeWithDynamicDependencies = function (e, t, n, i)
							{
								for (var r = n.length, o = new Array(r); r--;) o[r] = e.get(n[r]);
								return void 0 !== i && (o = o.concat(i)), t.apply(void 0, o)
							}, e
						}()).instance = new _t, Lt = function ()
						{
							function e(e)
							{
								this._key = e
							}
							return e.prototype.registerResolver = function (e, t, n)
							{
								return e.registerTransient(this._key || t, n)
							}, e
						}(), jt = function ()
						{
							function e(e)
							{
								var t = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1];
								"boolean" == typeof e ? this._registerInChild = e : (this._key = e, this._registerInChild = t)
							}
							return e.prototype.registerResolver = function (e, t, n)
							{
								return this._registerInChild ? e.registerSingleton(this._key || t, n) : e.root.registerSingleton(this._key || t, n)
							}, e
						}(), xt = Object.freeze([]), nt.registration = "aurelia:registration", nt.invoker = "aurelia:invoker", bt = mt.decorates, Ct = function ()
						{
							function e(e, t, n)
							{
								this.fn = e, this.invoker = t, this.dependencies = n
							}
							return e.prototype.invoke = function (e, t)
							{
								return void 0 !== t ? this.invoker.invokeWithDynamicDependencies(e, this.fn, this.dependencies, t) : this.invoker.invoke(e, this.fn, this.dependencies)
							}, e
						}(), (Et = {})[0] = {
							invoke: function (e, t)
							{
								return new t
							},
							invokeWithDynamicDependencies: m
						}, Et[1] = {
							invoke: function (e, t, n)
							{
								return new t(e.get(n[0]))
							},
							invokeWithDynamicDependencies: m
						}, Et[2] = {
							invoke: function (e, t, n)
							{
								return new t(e.get(n[0]), e.get(n[1]))
							},
							invokeWithDynamicDependencies: m
						}, Et[3] = {
							invoke: function (e, t, n)
							{
								return new t(e.get(n[0]), e.get(n[1]), e.get(n[2]))
							},
							invokeWithDynamicDependencies: m
						}, Et[4] = {
							invoke: function (e, t, n)
							{
								return new t(e.get(n[0]), e.get(n[1]), e.get(n[2]), e.get(n[3]))
							},
							invokeWithDynamicDependencies: m
						}, Et[5] = {
							invoke: function (e, t, n)
							{
								return new t(e.get(n[0]), e.get(n[1]), e.get(n[2]), e.get(n[3]), e.get(n[4]))
							},
							invokeWithDynamicDependencies: m
						}, Et.fallback = {
							invoke: m,
							invokeWithDynamicDependencies: m
						}, Rt = Et, zt = function ()
						{
							function e(e)
							{
								void 0 === e && (e = {}), this._configuration = e, this._onHandlerCreated = e.onHandlerCreated, this._handlers = e.handlers || (e.handlers = new Map), this._resolvers = new Map, this.root = this, this.parent = null
							}
							return e.prototype.makeGlobal = function ()
							{
								return e.instance = this, this
							}, e.prototype.setHandlerCreatedCallback = function (e)
							{
								this._onHandlerCreated = e, this._configuration.onHandlerCreated = e
							}, e.prototype.registerInstance = function (e, t)
							{
								return this.registerResolver(e, new It(0, void 0 === t ? e : t))
							}, e.prototype.registerSingleton = function (e, t)
							{
								return this.registerResolver(e, new It(1, void 0 === t ? e : t))
							}, e.prototype.registerTransient = function (e, t)
							{
								return this.registerResolver(e, new It(2, void 0 === t ? e : t))
							}, e.prototype.registerHandler = function (e, t)
							{
								return this.registerResolver(e, new It(3, t))
							}, e.prototype.registerAlias = function (e, t)
							{
								return this.registerResolver(t, new It(5, e))
							}, e.prototype.registerResolver = function (e, t)
							{
								E(e);
								var n = this._resolvers,
									i = n.get(e);
								return void 0 === i ? n.set(e, t) : 4 === i.strategy ? i.state.push(t) : n.set(e, new It(4, [i, t])), t
							}, e.prototype.autoRegister = function (e, t)
							{
								if ("function" == typeof (t = void 0 === t ? e : t))
								{
									var n = nt.get(nt.registration, t);
									return void 0 === n ? this.registerResolver(e, new It(1, t)) : n.registerResolver(this, e, t)
								}
								return this.registerResolver(e, new It(0, t))
							}, e.prototype.autoRegisterAll = function (e)
							{
								for (var t = e.length; t--;) this.autoRegister(e[t])
							}, e.prototype.unregister = function (e)
							{
								this._resolvers.delete(e)
							}, e.prototype.hasResolver = function (e)
							{
								var t = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1];
								return E(e), this._resolvers.has(e) || t && null !== this.parent && this.parent.hasResolver(e, t)
							}, e.prototype.get = function (t)
							{
								if (E(t), t === e) return this;
								if (bt(t)) return t.get(this, t);
								var n = this._resolvers.get(t);
								return void 0 === n ? null === this.parent ? this.autoRegister(t).get(this, t) : this.parent._get(t) : n.get(this, t)
							}, e.prototype._get = function (e)
							{
								var t = this._resolvers.get(e);
								return void 0 === t ? null === this.parent ? this.autoRegister(e).get(this, e) : this.parent._get(e) : t.get(this, e)
							}, e.prototype.getAll = function (e)
							{
								E(e);
								var t = this._resolvers.get(e);
								if (void 0 === t) return null === this.parent ? xt : this.parent.getAll(e);
								if (4 === t.strategy)
								{
									for (var n = t.state, i = n.length, r = new Array(i); i--;) r[i] = n[i].get(this, e);
									return r
								}
								return [t.get(this, e)]
							}, e.prototype.createChild = function ()
							{
								var t = new e(this._configuration);
								return t.root = this.root, t.parent = this, t
							}, e.prototype.invoke = function (e, t)
							{
								try
								{
									var n = this._handlers.get(e);
									return void 0 === n && (n = this._createInvocationHandler(e), this._handlers.set(e, n)), n.invoke(this, t)
								}
								catch (t)
								{
									throw new $("Error invoking " + e.name + ". Check the inner error for details.", t, !0)
								}
							}, e.prototype._createInvocationHandler = function (e)
							{
								var t = void 0;
								if (void 0 === e.inject) t = nt.getOwn(nt.paramTypes, e) || xt;
								else
								{
									t = [];
									for (var n = e;
										"function" == typeof n;)
									{
										var i;
										(i = t).push.apply(i, w(n)), n = Object.getPrototypeOf(n)
									}
								}
								var r = nt.getOwn(nt.invoker, e) || Rt[t.length] || Rt.fallback,
									o = new Ct(e, r, t);
								return void 0 !== this._onHandlerCreated ? this._onHandlerCreated(o) : o
							}, e
						}(), e("DI", Pt = Object.freeze(
						{
							resolver: mt,
							Lazy: wt,
							All: Nt,
							Optional: Dt,
							Parent: Tt,
							StrategyResolver: It,
							Factory: Ot,
							NewInstance: St,
							getDecoratorDependencies: u,
							lazy: c,
							all: l,
							optional: h,
							parent: d,
							factory: f,
							newInstance: p,
							invoker: g,
							invokeAsFactory: y,
							FactoryInvoker: _t,
							registration: M,
							transient: v,
							singleton: A,
							TransientRegistration: Lt,
							SingletonRegistration: jt,
							_emptyParameters: xt,
							InvocationHandler: Ct,
							Container: zt,
							autoinject: N,
							inject: D
						})), Ut = function (e, t)
						{
							return function ()
							{
								var n = e.apply(this, arguments);
								return t.call(this, n), n
							}
						}, Be.prototype.removeSamplesBeforeDate = function (e)
						{
							T(this, e)
						}, ke.prototype.removeSamplesBeforeDate = function (e)
						{
							T(this._property, e)
						}, Be.prototype.addSample = Ut(Be.prototype.addSample, function ()
						{
							I(this, this.maxNumSamples)
						}), Be.prototype.addSamples = Ut(Be.prototype.addSamples, function ()
						{
							I(this, this.maxNumSamples)
						}), Be.prototype.addSamplesPackedArray = Ut(Be.prototype.addSamplesPackedArray, function ()
						{
							I(this, this.maxNumSamples)
						}), ke.prototype.addSample = Ut(ke.prototype.addSample, function ()
						{
							I(this._property, this.maxNumSamples)
						}), ke.prototype.addSamples = Ut(ke.prototype.addSamples, function ()
						{
							I(this._property, this.maxNumSamples)
						}), ke.prototype.addSamplesPackedArray = Ut(ke.prototype.addSamplesPackedArray, function ()
						{
							I(this._property, this.maxNumSamples)
						}), kt = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, Bt = [], Ft = 0; Ft < 256; Ft++) Bt[Ft] = (Ft < 16 ? "0" : "") + Ft.toString(16);
					Qt = function (e)
						{
							function t()
							{
								return e.apply(this, arguments) || this
							}
							return kt(t, e), Object.defineProperty(t.prototype, "isConstant",
							{
								get: function ()
								{
									return !1
								},
								enumerable: !0,
								configurable: !0
							}), t.prototype.setValue = function (e, t)
							{
								this._value = se.clone(e), this._referenceFrame = t
							}, t
						}(de), Yt = function (e)
						{
							function t()
							{
								return e.apply(this, arguments) || this
							}
							return kt(t, e), Object.defineProperty(t.prototype, "isConstant",
							{
								get: function ()
								{
									return !1
								},
								enumerable: !0,
								configurable: !0
							}), t.prototype.setValue = function (e)
							{
								if (this._value !== e)
								{
									var t = ge(e),
										n = t && "function" == typeof e.clone,
										i = t && "function" == typeof e.equals;
									this._hasClone = n, this._hasEquals = i, this._value = n ? e.clone(this._value) : e
								}
							}, t
						}(fe), e("Cesium", Gt = Object.freeze(
						{
							createGuid: O,
							DynamicPositionProperty: Qt,
							DynamicProperty: Yt,
							binarySearch: te,
							CallbackProperty: ne,
							CameraEventAggregator: ie,
							CameraEventType: re,
							Cartesian2: oe,
							Cartesian3: se,
							Cartesian4: ae,
							Cartographic: ue,
							Clock: ce,
							ClockStep: le,
							CompositeEntityCollection: he,
							ConstantPositionProperty: de,
							ConstantProperty: fe,
							defaultValue: pe,
							defined: ge,
							DeveloperError: ye,
							Ellipsoid: Me,
							Entity: ve,
							EntityCollection: Ae,
							Event: Ee,
							ExtrapolationType: me,
							FeatureDetection: we,
							GeographicProjection: Ne,
							HeadingPitchRoll: De,
							HermitePolynomialApproximation: Te,
							JulianDate: Ie,
							CesiumMath: Oe,
							Matrix3: Se,
							Matrix4: _e,
							OrientationProperty: Le,
							PerspectiveFrustum: je,
							PerspectiveOffCenterFrustum: xe,
							PositionProperty: be,
							Property: Ce,
							Quaternion: Re,
							ReferenceEntity: ze,
							ReferenceFrame: Pe,
							ReferenceProperty: Ue,
							SampledPositionProperty: ke,
							SampledProperty: Be,
							ScreenSpaceEventHandler: Fe,
							ScreenSpaceEventType: Qe,
							Transforms: Ye,
							Simon1994PlanetaryPositions: Ge,
							PolylinePipeline: Ve,
							TerrainProvider: qe,
							loadImage: He,
							WebMercatorTilingScheme: We,
							getImagePixels: Xe,
							HeightmapTerrainData: Ze,
							Credit: Ke,
							sampleTerrain: Je
						})), Vt = 28, qt = 1.5, $e.prototype.listen = function (e, t)
						{
							var n = this.gl.canvas,
								i = "undefined" != typeof TouchEvent;
							this.listener = function (r)
							{
								var o = n.clientWidth / 2,
									s = Vt * qt,
									a = i && r instanceof TouchEvent ? r.changedTouches[0] : r;
								a.clientX > o - s && a.clientX < o + s && a.clientY > n.clientHeight - s ? (r.preventDefault(), r.stopImmediatePropagation(), e(r)) : a.clientX < s && a.clientY < s && (r.preventDefault(), r.stopImmediatePropagation(), t(r))
							}, n.addEventListener("click", this.listener, !1), n.addEventListener("touchstart", this.listener, !1)
						}, Ht = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, e("AVERAGE_EYE_HEIGHT", Wt = 1.6), e("DEFAULT_NEAR_PLANE", Xt = .01), e("DEFAULT_FAR_PLANE", Zt = 1e4),
						function (e)
						{
							e[e.AUGMENTER = "RealityAugmenter"] = "AUGMENTER", e[e.REALITY_AUGMENTER = "RealityAugmenter"] = "REALITY_AUGMENTER", e[e.REALITY = "RealityViewer"] = "REALITY", e[e.REALITY_VIEWER = "RealityViewer"] = "REALITY_VIEWER", e[e.MANAGER = "RealityManager"] = "MANAGER", e[e.REALITY_MANAGER = "RealityManager"] = "REALITY_MANAGER", e[e.APPLICATION = "Application"] = "APPLICATION", e[e.REALITY_VIEW = "RealityView"] = "REALITY_VIEW"
						}(Kt || e("Role", Kt = {})),
						function (e)
						{
							function t(t)
							{
								return t === e.REALITY_VIEWER || t === e.REALITY_VIEW
							}

							function n(t)
							{
								return t === e.REALITY_AUGMENTER || t === e.APPLICATION
							}

							function i(t)
							{
								return t === e.REALITY_MANAGER || "Manager" === t
							}

							function r(t)
							{
								return e.isRealityViewer(t)
							}

							function o(t)
							{
								return e.isRealityAugmenter(t)
							}

							function s(t)
							{
								return e.isRealityManager(t)
							}
							e.isRealityViewer = t, e.isRealityAugmenter = n, e.isRealityManager = i, e.isReality = r, e.isAugmenter = o, e.isManager = s
						}(Kt || e("Role", Kt = {})), e("Configuration", Jt = function ()
						{
							function e()
							{}
							return e
						}()), e("Viewport", $t = function ()
						{
							function e()
							{
								this.x = 0, this.y = 0, this.width = 0, this.height = 0
							}
							return e.clone = function (t, n)
							{
								if (void 0 === n && (n = new e), t) return n.x = t.x, n.y = t.y, n.width = t.width, n.height = t.height, n
							}, e.equals = function (e, t)
							{
								return e && t && Oe.equalsEpsilon(e.x, t.x, Oe.EPSILON7) && Oe.equalsEpsilon(e.y, t.y, Oe.EPSILON7) && Oe.equalsEpsilon(e.width, t.width, Oe.EPSILON7) && Oe.equalsEpsilon(e.height, t.height, Oe.EPSILON7)
							}, e
						}()), e("CanvasViewport", en = function (e)
						{
							function t()
							{
								var t = e.apply(this, arguments) || this;
								return t.pixelRatio = 1, t.renderWidthScaleFactor = 1, t.renderHeightScaleFactor = 1, t
							}
							return Ht(t, e), t.clone = function (e, n)
							{
								if (void 0 === n && (n = new t), e) return $t.clone(e, n), n.renderWidthScaleFactor = e.renderWidthScaleFactor, n.renderHeightScaleFactor = e.renderHeightScaleFactor, n
							}, t.equals = function (e, t)
							{
								return e && t && $t.equals(e, t) && Oe.equalsEpsilon(e.renderWidthScaleFactor, t.renderWidthScaleFactor, Oe.EPSILON7) && Oe.equalsEpsilon(e.renderHeightScaleFactor, t.renderHeightScaleFactor, Oe.EPSILON7)
							}, t
						}($t)),
						function (e)
						{
							e[e.SINGULAR = "Singular"] = "SINGULAR", e[e.LEFTEYE = "LeftEye"] = "LEFTEYE", e[e.RIGHTEYE = "RightEye"] = "RIGHTEYE", e[e.OTHER = "Other"] = "OTHER"
						}(tn || e("SubviewType", tn = {})),
						function (e)
						{
							function t(e, t)
							{
								return e ? (t = t ||
								{}, t.p = se.clone(e.p, t.p), t.o = Re.clone(e.o, t.o), t.r = e.r, t.meta = e.meta, t) : null
							}
							e.clone = t
						}(nn || e("SerializedEntityState", nn = {})),
						function (e)
						{
							function t(e, t)
							{
								return t = t ||
								{}, t.type = e.type, t.projectionMatrix = _e.clone(e.projectionMatrix, t.projectionMatrix), t.viewport = $t.clone(e.viewport, t.viewport), t
							}

							function n(e, t)
							{
								return e && t && e.type === t.type && $t.equals(e.viewport, t.viewport) && _e.equals(e.projectionMatrix, t.projectionMatrix)
							}
							e.clone = t, e.equals = n
						}(rn || e("SerializedSubview", rn = {})), e("SerializedSubviewList", on = function (e)
						{
							function t()
							{
								return e.call(this) || this
							}
							return Ht(t, e), t.clone = function (e, n)
							{
								if (e)
								{
									(n = n || new t).length = e.length;
									for (var i = 0; i < e.length; i++)
									{
										var r = e[i];
										n[i] = rn.clone(r, n[i])
									}
									return n
								}
							}, t
						}(Array)), Object.defineProperties(S.prototype,
						{
							errorEvent:
							{
								get: function ()
								{
									return this._errorEvent
								}
							},
							credit:
							{
								get: function ()
								{
									return this._credit
								}
							},
							tilingScheme:
							{
								get: function ()
								{
									return this._tilingScheme
								}
							},
							ready:
							{
								get: function ()
								{
									return !0
								}
							},
							readyPromise:
							{
								get: function ()
								{
									return this._readyPromise
								}
							},
							hasWaterMask:
							{
								get: function ()
								{
									return !1
								}
							},
							hasVertexNormals:
							{
								get: function ()
								{
									return !1
								}
							}
						}), S.prototype.requestTileGeometry = function (e, t, n, i)
						{
							var r = this._url + n + "/" + e + "/" + t + ".png",
								o = this._proxy;
							ge(o) && (r = o.getURL(r));
							var s = this._terrainPromises[r];
							s || (s = He(r, !0, i), this._terrainPromises[r] = s);
							var a = this;
							return s.then(function (e)
							{
								return new Ze(
								{
									buffer: Xe(e, a._heightmapWidth, a._heightmapWidth),
									width: a._heightmapWidth,
									height: a._heightmapWidth,
									childTileMask: n < 16 ? 0 : 15,
									structure: a._terrainDataStructure
								})
							})
						}, S.prototype.getLevelMaximumGeometricError = function (e)
						{
							return this._levelZeroMaximumGeometricError / (1 << e)
						}, S.prototype.getTileDataAvailable = function (e, t, n)
						{
							return n < 16 || void 0
						}, e("Event", sn = function ()
						{
							function e()
							{
								this._event = new Ee, this.addEventListener = this._event.addEventListener.bind(this._event), this.removeEventListener = this._event.removeEventListener.bind(this._event), this.raiseEvent = this._event.raiseEvent.bind(this._event), this.on = this.addEventListener, this.off = this.removeEventListener
							}
							return Object.defineProperty(e.prototype, "numberOfListeners",
							{
								get: function ()
								{
									return this._event.numberOfListeners
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.onNext = function (e, t)
							{
								var n = this.addEventListener(function (i)
								{
									Promise.resolve().then(function ()
									{
										return n()
									}), e.apply(t, i)
								})
							}, e
						}()), e("CommandQueue", an = function ()
						{
							function e()
							{
								var e = this;
								this._queue = [], this._paused = !0, this.errorEvent = new sn, this.errorEvent.addEventListener(function (t)
								{
									1 === e.errorEvent.numberOfListeners && console.error(t)
								})
							}
							return e.prototype.push = function (e, t)
							{
								var n = this,
									i = new Promise(function (t, i)
									{
										n._queue.push(
										{
											command: e,
											reject: i,
											execute: function ()
											{
												var n = Promise.resolve().then(e);
												return t(n), n
											}
										})
									});
								return !t && this._paused || this.execute(), i
							}, e.prototype.execute = function ()
							{
								var e = this;
								this._paused = !1, Promise.resolve().then(function ()
								{
									e._queue.length > 0 && !e._currentCommandPending && e._executeNextCommand()
								})
							}, e.prototype.pause = function ()
							{
								this._paused = !0
							}, e.prototype.clear = function ()
							{
								this._queue.forEach(function (e)
								{
									e.reject("Unable to execute.")
								}), this._queue = []
							}, e.prototype._executeNextCommand = function ()
							{
								var e = this;
								if (this._currentCommand = void 0, this._currentCommandPending = void 0, !this._paused)
								{
									var t = this._queue.shift();
									t && (this._currentCommand = t.command, this._currentCommandPending = t.execute().then(this._executeNextCommand.bind(this)).catch(function (t)
									{
										e.errorEvent.raiseEvent(t), e._executeNextCommand()
									}))
								}
							}, e
						}()), e("MessageChannelLike", un = function ()
						{
							function e()
							{
								var e, t, n, i = this,
									r = !0;
								e = new Promise(function (e)
								{
									i.port1 = {
										set onmessage(t)
										{
											n = t, e()
										},
										get onmessage()
										{
											return n
										},
										postMessage: function (e)
										{
											r && t.then(function ()
											{
												i.port2.onmessage && i.port2.onmessage(
												{
													data: e
												})
											})
										},
										close: function ()
										{
											r = !1
										}
									}
								});
								var o;
								t = new Promise(function (t)
								{
									i.port2 = {
										set onmessage(e)
										{
											o = e, t()
										},
										get onmessage()
										{
											return o
										},
										postMessage: function (t)
										{
											r && e.then(function ()
											{
												i.port1.onmessage && i.port1.onmessage(
												{
													data: t
												})
											})
										},
										close: function ()
										{
											r = !1
										}
									}
								})
							}
							return e
						}()), e("SynchronousMessageChannel", cn = function ()
						{
							function e()
							{
								var e = this,
									t = [],
									n = void 0,
									i = {
										data: null
									},
									r = !1,
									o = function ()
									{
										for (var n = 0; n < t.length; n++) e.port2.onmessage(t[n]);
										t.length = 0
									},
									s = function ()
									{
										for (var t = 0; t < a.length; t++) e.port1.onmessage(a[t]);
										a.length = 0
									};
								e.port1 = {
									get onmessage()
									{
										return n
									},
									set onmessage(e)
									{
										n = e, s()
									},
									postMessage: function (n)
									{
										e.port2.onmessage ? (i.data = n, e.port2.onmessage(i)) : r || t.push(
										{
											data: n
										})
									},
									close: function ()
									{
										r = !0, e.port1.onmessage = void 0
									}
								};
								var a = [],
									u = void 0,
									c = {
										data: null
									},
									l = !1;
								e.port2 = {
									get onmessage()
									{
										return u
									},
									set onmessage(e)
									{
										u = e, o()
									},
									postMessage: function (t)
									{
										e.port1.onmessage ? (c.data = t, e.port1.onmessage(c)) : l || a.push(
										{
											data: t
										})
									},
									close: function ()
									{
										l = !0, e.port2.onmessage = void 0
									}
								}
							}
							return e
						}()), e("MessageChannelFactory", ln = function ()
						{
							function e()
							{}
							return e.prototype.create = function ()
							{
								return "undefined" != typeof MessageChannel ? new MessageChannel : new un
							}, e.prototype.createSynchronous = function ()
							{
								return new cn
							}, e
						}()), e("getEventSynthesizier", dn = "undefined" != typeof document && document.createElement ? _ : function () {}), fn = function (e, t)
						{
							return {
								identifier: e.identifier,
								clientX: e.clientX - t.left,
								clientY: e.clientY - t.top,
								screenX: e.screenX,
								screenY: e.screenY
							}
						}, pn = function (e, t)
						{
							if (e)
							{
								for (var n = [], i = 0; i < e.length; i++)
								{
									var r = e.item(i);
									n[i] = fn(r, t)
								}
								return n
							}
						}, gn = /\{\s*\[native code\]\s*\}/, e("hasNativeWebVRImplementation", yn = "undefined" != typeof navigator && j(navigator.getVRDisplays) && !Object.getOwnPropertyDescriptor(navigator, "getVRDisplays")), e("suggestedWebGLContextAntialiasAttribute", Mn = yn), e("eastUpSouthToFixedFrame", vn = Ye.localFrameToFixedFrameGenerator("east", "up")), An = new se, En = new Re, e("getEntityPosition", mn = z), e("getEntityOrientation", wn = P), Nn = [], Dn = {}, Tn = "undefined" != typeof document ? document.createElement("a") : void 0, In = new xe, On = new se, Sn = new Re, e("isArgonApp", _n = "undefined" != typeof navigator && "undefined" != typeof window && navigator.userAgent.indexOf("Argon") > 0), e("isIOS", Ln = "undefined" != typeof navigator && "undefined" != typeof window && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream), e("isAndroid", jn = "undefined" != typeof navigator && "undefined" != typeof window && /Android/.test(navigator.userAgent) && !window.MSStream), xn = 0, e("requestAnimationFrame", bn = "undefined" != typeof window && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (e)
						{
							var t = performance.now(),
								n = Math.max(0, 16 - (t - xn)),
								i = setTimeout(function ()
								{
									e(t + n)
								}, n);
							return xn = t + n, i
						}), e("cancelAnimationFrame", Cn = "undefined" != typeof window ? window.cancelAnimationFrame.bind(window) : clearTimeout), e("defaultTerrainProvider", Rn = new S(
						{
							url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/",
							requestWaterMask: !0,
							requestVertexNormals: !0
						})), e("version", zn = "1.4.0"), Pn = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, Un = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, kn = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, Bn = Object.freeze(
						{}), e("SessionPort", Fn = function ()
						{
							function e(t)
							{
								var n = this;
								this.uri = t, this.id = O(), this._connectEvent = new sn, this.closeEvent = new sn, this.errorEvent = new sn, this.on = {}, this.suppressErrorOnUnknownTopic = !1, this._isOpened = !1, this._isConnected = !1, this._isClosed = !1, this._shouldStringify = !0, this._packet = [], this.on[e.OPEN] = function (e)
								{
									if (!e) throw new Error("Session did not provide a configuration (" + n.uri + ")");
									if (n._isConnected) throw new Error("Session has already connected! (" + n.uri + ")");
									n._info = e, n._version = e.version || [0], n._isConnected = !0, n._connectEvent.raiseEvent(void 0)
								}, this.on[e.CLOSE] = function ()
								{
									n._isClosed = !0, n._isConnected = !1, n.messagePort && n.messagePort.close && n.messagePort.close(), n.closeEvent.raiseEvent(void 0)
								}, this.on[e.ERROR] = function (e)
								{
									var t = new Error("Session Error: " + e.message);
									e.stack && (t.stack = e.stack), n.errorEvent.raiseEvent(t)
								}, this.errorEvent.addEventListener(function (e)
								{
									1 === n.errorEvent.numberOfListeners && console.error(e)
								})
							}
							return Object.defineProperty(e.prototype, "connectEvent",
							{
								get: function ()
								{
									if (this._isConnected) throw new Error("The connectEvent only fires once and the session is already connected.");
									return this._connectEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "info",
							{
								get: function ()
								{
									if (!this.isConnected) throw new Error("info is not available until the session is connected.");
									return this._info
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "version",
							{
								get: function ()
								{
									if (!ge(this._version)) throw new Error("version is not available until the session is opened.");
									return this._version
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "versionNumber",
							{
								get: function ()
								{
									return Number(this.version[0] + "." + this.version[1])
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.supportsProtocol = function (e, t)
							{
								if (!this._isConnected) throw new Error("Session has not yet connected");
								var n = this.info.protocols;
								if (!n) return !1;
								var i = !1,
									r = !1,
									o = new Set;
								return n.forEach(function (t)
								{
									if (-1 !== t.indexOf(e))
									{
										r = !0;
										var n = +t.split("@v")[1] || 0;
										o.add(n)
									}
								}), t ? Array.isArray(t) ? t.forEach(function (e)
								{
									o.has(e) && (i = !0)
								}) : o.has(t) && (i = !0) : t || (i = r), i
							}, e.prototype.whenConnected = function ()
							{
								var e = this;
								return new Promise(function (t, n)
								{
									e.isConnected && t();
									var i = e._connectEvent.addEventListener(function ()
									{
										i(), t()
									})
								})
							}, e.prototype.open = function (t, n)
							{
								var i = this;
								if (!this._isClosed)
								{
									if (this._isOpened) throw new Error("Session can only be opened once");
									if (!n) throw new Error("Session options must be provided");
									this.messagePort = t, this._isOpened = !0, (t instanceof cn || Ln) && (this._shouldStringify = !1), this.messagePort.onmessage = function (e)
									{
										if (!i._isClosed)
										{
											var t = "string" == typeof e.data ? JSON.parse(e.data) : e.data,
												n = t[0],
												r = t[1],
												o = t[2] || Bn,
												s = t[3],
												a = i.on[r];
											if (a && !s) try
											{
												(u = a(o, e)) && console.warn("Handler for " + r + " returned an unexpected response")
											}
											catch (e)
											{
												i.sendError(e), i.errorEvent.raiseEvent(e)
											}
											else if (a)
											{
												var u = new Promise(function (t)
												{
													return t(a(o, e))
												});
												Promise.resolve(u).then(function (e)
												{
													i._isClosed || i.send(r + ":resolve:" + n, e)
												}).catch(function (e)
												{
													if (!i._isClosed)
													{
														var t;
														"string" == typeof e ? t = e : "string" == typeof e.message && (t = e.message), i.send(r + ":reject:" + n,
														{
															reason: t
														})
													}
												})
											}
											else if (!i.suppressErrorOnUnknownTopic)
											{
												var c = "Unable to handle message for topic " + r + " (to: " + i.uri + ")";
												s && i.send(r + ":reject:" + n,
												{
													reason: c
												}), i.errorEvent.raiseEvent(new Error(c))
											}
										}
									}, this.send(e.OPEN, n)
								}
							}, e.prototype.send = function (e, t)
							{
								if (!this._isOpened) throw new Error("Session must be open to send messages");
								if (this._isClosed) return !1;
								var n = O(),
									i = this._packet;
								return i[0] = n, i[1] = e, i[2] = t, this.messagePort.postMessage(this._shouldStringify ? JSON.stringify(i) : i), !0
							}, e.prototype.sendError = function (t)
							{
								var n = t;
								return n instanceof Error && (n = {
									message: n.message,
									stack: n.stack
								}), this.send(e.ERROR, n)
							}, e.prototype.request = function (e, t)
							{
								var n = this;
								if (!this._isOpened || this._isClosed) throw new Error("Session must be open to make requests");
								var i = O(),
									r = e + ":resolve:" + i,
									o = e + ":reject:" + i,
									s = new Promise(function (t, i)
									{
										n.on[r] = function (e)
										{
											delete n.on[r], delete n.on[o], t(e)
										}, n.on[o] = function (t)
										{
											delete n.on[r], delete n.on[o], console.warn("Request '" + e + "' rejected with reason:\n" + t.reason), i(new Error(t.reason))
										}
									}),
									a = [i, e, t, !0];
								return this.messagePort.postMessage(Ln ? a : JSON.stringify(a)), s
							}, e.prototype.close = function ()
							{
								this._isClosed || (this._isOpened && this.send(e.CLOSE), this._isClosed = !0, this._isConnected = !1, this.messagePort && this.messagePort.close && this.messagePort.close(), this.closeEvent.raiseEvent(void 0))
							}, Object.defineProperty(e.prototype, "isConnected",
							{
								get: function ()
								{
									return this._isConnected
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isClosed",
							{
								get: function ()
								{
									return this._isClosed
								},
								enumerable: !0,
								configurable: !0
							}), e
						}()), Fn.OPEN = "ar.session.open", Fn.CLOSE = "ar.session.close", Fn.ERROR = "ar.session.error", e("SessionPortFactory", Qn = function ()
						{
							function e()
							{}
							return e.prototype.create = function (e)
							{
								return new Fn(e)
							}, e
						}()), e("ConnectService", Yn = function ()
						{
							function e()
							{}
							return e
						}()), e("SessionService", Gn = function ()
						{
							function e(e, t, n, i)
							{
								var r = this;
								this.configuration = e, this.connectService = t, this.sessionPortFactory = n, this.messageChannelFactory = i, this.manager = this.createSessionPort("argon:manager"), this.errorEvent = new sn, this._connectEvent = new sn, this._managedSessions = [], e.version = Z(zn), e.uri = "undefined" != typeof window && window.location ? window.location.href : void 0, e.title = e.title || ("undefined" != typeof document ? document.title : void 0), this.errorEvent.addEventListener(function (e)
								{
									1 === r.errorEvent.numberOfListeners && console.error(e)
								}), this.manager.errorEvent.addEventListener(function (e)
								{
									r.errorEvent.raiseEvent(e)
								}), this.manager.closeEvent.addEventListener(function ()
								{
									r.managedSessions.forEach(function (e)
									{
										e.close()
									})
								}), Object.freeze(this)
							}
							return Object.defineProperty(e.prototype, "connectEvent",
							{
								get: function ()
								{
									return this._connectEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "managedSessions",
							{
								get: function ()
								{
									return this._managedSessions
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.connect = function ()
							{
								this.connectService && this.connectService.connect ? this.connectService.connect(this) : console.warn("Argon: Unable to connect to a manager session; a connect service is not available")
							}, e.prototype.addManagedSessionPort = function (e)
							{
								var t = this;
								this.ensureIsRealityManager();
								var n = this.sessionPortFactory.create(e);
								return n.errorEvent.addEventListener(function (e)
								{
									t.errorEvent.raiseEvent(e)
								}), n.connectEvent.addEventListener(function ()
								{
									t.managedSessions.push(n), t.connectEvent.raiseEvent(n)
								}), n.closeEvent.addEventListener(function ()
								{
									var e = t.managedSessions.indexOf(n);
									e > -1 && t.managedSessions.splice(e, 1)
								}), this.manager.closeEvent.addEventListener(function ()
								{
									n.close()
								}), n
							}, e.prototype.createSessionPort = function (e)
							{
								return this.sessionPortFactory.create(e)
							}, e.prototype.createMessageChannel = function ()
							{
								return this.messageChannelFactory.create()
							}, e.prototype.createSynchronousMessageChannel = function ()
							{
								return this.messageChannelFactory.createSynchronous()
							}, Object.defineProperty(e.prototype, "isManager",
							{
								get: function ()
								{
									return Kt.isRealityManager(this.configuration && this.configuration.role)
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isRealityManager",
							{
								get: function ()
								{
									return this.isManager
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isAugmenter",
							{
								get: function ()
								{
									return Kt.isRealityAugmenter(this.configuration && this.configuration.role)
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isRealityAugmenter",
							{
								get: function ()
								{
									return this.isAugmenter
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isReality",
							{
								get: function ()
								{
									return Kt.isRealityViewer(this.configuration && this.configuration.role)
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isRealityViewer",
							{
								get: function ()
								{
									return this.isReality
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isApplication",
							{
								get: function ()
								{
									return this.isRealityAugmenter
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isRealityView",
							{
								get: function ()
								{
									return this.isRealityViewer
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.ensureIsRealityManager = function ()
							{
								if (!this.isRealityManager) throw new Error("An reality-manager only API was accessed from a non reality-manager.")
							}, e.prototype.ensureIsRealityViewer = function ()
							{
								if (!this.isRealityViewer) throw new Error("An reality-viewer only API was accessed from a non reality-viewer.")
							}, e.prototype.ensureNotRealityViewer = function ()
							{
								if (this.isRealityViewer) throw new Error("An non-permitted API was accessed from a reality-viewer.")
							}, e.prototype.ensureNotRealityAugmenter = function ()
							{
								if (this.isRealityAugmenter) throw new Error("An non-permitted API was accessed from a reality-viewer.")
							}, e.prototype.ensureConnected = function ()
							{
								if (!this.manager.isConnected) throw new Error("Session is not connected to manager")
							}, e
						}()), Un([H("isRealityAugmenter"), kn("design:type", Object), kn("design:paramtypes", [])], Gn.prototype, "isApplication", null), Un([H("isRealityViewer"), kn("design:type", Object), kn("design:paramtypes", [])], Gn.prototype, "isRealityView", null), e("SessionService", Gn = Un([N, kn("design:paramtypes", ["function" == typeof (Kn = void 0 !== Jt && Jt) && Kn || Object, Yn, Qn, "function" == typeof (Jn = void 0 !== ln && ln) && Jn || Object])], Gn)), e("LoopbackConnectService", Vn = function (e)
						{
							function t()
							{
								return e.apply(this, arguments) || this
							}
							return Pn(t, e), t.prototype.connect = function (e)
							{
								var t = e.createSynchronousMessageChannel(),
									n = t.port1;
								t.port2.onmessage = function (e)
								{
									t.port2.postMessage(e.data)
								}, e.manager.connectEvent.addEventListener(function ()
								{
									e.connectEvent.raiseEvent(e.manager)
								}), e.manager.open(n, e.configuration)
							}, t
						}(Yn)), e("DOMConnectService", qn = function (e)
						{
							function t()
							{
								return e.apply(this, arguments) || this
							}
							return Pn(t, e), t.isAvailable = function ()
							{
								return "undefined" != typeof window && void 0 !== window.parent
							}, t.prototype.connect = function (e)
							{
								var t = e.createMessageChannel();
								window.parent.postMessage(
								{
									type: "ARGON_SESSION",
									name: window.name
								}, "*", [t.port1]), e.manager.open(t.port2, e.configuration)
							}, t
						}(Yn)), e("DebugConnectService", Hn = function (e)
						{
							function t()
							{
								return e.apply(this, arguments) || this
							}
							return Pn(t, e), t.isAvailable = function ()
							{
								return "undefined" != typeof window && !!window.__ARGON_DEBUG_PORT__
							}, t.prototype.connect = function (e)
							{
								var t = e.manager,
									n = e.configuration;
								t.open(window.__ARGON_DEBUG_PORT__, n)
							}, t
						}(Yn)), e("SessionConnectService", Wn = function (e)
						{
							function t(t, n)
							{
								var i = e.call(this) || this;
								return i.session = t, i.parentConfiguration = n, i
							}
							return Pn(t, e), t.isAvailable = function ()
							{
								return !0
							}, t.prototype.connect = function (e)
							{
								var t = e.createSynchronousMessageChannel();
								this.session.open(t.port1, this.parentConfiguration), e.manager.open(t.port2, e.configuration)
							}, t
						}(Yn)), e("WKWebViewConnectService", Xn = function (e)
						{
							function t()
							{
								return e.apply(this, arguments) || this
							}
							return Pn(t, e), t.isAvailable = function ()
							{
								return "undefined" != typeof window && window.webkit && window.webkit.messageHandlers
							}, t.prototype.connect = function (e)
							{
								var t = e.createSynchronousMessageChannel();
								t.port2.onmessage = function (e)
								{
									webkit.messageHandlers.argon.postMessage(JSON.stringify(e.data))
								}, window.__ARGON_PORT__ = t.port2, e.manager.open(t.port1, e.configuration), window.addEventListener("beforeunload", function ()
								{
									e.manager.close()
								})
							}, t
						}(Yn)), e("AndroidWebViewConnectService", Zn = function (e)
						{
							function t()
							{
								return e.apply(this, arguments) || this
							}
							return Pn(t, e), t.isAvailable = function ()
							{
								return "undefined" != typeof window && window.__argon_android__
							}, t.prototype.connect = function (e)
							{
								var t = e.createSynchronousMessageChannel();
								t.port2.onmessage = function (e)
								{
									window.__argon_android__.emit("argon", JSON.stringify(e.data))
								}, window.__ARGON_PORT__ = t.port2, e.manager.open(t.port1, e.configuration), window.addEventListener("beforeunload", function ()
								{
									e.manager.close()
								})
							}, t
						}(Yn)), $n = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, ei = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("Permission", ti = function ()
						{
							function e(e, t)
							{
								this.type = e, this.state = t || ni.NOT_REQUIRED
							}
							return e
						}()),
						function (e)
						{
							e[e.NOT_REQUIRED = "not_required"] = "NOT_REQUIRED", e[e.PROMPT = "prompt"] = "PROMPT", e[e.GRANTED = "granted"] = "GRANTED", e[e.DENIED = "denied"] = "DENIED"
						}(ni || e("PermissionState", ni = {})), e("PermissionService", ii = function ()
						{
							function e(e)
							{
								this.sessionService = e
							}
							return e.prototype.query = function (e, t)
							{
								return void 0 === t && (t = this.sessionService.manager), t.request("ar.permission.query",
								{
									type: e
								}).then(function (e)
								{
									return e.state || ni.NOT_REQUIRED
								})
							}, e.prototype.revoke = function (e)
							{
								return this.sessionService.manager.request("ar.permission.revoke",
								{
									type: e
								}).then(function (e)
								{
									return e.state
								})
							}, e
						}()), e("PermissionService", ii = $n([N(), ei("design:paramtypes", ["function" == typeof (oi = void 0 !== Gn && Gn) && oi || Object])], ii)), e("PermissionServiceProvider", ri = function ()
						{
							function e(e)
							{
								var t = this;
								this.sessionService = e, this.sessionService.ensureIsRealityManager(), this.sessionService.connectEvent.addEventListener(function (e)
								{
									e.on["ar.permission.query"] = function (n)
									{
										var i = n.type;
										return Promise.resolve(
										{
											state: t.getPermissionState(e, i)
										})
									}, e.on["ar.permission.revoke"] = function (e)
									{
										e.type;
										return Promise.reject(new Error("Revoking permission is not supported on this browser."))
									}
								})
							}
							return e.prototype.handlePermissionRequest = function (e, t, n)
							{
								return Promise.resolve()
							}, e.prototype.getPermissionState = function (e, t)
							{
								return ni.GRANTED
							}, e
						}()), e("PermissionServiceProvider", ri = $n([N(), ei("design:paramtypes", ["function" == typeof (si = void 0 !== Gn && Gn) && si || Object])], ri)), ai = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, ui = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("EntityPose", ci = function ()
						{
							function e(e, t, n)
							{
								if (this._collection = e, this.status = 0, this.position = new se, this.orientation = new Re, this.time = new Ie(0, 0), this.previousStatus = 0, this._getEntityPositionInReferenceFrame = z, this._getEntityOrientationInReferenceFrame = P, this._collection._firing = !0, "string" == typeof t)
								{
									var i = this._collection.getById(t);
									i || (i = new ze(this._collection, t)), this._entity = i
								}
								else this._entity = t;
								if ("string" == typeof n)
								{
									var r = this._collection.getById(n);
									ge(r) || (r = new ze(this._collection, n)), this._referenceFrame = r
								}
								else this._referenceFrame = n
							}
							return Object.defineProperty(e.prototype, "entity",
							{
								get: function ()
								{
									return this._entity
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "referenceFrame",
							{
								get: function ()
								{
									return this._referenceFrame
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "poseStatus",
							{
								get: function ()
								{
									return this.status
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.update = function (e)
							{
								var t = Ie,
									n = li;
								t.clone(e, this.time), t.equals(this.previousTime, e) || (this.previousStatus = this.status, this.previousTime = t.clone(e, this.previousTime), this.previousPosition = se.clone(this.position, this.previousPosition), this.previousOrientation = Re.clone(this.orientation, this.previousOrientation));
								var i = this.entity,
									r = this.referenceFrame,
									o = this._getEntityPositionInReferenceFrame(i, e, r, this.position),
									s = this._getEntityOrientationInReferenceFrame(i, e, r, this.orientation),
									a = o && s,
									u = 0,
									c = this.previousStatus;
								a && (u |= n.KNOWN), !a || c & n.KNOWN ? !a && c & n.KNOWN && (u |= n.LOST) : u |= n.FOUND, se.equals(this.previousPosition, o) && Re.equals(this.previousOrientation, s) || (u |= n.CHANGED), this.status = u
							}, e
						}()),
						function (e)
						{
							e[e.KNOWN = 1] = "KNOWN", e[e.FOUND = 2] = "FOUND", e[e.LOST = 4] = "LOST", e[e.CHANGED = 8] = "CHANGED"
						}(li || e("PoseStatus", li = {})), e("EntityService", hi = function ()
						{
							function e(e)
							{
								this.sessionService = e, this.collection = new Ae, this.subscribedEvent = new sn, this.unsubscribedEvent = new sn, this.subscriptions = new Map, this._scratchCartesian = new se, this._scratchQuaternion = new Re, this._scratchMatrix3 = new Se, this._scratchMatrix4 = new _e, this._getEntityPositionInReferenceFrame = z, this._entityPoseMap = new Map, this._stringIdentifierFromReferenceFrame = x
							}
							return e.prototype._handleSubscribed = function (e)
							{
								var t = this.subscriptions.get(e.id),
									n = e.options && JSON.stringify(e.options);
								t && JSON.stringify(t) !== n || (t && this._handleUnsubscribed(e.id), this.subscriptions.set(e.id, n && JSON.parse(n)), this.subscribedEvent.raiseEvent(e))
							}, e.prototype._handleUnsubscribed = function (e)
							{
								this.subscriptions.has(e) && (this.subscriptions.delete(e), this.unsubscribedEvent.raiseEvent(
								{
									id: e
								}))
							}, e.prototype.getCartographic = function (e, t, n)
							{
								var i = this._getEntityPositionInReferenceFrame(e, t, Pe.FIXED, this._scratchCartesian);
								if (i) return n = n || new ue, ue.fromCartesian(i, void 0, n)
							}, e.prototype.createFixed = function (e, t)
							{
								var n = se.fromRadians(e.longitude, e.latitude, e.height, void 0, this._scratchCartesian),
									i = t(n, void 0, this._scratchMatrix4),
									r = _e.getRotation(i, this._scratchMatrix3),
									o = Re.fromRotationMatrix(r, this._scratchQuaternion);
								return new ve(
								{
									position: n,
									orientation: o
								})
							}, e.prototype.subscribe = function (e, t, n)
							{
								var i = this;
								void 0 === n && (n = this.sessionService.manager);
								var r = e.id || e,
									o = {
										id: r,
										options: t
									};
								return n.whenConnected().then(function ()
								{
									return 0 === n.version[0] && n.version[1] < 2 ? n.request("ar.context.subscribe", o) : n.request("ar.entity.subscribe", o)
								}).then(function ()
								{
									var e = i.collection.getOrCreateEntity(r);
									return i._handleSubscribed(o), e
								})
							}, e.prototype.unsubscribe = function (e, t)
							{
								var n = this;
								void 0 === t && (t = this.sessionService.manager);
								var i = e.id || e;
								t.whenConnected().then(function ()
								{
									0 === t.version[0] && t.version[1] < 2 ? t.send("ar.context.unsubscribe",
									{
										id: i
									}) : t.send("ar.entity.unsubscribe",
									{
										id: i
									})
								}).then(function ()
								{
									n._handleUnsubscribed(i)
								})
							}, e.prototype.createEntityPose = function (e, t)
							{
								return new ci(this.collection, e, t)
							}, e.prototype.getEntityPose = function (e, t, n)
							{
								var i = this._stringIdentifierFromReferenceFrame(e) + "@" + this._stringIdentifierFromReferenceFrame(t),
									r = this._entityPoseMap.get(i);
								return r || (r = this.createEntityPose(e, t), this._entityPoseMap.set(i, r)), r.update(n), r
							}, e.prototype.updateEntityFromSerializedState = function (e, t)
							{
								var n = this.collection.getOrCreateEntity(e);
								if (!t) return n.position && n.position.setValue(void 0), n.orientation && n.orientation.setValue(void 0), n.meta = void 0, n;
								var i = t.p,
									r = Re.clone(t.o, this._scratchQuaternion),
									o = "number" == typeof t.r ? t.r : this.collection.getOrCreateEntity(t.r),
									s = n.position,
									a = n.orientation;
								return s instanceof de ? s.setValue(i, o) : n.position = new de(i, o), a instanceof fe ? a.setValue(r) : n.orientation = new fe(r), n.meta = t.meta, n
							}, e
						}()), e("EntityService", hi = ai([N(), ui("design:paramtypes", ["function" == typeof (fi = void 0 !== Gn && Gn) && fi || Object])], hi)), e("EntityServiceProvider", di = function ()
						{
							function e(e, t, n)
							{
								var i = this;
								this.sessionService = e, this.entityService = t, this.permissionServiceProvider = n, this.subscriptionsBySubscriber = new WeakMap, this.subscribersByEntity = new Map, this.sessionSubscribedEvent = new sn, this.sessionUnsubscribedEvent = new sn, this._cacheTime = new Ie(0, 0), this._entityStateCache = {}, this._getSerializedEntityState = U, this.sessionService.ensureIsRealityManager(), this.sessionService.connectEvent.addEventListener(function (e)
								{
									var t = {};
									i.subscriptionsBySubscriber.set(e, t), e.on["ar.entity.subscribe"] = e.on["ar.context.subscribe"] = function (n)
									{
										var r = n.id,
											o = n.options,
											s = t[r];
										if (!s || !b(s, o))
										{
											o = o ||
											{};
											var a = i.subscribersByEntity.get(r) || new Set;
											return i.subscribersByEntity.set(r, a), a.add(e), t[r] = o, i.sessionSubscribedEvent.raiseEvent(
											{
												session: e,
												id: r,
												options: o
											}), i.permissionServiceProvider.handlePermissionRequest(e, r, o).then(function () {})
										}
									}, e.on["ar.entity.unsubscribe"] = e.on["ar.context.unsubscribe"] = function (n)
									{
										var r = n.id;
										if (t[r])
										{
											var o = i.subscribersByEntity.get(r);
											o && o.delete(e), delete t[r], i.sessionUnsubscribedEvent.raiseEvent(
											{
												id: r,
												session: e
											})
										}
									}, e.closeEvent.addEventListener(function ()
									{
										i.subscriptionsBySubscriber.delete(e);
										for (var n in t)
										{
											var r = i.subscribersByEntity.get(n);
											r && r.delete(e), i.sessionUnsubscribedEvent.raiseEvent(
											{
												id: n,
												session: e
											})
										}
									})
								})
							}
							return e.prototype.fillEntityStateMap = function (e, t, n, i)
							{
								for (var r in n)
									for (var o = this.entityService.collection.getById(r); ge(o) && void 0 === e[r = o.id];)
									{
										var s = o && o.position && o.position.referenceFrame;
										if (i[r])
										{
											e[r] = null;
											break
										}
										var a = this._getCachedSerializedEntityState(o, t, s);
										if (e[r] = a, null === a || "number" == typeof s) break;
										o = s
									}
							}, e.prototype._getCachedSerializedEntityState = function (e, t, n)
							{
								if (!e || !ge(n)) return null;
								var i = e.id;
								return ge(this._entityStateCache[i]) && this._cacheTime.equalsEpsilon(t, 1e-6) || (this._entityStateCache[i] = this._getSerializedEntityState(e, t, n)), this._entityStateCache[i]
							}, e
						}()), e("EntityServiceProvider", di = ai([N, ui("design:paramtypes", ["function" == typeof (pi = void 0 !== Gn && Gn) && pi || Object, hi, "function" == typeof (gi = void 0 !== ri && ri) && gi || Object])], di)), yi = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, Mi = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("FocusService", vi = function ()
						{
							function e(e)
							{
								var t = this;
								this.focusEvent = new sn, this.blurEvent = new sn, this._hasFocus = !1, e.manager.on["ar.focus.state"] = function (e)
								{
									var n = e.state;
									t._hasFocus !== n && (t._hasFocus = n, n ? t.focusEvent.raiseEvent(void 0) : t.blurEvent.raiseEvent(void 0))
								}
							}
							return Object.defineProperty(e.prototype, "hasFocus",
							{
								get: function ()
								{
									return this._hasFocus
								},
								enumerable: !0,
								configurable: !0
							}), e
						}()), e("FocusService", vi = yi([D(Gn), Mi("design:paramtypes", ["function" == typeof (Ei = void 0 !== Gn && Gn) && Ei || Object])], vi)), e("FocusServiceProvider", Ai = function ()
						{
							function e(e)
							{
								var t = this;
								this.sessionService = e, this.sessionFocusEvent = new sn, e.ensureIsRealityManager(), e.manager.connectEvent.addEventListener(function ()
								{
									setTimeout(function ()
									{
										!t._session && t.sessionService.manager.isConnected && (t.session = t.sessionService.manager)
									})
								})
							}
							return Object.defineProperty(e.prototype, "session",
							{
								get: function ()
								{
									return this._session
								},
								set: function (e)
								{
									if (e && !e.isConnected) throw new Error("Only a connected session can be granted focus");
									var t = this._session;
									t !== e && (t && t.send("ar.focus.state",
									{
										state: !1
									}), e && e.send("ar.focus.state",
									{
										state: !0
									}), this._session = e, this.sessionFocusEvent.raiseEvent(
									{
										previous: t,
										current: e
									}))
								},
								enumerable: !0,
								configurable: !0
							}), e
						}()), e("FocusServiceProvider", Ai = yi([D(Gn, vi), Mi("design:paramtypes", ["function" == typeof (mi = void 0 !== Gn && Gn) && mi || Object])], Ai)), wi = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, Ni = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("VisibilityService", Di = function ()
						{
							function e(e)
							{
								var t = this;
								this.showEvent = new sn, this.hideEvent = new sn, this._isVisible = !1, e.manager.on["ar.visibility.state"] = function (e)
								{
									var n = e.state;
									t._isVisible !== n && (t._isVisible = n, n ? t.showEvent.raiseEvent(void 0) : t.hideEvent.raiseEvent(void 0))
								}, e.manager.closeEvent.addEventListener(function ()
								{
									t._isVisible && (t._isVisible = !1, t.hideEvent.raiseEvent(void 0))
								}), e.manager.connectEvent.addEventListener(function ()
								{
									0 === e.manager.version[0] && (t._isVisible = !0, t.showEvent.raiseEvent(void 0))
								})
							}
							return Object.defineProperty(e.prototype, "isVisible",
							{
								get: function ()
								{
									return this._isVisible
								},
								enumerable: !0,
								configurable: !0
							}), e
						}()), e("VisibilityService", Di = wi([D(Gn), Ni("design:paramtypes", ["function" == typeof (Ii = void 0 !== Gn && Gn) && Ii || Object])], Di)), e("VisibilityServiceProvider", Ti = function ()
						{
							function e(e)
							{
								var t = this;
								this.visibleSessions = new Set, this.sessionChangeEvent = new sn, e.ensureIsRealityManager(), this.sessionChangeEvent.addEventListener(function (e)
								{
									e.send("ar.visibility.state",
									{
										state: t.visibleSessions.has(e)
									})
								}), e.manager.connectEvent.addEventListener(function ()
								{
									t.set(e.manager, !0)
								})
							}
							return e.prototype.set = function (e, t)
							{
								t ? this.visibleSessions.has(e) || (this.visibleSessions.add(e), this.sessionChangeEvent.raiseEvent(e)) : this.visibleSessions.has(e) && (this.visibleSessions.delete(e), this.sessionChangeEvent.raiseEvent(e))
							}, e
						}()), e("VisibilityServiceProvider", Ti = wi([D(Gn, Di), Ni("design:paramtypes", ["function" == typeof (Oi = void 0 !== Gn && Gn) && Oi || Object])], Ti)), Si = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, _i = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("Subview", Li = function ()
						{
							function e()
							{}
							return e
						}()),
						function (e)
						{
							e[e.EMBEDDED = 0] = "EMBEDDED", e[e.PAGE = 0] = "PAGE", e[e.IMMERSIVE = 1] = "IMMERSIVE"
						}(ji || e("ViewportMode", ji = {})), e("ViewItems", xi = function ()
						{
							function e()
							{}
							return e
						}()), e("ViewItems", xi = Si([A(), _i("design:paramtypes", [])], xi)), e("ViewService", bi = function ()
						{
							function e(e, t, n)
							{
								var i = this;
								this.sessionService = e, this.focusService = t, this.viewItems = n, this.uiEvent = new sn, this.viewportChangeEvent = new sn, this.viewportModeChangeEvent = new sn, this._mode = ji.EMBEDDED, this._viewport = new $t, this._renderWidth = 0, this._renderHeight = 0, this.autoLayoutImmersiveMode = !0, this.autoStyleLayerElements = !0, this.autoPublishEmbeddedMode = !0, this._subviews = [], this._subviewFrustum = [], this._desiredViewportMode = this.viewportMode, "undefined" != typeof document && document.createElement && !n.element && (n.element = document.createElement("div")), e.manager.on["ar.view.viewportMode"] = function (e)
								{
									var t = e.mode;
									i._updateViewportMode(t)
								}, e.isRealityManager || this._updateViewportMode(ji.IMMERSIVE), e.manager.connectEvent.addEventListener(function ()
								{
									i.viewportModeChangeEvent.raiseEvent(i.viewportMode)
								})
							}
							return Object.defineProperty(e.prototype, "viewportMode",
							{
								get: function ()
								{
									return this._mode
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "presentationMode",
							{
								get: function ()
								{
									return this.viewportMode
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "viewport",
							{
								get: function ()
								{
									return this._viewport
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "renderWidth",
							{
								get: function ()
								{
									return this._renderWidth
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "renderHeight",
							{
								get: function ()
								{
									return this._renderHeight
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.getViewport = function ()
							{
								return this.viewport
							}, e.prototype.setLayers = function (e)
							{
								var t = this.viewItems.layers;
								if (t)
									for (var n = 0, i = t; n < i.length; n++)
									{
										s = i[n];
										this.element.removeChild(s.source)
									}
								this.viewItems.layers = e;
								for (var r = 0, o = e; r < o.length; r++)
								{
									var s = o[r];
									this.element.appendChild(s.source)
								}
							}, Object.defineProperty(e.prototype, "element",
							{
								get: function ()
								{
									return this.viewItems.element
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "layers",
							{
								get: function ()
								{
									return this.viewItems.layers
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "subviews",
							{
								get: function ()
								{
									return this._subviews
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.getSubviews = function ()
							{
								return this.subviews
							}, e.prototype._processContextFrameState = function (e, t)
							{
								var n = e.viewport.renderWidthScaleFactor || 1,
									i = e.viewport.renderHeightScaleFactor || 1;
								this._renderWidth = e.viewport.width * n, this._renderHeight = e.viewport.height * i;
								var r = e.subviews,
									o = this._subviews;
								o.length = r.length;
								for (var s = 0, a = 0, u = r; a < u.length; a++)
								{
									var c = u[a],
										l = o[s] = o[s] ||
										{};
									l.index = s, l.type = c.type, l.viewport = l.viewport ||
									{}, l.viewport.x = c.viewport.x, l.viewport.y = c.viewport.y, l.viewport.width = c.viewport.width, l.viewport.height = c.viewport.height, l.renderViewport = l.renderViewport ||
									{}, l.renderViewport.x = c.viewport.x * n, l.renderViewport.y = c.viewport.y * i, l.renderViewport.width = c.viewport.width * n, l.renderViewport.height = c.viewport.height * i, l.frustum = this._subviewFrustum[s] = this._subviewFrustum[s] || new je, Y(c.projectionMatrix, l.frustum), l.projectionMatrix = l.frustum.projectionMatrix, l.pose = t.getEntityPose(t.getSubviewEntity(s)), s++
								}
								this._updateViewport(e.viewport)
							}, e.prototype.requestPresentationMode = function (e)
							{
								return this.sessionService.manager.request("ar.view.desiredViewportMode",
								{
									mode: e
								})
							}, Object.defineProperty(e.prototype, "desiredViewportMode",
							{
								get: function ()
								{
									return this._desiredViewportMode
								},
								set: function (e)
								{
									var t = this;
									this._desiredViewportMode = e, this.sessionService.manager.whenConnected().then(function ()
									{
										t.sessionService.manager.version[0] > 0 && t.sessionService.manager.send("ar.view.desiredViewportMode",
										{
											mode: e
										})
									})
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype._updateViewportMode = function (e)
							{
								this.viewportMode !== e && (this._mode = e, this.viewportModeChangeEvent.raiseEvent(e))
							}, e.prototype.publishEmbeddedViewport = function (e)
							{
								this.sessionService.manager.isConnected && this.sessionService.manager.version[0] >= 1 && this.sessionService.manager.send("ar.view.embeddedViewport",
								{
									viewport: e
								})
							}, e.prototype._updateViewport = function (e)
							{
								var t = JSON.stringify(e);
								this._currentViewportJSON && this._currentViewportJSON === t || (this._currentViewportJSON = t, this._viewport = $t.clone(e, this._viewport), this.viewportChangeEvent.raiseEvent(e))
							}, e.prototype.sendUIEventToSession = function (e, t)
							{
								t && t.isConnected && t.send("ar.view.uievent", e)
							}, e.prototype._watchEmbeddedViewport = function ()
							{
								var e = this,
									t = function () {};
								setInterval(function ()
								{
									e.focusService.hasFocus
								}, 500), "undefined" != typeof window && window.addEventListener && (window.addEventListener("orientationchange", t), window.addEventListener("scroll", t), this.sessionService.manager.closeEvent.addEventListener(function ()
								{
									window.removeEventListener("orientationchange", t), window.removeEventListener("scroll", t)
								}))
							}, e
						}()), Si([H("viewportMode"), _i("design:type", Object), _i("design:paramtypes", [])], bi.prototype, "presentationMode", null), Si([H("viewport"), _i("design:type", Function), _i("design:paramtypes", []), _i("design:returntype", void 0)], bi.prototype, "getViewport", null), Si([H("subviews"), _i("design:type", Function), _i("design:paramtypes", []), _i("design:returntype", void 0)], bi.prototype, "getSubviews", null), Si([H("desiredViewportMode"), _i("design:type", Function), _i("design:paramtypes", [Number]), _i("design:returntype", Object)], bi.prototype, "requestPresentationMode", null), e("ViewService", bi = Si([N, _i("design:paramtypes", ["function" == typeof (ki = void 0 !== Gn && Gn) && ki || Object, "function" == typeof (Bi = void 0 !== vi && vi) && Bi || Object, xi])], bi)), e("ViewServiceProvider", Ci = function ()
						{
							function e(e, t, n, i)
							{
								var r = this;
								this.sessionService = e, this.viewService = t, this.focusServiceProvider = n, this.sessionViewportMode = new WeakMap, this.sessionEmbeddedViewport = new WeakMap, this.forwardedUIEvent = new sn, e.ensureIsRealityManager(), e.connectEvent.addEventListener(function (e)
								{
									r.sessionViewportMode.set(e, e === r.sessionService.manager ? r.viewService.desiredViewportMode : ji.IMMERSIVE), e.on["ar.view.forwardUIEvent"] = function (e)
									{
										r.forwardedUIEvent.raiseEvent(e)
									}, e.on["ar.view.desiredViewportMode"] = function (t)
									{
										var n = t.mode;
										r.sessionViewportMode.set(e, n), r._publishViewportModes()
									}, e.on["ar.view.embeddedViewport"] = function (t)
									{
										r.sessionEmbeddedViewport.set(e, t)
									}, r._publishViewportModes()
								}), n.sessionFocusEvent.addEventListener(function ()
								{
									r._publishViewportModes()
								})
							}
							return e.prototype.sendUIEventToSession = function (e, t)
							{
								t.send("ar.view.uievent", e)
							}, e.prototype._publishViewportModes = function ()
							{
								this.sessionService.manager.send("ar.view.viewportMode",
								{
									mode: this.sessionViewportMode.get(this.sessionService.manager)
								});
								for (var e = 0, t = this.sessionService.managedSessions; e < t.length; e++)
								{
									var n = t[e],
										i = n === this.focusServiceProvider.session ? this.sessionViewportMode.get(n) : ji.IMMERSIVE;
									n.version[0] > 0 && n.send("ar.view.viewportMode",
									{
										mode: i
									})
								}
							}, e
						}()), e("ViewServiceProvider", Ci = Si([N(), _i("design:paramtypes", ["function" == typeof (Fi = void 0 !== Gn && Gn) && Fi || Object, bi, "function" == typeof (Qi = void 0 !== Ai && Ai) && Qi || Object, "function" == typeof (Yi = void 0 !== Ti && Ti) && Yi || Object])], Ci)), "undefined" != typeof document && document.createElement && ((Ri = document.querySelector("meta[name=viewport]")) || (Ri = document.createElement("meta")), Ri.name = "viewport", Ri.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0", document.head.appendChild(Ri), (zi = document.querySelector("meta[name=argon]")) || (zi = document.createElement("meta")), zi.name = "argon", document.head.appendChild(zi), (Pi = document.createElement("style")).type = "text/css", document.head.insertBefore(Pi, document.head.firstChild), (Ui = Pi.sheet).insertRule("\n        #argon {\n            position: fixed;\n            width: 100%;\n            height: 100%;\n            left: 0;\n            bottom: 0;\n            margin: 0;\n            border: 0;\n            padding: 0;\n        }\n    ", Ui.cssRules.length), Ui.insertRule("\n        .argon-view {\n            -webkit-tap-highlight-color: transparent;\n            -webkit-user-select: none;\n            user-select: none;\n        }\n    ", Ui.cssRules.length), Ui.insertRule("\n        .argon-immersive .argon-view {\n            position: fixed !important;\n            width: 100% !important;\n            height: 100% !important;\n            max-width: 100% !important;\n            max-height: 100% !important;\n            left: 0;\n            bottom: 0;\n            margin: 0;\n            border: 0;\n            padding: 0;\n            visibility: visible;\n        }\n    ", Ui.cssRules.length), Ui.insertRule("\n        :not(.argon-reality-manager).argon-immersive body {\n            visibility: hidden;\n        }\n    ", Ui.cssRules.length), Ui.insertRule("\n        .argon-interactive {\n            pointer-events: auto;\n        }\n    ", Ui.cssRules.length)), Gi = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, Vi = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("DeviceStableState", qi = function ()
						{
							function e()
							{
								this.suggestedGeolocationSubscription = void 0, this.userTracking = "none", this.displayMode = "other", this.isPresentingHMD = !1, this.isPresentingRealityHMD = !1, this.strict = !1
							}
							return e
						}()), e("DeviceFrameState", Hi = function ()
						{
							function e()
							{
								this._scratchFrustum = new je, this.time = Ie.now(), this.viewport = new en, this.subviews = [
								{
									type: tn.SINGULAR,
									viewport: new $t,
									projectionMatrix: (this._scratchFrustum.near = Xt, this._scratchFrustum.far = Zt, this._scratchFrustum.fov = Oe.PI_OVER_THREE, this._scratchFrustum.aspectRatio = 1, _e.clone(this._scratchFrustum.projectionMatrix))
								}], this.userTracking = "none"
							}
							return e
						}()), e("Device", Wi = function ()
						{
							function e(e, t, n)
							{
								var i = this;
								this.owner = e, this.entityService = t, this.viewItems = n, this.userTracking = "none", this.displayMode = Ln || jn ? "hand" : "other", this.screenOrientation = 0, this.frameState = new Hi, this.frameStateEvent = new sn, this.vrDisplaysUpdatedEvent = new sn, this.vrDisplayChangeEvent = new sn, this.userTrackingChangeEvent = new sn, this.displayModeChangeEvent = new sn, this.screenOrientationChangeEvent = new sn, this.suggestedGeolocationSubscriptionChangeEvent = new sn, this.deviceGeolocation = new ve(
								{
									id: "ar.device-geolocation",
									position: new Qt(void 0, Pe.FIXED),
									orientation: new Yt(void 0)
								}), this.deviceOrientation = new ve(
								{
									id: "ar.device-orientation",
									position: new Qt(se.ZERO, this.deviceGeolocation),
									orientation: new Yt(void 0)
								}), this.origin = new ve(
								{
									id: "ar.device.origin",
									name: "Device Origin",
									position: new Qt(void 0, this.deviceGeolocation),
									orientation: new Yt(void 0)
								}), this.stage = new ve(
								{
									id: "ar.device.stage",
									name: "Device Stage",
									position: new Qt(void 0, this.deviceGeolocation),
									orientation: new Yt(void 0)
								}), this.user = new ve(
								{
									id: "ar.device.user",
									name: "Device User",
									position: new Qt(void 0, this.origin),
									orientation: new Yt(void 0)
								}), this._useWebVR = "undefined" != typeof navigator && navigator.getVRDisplays && navigator.userAgent.indexOf("Argon") > 0 == !1, this._scratchCartesian = new se, this._scratchFrustum = new je, this.naturalUserHeight = Wt, this._running = !1, this._previousNumListeners = 0, this._handleScreenOrientationChange = function ()
								{
									var e, t, n, r = function (e)
										{
											clearInterval(o), clearTimeout(s), i.screenOrientationChangeEvent.raiseEvent(void 0)
										},
										o = setInterval(function ()
										{
											window.innerWidth === e && window.innerHeight === t ? 100 === ++n && r() : (e = window.innerWidth, t = window.innerHeight, n = 0)
										}),
										s = setTimeout(function ()
										{
											r()
										}, 1e3)
								}, this._handleVRDisplayPresentChange = function (e)
								{
									var t = e.display || e.detail.vrdisplay || e.detail.display;
									if (t && t === i.vrDisplay)
									{
										var n = t.isPresenting ? "head" : t.capabilities.hasOrientation ? "hand" : "other";
										n !== i.displayMode && (i.displayMode = n, i.displayModeChangeEvent.raiseEvent(void 0))
									}
								}, this._onUpdateFrameState = function ()
								{
									var e = i.frameState;
									Ie.now(e.time), e.strict = i.strict;
									try
									{
										i.onUpdateFrameState(), i.frameStateEvent.raiseEvent(e)
									}
									catch (e)
									{
										i.owner.manager.sendError(e), i.owner.errorEvent.raiseEvent(e)
									}
									i.frameStateEvent.numberOfListeners > 0 ? i.requestAnimationFrame(i._onUpdateFrameState) : i._running = !1
								}, this._scratchQuaternion = new Re, this._scratchQuaternion2 = new Re, this._scratchMatrix3 = new Se, this._scratchMatrix4 = new _e, this._defaultLeftBounds = [0, 0, .5, 1], this._defaultRightBounds = [.5, 0, .5, 1], this._sittingSpace = new ve(
								{
									position: new Qt,
									orientation: new Yt
								}), this._negX90 = Re.fromAxisAngle(se.UNIT_X, -Oe.PI_OVER_TWO), this.requestAnimationFrame = function (e)
								{
									return i.vrDisplay && i.vrDisplay.isPresenting ? i.vrDisplay.requestAnimationFrame(e) : bn(e)
								}, this.cancelAnimationFrame = function (e)
								{
									i.vrDisplay ? i.vrDisplay.cancelAnimationFrame(e) : Cn(e)
								}, this._scratchGeolocationCartesian = new se, this._scratchGeolocationMatrix4 = new _e, this._srcatchGeolocationMatrix3 = new Se, this._scratchGeolocationQuaternion = new Re, this._eastUpSouthToFixedFrame = vn, this._scratchCartographic = new ue;
								var r = this.frameStateEvent.addEventListener.bind(this.frameStateEvent);
								this.frameStateEvent.addEventListener = function (e)
								{
									var t = r(e);
									return i._checkFrameStateListeners(), t
								};
								var o = this.frameStateEvent.removeEventListener.bind(this.frameStateEvent);
								this.frameStateEvent.removeEventListener = function (e)
								{
									var t = o(e);
									return i._checkFrameStateListeners(), t
								}, e.isRealityManager && (this.entityService.subscribedEvent.addEventListener(function (e)
								{
									"ar.origin" !== e.id && "ar.stage" !== e.id || (i.suggestedGeolocationSubscription = e.options ||
									{}, i.suggestedGeolocationSubscriptionChangeEvent.raiseEvent(void 0))
								}), this.entityService.unsubscribedEvent.addEventListener(function (e)
								{
									"ar.origin" !== e.id && "ar.stage" !== e.id || (i.suggestedGeolocationSubscription = void 0, i.suggestedGeolocationSubscriptionChangeEvent.raiseEvent(void 0))
								}))
							}
							return e.prototype.getSubviewEntity = function (e)
							{
								var t = this.entityService.collection.getOrCreateEntity("ar.device.view_" + e);
								return t.position || (t.position = new Qt(se.ZERO, this.user)), t.orientation || (t.orientation = new Yt(Re.IDENTITY)), t
							}, Object.defineProperty(e.prototype, "strict",
							{
								get: function ()
								{
									return !(!this._overrideState || !this._overrideState.strict) || "head" === this.displayMode && !this._hasPolyfillWebVRDisplay()
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "suggestedUserHeight",
							{
								get: function ()
								{
									return "head" === this.displayMode ? this.naturalUserHeight : .75 * this.naturalUserHeight
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "hasSeparateRealityLayer",
							{
								get: function ()
								{
									return this.vrDisplay && !!this.vrDisplay.displayName.match(/polyfill/g) || void 0 === this.vrDisplay
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype._checkFrameStateListeners = function ()
							{
								var e = this.frameStateEvent.numberOfListeners,
									t = this._previousNumListeners;
								if (this._previousNumListeners = e, "undefined" != typeof window && window.addEventListener)
								{
									if (0 === t && 1 === e) this._useWebVR ? this._selectVRDisplay() : (this.userTracking = Ln || jn ? "3DOF" : "none", this.userTrackingChangeEvent.raiseEvent(void 0)), window.addEventListener("orientationchange", this._handleScreenOrientationChange), window.addEventListener("vrdisplaypresentchange", this._handleVRDisplayPresentChange), this.requestAnimationFrame(this._onUpdateFrameState);
									else if (1 === t && 0 === e)
									{
										var n = this.vrDisplay;
										n && (n.isPresenting && n.exitPresent(), this.vrDisplay = void 0, this.vrDisplayChangeEvent.raiseEvent(void 0), this.userTracking = "none", this.userTrackingChangeEvent.raiseEvent(void 0)), window.removeEventListener("orientationchange", this._handleScreenOrientationChange), window.removeEventListener("vrdisplaypresentchange", this._handleVRDisplayPresentChange)
									}
								}
								else 0 !== t || 1 !== e || this._running || (this._running = !0, this.requestAnimationFrame(this._onUpdateFrameState))
							}, e.prototype._selectVRDisplay = function ()
							{
								var e = this;
								navigator.getVRDisplays().then(function (t)
								{
									e.vrDisplays = t;
									var n = e.vrDisplay = t[0];
									n && (e.userTracking = n.capabilities.hasPosition && n.capabilities.hasOrientation ? "6DOF" : "3DOF", e.vrDisplaysUpdatedEvent.raiseEvent(void 0), e.vrDisplayChangeEvent.raiseEvent(void 0), e.userTrackingChangeEvent.raiseEvent(void 0))
								})
							}, e.prototype.onUpdateFrameState = function ()
							{
								this._updateViewport();
								var e = this.vrDisplay;
								e && e.isPresenting || e && !e.capabilities.hasExternalDisplay && !e.capabilities.canPresent && -1 === e.displayName.indexOf("polyfill") ? this._updateForWebVR() : this._updateDefault()
							}, e.prototype._updateViewport = function ()
							{
								var e = this._overrideState,
									t = this.frameState,
									n = t.viewport;
								if (e && e.viewport) en.clone(e.viewport, n);
								else
								{
									var i = this.viewItems.element;
									n.x = 0, n.y = 0, n.width = i && i.clientWidth || 0, n.height = i && i.clientHeight || 0;
									var r = this.vrDisplay;
									if (r && r.isPresenting)
									{
										var o = r.getEyeParameters("left"),
											s = r.getEyeParameters("right"),
											a = t.viewport;
										a.renderWidthScaleFactor = 2 * Math.max(o.renderWidth, s.renderWidth) / a.width, a.renderHeightScaleFactor = Math.max(o.renderHeight, s.renderHeight) / a.height
									}
									else n.renderHeightScaleFactor = 1, n.renderWidthScaleFactor = 1
								}
							}, e.prototype._updateDefault = function ()
							{
								this._updateDefaultStage(), this._updateDefaultUser(), this._updateDefaultOrigin();
								var e = this._overrideState,
									t = this.frameState,
									n = t.viewport;
								e && e.viewport && en.clone(e.viewport, n);
								var i = t.subviews;
								if (e && e.subviews) on.clone(e.subviews, i);
								else
								{
									i.length = 1;
									var r = i[0] ||
									{};
									r.type = tn.SINGULAR, r.viewport.x = 0, r.viewport.y = 0, r.viewport.width = n.width, r.viewport.height = n.height;
									var o = n.width / n.height,
										s = this._scratchFrustum;
									s.near = Xt, s.far = Zt, s.fov = Oe.PI_OVER_THREE, s.aspectRatio = isFinite(o) && 0 !== o ? o : 1, r.projectionMatrix = _e.clone(s.projectionMatrix, r.projectionMatrix);
									var a = this.getSubviewEntity(0);
									a.position.setValue(se.ZERO, this.user), a.orientation.setValue(Re.IDENTITY)
								}
							}, e.prototype._updateDefaultStage = function ()
							{
								var e = this.stage,
									t = this._contextFrameState;
								t && e.id in t.entities || (e.position.setValue(se.fromElements(0, -this.suggestedUserHeight, 0, this._scratchCartesian), this.deviceGeolocation), e.orientation.setValue(Re.IDENTITY))
							}, e.prototype._updateDefaultUser = function ()
							{
								var e = this.user;
								this._tryOrientationUpdates();
								var t = this._contextFrameState;
								if (!(t && e.id in t.entities))
								{
									var n = Re.fromAxisAngle(se.UNIT_Z, this.screenOrientationDegrees * Oe.RADIANS_PER_DEGREE, this._scratchQuaternion);
									e.position.setValue(se.ZERO, this.deviceOrientation), e.orientation.setValue(n)
								}
							}, e.prototype._updateDefaultOrigin = function ()
							{
								var e = this.origin,
									t = this.deviceGeolocation,
									n = this._contextFrameState;
								if (!(n && e.id in n.entities))
								{
									var i = this.frameState.time,
										r = this.entityService.getEntityPose(e, t, i),
										o = this.entityService.getEntityPose(t, Pe.FIXED, i);
									if (0 == (r.status & li.KNOWN) && o.status & li.KNOWN || e.position.referenceFrame !== Pe.FIXED && o.status & li.KNOWN || r.status & li.KNOWN && o.status & li.KNOWN && se.magnitudeSquared(r.position) > 1e4) return e.position.setValue(o.position, Pe.FIXED), e.orientation.setValue(o.orientation), void console.log("Updated device origin to " + JSON.stringify(o.position) + " at FIXED");
									0 == (o.status & li.KNOWN) && (e.position.setValue(se.ZERO, t), e.orientation.setValue(Re.IDENTITY))
								}
							}, e.prototype._updateForWebVR = function ()
							{
								var e = this.vrDisplay;
								if (!e) throw new Error("No vr display!");
								var t = this.frameState,
									n = this._vrFrameData = this._vrFrameData || new VRFrameData;
								e.getFrameData(n);
								var i = e.getLayers()[0],
									r = i && i.leftBounds,
									o = i && i.rightBounds;
								i ? (r = i.leftBounds && 4 === i.leftBounds.length ? i.leftBounds : this._defaultLeftBounds, o = i.rightBounds && 4 === i.rightBounds.length ? i.rightBounds : this._defaultRightBounds) : (r = this._defaultLeftBounds, o = this._defaultRightBounds);
								var s = t.viewport,
									a = t.subviews = t.subviews || [];
								a.length = 2;
								var u = a[0] = a[0] ||
									{},
									c = a[1] = a[1] ||
									{};
								u.type = tn.LEFTEYE, c.type = tn.RIGHTEYE;
								var l = u.viewport = u.viewport ||
								{};
								l.x = r[0] * s.width, l.y = r[1] * s.height, l.width = r[2] * s.width, l.height = r[3] * s.height;
								var h = c.viewport = c.viewport ||
								{};
								h.x = o[0] * s.width, h.y = o[1] * s.height, h.width = o[2] * s.width, h.height = o[3] * s.height, u.projectionMatrix = _e.clone(n.leftProjectionMatrix, u.projectionMatrix), c.projectionMatrix = _e.clone(n.rightProjectionMatrix, c.projectionMatrix);
								var d = this.user;
								this._sittingSpace.position.setValue(se.ZERO, this.deviceGeolocation), this._sittingSpace.orientation.setValue(Re.IDENTITY);
								var f = e.stageParameters ? e.stageParameters.sittingToStandingTransform : _e.IDENTITY,
									p = _e.inverseTransformation(f, this._scratchMatrix4),
									g = _e.getTranslation(p, this._scratchCartesian),
									y = _e.getRotation(p, this._scratchMatrix3),
									M = Re.fromRotationMatrix(y, this._scratchQuaternion);
								this.stage.position.setValue(g, this._sittingSpace), this.stage.orientation.setValue(M), this.origin.position.setValue(se.ZERO, this.stage), this.origin.orientation.setValue(Re.IDENTITY);
								var v = e.capabilities.hasPosition ? n.pose.position ? se.unpack(n.pose.position, 0, this._scratchCartesian) : void 0 : se.ZERO,
									A = n.pose.orientation ? Re.unpack(n.pose.orientation, 0, this._scratchQuaternion2) : void 0;
								d.position.setValue(v, this._sittingSpace), d.orientation.setValue(A);
								var E = _e.inverseTransformation(n.leftViewMatrix, this._scratchMatrix4),
									m = this.getSubviewEntity(0),
									w = _e.getTranslation(E, this._scratchCartesian),
									N = _e.getRotation(E, this._scratchMatrix3),
									D = Re.fromRotationMatrix(N, this._scratchQuaternion);
								m.position.setValue(w, this._sittingSpace), m.orientation.setValue(D);
								var T = _e.inverseTransformation(n.rightViewMatrix, this._scratchMatrix4),
									I = this.getSubviewEntity(1),
									O = _e.getTranslation(T, this._scratchCartesian),
									S = _e.getRotation(T, this._scratchMatrix3),
									_ = Re.fromRotationMatrix(S, this._scratchQuaternion);
								if (I.position.setValue(O, this._sittingSpace), I.orientation.setValue(_), e.displayName.includes("polyfill"))
								{
									var L = this.entityService.getEntityPose(m, d, t.time),
										j = this.entityService.getEntityPose(I, d, t.time);
									return m.position.setValue(L.position, d), I.position.setValue(j.position, d), m.orientation.setValue(L.orientation), I.orientation.setValue(j.orientation), this._updateDefaultStage(), void this._updateDefaultUser()
								}
							}, e.prototype._tryOrientationUpdates = function ()
							{
								var e = this;
								if ("undefined" != typeof window && window.addEventListener && !ge(this._deviceOrientationListener))
								{
									var t = void 0;
									this._deviceOrientationListener = function (n)
									{
										var i = n.alpha,
											r = n.webkitCompassHeading,
											o = +n.webkitCompassAccuracy;
										if (ge(i) && (n.absolute && (t = 0), e._deviceOrientationHeadingAccuracy = o > 0 ? o : void 0, (!ge(t) || Math.abs(0) > 5) && ge(r) && o >= 0 && o < 80 && r >= 0 && (ge(t) ? t -= 0 : t = -r), ge(t) && ge(n.alpha) && ge(n.beta) && ge(n.gamma)))
										{
											var s = Oe.RADIANS_PER_DEGREE * (n.alpha + t || -r || 0),
												a = Oe.RADIANS_PER_DEGREE * n.beta,
												u = Oe.RADIANS_PER_DEGREE * n.gamma,
												c = Re.fromAxisAngle(se.UNIT_Z, s, e._scratchQuaternion),
												l = Re.fromAxisAngle(se.UNIT_X, a, e._scratchQuaternion2),
												h = Re.multiply(c, l, e._scratchQuaternion),
												d = Re.fromAxisAngle(se.UNIT_Y, u, e._scratchQuaternion2),
												f = Re.multiply(h, d, e._scratchQuaternion),
												p = Re.multiply(e._negX90, f, e._scratchQuaternion2);
											e.deviceOrientation.orientation.setValue(p), e.deviceOrientation.meta = e.deviceOrientation.meta ||
											{}, e.deviceOrientation.meta.geoHeadingAccuracy = o || void 0
										}
									}, "ondeviceorientationabsolute" in window ? window.addEventListener("deviceorientationabsolute", this._deviceOrientationListener) : "ondeviceorientation" in window && window.addEventListener("deviceorientation", this._deviceOrientationListener)
								}
							}, e.prototype._hasPolyfillWebVRDisplay = function ()
							{
								return !!this.vrDisplay && !!this.vrDisplay.displayName.match(/polyfill/g)
							}, Object.defineProperty(e.prototype, "screenOrientationDegrees",
							{
								get: function ()
								{
									return "undefined" != typeof window ? screen.orientation && -screen.orientation.angle || -window.orientation || 0 : 0
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.requestHeadDisplayMode = function ()
							{
								var e = this.vrDisplay,
									t = this.viewItems.element,
									n = this.viewItems.layers;
								if (!t) return Promise.reject(new Error("A DOM element is required"));
								if (!e || !e.capabilities.canPresent) return Promise.reject(new Error("Display mode 'head' is not supported"));
								var i = [
								{
									source: n && n[0] && n[0].source || t.querySelector("canvas") || t.lastElementChild
								}];
								return e.requestPresent(i)
							}, e.prototype.exitHeadDisplayMode = function ()
							{
								return this.vrDisplay && this.vrDisplay.isPresenting ? this.vrDisplay.exitPresent() : Promise.reject(new Error("Display is not currently in 'head' mode"))
							}, e.prototype._setState = function (e)
							{
								this._overrideState = e, this.userTracking !== e.userTracking && (this.userTracking = e.userTracking, this.userTrackingChangeEvent.raiseEvent(void 0)), this.displayMode !== e.displayMode && (this.displayMode = e.displayMode, this.displayModeChangeEvent.raiseEvent(void 0)), b(this.suggestedGeolocationSubscription, e.suggestedGeolocationSubscription) || (this.suggestedGeolocationSubscription = e.suggestedGeolocationSubscription, this.suggestedGeolocationSubscriptionChangeEvent.raiseEvent(void 0))
							}, e.prototype.onGeolocationUpdate = function (e, t, n)
							{
								var i = this;
								if (ge(n) || 0 !== e.height)
								{
									var r = this.deviceGeolocation,
										o = se.fromRadians(e.longitude, e.latitude, e.height, void 0, this._scratchGeolocationCartesian),
										s = this._eastUpSouthToFixedFrame(o, void 0, this._scratchGeolocationMatrix4),
										a = _e.getRotation(s, this._srcatchGeolocationMatrix3),
										u = Re.fromRotationMatrix(a, this._scratchGeolocationQuaternion);
									r.position.setValue(o, Pe.FIXED), r.orientation.setValue(u);
									var c = r.meta = r.meta ||
									{};
									c.geoHorizontalAccuracy = t, c.geoVerticalAccuracy = n
								}
								else W(e).then(function ()
								{
									return i.onGeolocationUpdate(e, t, 0)
								})
							}, e.prototype.startGeolocationUpdates = function (e)
							{
								var t = this;
								if ("undefined" == typeof navigator || !navigator.geolocation) throw new Error("Unable to start geolocation updates");
								ge(this._geolocationWatchId) || (this._geolocationWatchId = navigator.geolocation.watchPosition(function (e)
								{
									var n = e.coords.longitude,
										i = e.coords.latitude,
										r = e.coords.altitude,
										o = ue.fromDegrees(n, i, r || 0, t._scratchCartographic);
									t.onGeolocationUpdate(o, e.coords.accuracy > 0 ? e.coords.accuracy : void 0, e.coords.altitudeAccuracy || void 0)
								}, function (e)
								{
									console.warn("Unable to start geolocation updates: " + e.message)
								}, e))
							}, e.prototype.stopGeolocationUpdates = function ()
							{
								"undefined" != typeof navigator && ge(this._geolocationWatchId) && (navigator.geolocation.clearWatch(this._geolocationWatchId), this._geolocationWatchId = void 0)
							}, e
						}()), e("Device", Wi = Gi([N, Vi("design:paramtypes", ["function" == typeof (Ki = void 0 !== Gn && Gn) && Ki || Object, "function" == typeof (Ji = void 0 !== hi && hi) && Ji || Object, "function" == typeof ($i = void 0 !== xi && xi) && $i || Object])], Wi)), e("DeviceService", Xi = function ()
						{
							function e(e, t, n, i)
							{
								var r = this;
								this.sessionService = e, this.entityService = t, this.viewService = n, this._device = i, this.autoSubmitFrame = !0, this.frameState = this._device.frameState, this.frameStateEvent = new sn, this.presentHMDChangeEvent = this._device.displayModeChangeEvent, this.vrDisplayChangeEvent = this._device.vrDisplayChangeEvent, this.displayModeChangeEvent = this._device.displayModeChangeEvent, this.screenOrientationChangeEvent = this._device.screenOrientationChangeEvent, this.userTrackingChangeEvent = this._device.userTrackingChangeEvent, this.vrDisplaysUpdatedEvent = this._device.vrDisplaysUpdatedEvent, this.stage = this._device.stage, this.origin = this._device.origin, this.user = this._device.user, this.suggestedGeolocationSubscriptionChangeEvent = this._device.suggestedGeolocationSubscriptionChangeEvent, this.requestAnimationFrame = this._device.requestAnimationFrame.bind(this._device), this.cancelAnimationFrame = this._device.cancelAnimationFrame.bind(this._device), this._onDeviceFrameEvent = function ()
								{
									r.frameStateEvent.raiseEvent(r._device.frameState)
								}, this.getSubviewEntity = this._device.getSubviewEntity.bind(this._device), this.entityService.collection.add(this.stage), this.entityService.collection.add(this.origin), this.entityService.collection.add(this.user), this.entityService.collection.add(this._device.deviceGeolocation), this.entityService.collection.add(this._device.deviceOrientation), this._startUpdates(), this.sessionService.manager.closeEvent.addEventListener(function ()
								{
									return r._stopUpdates()
								}), this.sessionService.isRealityManager || (e.manager.on["ar.device.state"] = e.manager.on["ar.device.frameState"] = function (e)
								{
									r._device.owner === r.sessionService && r._device._setState(e)
								})
							}
							return Object.defineProperty(e.prototype, "vrDisplay",
							{
								get: function ()
								{
									return this._device.vrDisplay
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "vrDisplays",
							{
								get: function ()
								{
									return this._device.vrDisplays
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "displayMode",
							{
								get: function ()
								{
									return this._device.displayMode
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "screenOrientationDegrees",
							{
								get: function ()
								{
									return this._device.screenOrientationDegrees
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "userTracking",
							{
								get: function ()
								{
									return this._device.userTracking
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoHeadingAccuracy",
							{
								get: function ()
								{
									return this.stage.meta ? this.stage.meta.geoHeadingAccuracy : void 0
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoHorizontalAccuracy",
							{
								get: function ()
								{
									return this.stage.meta ? this.stage.meta.geoHorizontalAccuracy : void 0
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoVerticalAccuracy",
							{
								get: function ()
								{
									return this.stage.meta ? this.stage.meta.geoVerticalAccuracy : void 0
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "suggestedGeolocationSubscription",
							{
								get: function ()
								{
									return this._device.suggestedGeolocationSubscription
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "suggestedUserHeight",
							{
								get: function ()
								{
									return this._device.suggestedUserHeight
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "strict",
							{
								get: function ()
								{
									return this._device.strict
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype._processContextFrameState = function (e)
							{
								this._device._contextFrameState = e
							}, e.prototype._startUpdates = function ()
							{
								var e = this;
								this.sessionService.manager.whenConnected().then(function ()
								{
									e.sessionService.manager.version[0] > 0 && e.sessionService.manager.send("ar.device.startUpdates")
								}), this._device.frameStateEvent.addEventListener(this._onDeviceFrameEvent)
							}, e.prototype._stopUpdates = function ()
							{
								var e = this;
								this.sessionService.manager.whenConnected().then(function ()
								{
									e.sessionService.manager.version[0] > 0 && e.sessionService.manager.send("ar.device.stopUpdates")
								}), this._device.frameStateEvent.removeEventListener(this._onDeviceFrameEvent)
							}, e.prototype.onRequestPresentHMD = function ()
							{
								return this._device.requestHeadDisplayMode()
							}, e.prototype.onExitPresentHMD = function ()
							{
								return this._device.exitHeadDisplayMode()
							}, e.prototype.createContextFrameState = function (e, t, n, i)
							{
								return ns.instance.context.createFrameState(e, t, n, i)
							}, e.prototype.subscribeGeolocation = function (e, t)
							{
								var n = this;
								return void 0 === t && (t = this.sessionService.manager), this.sessionService.manager.whenConnected().then(function ()
								{
									return n.sessionService.manager.versionNumber >= 1.4 ? n.entityService.subscribe(n.origin.id, e).then(function () {}) : n.entityService.subscribe(n.stage.id, e).then(function () {})
								})
							}, e.prototype.unsubscribeGeolocation = function (e)
							{
								var t = this;
								void 0 === e && (e = this.sessionService.manager), this.sessionService.manager.whenConnected().then(function ()
								{
									t.sessionService.manager.versionNumber >= 1.4 ? t.entityService.unsubscribe(t.origin.id) : t.entityService.unsubscribe(t.stage.id)
								})
							}, Object.defineProperty(e.prototype, "isPresentingHMD",
							{
								get: function ()
								{
									return "head" === this._device.displayMode
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isPresentingRealityHMD",
							{
								get: function ()
								{
									return "head" === this._device.displayMode && this._device.hasSeparateRealityLayer
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "hasSeparateRealityLayer",
							{
								get: function ()
								{
									return this._device.hasSeparateRealityLayer
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.requestPresentHMD = function ()
							{
								if (!this.sessionService.manager.isConnected) throw new Error("Session must be connected");
								return this.sessionService.isRealityManager ? this.onRequestPresentHMD() : this.sessionService.manager.request("ar.device.requestPresentHMD")
							}, e.prototype.exitPresentHMD = function ()
							{
								if (!this.sessionService.manager.isConnected) throw new Error("Session must be connected");
								return this.sessionService.isRealityManager ? this.onExitPresentHMD() : this.sessionService.manager.request("ar.device.exitPresentHMD")
							}, e
						}()), Gi([H(), Vi("design:type", Function), Vi("design:paramtypes", ["function" == typeof (er = void 0 !== Ie && Ie) && er || Object, "function" == typeof (tr = void 0 !== en && en) && tr || Object, "function" == typeof (nr = void 0 !== on && on) && nr || Object, Object]), Vi("design:returntype", Object)], Xi.prototype, "createContextFrameState", null), e("DeviceService", Xi = Gi([A(!0), Vi("design:paramtypes", ["function" == typeof (ir = void 0 !== Gn && Gn) && ir || Object, "function" == typeof (rr = void 0 !== hi && hi) && rr || Object, "function" == typeof (or = void 0 !== bi && bi) && or || Object, Wi])], Xi)), e("DeviceServiceProvider", Zi = function ()
						{
							function e(e, t, n, i, r, o, s)
							{
								var a = this;
								this.sessionService = e, this.deviceService = t, this.viewService = n, this.entityService = i, this.entityServiceProvider = r, this.visibilityServiceProvider = o, this.device = s, this.needsPublish = !1, this._stableState = new qi, this._targetGeolocationOptions = {}, this._sessionGeolocationOptions = new Map, this.sessionService.connectEvent.addEventListener(function (e)
								{
									e.on["ar.device.requestFrameState"] = function () {}, e.on["ar.device.startUpdates"] = function () {}, e.on["ar.device.stopUpdates"] = function () {}, e.on["ar.device.setGeolocationOptions"] = function (t)
									{
										var n = t.options;
										a._sessionGeolocationOptions.set(e, n), a._checkDeviceGeolocationSubscribers()
									}, e.on["ar.device.requestPresentHMD"] = function ()
									{
										return a.handleRequestPresentHMD(e)
									}, e.on["ar.device.exitPresentHMD"] = function ()
									{
										return a.handleExitPresentHMD(e)
									}, e.closeEvent.addEventListener(function ()
									{
										a._sessionGeolocationOptions.has(e) && (a._sessionGeolocationOptions.delete(e), a._checkDeviceGeolocationSubscribers())
									}), a.needsPublish = !0
								}), this.entityServiceProvider.sessionSubscribedEvent.addEventListener(function (e)
								{
									var t = e.id,
										n = e.options,
										i = e.session;
									a.deviceService.origin.id === t && (a._sessionGeolocationOptions.set(i, n), a._checkDeviceGeolocationSubscribers())
								}), this.entityServiceProvider.sessionUnsubscribedEvent.addEventListener(function (e)
								{
									var t = e.id;
									a.deviceService.origin.id === t && a._checkDeviceGeolocationSubscribers()
								});
								var u = function ()
								{
									return a.needsPublish = !0
								};
								this.deviceService.suggestedGeolocationSubscriptionChangeEvent.addEventListener(u), this.deviceService.screenOrientationChangeEvent.addEventListener(u), this.deviceService.userTrackingChangeEvent.addEventListener(u), this.deviceService.displayModeChangeEvent.addEventListener(u), this.viewService.viewportChangeEvent.addEventListener(u), this.viewService.viewportModeChangeEvent.addEventListener(u);
								var c = this.viewService.viewportMode;
								this.deviceService.displayModeChangeEvent.addEventListener(function ()
								{
									if ("head" === a.deviceService.displayMode)
									{
										var e = a.deviceService.vrDisplay;
										e && e.displayName.match(/polyfill/g) && ((r = (i = (t = n.layers) && t[0]) && i.source) && r.classList.add("argon-interactive"), c = n.viewportMode, n.desiredViewportMode = ji.IMMERSIVE)
									}
									else
									{
										var t = n.layers,
											i = t && t[0],
											r = i && i.source;
										r && r.classList.remove("argon-interactive"), n.desiredViewportMode = c
									}
								}), this.deviceService.frameStateEvent.addEventListener(function (e)
								{
									if (a.needsPublish || a._stableState.isPresentingHMD !== a.deviceService.isPresentingHMD || a._stableState.isPresentingRealityHMD !== a.deviceService.isPresentingRealityHMD || !1 === en.equals(a._stableState.viewport, e.viewport)) a.needsPublish = !0;
									else if (a._stableState.subviews)
										if (a._stableState.subviews.length === e.subviews.length)
										{
											for (var t = 0; t < e.subviews.length; t++)
												if (!rn.equals(e.subviews[t], a._stableState.subviews[t]))
												{
													a.needsPublish = !0;
													break
												}
										}
									else a.needsPublish = !0;
									a.needsPublish && a.publishStableState()
								}), this.viewService.viewportModeChangeEvent.addEventListener(function (e)
								{
									e === ji.PAGE && a.deviceService.vrDisplay && a.deviceService.vrDisplay.displayName.match(/polyfill/g) && "head" === a.deviceService.displayMode && a.deviceService.exitPresentHMD()
								})
							}
							return e.prototype.handleRequestPresentHMD = function (e)
							{
								return this.deviceService.requestPresentHMD()
							}, e.prototype.handleExitPresentHMD = function (e)
							{
								return this.deviceService.exitPresentHMD()
							}, e.prototype.publishStableState = function ()
							{
								var e = this._stableState;
								e.isPresentingHMD = this.deviceService.isPresentingHMD, e.isPresentingRealityHMD = this.deviceService.isPresentingRealityHMD, e.suggestedGeolocationSubscription = this.deviceService.suggestedGeolocationSubscription, e.strict = this.deviceService.strict, e.viewport = en.clone(this.deviceService.frameState.viewport, e.viewport), e.subviews = on.clone(this.deviceService.frameState.subviews, e.subviews), e.displayMode = this.deviceService.displayMode, e.userTracking = this.deviceService.userTracking, this.onUpdateStableState(this._stableState);
								for (var t = 0, n = this.sessionService.managedSessions; t < n.length; t++)
								{
									var i = n[t];
									i.version[0] > 0 && i !== this.sessionService.manager && this.visibilityServiceProvider.visibleSessions.has(i) && i.send("ar.device.state", e)
								}
								this.needsPublish = !1
							}, e.prototype.onUpdateStableState = function (e) {}, e.prototype._checkDeviceGeolocationSubscribers = function ()
							{
								var e = this.entityServiceProvider.subscribersByEntity.get(this.deviceService.origin.id);
								if (e && e.size > 0)
								{
									var t = {};
									this._sessionGeolocationOptions.forEach(function (e, n)
									{
										t.enableHighAccuracy = t.enableHighAccuracy || e && e.enableHighAccuracy || !1
									}), this._targetGeolocationOptions.enableHighAccuracy !== t.enableHighAccuracy && (this._targetGeolocationOptions = t), JSON.stringify(this._targetGeolocationOptions) !== JSON.stringify(this._currentGeolocationOptions) && (this._currentGeolocationOptions = this._targetGeolocationOptions, this.device.stopGeolocationUpdates(), this.device.startGeolocationUpdates(this._targetGeolocationOptions))
								}
								else this.device.stopGeolocationUpdates(), this._currentGeolocationOptions = void 0;
								this.needsPublish = !0
							}, e
						}()), e("DeviceServiceProvider", Zi = Gi([N(), Vi("design:paramtypes", ["function" == typeof (sr = void 0 !== Gn && Gn) && sr || Object, Xi, "function" == typeof (ar = void 0 !== bi && bi) && ar || Object, "function" == typeof (ur = void 0 !== hi && hi) && ur || Object, "function" == typeof (cr = void 0 !== di && di) && cr || Object, "function" == typeof (lr = void 0 !== Ti && Ti) && lr || Object, Wi])], Zi)), e("RealityViewer", hr = function ()
						{
							function e(e)
							{
								var t = this;
								this.uri = e, this.providedReferenceFrames = [], this.connectEvent = new sn, this.presentChangeEvent = new sn, this._isPresenting = !1, this.connectEvent.addEventListener(function (e)
								{
									t._session && t._session.close(), t._session = e, e.closeEvent.addEventListener(function ()
									{
										t._session === e && (t._session = void 0)
									})
								})
							}
							return Object.defineProperty(e.prototype, "isPresenting",
							{
								get: function ()
								{
									return this._isPresenting
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "session",
							{
								get: function ()
								{
									return this._session
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isSharedCanvas",
							{
								get: function ()
								{
									return this._sharedCanvas
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.destroy = function ()
							{
								this.setPresenting(!1), this.session && this.session.close()
							}, e.prototype.setPresenting = function (e)
							{
								this._isPresenting !== e && (this._isPresenting = e, this.presentChangeEvent.raiseEvent(void 0))
							}, e.getType = function (e)
							{
								if (void 0 !== e) return "reality" === e.split(":")[0] ? e : "hosted"
							}, e
						}()), hr.DEFAULT = "reality:default", hr.EMPTY = "reality:empty", hr.LIVE = "reality:live", hr.WEBRTC = "reality:webrtc", hr.TANGO = "reality:tango", dr = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, fr = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("RealityFactory", pr = function ()
						{
							function e()
							{}
							return e
						}()), e("RealityService", gr = function ()
						{
							function e(e)
							{
								var t = this;
								//E: changed getUserMedia into mediaDevices.getUserMedia
								//if (this.sessionService = e, this._connectEvent = new sn, this._sessions = [], this._changeEvent = new sn, this.default = hr.EMPTY, (Ln || jn) && navigator.getUserMedia && navigator.mediaDevices)
								if (this.sessionService = e, this._connectEvent = new sn, this._sessions = [], this._changeEvent = new sn, this.default = hr.EMPTY, (Ln || jn) && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
								{
									var n = null;
									navigator.getVRDisplays && navigator.getVRDisplays().then(function (e)
									{
										if (e && e.length > 0)
											for (var t = 0; !n && t < e.length; t++) "Tango VR Device" !== (n = e[t]).displayName && (n = null)
									}).then(function ()
									{
										t.default = n ? hr.TANGO : hr.WEBRTC
									})
								}
								e.manager.on["ar.reality.connect"] = function (e)
								{
									var n = e.id,
										i = t.sessionService.createSessionPort(n),
										r = t.sessionService.createSynchronousMessageChannel(),
										o = "ar.reality.message.route." + n,
										s = "ar.reality.message.send." + n,
										a = "ar.reality.close." + n;
									r.port1.onmessage = function (e)
									{
										t.sessionService.manager.send(o, e.data)
									}, t.sessionService.manager.on[s] = function (e)
									{
										r.port1.postMessage(e)
									}, t.sessionService.manager.on[a] = function ()
									{
										i.close()
									}, i.connectEvent.addEventListener(function ()
									{
										t.sessions.push(i), t.connectEvent.raiseEvent(i), i.closeEvent.addEventListener(function ()
										{
											var e = t.sessions.indexOf(i);
											t.sessions.splice(e, 1)
										})
									}), t.sessionService.manager.closeEvent.addEventListener(function ()
									{
										i.close(), delete t.sessionService.manager.on[s], delete t.sessionService.manager.on[a]
									}), setTimeout(function ()
									{
										i.open(r.port2, t.sessionService.configuration)
									})
								}
							}
							return Object.defineProperty(e.prototype, "connectEvent",
							{
								get: function ()
								{
									return this._connectEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "sessions",
							{
								get: function ()
								{
									return this._sessions
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "changeEvent",
							{
								get: function ()
								{
									return this._changeEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "current",
							{
								get: function ()
								{
									return this._current
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "isSharedCanvas",
							{
								get: function ()
								{
									return this._sharedCanvas
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype._processContextFrameState = function (e)
							{
								var t = e.reality,
									n = this._current;
								n !== t && (this._current = t, this.changeEvent.raiseEvent(
								{
									previous: n,
									current: t
								}))
							}, e.prototype._publishContextFrameState = function (e)
							{
								var t = this.sessionService;
								if (t.isRealityViewer && t.manager.isConnected)
									if (t.manager.isConnected && 0 === t.manager.version[0])
									{
										var n = e.eye = e.eye ||
										{};
										n.pose = e.entities["ar.user"], n.viewport = $t.clone(e.subviews[0].viewport, n.viewport), delete e.entities["ar.user"], t.manager.send("ar.reality.frameState", e), e.entities["ar.user"] = n.pose
									}
								else t.manager.send("ar.reality.frameState", e)
							}, e.prototype.install = function (e)
							{
								var t = this;
								return this.sessionService.manager.whenConnected().then(function ()
								{
									return t.sessionService.manager.version[0] >= 1 != !0 ? Promise.reject(new Error("Not supported")) : t.sessionService.manager.request("ar.reality.install",
									{
										uri: e
									})
								})
							}, e.prototype.uninstall = function (e)
							{
								var t = this;
								return this.sessionService.manager.whenConnected().then(function ()
								{
									return t.sessionService.manager.version[0] >= 1 != !0 ? Promise.reject(new Error("Not supported")) : t.sessionService.manager.request("ar.reality.uninstall",
									{
										uri: e
									})
								})
							}, e.prototype.request = function (e)
							{
								var t = this;
								return this.sessionService.manager.whenConnected().then(function ()
								{
									return t.sessionService.manager.version[0] >= 1 != !0 ? t.sessionService.manager.request("ar.reality.desired",
									{
										reality:
										{
											uri: e
										}
									}) : t.sessionService.manager.request("ar.reality.request",
									{
										uri: e
									})
								})
							}, e.prototype.setDesired = function (e)
							{
								this.request(e ? e.uri : hr.DEFAULT)
							}, e.prototype.setStageGeolocation = function (e, t)
							{
								return e.supportsProtocol("ar.configureStage") ? e.request("ar.configureStage.setStageGeolocation",
								{
									geolocation: t
								}) : Promise.reject("Protocol `ar.configureStage` is not supported")
							}, e.prototype.resetStageGeolocation = function (e)
							{
								return e.supportsProtocol("ar.configureStage") ? e.request("ar.configureStage.resetStageGeolocation") : Promise.reject("Protocol `ar.configureStage` is not supported")
							}, e
						}()), dr([H("request"), fr("design:type", Function), fr("design:paramtypes", [Object]), fr("design:returntype", void 0)], gr.prototype, "setDesired", null), e("RealityService", gr = dr([N(), fr("design:paramtypes", ["function" == typeof (Mr = void 0 !== Gn && Gn) && Mr || Object])], gr)), e("RealityServiceProvider", yr = function ()
						{
							function e(e, t, n, i, r, o, s, a)
							{
								var u = this;
								this.sessionService = e, this.realityService = t, this.entityService = n, this.deviceService = i, this.viewServiceProvider = r, this.visibilityServiceProvider = o, this.focusServiceProvider = s, this.realityViewerFactory = a, this.installedEvent = new sn, this.uninstalledEvent = new sn, this.presentingRealityViewerChangeEvent = new sn, this.nextFrameStateEvent = new sn, this._viewerByURI = new Map, this._installersByURI = new Map, this._scratchFrustum = new je, e.ensureIsRealityManager(), e.manager.connectEvent.addEventListener(function ()
								{
									setTimeout(function ()
									{
										u.sessionService.manager.isConnected && !u._presentingRealityViewer && u.realityService.default && u._handleRequest(u.sessionService.manager,
										{
											uri: u.realityService.default
										})
									}, 0)
								}), e.manager.closeEvent.addEventListener(function ()
								{
									u._viewerByURI.forEach(function (e)
									{
										e.destroy()
									})
								}), e.connectEvent.addEventListener(function (e)
								{
									Kt.isRealityViewer(e.info.role) || (e.on["ar.reality.install"] = function (t)
									{
										var n = t.uri;
										return u._handleInstall(e, n)
									}, e.on["ar.reality.uninstall"] = function (t)
									{
										var n = t.uri;
										return u._handleUninstall(e, n)
									}, e.on["ar.reality.request"] = function (t)
									{
										return u._handleRequest(e, t)
									}, e.on["ar.reality.desired"] = function (t)
									{
										var n = t.reality;
										if (n && n.type)
										{
											var i = n.type;
											n.uri = n.uri || "reality:" + i, "hosted" === i && (n.uri = n.url)
										}
										u._handleRequest(e,
										{
											uri: n.uri
										})
									})
								}), this.viewServiceProvider.forwardedUIEvent.addEventListener(function (e)
								{
									var t = u._presentingRealityViewer && u._presentingRealityViewer.session;
									t && u.viewServiceProvider.sendUIEventToSession(e, t)
								})
							}
							return Object.defineProperty(e.prototype, "presentingRealityViewer",
							{
								get: function ()
								{
									return this._presentingRealityViewer
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype._handleInstall = function (e, t)
							{
								var n = this,
									i = this._installersByURI.get(t);
								if (i) i.add(e);
								else
								{
									var r = this.realityViewerFactory.createRealityViewer(t);
									this._viewerByURI.set(t, r), (i = new Set).add(e), this._installersByURI.set(t, i), r.connectEvent.addEventListener(function (i)
									{
										if (!Kt.isRealityViewer(i.info.role)) throw i.sendError(
										{
											message: "Expected a reality viewer"
										}), i.close(), new Error('The application "' + i.uri + '" does not support being loaded as a reality viewer');
										if (i.on["ar.reality.frameState"] = function (e)
											{
												if (n._presentingRealityViewer === r)
												{
													if (0 === i.version[0])
													{
														var t = n.deviceService.frameState;
														if (!t) return;
														e.viewport = en.clone(t.viewport, e.viewport), e.subviews = on.clone(t.subviews, e.subviews);
														var o = e.eye,
															s = o.pose,
															a = o.fov;
														e.entities = e.entities ||
														{}, e.entities["ar.user"] = s;
														for (var u = 0, c = e.subviews; u < c.length; u++)
														{
															var l = c[u],
																h = Y(l.projectionMatrix, l.frustum ||
																{});
															h.fov = a, n._scratchFrustum.clone(h), l.projectionMatrix = _e.clone(n._scratchFrustum.projectionMatrix, l.projectionMatrix)
														}
													}
													e.reality = r.uri, n.realityService._sharedCanvas = !(!n.sessionService.configuration.sharedCanvas || !r.session.info.sharedCanvas), r._sharedCanvas = n.realityService._sharedCanvas, n.nextFrameStateEvent.raiseEvent(e)
												}
											}, i.info.supportsCustomProtocols)
										{
											n._connectViewerWithSession(i, n.sessionService.manager);
											for (var o = 0, s = n.sessionService.managedSessions; o < s.length; o++) e = s[o], n._connectViewerWithSession(i, e);
											var a = n.sessionService.connectEvent.addEventListener(function (e)
											{
												e !== n.sessionService.manager && n._connectViewerWithSession(i, e)
											});
											i.closeEvent.addEventListener(function ()
											{
												return a()
											})
										}
										var u = r.presentChangeEvent.addEventListener(function ()
										{
											n.visibilityServiceProvider.set(i, r.isPresenting)
										});
										n.visibilityServiceProvider.set(i, r.isPresenting), console.log("set visibile : " + r.uri), i.closeEvent.addEventListener(function ()
										{
											u(), n.entityService.collection.removeById(i.uri), console.log("Reality session closed: " + t)
										})
									}), this.installedEvent.raiseEvent(
									{
										viewer: r
									}), r.load()
								}
							}, e.prototype._connectViewerWithSession = function (e, t)
							{
								if (!Kt.isRealityViewer(t.info.role))
								{
									var n = O(),
										i = "ar.reality.message.route." + n,
										r = "ar.reality.message.send." + n,
										o = "ar.reality.close." + n;
									e.on[i] = function (e)
									{
										t.send(r, e)
									}, t.on[i] = function (t)
									{
										e.send(r, t)
									}, t.send("ar.reality.connect",
									{
										id: n
									}), e.send("ar.reality.connect",
									{
										id: n
									}), e.closeEvent.addEventListener(function ()
									{
										t.send(o)
									}), t.closeEvent.addEventListener(function ()
									{
										e.send(o)
									})
								}
							}, e.prototype._handleUninstall = function (e, t)
							{
								var n = this._installersByURI.get(t);
								if (!n) return Promise.reject(new Error("Unable to uninstall a reality viewer which is not installed"));
								if (0 === n.size)
								{
									var i = this._viewerByURI.get(t);
									this._viewerByURI.delete(t), i.destroy(), this.uninstalledEvent.raiseEvent(
									{
										viewer: i
									})
								}
							}, e.prototype._handleRequest = function (e, t)
							{
								if (this.focusServiceProvider.session === e || e === this.sessionService.manager)
								{
									var n = t && t.uri || hr.DEFAULT;
									switch (n)
									{
									case hr.DEFAULT:
										n = this.realityService.default
									}
									return this._handleInstall(e, n), this._setPresentingRealityViewer(this._viewerByURI.get(n)), Promise.resolve()
								}
								throw new Error("Request Denied")
							}, e.prototype._setPresentingRealityViewer = function (e)
							{
								if (!e) throw new Error("Invalid State. Expected a RealityViewer instance");
								this._presentingRealityViewer !== e && (this._presentingRealityViewer = e, this.presentingRealityViewerChangeEvent.raiseEvent(
								{
									viewer: e
								}), this._viewerByURI.forEach(function (t)
								{
									t.setPresenting(t === e)
								}), console.log("Presenting reality viewer changed to: " + e.uri))
							}, e.prototype.getViewerByURI = function (e)
							{
								return this._viewerByURI.get(e)
							}, e.prototype.removeInstaller = function (e)
							{
								var t = this;
								this._viewerByURI.forEach(function (n, i, r)
								{
									var o = t._installersByURI.get(i);
									o && o.has(e) && (o.delete(e), 0 === o.size && n.session && (t._handleUninstall(n.session, i), t._installersByURI.delete(i)))
								})
							}, e
						}()), e("RealityServiceProvider", yr = dr([N, fr("design:paramtypes", ["function" == typeof (vr = void 0 !== Gn && Gn) && vr || Object, gr, "function" == typeof (Ar = void 0 !== hi && hi) && Ar || Object, "function" == typeof (Er = void 0 !== Xi && Xi) && Er || Object, "function" == typeof (mr = void 0 !== Ci && Ci) && mr || Object, "function" == typeof (wr = void 0 !== Ti && Ti) && wr || Object, "function" == typeof (Nr = void 0 !== Ai && Ai) && Nr || Object, pr])], yr)), Dr = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, Tr = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, Ir = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='768' height='768'%3E%3Cpath fill='white' d='M448.5 96H672v223.5h-64.5v-114L294 519l-45-45 313.5-313.5h-114V96zm159 511.5V384H672v223.5c0 34.5-30 64.5-64.5 64.5h-447c-36 0-64.5-30-64.5-64.5v-447C96 126 124.5 96 160.5 96H384v64.5H160.5v447h447z'/%3E%3C/svg%3E\")", Or = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cpath fill='white' d='M256 96C144.34 96 47.56 161.02 0 256c47.56 94.98 144.34 160 256 160 111.656 0 208.438-65.02 256-160-47.558-94.98-144.344-160-256-160zm126.225 84.852c30.08 19.187 55.57 44.887 74.717 75.148-19.146 30.26-44.637 55.96-74.718 75.148C344.427 355.258 300.78 368 256 368s-88.43-12.743-126.226-36.852c-30.08-19.186-55.57-44.886-74.716-75.148 19.146-30.262 44.637-55.962 74.717-75.148 1.96-1.25 3.938-2.46 5.93-3.65C130.725 190.866 128 205.612 128 221c0 70.69 57.308 128 128 128s128-57.31 128-128c0-15.387-2.726-30.134-7.704-43.8 1.99 1.19 3.97 2.402 5.93 3.652zM256 208c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48z'/%3E%3C/svg%3E\")", Sr = "url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20245.82%20141.73%22%3E%3Cdefs%3E%3Cstyle%3E.a%7Bfill%3A%23fff%3Bfill-rule%3Aevenodd%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Emask%3C%2Ftitle%3E%3Cpath%20class%3D%22a%22%20d%3D%22M175.56%2C111.37c-22.52%2C0-40.77-18.84-40.77-42.07S153%2C27.24%2C175.56%2C27.24s40.77%2C18.84%2C40.77%2C42.07S198.08%2C111.37%2C175.56%2C111.37ZM26.84%2C69.31c0-23.23%2C18.25-42.07%2C40.77-42.07s40.77%2C18.84%2C40.77%2C42.07-18.26%2C42.07-40.77%2C42.07S26.84%2C92.54%2C26.84%2C69.31ZM27.27%2C0C11.54%2C0%2C0%2C12.34%2C0%2C28.58V110.9c0%2C16.24%2C11.54%2C30.83%2C27.27%2C30.83H99.57c2.17%2C0%2C4.19-1.83%2C5.4-3.7L116.47%2C118a8%2C8%2C0%2C0%2C1%2C12.52-.18l11.51%2C20.34c1.2%2C1.86%2C3.22%2C3.61%2C5.39%2C3.61h72.29c15.74%2C0%2C27.63-14.6%2C27.63-30.83V28.58C245.82%2C12.34%2C233.93%2C0%2C218.19%2C0H27.27Z%22%2F%3E%3C%2Fsvg%3E)", _r = 'url(\'data:image/svg+xml;utf8,<svg width="512" height="512" version="1.1" viewBox="-3 -3 17 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="white" id="Core" transform="translate(-215.000000, -257.000000)"><g id="fullscreen" transform="translate(215.000000, 257.000000)"><path d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z" id="Shape"/></g></g></g></svg>\')', Lr = "url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBYRXhpZgAATU0AKgAAAAgABAExAAIAAAARAAAAPlEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAABBZG9iZSBJbWFnZVJlYWR5AAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCACQAJADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9ObW1tTbW5NrbDMEJwtvCo5jU8KqBVHoFAAHAAFT/AGS1/wCfW3/78x//ABNFp/x6Wv8A17w/+i1qxX/ILOVXnl71T4n1l3/4C+4/1nUNF7vRfZ8vQr/ZLX/n1t/+/Mf/AMTR9ktf+fW3/wC/Mf8A8TViip5qv81T75f10X3D5P7v/kv/AACv9ktf+fW3/wC/Mf8A8TR9ktf+fW3/AO/Mf/xNWKKOar/NU++X9dF9wcn93/yX/gFf7Ja/8+tv/wB+Y/8A4mj7Ja/8+tv/AN+Y/wD4mrFFHNV/mqffL+ui+4OT+7/5L/wCv9ktf+fW3/78x/8AxNH2S1/59bf/AL8x/wDxNWKKOar/ADVPvl/XRfcHJ/d/8l/4BX+yWv8Az62//fmP/wCJo+yWv/Prb/8AfmP/AOJqxRRzVf5qn3y/rovuDk/u/wDkv/AK/wBktf8An1t/+/Mf/wATR9ktf+fW3/78x/8AxNWKKOar/NU++X9dF9wcn93/AMl/4BX+yWv/AD62/wD35j/+Jo+yWv8Az62//fmP/wCJqxRRzVf5qn3y/rovuDk/u/8Akv8AwCv9ktf+fW3/AO/Mf/xNQXVrai2uCLW2OIJjhreFhxGx5VkKsPUMCCOCCKv1Xu/+PS6/695v/RbVVOVT2kNZ/HHrLuv8kJw0fu9H9ny9BLP/AI87T/r2g/8ARS1ZqtZ/8edp/wBe0H/opas1pP45f4pfmzVT0Wj2X5L/AIP9PQoooqR8/k/6/p/09CiiigOfyf8AX9P+noUUUUBz+T/r+n/T0KKKKA5/J/1/T/p6FFFFAc/k/wCv6f8AT0KKKKA5/J/1/T/p6FFFFAc/k/6/p/09Cq15/wAed3/17T/+imqzVa8/487v/r2n/wDRTVdP+JT/AMcf/SkJz0ej2f5f8P8A09Cz/wCPO0/69oP/AEUtWarWf/Hnaf8AXtB/6KWrNKfxy/xS/NmS2XovyCiiipGFfpT8AP2E/C3xX+E3hT4ieLPF/jLQdT8VRX+o2+l6Kuix2cGkLqV3a6RN/wATHSr25eW/sLeDUHczCPbdIqRqFy35v2WmX2t3+naHpkck2pa5qOn6Jp0USl5JL/V7yHTrRUUZLN59zGcAdAT2r+ofwn4dsfCHhfw54U0xdmneGtC0nQbEYx/oukWMFhAWHPztHArOSSWcliSSSf8ARL9nx4C8H+L3E3H+eeIPDuF4l4Y4YyXLctwuX4+WKpYWWf57jZYmji4SwtbD1KtXA5fk+NpSp+1dOnHMqc6lNylQlH8B8e+O834RyvIcHw/mFTLs0zTHYnEVMRRjSnVjgMvoRhUpONanVhGOIxOOoTjLlUm8JNRklzp/n7/w7R+F/wD0Ub4kf99eFv8A5n6/N/8Aac+FFj+z98ZIvhnBqN/qGk614T0nxX4R1fV3tDe6tFNc3+ma3p90bO3tLWK907U9PZ7aNIE8+xvLb70wJf8ApCr8h/8Agrd8Pjf+AfhZ8VLSGJZ/B/i278JavcorLd/2T41tI5dObzFGfJtPEOhWEceXBil1IvGMu5H9ifSo+iB4N5Z4KcU594fcB5bwxxHw7PLs4p5hldTMqmIll9HGUsLmlGpTxWNxFGph6eBxVXHVoOClJYJKFSlO1SP5D4X+LvGOK4zyzAcQZ5XzPLsxjiMG8PiYYWEFiZ0ZVMLOEqNCnONWdejDDwfM1+/1jJaP8x6K4Xwp4r/tPy9M1SQDU1G22uWwqamqjhHPCpqCgHjhbsDcuJQwPdV/hvmOXYrK8VPCYunyVIaxkrunWpttRrUZNLnpzs7OylGSlCcYVIThH+1cPiKWKpRrUZc0Xo09JQkt4TWtpK+q1TTUotxcZMooorhNwooooAKKKKACq15/x53f/XtP/wCimqzVa8/487v/AK9p/wD0U1XT/iU/8cf/AEpCez9H+QWf/Hnaf9e0H/opas1nWf8Ax52n/XtB/wCilqzSn8cv8UvzY42stXsunl6liiq9FSPTu/u/4J9X/sWeCf8AhNv2jfA4mglm0/wdHqfju/aMHbDJoduttojTNghVPiDUtMkUNjeYCFII4/oJr8r/APgmb4JEel/E74lXEDeZqOp6Z4I0i4OQrWejW/8AbGsbB0fzL/VrGF3HAewMf3lYD9TmZUVndlREUszMQqqqjLMzHACqASSSAAMmv+hT9nrwH/qd9HXKM4xFFUsfx9neb8WV3ONq0cFGpDJMqpSl/wA+ZYPKFmFCN3GKzGc9JVJpfwN9IHPP7W8QsTgqc3PD5BgMFlULP3XXnGWYYuVk3apGvjXhqnW+Gin8KOZ8MeMdA8Yf8JD/AGBei9/4RbxRq3g7Wtox9l1/RPs/9pWR5OWtzdQgk7SS3TGCfH/2s/hw/wAWP2cvi74JtoY5tUvvB2o6loIkjDlfEPh0J4h0IxEqzRSvqel20KyphlErc7SwPyN/wTW+LH/CyJ/2qvMlXffftAeIPiRYwMVEn9j/ABBEsVlKqDpF/wAUw0fykojDHG4Fv1AIBBBAIIwQRkEHqCD1Br+jOD88y3xr8Jfr+JWHqZXxtlPEuS4tYW1Si8LPGZtw9ieRTlNc3s6E21KTtUuuh+dZxgcTwXxZ9XpuaxWS4vLMbSc/iVVUcJmNO7SWilUitFsfxZW8wuIILhN6CaOKePqkib1WRDkYKSISDkEFWHHIr2Pwr4tGohNN1WVE1JFxb3TkImpIi/dkY4VL9FXLZIW6UFlxKGDH7QPw9f4UfHT4t/D3yDb2nh7x1rT6NGQFB8N69KviTw2yKOFjXRNYsoFVflUwsikha8V1MkadfsCVZbO6ZWBIZWWF2VlI5DKwDKw5BAI5Ff8APXxlwjKljs34bzin7DM8izPMMrrVIxvVwmYZdiquCxUUnZyp+3w8oVqMuVTjFfw6sKdSn/fWTZqpU8HmGElz4TH0MNiYRv7tbDYmnCtSldXSl7OopQmtYtu6cXKMvteH4cfEm4hiuLb4bfEK5t540mguLfwT4lnt54ZVDxTQTRaY0c0MqMrxSxsySIyujFSDVXUvA3jrRbOXUtb8C+NdF023MYuNS1jwpr2mafbmaVIYRPe3thBbQmaaSOGLzJV8yaSOJMu6qf6RfhFJJL8J/hhLK7SSy/DzwVJJI5LPJI/hvTGd2Y8lmYlmJ5JJNZ3xv+GNv8ZvhJ8QPhdc6g+kf8Jp4bvdItNZiRpZdF1Rgtxo+tRRLJEZpdH1WCy1KKHzEWWS1WN2CsTX951v2YWS1+Equb5P4nZ3is9rcOzzLK8tr8P5dSweJzaplv1rBYGtiP7SjOnhq2MdOhUr2UoUpupZONj8Qp/SXxEM2hhMZwzhKOBjmMcNisVDMcROtSwkcSqVfEQpfVbTqQoqdSNO9pSXLfVW/nk8B/Cb4m/FFrz/AIV54G1/xZDp0ogv77T4IINLs7ll3i1n1bUbiy00Xez5jaJdPcopDPCqspOT4x8C+NPh5q40Dx34X1fwprL263kNhrECRPdWTSyQLfWU0Ms9re2bTwzQC5tZ5ovOhliZhIjKP6VfAHgbw78NfB3h/wAD+FbKOx0Tw7p0FhaoiIsty8a5utQvXRV+0ajqV0Zr7UbtwZbq9uJp5CXkJr8Qf+Cqer3mjftDfC66tGyD8IZkuLWRmFvdw/8ACaaqTFKBna4I3QzqN8L4IypZT+Z+Nf0Csl8IPAyPHFTjHN828QMHXyShmmCjSwNLhWeJzSvCjisHgIvDLM4xwk6jpYfMMRjHHF+yVapgcJGs6dD6Tgzx1xPF3GzyOGTYXCZBVp46phcTKdeebKnhaUqlOtiLVvqn75R5qmHp0b0VL2ccRXlT9pV+PaKyNM1O01e0S9snLRk7JYnwJrWcDLW9wo+669VYfJKmJIyVJAv1/mhVpVaFWpRrU5UqtKThUpzXLOE47xkujX47rQ/o2EoTjGcJ80JJSjKNmmmrppqRYqtef8ed3/17T/8AopqWq15/x53f/XtP/wCimpU/4lP/ABx/9KQ3az1ez6eXqFn/AMedp/17Qf8Aopas1Ws/+PO0/wCvaD/0UtWaU/jl/il+bEtl6L8gprusaPI5wkas7n0VQWY/gATTq7X4aeD3+IXxH8BeBFEmzxZ4u0PR7to1LNHpct5HPrM3AYqsOjwX0rNg7QhbtXo5LlWNz7OMqyPLaLxGYZxmWCyvA0FdOtjMfiaWFw1JNKTTnWqwjdRbV9nsY4nE0cFhsRjMTP2eGwlCtisRU/590MPTlWrT/wC3KcJS+R++/wCyX4GPw+/Z7+GeizQGDUdQ0GPxTrCsCJP7U8WSyeILlJVIBWS2XUIrMoQGjW2VGyyknof2kPGh+HnwC+MfjRJDFcaB8OfFl3YyAgFNTk0e6tdKIzwT/aNxa8dW+6OSK9oiijgijhhRY4oUSKKNFCpHHGoRERRwqqoCqBwAABXmvxi+E3hf44fDzXfhj40m1uHwx4kOnDVl8P6pJo2o3EOmanZ6tDbC+ijldLaa6sYFu4guLi33wMdjtX/VDQ4RxXC/hRT4F4P9isdkPAK4W4bnWqPCUHjsvyD+y8rr16yhVlRjPE06NavW5Ks43nUaqT3/AMwJ5vSzTiyWe5z7T6vj+IP7VzNU4+1qKhiMw+tYuFKDlBTlGlOcKcHKEXaMbxW34X/8EnfFH/COfH3xL4LlkJh8afCyXyQWPzan4K1ewu4WI6OX0/WtWZj97MYI431/Q7XxJ8I/2AfgL8EviHoPxP8AA0vxBh8T+HY9VhsTqvjO61TTZrfWdMudKv7e9sJrVY7mGS2uWdFLKY7mK3nUh4Vr7br89+jH4dcZeFfhjDgvjWWWzx2X59muIy15VjZY7DLKswWFxcYyqTw2FlCssxq5k5U/ZySjKE1N87hD3/EviHJ+KeJXnOS/WvY4jAYWnivrdCOHqfW8O6tFtQjWrJw+rQwyUuZXkpLl0u/5/v8Agq78PD4f+NXgT4k2tqsVj8RfBU2h6hcKwzP4k8C3o2mRAAVebw9r2nxI7E+ZHpbKpxDhfyq1P/kG6h/143f/AKTyV/R7/wAFQfh9/wAJd+zNd+K7a2hk1L4V+K9C8Yi4Yf6RDoV1LJ4a8SJAe6fYNaS+uI+Ny6aj5zGAf5wtU/5Buo/9eN3/AOk8lf5h/TI4O/1S8duJMRSpOngeLsLl/FuD91pOpmFKWDzR83wylPOsvzGu0rOMa8FJN+/P+lfCDN/7V4JyqMpc1bKq1bKK2t3bDTjWwul21GOBxOFpq+7pytoj+xD4Pf8AJJPhb/2TnwR/6jOmV6NXnPwe/wCSSfC3/snPgj/1GdMr0av9qOG/+SdyD/sS5X/6g0D+Ncx/5GGO/wCwzE/+npn5d/tIf8FMfDPwe8f6x8Nfh/4Db4k614Vuzp3i7W7vxCvh7w3pWtRBWu/D9hLDpmr3usanp29YtWljgtbHTr0PYGe5u4bmK2/KT9rf9pO0/ak8aeCfHMPhC+8E3nh3wTP4U1XSLvVbXWrea7bXrvVo73TNRtreyeW0eG52Ol5Y2dxFKNgSVB5rfMmrXE93rfiK7uZXnubvxN4mu7maQlpJrm61/Ubi4mdjks8s0jyOSSSzEmqNf4b+LH0lPE/xTXEOR53m9CnwdmWaQxOD4YoZXlVOjltLL8Z7fLo08xjglm1avSUIrEVa+PqRxE5VG6cIeyp0v7Y4X8O+GeF3gMbgcHOWb4bCypVczqYrFSqYmdeh7PEynh3WeEhCpeTpwp0IuklFKcpc8p6ekatd6LeC7tCG3AJc2zkiC8gBz5UuPuuvWCcDfC+CMoWU+36bqVpq1ol7ZOWjY7JI3wJraYDLW9wg+7IvVWHySpiSMlScfPtaek6td6NeLd2hDbgEubZyRDeQA58qXH3XXkwTgb4X5GULKf5Q4k4bpZxSeIw6jSzGlG0Jv3YYmEdqNZ7KVtKVV/B8E702nD9Ry3MpYOSp1G5Yab1WrdJtq84K+388OvxR974vfarXn/Hnd/8AXtP/AOimqLTdStNWtEvbJy0THZJG+BNbTAZe3uFH3ZF6hh8kqYkjJU8S3n/Hnd/9e0//AKKavx90qtDE+xrU5UqtKqoVKc1yzhOMleMl0a/HdaH2CnGdNThJShKPNGUXdNNXTTQlmR9jteR/x7Qf+ilqzuHqPzrPszm0tT/07Qf+ilqzROC55av4pfn/AMP/AFvUdl6L8ifcPUfnX3n/AME7fBY8RfHPUvFs6SG0+HnhC9uoJFTdD/bfiqU6JZo7kbVcaRHr7oAd+dpA27iPgWv23/4JweCf7C+C+teM54pI7z4g+L9QuYXcYV9E8MD/AIR/TjHxlka/g1q4DZKn7R8oGCW/rv6C/AP+vH0keCJVqXtsBwd9d45x9483s3kFODyirbZcvEWKyf3n8N7r31G/5R4255/YfhznrhPkxGbqhkWG1tzPMZv63Du+bLKOP/Dbc/QmvnX4zftW/Av4Aa5ovhv4qeMJfD2s+INJuNb0uzg8P+ItaM2mW14LCS5kl0XS7+G3Bui0UcdxJHLKY5WjRljZh9FV/NL/AMFJvFknif8Aa08V6eLr7TZeBvCfgzwlaIG3R2txLp83inVIUHRXNz4jjE46+ZFg/dFf7YfSZ8X838FvDinxRw/h8pxWeY/iHLMiy6hnVHE4nAOWJoY7HYqdTD4PG5fiKjhgcuxPs+TFU4xqyhKfNH3X/F/htwlhOMuIZ5ZmFTFUsFh8uxOOxE8HUp0q9qdShh6UYVK1DEU1eviaTknSbcFJRadmv1tl/wCClH7HcEUk0vxPvVjhjeWRv+EE8ettSNSzHavhsscKCcKCT2BNfb2lapYa3pem61pVwl5pmr2Fnqmm3cYdY7qwv7eO7s7lFkVHCT28scqh0VwGAZVOQP4w5EWVHjcZSRGRh6q4KsPxBNf1T/sT+MZvHX7KvwQ1y6kSS9g8E2Xhu+KNuIu/B09z4Tl8zkkSv/YolcNzmTPIIJ/IPoq/Sc4x8auKeJeGeM8Dwxg6+XZBTzzKnw9gMywM6tOhmGHwGYxxKzDOc29qoSzDAOl7JUXDmnzud1y/WeJ/htlHB2V5dmWT1syrQr4+WBxax9fDV1GVTDzr4d0lQweFcW/q+IU3JzT9xJJpuXuXxF8G2HxE8A+NPAeqRwyWHjHwtrvhq5FxGJIkTWdMubATMpVvmt3nWeNgC6SRo6YdVI/jf1rT9Q0i213RtWRotW0T+2dD1aNxho9V0aS70vUkPTOy+tJ1Bx8wAYda/tSr+WX/AIKC/D0/Dj9pr4wWkNuYNK8ZwW/xK0fCLHFJH4s06X+2/JVeAF8V6dr7SY6tIJCAZMD439oRwd9a4c4E48oUr1MozXG8M5hUhFOTwuc4f+0MvnVfK5RpYbFZVi6UHzxiquYqLUpThy+14AZv7PMs6yKpL3cVh8NmeHTeiq4OssNiIwXWdWli6U3a75MLfZNn9Knwe/5JJ8Lf+yc+CP8A1GdMr0avOfg9/wAkk+Fv/ZOfBH/qM6ZXo1f37w3/AMk7kH/Ylyv/ANQaB+C5j/yMMd/2GYn/ANPTP4v73/kJ6z/2Hte/9PN9VerF7/yE9Z/7D2vf+nm+qvX/ADb4j/eK/wD1+q/+lyP9EofBH/DH8kFFFFYlGnpOrXmjXYu7Rg2QEubZyRBeQg5MUuPuuvWCcDfC+CMqWU+yxanZ6tpE97ZOWja3nSSJ8Ce2nELFre4UfdkXnaw+SVcSRkg4Hg9W7TVrvRjcXVqwIa2lS5t3J8m7gEbZjlAyQ6/egmUb4nwRlSVr5jiDhylm6jiKCjSzGly8k9o4iEWrUaz/AJklalVesPgl+7acPUy7Mp4NulUvPDTbvHVulJ7zguz+3D7Wso+9pL3Sz/487T/r2g/9FLVmq1n/AMedp/17Qf8Aopas1+QT+OX+KX5s+zWy9F+QV7bZ/tpftQfCvwroXhnwJ4k8H2fgnw3p1rpGm2E/gHTb280q2t12Iby8a7je9W4fdLNqEkayyXUsrXXzSbz4lSEAhlZVZWVkdHUMjoww6OjZV0cEhlIwRX3PAHiVxp4ZZrXzfgviLOOHcVjsMsBmNTJ8wxGW1sbgPbU67wtSvhpwqcirUqdaGriqtOEpRnFOEvEz7h3KOJcJDB5xgMJj6VGr9Yw8cZhqWJp0cQoSpqrGnWjKHNyTnBuylyTkoyi2mvZP+HlP7YH/AEOfgj/w3Ol//J1fG/jHxbr3j7xd4m8deKrqK+8T+L9YuNe1+8t7ZbO2uNSuljjka2so2eOzt0ihhigto2ZYo41UMetXfE3hk6WXv7BWbTHb97Fks+mu5wFP8T2TscQynJh4il4CuePr93znxX438R8swceJONuJOKMuw9d4nDYTO84xuYU8HjPZulUl7DE16sKOKhTqSpykld053hOVKpGU/gsLwvk/DuJrf2fkuW5ZiKlNUqlXA4KhhpV6POpxXtKVOEqlJzipJN2542klODSK+oPhL+2V+0L8DvBtv4A+G/ifw9p/hW01HVNUtbLWfCVjrt1Bd6zdvf6iI764uYZfs8t5LNPFAVIgMrqjFcAfL9FcvDXFfE3B2YSzbhTPs24czOeGqYOePybHYjL8XPCVp0qlXDSr4apTqSoVKlGjOdJtwlOlTk1zQi1eYZZl2bYdYXNMDhMwwyqRrLD4zD08TRVWClGFRU6sZRVSMZzjGaXMlOSTtJ3+6/8Ah5T+2B/0Ofgj/wANzpf/AMnV84/Gz46fEj9ojVtJ134sXuhatq+iaNeeH7C90Pw/a+HZTo99ci8ms7w2s05vBDc+ZNZPIR9ja6vfLB+1SV5FRX0XEHix4m8WZZWyXibj3izP8or1KNWtlubZ5j8dgqtTD1Y1qFSeHxFedOU6VWEalOTjeMldM4cBwxw5lWJhjcsyPKsBi6anGGJwmAw2HrxjUi4TjGrSpxmlOLcZK9pJtPQ+2NF/4KI/tY+HtG0nQNK8X+DIdL0PTLDR9Nil+H2mTyxWGmWsVlZxyzG9UzSJbwRq8pVTIwLlRnFaf/Dyn9sD/oc/BH/hudL/APk6vhSivWpeO/jRQpUqFHxT48pUaNOFKlShxNmsYU6dOKhThCKxNoxhFKMUtEkkjklwTwfOUpz4YyGU5ycpSllWDblKTvKTbo3bbbbfVj5HaWaed8GW5ubm7mIG1Wnu55LmdlUcIrTSuVQcIpCDhRTKKK/KG222222223dtt6ttvdt7s+nCiiikAVXu/wDj1uf+veb/ANFtViq93/x63P8A17zf+i2qofHH/FH80B9DWZH2O15H/HtB/wCilqzuHqPzqhaf8ett/wBe8P8A6LWrFfzvP45f4pfmz9Hi7xi+6X5E+4eo/OjcPUfnUFFSMnJUghtjKysjK4DI6MMMjqeHRwcMp4IryfxL4a/ssvqGnqX0tmHmxAl3012PCsSSWsnbiGU5MJIhlONjH1Gl4wQyq6spR0dQySIwwyOjZVkYcMpBBFevk+cYnJ8T7aj79Gdo4nDSbUK8E+9nyVYXbpVUm4NtNTpyqU58eNwVLG0uSfuzjd06qV5Ql+sZWSnG+q1TUlGS+fqK6/xL4aOmFtQ09WfS3b97Fyz6bI7cIerNZMTiKU8wnEUpxsauQr9lwGPw2ZYani8LPnpT0aek6c0k5UqsbvkqQurq7TTjODlCUZS+JxGHq4arKlWjyyjr3jKL2lF9Yvo+jTTSkmkUUUV2GIUUUUAFFFFABRRRQAVXu/8Aj1uf+veb/wBFtViq93/x63P/AF7zf+i2qofHH/FH80B9AWn/AB623/XvD/6LWrFULW6tRbW4N1bHEEIytxCwOI1HDK5Vh6MpII5BIqf7Xa/8/Nv/AN/o/wD4qv56nCfPL3J/E/svv6ea+8/RYSXLHVfDHquy/wA0WKKr/a7X/n5t/wDv9H/8VR9rtf8An5t/+/0f/wAVU8k/5J/+Av8Ay8195XNH+Zfev66r7yxRVf7Xa/8APzb/APf6P/4qj7Xa/wDPzb/9/o//AIqjkn/JP/wF/wCXmvvDmj/MvvX9dV95ZzwQQrKysjo4DI6MMMjqeGRgSGU8EV5Z4l8N/wBmFr/T1ZtLZv3sPLPprtjCsTy9m7HEUpyYSRFKcFGr0r7Xa/8APzb/APf6P/4qj7XaEMrXFq6spV0eWJkdGGGR1LEMrDhlIIIr1smzXGZPiVWoxnOjPljicO1JQr00+9nyVYXbpVUm4NtNSpznCfFjcJQxtLkm4xmrunUVnKEnb/wKL0Uo3SkrbSUZR8HorpvEmjW2ms19YTwvpzsPMhE0bSWEjE/Kfmy1mx4ikPMJxHIcbWrkftdr/wA/Nv8A9/o//iq/ZcDjKOY4anisK5Tp1FqnG06c1bmpVY68tSF1dXaacZQcoSjKXxdehUw1WVGqkpR1TTvGcX8M4P7UZdHve8WlJNKxRVf7Xa/8/Nv/AN/o/wD4qj7Xa/8APzb/APf6P/4quzll/LL7n/XVfeY3/r+vVfeWKKr/AGu1/wCfm3/7/R//ABVH2u1/5+bf/v8AR/8AxVHLL+WX3P8ArqvvC/8AX9eq+8sUVX+12v8Az82//f6P/wCKo+12v/Pzb/8Af6P/AOKo5Zfyy+5/11X3hf8Ar+vVfeWKr3f/AB63P/XvN/6Laj7Xa/8APzb/APf6P/4qoLq6tWtrhRc22WglAzPCoyY2AyzOFUepJAHUkCnCMuaPuv4o9H3X+aFdd1/X/Do//9k=)", e("DefaultUIService", jr = function ()
						{
							function e(e, t, n, i, r)
							{
								var o = this;
								this.sessionService = e, this.viewService = t, this.realityService = n, this.realityServiceProvider = i, this.deviceService = r, this.realityViewerItemElements = new Map, this.menuItems = [], this.menuOpen = !1;
								var s = this.sessionService.configuration.defaultUI ||
								{};
								if (document && !s.disable)
								{
									var a = document.createElement("style");
									a.type = "text/css", document.head.insertBefore(a, document.head.firstChild);
									var u = a.sheet;
									u.insertRule("\n                .argon-ui {\n                    -webkit-tap-highlight-color: transparent;\n                    -webkit-user-select: none;\n                }\n            ", u.cssRules.length), u.insertRule("\n                .argon-ui-button {\n                    background-image: " + Lr + ";\n                    width: 144px;\n                    height: 144px;\n                }\n            ", u.cssRules.length), u.insertRule("\n                .argon-ui-blur {\n                    background-color: rgba(238, 178, 17, 0.7);\n                    -webkit-backdrop-filter: blur(5px);\n                }\n            ", u.cssRules.length), u.insertRule("\n                .argon-ui-box {\n                    webkit-user-select: none;\n                    ms-user-select: none;\n                    user-select: none;\n                }\n            ", u.cssRules.length), u.insertRule("\n                .argon-ui-list-item {\n                    align-items: center;\n                    background: white;\n                    border-top: 1px solid lightgrey;\n                    display: flex;\n                    height: 20px;\n                    justify-content: space-between;\n                    padding: 20px;\n                    width: 100%;\n                    cursor: pointer;\n                    font-family: 'Sans-serif';\n                    font-size: 12px;\n                    color: #5F5F5F;\n                    box-sizing: border-box;\n                }\n            ", u.cssRules.length), u.insertRule("\n                .argon-ui-list-item:hover {\n                    background: rgb(240,240,240);\n                }\n            ", u.cssRules.length), this.element = document.createElement("div"), this.element.className = "argon-ui", this.element.style.position = "absolute", this.element.style.bottom = "0", this.element.style.right = "0", this.element.style.width = "100%", this.element.style.height = "100%", this.element.style.userSelect = "none", this.element.style.webkitUserSelect = "none", this.element.style.zIndex = "10", this.element.style.pointerEvents = "none", this.element.style.overflow = "hidden", this.viewService.element.appendChild(this.element), this.sessionService.manager.closeEvent.addEventListener(function ()
									{
										o.element.remove()
									});
									var c = document.createElement("div");
									c.className = "argon-overlay", c.style.width = "100%", c.style.height = "100%", c.style.display = "flex", c.style.alignItems = "center", c.style.pointerEvents = "auto", c.addEventListener("click", function (e)
									{
										e.target === c && (c.remove(), e.stopPropagation())
									}), this.realityViewerSelectorElement = document.createElement("div"), this.realityViewerSelectorElement.classList.add("argon-ui-box"), this.realityViewerSelectorElement.classList.add("argon-ui-blur"), this.realityViewerSelectorElement.style.maxWidth = "300px", this.realityViewerSelectorElement.style.maxHeight = "70%", this.realityViewerSelectorElement.style.width = "70%", this.realityViewerSelectorElement.style.margin = "auto", this.realityViewerSelectorElement.style.padding = "20px", this.realityViewerSelectorElement.style.boxShadow = "rgb(102,102,102) 0 5px 20px", c.appendChild(this.realityViewerSelectorElement);
									var l = document.createElement("h2");
									l.innerText = "Select a Reality", l.style.fontFamily = "Sans-Serif", l.style.color = "white", l.style.marginTop = "0", l.style.flex = "0 1 auto", this.realityViewerSelectorElement.appendChild(l), this.realityViewerListElement = document.createElement("div"), this.realityViewerListElement.style.flex = "1 1 auto", this.realityViewerListElement.style.maxHeight = "250px", this.realityViewerListElement.style.overflowY = "auto", this.realityViewerSelectorElement.appendChild(this.realityViewerListElement), this.realityServiceProvider.installedEvent.addEventListener(function (e)
									{
										var t = e.viewer,
											n = t.uri,
											i = document.createElement("div");
										i.innerText = n, t.connectEvent.addEventListener(function (e)
										{
											i.innerText = e.info.title || n
										}), i.className = "argon-ui-list-item", o.realityViewerItemElements.set(n, i), o.realityViewerListElement.appendChild(i), i.addEventListener("click", function ()
										{
											o.realityService.request(n), c.remove()
										})
									}), this.realityServiceProvider.uninstalledEvent.addEventListener(function (e)
									{
										var t = e.viewer.uri,
											n = o.realityViewerItemElements.get(t);
										o.realityViewerItemElements.delete(t), n.remove()
									}), this.menuBackgroundElement = document.createElement("div"), this.menuBackgroundElement.className = "argon-ui-blur", this.menuBackgroundElement.style.position = "absolute", this.menuBackgroundElement.style.bottom = "-150px", this.menuBackgroundElement.style.right = "-150px", this.menuBackgroundElement.style.width = "300px", this.menuBackgroundElement.style.height = "300px", this.menuBackgroundElement.style.transform = "scale(0.1)", this.menuBackgroundElement.style.transition = "transform 0.3s, opacity 0.3s", this.menuBackgroundElement.style.borderRadius = "150px", this.menuBackgroundElement.style.zIndex = "-2", this.element.appendChild(this.menuBackgroundElement);
									var h = document.createElement("div");
									this.element.appendChild(h), h.className = "argon-ui-button", h.style.position = "absolute", h.style.bottom = "0", h.style.right = "0", h.style.transform = "scale(0.36)", h.style.transformOrigin = "110% 110%", h.style.borderRadius = "72px", h.style.cursor = "pointer", h.style.pointerEvents = "auto", h.style.zIndex = "-1", this.openInArgonMenuItem = this._createMenuItem(Ir, "Open in Argon"), Ln ? (this.openInArgonMenuItem.addEventListener("touchstart", function ()
									{
										q()
									}), this.openInArgonMenuItem.addEventListener("touchend", function ()
									{
										confirm("Oops, it looks like you are still here! You may not have the Argon Browser installed. Would you like to install it now?") && V(), o.menuOpen = !1, o.updateMenu()
									})) : jn && (this.openInArgonMenuItem.onclick = function ()
									{
										q()
									}), this.hmdMenuItem = this._createMenuItem(Sr, "Toggle HMD", function ()
									{
										o.menuOpen = !1, o.updateMenu(), o.deviceService.isPresentingHMD ? o.deviceService.exitPresentHMD() : o.deviceService.requestPresentHMD()
									}), this.realityMenuItem = this._createMenuItem(Or, "Select Reality Viewer...", function ()
									{
										o.menuOpen = !1, o.updateMenu(), c.style.backgroundColor = "rgba(0,0,0,0.3)", o.element.appendChild(c)
									}), this.maximizeMenuItem = this._createMenuItem(_r, "Toggle Immersive View", function ()
									{
										o.menuOpen = !1, o.updateMenu(), o.viewService.viewportMode === ji.IMMERSIVE ? o.viewService.desiredViewportMode = ji.EMBEDDED : o.viewService.desiredViewportMode = ji.IMMERSIVE
									}), this.onSelect(h, this.toggleMenu.bind(this)), this.updateMenu(), this.viewService.viewportChangeEvent.addEventListener(function ()
									{
										o.updateMenu()
									}), this.viewService.viewportModeChangeEvent.addEventListener(function ()
									{
										o.updateMenu()
									})
								}
							}
							return e.prototype._createMenuItem = function (e, t, n)
							{
								var i = document.createElement("div");
								return i.style.position = "absolute", i.style.bottom = "-20px", i.style.right = "-20px", i.style.textAlign = "left", i.style.width = "40px", i.style.height = "40px", i.style.fontFamily = "Arial Black", i.style.color = "black", i.style.cursor = "default", i.style.textShadow = "-1px -1px 0px #545454, 1px -1px 0px #545454, -1px 1px 0px #545454, 1px 1px 0px #545454", i.style.transition = "transform 0.3s ease 0.1s, opacity 0.3s ease 0.1s", i.style.opacity = "0", i.style.pointerEvents = "none", i.style.transformOrigin = "50% 50%", i.style.backgroundImage = e, i.style.backgroundSize = "100% 100%", i.style.backgroundRepeat = "no-repeat", i.style.zIndex = "2", i.style.cursor = "pointer", this.element.appendChild(i), i.title = t, n && this.onSelect(i, n), i.addEventListener("mouseenter", function ()
								{
									i.style.color = "#eeb211"
								}), i.addEventListener("mouseleave", function ()
								{
									i.style.color = "white"
								}), i
							}, e.prototype.onSelect = function (e, t)
							{
								e.addEventListener("touchend", function (e)
								{
									e.preventDefault(), e.stopPropagation(), t()
								}), e.addEventListener("click", function (e)
								{
									e.stopPropagation(), t()
								})
							}, e.prototype.toggleMenu = function ()
							{
								this.menuOpen ? this.menuOpen = !1 : this.menuOpen = !0, this.updateMenu()
							}, e.prototype._hideMenuItem = function (e)
							{
								e.style.transform = "scale(0.2)", e.style.opacity = "0", e.style.pointerEvents = "none"
							}, e.prototype.updateMenu = function ()
							{
								var e = this;
								this.deviceService.isPresentingHMD && Ln ? this.element.style.display = "none" : this.element.style.display = "block", this.menuItems.length = 0, this.menuItems.push(null), Ln || jn ? this.menuItems.push(this.openInArgonMenuItem) : this._hideMenuItem(this.openInArgonMenuItem);
								var t = this.viewService.element.parentElement,
									n = t ? t.clientWidth : 0,
									i = t ? t.clientHeight : 0;
								if (window.innerWidth !== n || window.innerHeight !== i ? this.menuItems.push(this.maximizeMenuItem) : this._hideMenuItem(this.maximizeMenuItem), Ln || "getVRDisplays" in navigator ? this.menuItems.push(this.hmdMenuItem) : this._hideMenuItem(this.hmdMenuItem), this.realityViewerItemElements.size > 0 ? this.menuItems.push(this.realityMenuItem) : this._hideMenuItem(this.realityMenuItem), this.menuItems.push(null), this.menuOpen)
								{
									var r = this.menuItems.length;
									this.menuItems.forEach(function (e, t)
									{
										if (e)
										{
											var n = t / (r - 1) * (Math.PI / 2 + Math.PI / 8) - Math.PI / 16,
												i = 100 * Math.cos(n),
												o = 100 * Math.sin(n);
											e.style.transform = "translateX(" + -i + "px) translateY(" + -o + "px) scale(0.8)", e.style.opacity = "1", e.style.pointerEvents = "auto"
										}
									}), this.menuBackgroundElement.style.transform = "scale(1)"
								}
								else this.menuItems.forEach(function (t, n)
								{
									t && e._hideMenuItem(t)
								}), this.menuBackgroundElement.style.transform = "scale(0.1)"
							}, e
						}()), e("DefaultUIService", jr = Dr([N(), Tr("design:paramtypes", ["function" == typeof (xr = void 0 !== Gn && Gn) && xr || Object, "function" == typeof (br = void 0 !== bi && bi) && br || Object, "function" == typeof (Cr = void 0 !== gr && gr) && Cr || Object, "function" == typeof (Rr = void 0 !== yr && yr) && Rr || Object, "function" == typeof (zr = void 0 !== Xi && Xi) && zr || Object])], jr)), Pr = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, Ur = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("ContextService", kr = function ()
						{
							function e(e, t, n, i, r)
							{
								var o = this;
								this.entityService = e, this.sessionService = t, this.deviceService = n, this.viewService = i, this.realityService = r, this.updateEvent = new sn, this.renderEvent = new sn, this.postRenderEvent = new sn, this.originChangeEvent = new sn, this.timestamp = -1, this.deltaTime = 0, this.maxDeltaTime = 1 / 3 * 1e3, this.time = new Ie(0, 0), this.origin = this.entities.add(new ve(
								{
									id: "ar.origin",
									name: "Origin",
									position: new Qt(void 0, Pe.FIXED),
									orientation: new Yt(void 0)
								})), this._localOrigin = this.entities.add(new ve(
								{
									id: "ar.localOrigin",
									name: "Local Origin",
									position: new Qt(se.ZERO, this.origin),
									orientation: new Yt(Re.IDENTITY)
								})), this._localOriginEastNorthUp = this.entities.add(new ve(
								{
									id: "ar.localOriginENU",
									name: "Local Origin (ENU)",
									position: new Qt(se.ZERO, this.origin),
									orientation: new Yt(Re.fromAxisAngle(se.UNIT_X, -Math.PI / 2))
								})), this.stage = this.entities.add(new ve(
								{
									id: "ar.stage",
									name: "Stage",
									position: new Qt(void 0, Pe.FIXED),
									orientation: new Yt(void 0)
								})), this.stageEUS = this.entities.add(new ve(
								{
									id: "ar.stageEUS",
									name: "Stage (EUS)",
									position: new Qt(void 0, this.stage),
									orientation: new Yt(void 0)
								})), this.stageENU = this.entities.add(new ve(
								{
									id: "ar.stageENU",
									name: "Stage (ENU)",
									position: new Qt(void 0, this.stage),
									orientation: new Yt(void 0)
								})), this.floor = this.entities.add(new ve(
								{
									id: "ar.floor",
									name: "Floor",
									position: new Qt(se.ZERO, this.stage),
									orientation: new Yt(Re.IDENTITY)
								})), this.user = this.entities.add(new ve(
								{
									id: "ar.user",
									name: "User",
									position: new Qt(void 0, this.stage),
									orientation: new Yt(void 0)
								})), this.view = this.entities.add(new ve(
								{
									id: "ar.view",
									name: "View",
									position: new Qt(se.ZERO, this.user),
									orientation: new Yt(Re.IDENTITY)
								})), this.defaultReferenceFrame = this.origin, this._updatingEntities = new Set, this._knownEntities = new Set, this._scratchCartesian = new se, this._scratchQuaternion = new Re, this._scratchFrustum = new je, this.subscribe = this.entityService.subscribe.bind(this.entityService), this.unsubscribe = this.entityService.unsubscribe.bind(this.entityService), this._frameIndex = -1, this._scratchFrameState = {
									time:
									{},
									entities:
									{},
									viewport:
									{},
									subviews: []
								}, this._getSerializedEntityState = U, this._getEntityPositionInReferenceFrame = z, this._getEntityOrientationInReferenceFrame = P, this._eastUpSouthToFixedFrame = vn, this._eastNorthUpToFixedFrame = Ye.eastNorthUpToFixedFrame, this._getReachableAncestorReferenceFrames = R, this._scratchArray = [], this._scratchMatrix3 = new Se, this._scratchMatrix4 = new _e, this._convertEntityReferenceFrame = G, this.sessionService.manager.on["ar.context.update"] = function (e)
								{
									var t = o._scratchFrustum;
									if ("string" != typeof e.reality && (e.reality = e.reality && e.reality.uri), !e.viewport && e.view && e.view.viewport && (e.viewport = e.view.viewport), !e.subviews && e.view && e.view.subviews)
									{
										e.subviews = e.view.subviews, t.near = Xt, t.far = Zt;
										for (var n = 0, i = e.subviews; n < i.length; n++)
										{
											var r = i[n],
												s = r.frustum;
											t.xOffset = s.xOffset || 0, t.yOffset = s.yOffset || 0, t.fov = s.fov || Oe.PI_OVER_THREE, t.aspectRatio = s.aspectRatio || 1, r.projectionMatrix = _e.clone(t.projectionMatrix, r.projectionMatrix)
										}
									}!e.entities[o.user.id] && e.view && e.view.pose && (e.entities[o.user.id] = e.view.pose);
									var a = o.sessionService.isRealityViewer;
									o._update(e, a)
								}, this._scratchFrustum.near = Xt, this._scratchFrustum.far = Zt, this._scratchFrustum.fov = Oe.PI_OVER_THREE, this._scratchFrustum.aspectRatio = 1, this._serializedFrameState = {
									reality: void 0,
									time: Ie.now(),
									entities:
									{},
									viewport: new en,
									subviews: [
									{
										type: tn.SINGULAR,
										viewport: new $t,
										projectionMatrix: this._scratchFrustum.projectionMatrix
									}]
								}
							}
							return Object.defineProperty(e.prototype, "entities",
							{
								get: function ()
								{
									return this.entityService.collection
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "localOriginChangeEvent",
							{
								get: function ()
								{
									return this.originChangeEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "userTracking",
							{
								get: function ()
								{
									return this._serializedFrameState && this._serializedFrameState.userTracking || "3DOF"
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "localOrigin",
							{
								get: function ()
								{
									return this._localOrigin
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "localOriginEastUpSouth",
							{
								get: function ()
								{
									return this._localOrigin
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "localOriginEastNorthUp",
							{
								get: function ()
								{
									return this._localOriginEastNorthUp
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "serializedFrameState",
							{
								get: function ()
								{
									return this._serializedFrameState
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "systemTime",
							{
								get: function ()
								{
									return this.timestamp
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.getTime = function ()
							{
								return this.time
							}, e.prototype.setDefaultReferenceFrame = function (e)
							{
								this.defaultReferenceFrame = e
							}, e.prototype.getDefaultReferenceFrame = function ()
							{
								return this.defaultReferenceFrame
							}, e.prototype.subscribeToEntityById = function (e)
							{
								return this.subscribe(e), this.entities.getOrCreateEntity(e)
							}, e.prototype.getEntityCartographic = function (e, t)
							{
								return this.entityService.getCartographic(e, this.time, t)
							}, e.prototype.createGeoEntity = function (e, t)
							{
								return this.entityService.createFixed(e, t)
							}, e.prototype.createEntityPose = function (e, t)
							{
								return void 0 === t && (t = this.defaultReferenceFrame), this.entityService.createEntityPose(e, t)
							}, e.prototype.getEntityPose = function (e, t)
							{
								return void 0 === t && (t = this.defaultReferenceFrame), this.entityService.getEntityPose(e, t, this.time)
							}, e.prototype.submitFrameState = function (e)
							{
								e.index = ++this._frameIndex, this._update(e)
							}, e.prototype.createFrameState = function (e, t, n, i)
							{
								var r = i && i.overrideUser;
								this.deviceService.strict && r && (r = !1);
								var o = this._scratchFrameState;
								o.time = Ie.clone(e, o.time), o.viewport = en.clone(t, o.viewport), o.subviews = on.clone(n, o.subviews);
								var s = o.entities = {},
									a = this._getSerializedEntityState,
									u = this.stage;
								i && i.overrideStage && (s[u.id] = a(u, e, void 0));
								var c = this.user;
								r && (s[c.id] = a(c, e, u));
								var l = this.view;
								if (i && i.overrideView && (s[l.id] = a(l, e, c)), i && i.overrideSubviews)
									for (var h = 0; h < n.length; h++)
									{
										var d = n[h];
										if (!isFinite(d.projectionMatrix[0])) throw new Error("Invalid projection matrix (contains non-finite values)");
										var f = this.getSubviewEntity(h);
										s[f.id] = a(f, e, l)
									}
								var p = i && i.floorOffset || 0,
									g = this.floor;
								return g.position.setValue(se.fromElements(0, p, 0, this._scratchCartesian), u), 0 !== p && (o.entities[this.floor.id] = a(g, e, u)), o.userTracking = i && i.userTracking, o
							}, e.prototype._updateBackwardsCompatability = function (e)
							{
								this._knownEntities.clear();
								var t = this.entityService;
								for (var n in e.entities) t.updateEntityFromSerializedState(n, e.entities[n]), this._updatingEntities.add(n), this._knownEntities.add(n);
								for (var i = 0, r = this._updatingEntities; i < r.length; i++)
								{
									n = r[i];
									if (!this._knownEntities.has(n))
									{
										var o = this.entities.getById(n);
										o && (o.position && o.position.setValue(void 0), o.orientation && o.orientation.setValue(void 0)), this._updatingEntities.delete(n)
									}
								}
								var s = this._getEntityPositionInReferenceFrame(this.user, e.time, Pe.FIXED, this._scratchCartesian);
								if (s)
								{
									var a = vn(s, void 0, this._scratchMatrix4),
										u = _e.getRotation(a, this._scratchMatrix3),
										c = Re.fromRotationMatrix(u);
									this.stage.position.setValue(s, Pe.FIXED), this.stage.orientation.setValue(c)
								}
								else this.stage.position.setValue(se.fromElements(0, -this.deviceService.suggestedUserHeight, 0, this._scratchCartesian), this.user.position.referenceFrame), this.stage.orientation.setValue(Re.IDENTITY);
								e.entities[this.stage.id] = !0
							}, e.prototype._update = function (e, t)
							{
								this._serializedFrameState = e;
								var n = performance.now();
								this.deltaTime = Math.min(n - this.timestamp, this.maxDeltaTime), this.timestamp = n, Ie.clone(e.time, this.time), this.sessionService.manager.isConnected && 0 === this.sessionService.manager.version[0] ? this._updateBackwardsCompatability(e) : this._updateEntities(e.entities), this.deviceService._processContextFrameState(e), this._updateContextEntities(e), this._updateStageGeo(), this.viewService._processContextFrameState(e, this), this.realityService._processContextFrameState(e), t || (this._checkOriginChange(), this.updateEvent.raiseEvent(this), this.renderEvent.raiseEvent(this), this.postRenderEvent.raiseEvent(this), this.realityService._publishContextFrameState(e), this._trySubmitFrame())
							}, e.prototype._updateEntities = function (e)
							{
								var t = this.entityService;
								for (var n in e) t.updateEntityFromSerializedState(n, e[n])
							}, e.prototype._updateContextEntities = function (e)
							{
								var t = e.time,
									n = e.entities,
									i = this.origin,
									r = this.stage,
									o = this.deviceService.origin,
									s = this.deviceService.stage,
									a = r.position,
									u = r.orientation,
									c = i.position,
									l = i.orientation;
								if (n[r.id])
								{
									var h = this.getEntityPose(s, o),
										d = this.getEntityPose(o, s);
									c.setValue(d.position, r), l.setValue(d.orientation);
									var f = R(r, t, this._scratchArray)[0];
									if (!ge(f)) throw new Error("Stage frame must have a reachable parent reference frame!");
									var p = this.getEntityPose(i, f);
									c.setValue(p.position, f), l.setValue(p.orientation), a.setValue(h.position, i), u.setValue(h.orientation)
								}
								else a.setValue(se.ZERO, s), u.setValue(Re.IDENTITY), c.setValue(se.ZERO, o), l.setValue(Re.IDENTITY);
								var g = this.deviceService.user,
									y = this.user;
								if (n[y.id]) this._convertEntityReferenceFrame(y, t, r);
								else
								{
									var M = this.getEntityPose(g, o),
										v = y.position,
										A = y.orientation;
									v.setValue(M.position, i), A.setValue(M.orientation)
								}
								var E = this.view;
								if (n[E.id]) this._convertEntityReferenceFrame(E, t, y);
								else
								{
									var m = E.position,
										w = E.orientation;
									m.setValue(se.ZERO, y), w.setValue(Re.IDENTITY)
								}
								for (var N = 0; N < e.subviews.length; N++)
									if (!n["ar.view_" + N])
									{
										var D = this.deviceService.getSubviewEntity(N),
											T = this.getSubviewEntity(N),
											I = this._getEntityPositionInReferenceFrame(D, t, g, this._scratchCartesian),
											O = this._getEntityOrientationInReferenceFrame(D, t, g, this._scratchQuaternion),
											S = T.position,
											_ = T.orientation;
										S.setValue(I, E), _.setValue(O)
									}
								n[this.floor.id] ? this._convertEntityReferenceFrame(this.floor, t, r) : this.floor.position.setValue(se.ZERO, r)
							}, e.prototype._updateStageGeo = function ()
							{
								var e = this.time,
									t = this.stage,
									n = this._getEntityPositionInReferenceFrame(t, e, Pe.FIXED, this._scratchCartesian);
								if (n)
								{
									var i = this._eastUpSouthToFixedFrame(n, void 0, this._scratchMatrix4),
										r = _e.getRotation(i, this._scratchMatrix3),
										o = Re.fromRotationMatrix(r, this._scratchQuaternion);
									this.stageEUS.position.setValue(n, Pe.FIXED), this.stageEUS.orientation.setValue(o);
									var s = this._eastNorthUpToFixedFrame(n, void 0, this._scratchMatrix4),
										a = _e.getRotation(s, this._scratchMatrix3),
										u = Re.fromRotationMatrix(a, this._scratchQuaternion);
									this.stageENU.position.setValue(n, Pe.FIXED), this.stageENU.orientation.setValue(u)
								}
								else this.stageEUS.position.setValue(void 0, Pe.FIXED), this.stageEUS.orientation.setValue(void 0), this.stageENU.position.setValue(void 0, Pe.FIXED), this.stageENU.orientation.setValue(void 0)
							}, e.prototype._checkOriginChange = function ()
							{
								var e = this.time,
									t = this._getReachableAncestorReferenceFrames(this.origin, e, this._scratchArray)[0] || Pe.FIXED,
									n = this.getEntityPose(this.origin, t);
								(t !== this._previousOriginReferenceFrame || n.status & li.CHANGED) && (this._previousOriginReferenceFrame = t, this.sessionService.isRealityAugmenter && console.log("Updated context origin to " + JSON.stringify(n.position) + " at " + x(t)), this.originChangeEvent.raiseEvent(void 0))
							}, e.prototype._trySubmitFrame = function ()
							{
								var e = this.deviceService.vrDisplay;
								this.deviceService.autoSubmitFrame && e && e.isPresenting && !this.sessionService.isRealityViewer && e.submitFrame()
							}, e.prototype.getSubviewEntity = function (e)
							{
								var t = this.entityService.collection.getOrCreateEntity("ar.view_" + e);
								return t.position || (t.position = new Qt(se.ZERO, this.user)), t.orientation || (t.orientation = new Yt(Re.IDENTITY)), t
							}, e.prototype.subscribeGeolocation = function (e)
							{
								var t = this;
								return this.sessionService.manager.whenConnected().then(function ()
								{
									return t.sessionService.manager.versionNumber >= 1.4 ? t.entityService.subscribe(t.origin.id, e).then(function () {}) : t.entityService.subscribe(t.stage.id, e).then(function () {})
								})
							}, e.prototype.unsubscribeGeolocation = function ()
							{
								var e = this;
								this.sessionService.manager.whenConnected().then(function ()
								{
									e.sessionService.manager.versionNumber >= 1.4 ? e.entityService.unsubscribe(e.origin.id) : e.entityService.unsubscribe(e.stage.id)
								})
							}, e.prototype._getInheritedMetaProperty = function (e, t)
							{
								for (var n = e.position.referenceFrame; n;)
								{
									var i = n.meta && n.meta[t];
									if (ge(i)) return i;
									n = n.position && n.position.referenceFrame
								}
							}, Object.defineProperty(e.prototype, "geoHeadingAccuracy",
							{
								get: function ()
								{
									return this._getInheritedMetaProperty(this.user, "geoHeadingAccuracy")
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoHorizontalAccuracy",
							{
								get: function ()
								{
									return this._getInheritedMetaProperty(this.stage, "geoHorizontalAccuracy")
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoVerticalAccuracy",
							{
								get: function ()
								{
									return this._getInheritedMetaProperty(this.stage, "geoVerticalAccuracy")
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoposeHeadingAccuracy",
							{
								get: function ()
								{
									return this.geoHeadingAccuracy
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoposeHorizontalAccuracy",
							{
								get: function ()
								{
									return this.geoHorizontalAccuracy
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoposeVerticalAccuracy",
							{
								get: function ()
								{
									return this.geoVerticalAccuracy
								},
								enumerable: !0,
								configurable: !0
							}), e
						}()), Pr([H("originChangeEvent"), Ur("design:type", Object), Ur("design:paramtypes", [])], kr.prototype, "localOriginChangeEvent", null), Pr([H("origin"), Ur("design:type", Object), Ur("design:paramtypes", [])], kr.prototype, "localOrigin", null), Pr([H(), Ur("design:type", Object), Ur("design:paramtypes", [])], kr.prototype, "localOriginEastUpSouth", null), Pr([H(), Ur("design:type", Object), Ur("design:paramtypes", [])], kr.prototype, "localOriginEastNorthUp", null), Pr([H("timestamp"), Ur("design:type", Object), Ur("design:paramtypes", [])], kr.prototype, "systemTime", null), Pr([H("time"), Ur("design:type", Function), Ur("design:paramtypes", []), Ur("design:returntype", "function" == typeof (Fr = void 0 !== Ie && Ie) && Fr || Object)], kr.prototype, "getTime", null), Pr([H(), Ur("design:type", Function), Ur("design:paramtypes", [Object]), Ur("design:returntype", void 0)], kr.prototype, "setDefaultReferenceFrame", null), Pr([H("defaultReferenceFrame"), Ur("design:type", Function), Ur("design:paramtypes", []), Ur("design:returntype", Object)], kr.prototype, "getDefaultReferenceFrame", null), Pr([H("subscribe"), Ur("design:type", Function), Ur("design:paramtypes", [String]), Ur("design:returntype", "function" == typeof (Qr = void 0 !== ve && ve) && Qr || Object)], kr.prototype, "subscribeToEntityById", null), Pr([H("EntityService.createFixed"), Ur("design:type", Function), Ur("design:paramtypes", ["function" == typeof (Yr = void 0 !== ue && ue) && Yr || Object, Object]), Ur("design:returntype", void 0)], kr.prototype, "createGeoEntity", null), e("ContextService", kr = Pr([N(), Ur("design:paramtypes", ["function" == typeof (Gr = void 0 !== hi && hi) && Gr || Object, "function" == typeof (Vr = void 0 !== Gn && Gn) && Vr || Object, "function" == typeof (qr = void 0 !== Xi && Xi) && qr || Object, "function" == typeof (Hr = void 0 !== bi && bi) && Hr || Object, "function" == typeof (Wr = void 0 !== gr && gr) && Wr || Object])], kr)), e("ContextServiceProvider", Br = function ()
						{
							function e(e, t, n, i, r, o, s)
							{
								var a = this;
								this.sessionService = e, this.contextService = t, this.deviceService = n, this.entityServiceProvider = i, this.permissionServiceProvider = r, this.realityServiceProvider = o, this.device = s, this._cacheTime = new Ie(0, 0), this._sessionEntities = {}, this._includedFrames = {}, this._excludedFrames = {}, this.desiredGeolocationOptions = {}, this.sessionGeolocationOptions = new Map, this.entityServiceProvider.sessionSubscribedEvent.addEventListener(function (e)
								{
									e.id === a.contextService.stage.id && e.session !== a.sessionService.manager && (a._setGeolocationOptions(e.session, e.options), a.contextService.subscribeGeolocation(a.desiredGeolocationOptions))
								}), this.entityServiceProvider.sessionUnsubscribedEvent.addEventListener(function ()
								{
									var e = a.entityServiceProvider.subscribersByEntity.get(a.contextService.stage.id);
									e && 1 === e.size && e.has(a.sessionService.manager) && a.contextService.unsubscribeGeolocation()
								}), this.sessionService.connectEvent.addEventListener(function (e)
								{
									var t = a.entityServiceProvider.subscriptionsBySubscriber.get(e);
									t[a.contextService.user.id] = {}, t[a.contextService.stage.id] = {}, t[a.deviceService.user.id] = {}, t[a.deviceService.stage.id] = {}
								}), this.realityServiceProvider.nextFrameStateEvent.addEventListener(function (e)
								{
									a.contextService.submitFrameState(e), a._publishFrameState()
								})
							}
							return e.prototype._publishFrameState = function ()
							{
								var e = this.contextService.serializedFrameState;
								this._cacheTime = Ie.clone(e.time, this._cacheTime);
								for (var t = 0, n = this.sessionService.managedSessions; t < n.length; t++)
								{
									var i = n[t];
									this._sendUpdateForSession(e, i)
								}
							}, e.prototype._sendUpdateForSession = function (e, t)
							{
								if (!(Kt.isRealityViewer(t.info.role) && t.versionNumber < 1.4))
								{
									var n = this._sessionEntities,
										i = this.entityServiceProvider;
									for (var r in n) delete n[r];
									if (e.entities)
										for (var r in e.entities) n[r] = e.entities[r];
									var o = this._includedFrames;
									for (r in o) delete o[r];
									var s = i.subscriptionsBySubscriber.get(t);
									if (s)
										for (var r in s) o[r] = !0;
									var a = this.deviceService,
										u = a.origin.id,
										c = a.stage.id,
										l = a.stage.id,
										h = this.contextService,
										d = h.origin.id,
										f = h.stage.id,
										p = h.stage.id;
									o[u] = !0, o[c] = !0, o[l] = !0, o[d] = !0, o[f] = !0, o[p] = !0, o[h.view.id] = !0;
									for (var g = 0; g < e.subviews.length; g++) o["ar.view_" + g] = !0, o["ar.device.view_" + g] = !0;
									var y = this._excludedFrames;
									for (r in y) delete y[r];
									this.permissionServiceProvider.getPermissionState(t, "geolocation") != ni.GRANTED && (y[u] = !0, y[d] = !0), i.fillEntityStateMap(n, e.time, o, y), t.versionNumber >= 1.4 && delete n[this.device.deviceOrientation.id];
									var M = e.entities;
									e.entities = n, e.time = e.time, e.sendTime = Ie.now(e.sendTime), t.send("ar.context.update", e), e.entities = M
								}
							}, e.prototype._setGeolocationOptions = function (e, t)
							{
								var n = this;
								this.sessionGeolocationOptions.set(e, t), e.closeEvent.addEventListener(function ()
								{
									n.sessionGeolocationOptions.delete(e), n._updateDesiredGeolocationOptions()
								}), this._updateDesiredGeolocationOptions()
							}, e.prototype._updateDesiredGeolocationOptions = function ()
							{
								var e = {};
								this.sessionGeolocationOptions.forEach(function (t, n)
								{
									e.enableHighAccuracy = e.enableHighAccuracy || t && t.enableHighAccuracy || !1
								}), this.desiredGeolocationOptions.enableHighAccuracy !== e.enableHighAccuracy && (this.desiredGeolocationOptions = e)
							}, e
						}()), e("ContextServiceProvider", Br = Pr([N(), Ur("design:paramtypes", ["function" == typeof (Xr = void 0 !== Gn && Gn) && Xr || Object, kr, "function" == typeof (Zr = void 0 !== Xi && Xi) && Zr || Object, "function" == typeof (Kr = void 0 !== di && di) && Kr || Object, "function" == typeof (Jr = void 0 !== ri && ri) && Jr || Object, "function" == typeof ($r = void 0 !== yr && yr) && $r || Object, "function" == typeof (eo = void 0 !== Wi && Wi) && eo || Object])], Br)), to = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, no = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, io = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("VuforiaServiceProvider", ro = function ()
						{
							function e(e)
							{
								e.isRealityManager && (e.connectEvent.addEventListener(function (e)
								{
									e.on["ar.vuforia.isAvailable"] = function ()
									{
										return Promise.resolve(
										{
											available: !1
										})
									}
								}), e.connectEvent.addEventListener(function (e)
								{
									e.on["ar.vuforia.init"] = function ()
									{
										return Promise.reject(new Error("Vuforia is not supported on this system"))
									}
								}))
							}
							return e
						}()), e("VuforiaServiceProvider", ro = no([D(Gn), io("design:paramtypes", ["function" == typeof (ho = void 0 !== Gn && Gn) && ho || Object])], ro)),
						function (e)
						{
							e[e.MaxSimultaneousImageTargets = 0] = "MaxSimultaneousImageTargets", e[e.MaxSimultaneousObjectTargets = 1] = "MaxSimultaneousObjectTargets", e[e.DelayedLoadingObjectDatasets = 2] = "DelayedLoadingObjectDatasets"
						}(oo || e("VuforiaHint", oo = {})), e("VuforiaService", so = function ()
						{
							function e(e)
							{
								this.sessionService = e
							}
							return e.prototype.isAvailable = function ()
							{
								return this.sessionService.manager.request("ar.vuforia.isAvailable").then(function (e)
								{
									return e.available
								})
							}, e.prototype.init = function (e)
							{
								var t = this;
								if ("string" == typeof e && (e = {
										encryptedLicenseData: e
									}), !e.encryptedLicenseData || "string" != typeof e.encryptedLicenseData) throw new Error("options.encryptedLicenseData is required.");
								return this.sessionService.manager.request("ar.vuforia.init", e).then(function ()
								{
									return new ao(t.sessionService.manager)
								})
							}, e.prototype.initWithUnencryptedKey = function (e)
							{
								var t = this;
								return "string" == typeof e && (e = {
									key: e
								}), this.sessionService.manager.request("ar.vuforia.init", e).then(function ()
								{
									return new ao(t.sessionService.manager)
								})
							}, e
						}()), e("VuforiaService", so = no([D(Gn, ro), io("design:paramtypes", ["function" == typeof (fo = void 0 !== Gn && Gn) && fo || Object])], so)), e("VuforiaAPI", ao = function ()
						{
							function e(e)
							{
								this.manager = e, this.objectTracker = new co(e)
							}
							return e.prototype.setHint = function (e, t)
							{
								var n = {
									hint: e,
									value: t
								};
								return this.manager.request("ar.vuforia.setHint", n).then(function (e)
								{
									return e.result
								})
							}, e
						}()), e("VuforiaTracker", uo = function ()
						{
							function e()
							{}
							return e
						}()), e("VuforiaObjectTracker", co = function (e)
						{
							function t(t)
							{
								var n = e.call(this) || this;
								return n.managerSession = t, n.dataSetLoadEvent = new sn, n.dataSetUnloadEvent = new sn, n.dataSetActivateEvent = new sn, n.dataSetDeactivateEvent = new sn, n._deprecatedDataSetInstanceMap = new Map, t.on["ar.vuforia.objectTrackerLoadDataSetEvent"] = function (e)
								{
									n.dataSetLoadEvent.raiseEvent(e)
								}, t.on["ar.vuforia.objectTrackerUnloadDataSetEvent"] = function (e)
								{
									n.dataSetUnloadEvent.raiseEvent(e)
								}, t.on["ar.vuforia.objectTrackerActivateDataSetEvent"] = function (e)
								{
									var t = n._deprecatedDataSetInstanceMap.get(e.id);
									t ? (t._onActivate(), n.dataSetActivateEvent.raiseEvent(t)) : n.dataSetActivateEvent.raiseEvent(e)
								}, t.on["ar.vuforia.objectTrackerDeactivateDataSetEvent"] = function (e)
								{
									var t = n._deprecatedDataSetInstanceMap.get(e.id);
									t ? (t._onDeactivate(), n.dataSetActivateEvent.raiseEvent(t)) : n.dataSetDeactivateEvent.raiseEvent(e)
								}, n
							}
							return to(t, e), t.prototype.createDataSet = function (e)
							{
								var t = this;
								return e && window.document && (e = k(e)), this.managerSession.request("ar.vuforia.objectTrackerCreateDataSet",
								{
									url: e
								}).then(function (e)
								{
									var n = new lo(e.id, t.managerSession);
									return t._deprecatedDataSetInstanceMap.set(e.id, n), n
								})
							}, t.prototype.createDataSetFromURL = function (e)
							{
								return e && window.document && (e = k(e)), this.managerSession.request("ar.vuforia.objectTrackerCreateDataSet",
								{
									url: e
								}).then(function (e)
								{
									return e.id
								})
							}, Object.defineProperty(t.prototype, "createDataSetFromURI",
							{
								get: function ()
								{
									return this.createDataSetFromURL
								},
								enumerable: !0,
								configurable: !0
							}), t.prototype.loadDataSet = function (e)
							{
								var t = this;
								return this.managerSession.whenConnected().then(function ()
								{
									return 0 == t.managerSession.version[0] ? t.managerSession.request("ar.vuforia.dataSetLoad",
									{
										id: e
									}) : t.managerSession.request("ar.vuforia.objectTrackerLoadDataSet",
									{
										id: e
									})
								})
							}, t.prototype.unloadDataSet = function (e)
							{
								var t = this;
								return this.managerSession.whenConnected().then(function ()
								{
									return 0 == t.managerSession.version[0] ? t.deactivateDataSet(e) : t.managerSession.request("ar.vuforia.objectTrackerUnloadDataSet",
									{
										id: e
									})
								})
							}, t.prototype.activateDataSet = function (e)
							{
								return e = e instanceof lo ? e.id : e, this.managerSession.request("ar.vuforia.objectTrackerActivateDataSet",
								{
									id: e
								})
							}, t.prototype.deactivateDataSet = function (e)
							{
								return e = e instanceof lo ? e.id : e, this.managerSession.request("ar.vuforia.objectTrackerDeactivateDataSet",
								{
									id: e
								})
							}, t
						}(uo)), no([H("createDataSetFromURL"), io("design:type", Function), io("design:paramtypes", [String]), io("design:returntype", Object)], co.prototype, "createDataSet", null), no([H("createDataSetFromURL"), io("design:type", Object), io("design:paramtypes", [])], co.prototype, "createDataSetFromURI", null), e("DeprecatedVuforiaDataSet", lo = function ()
						{
							function e(e, t)
							{
								this.id = e, this.managerSession = t, this._isActive = !1
							}
							return e.prototype._onActivate = function ()
							{
								this._isActive = !0
							}, e.prototype._onDeactivate = function ()
							{
								this._isActive = !1
							}, e.prototype.fetch = function ()
							{
								return this.managerSession.request("ar.vuforia.dataSetFetch",
								{
									id: this.id
								})
							}, e.prototype.load = function ()
							{
								var e = this;
								return this.managerSession.request("ar.vuforia.dataSetLoad",
								{
									id: this.id
								}).then(function (t)
								{
									return e._trackables = t, t
								})
							}, e.prototype.isActive = function ()
							{
								return this._isActive
							}, e.prototype.getTrackables = function ()
							{
								return this._trackables
							}, e
						}()), po = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, go = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, yo = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("EmptyRealityViewer", Mo = function (e)
						{
							function t(t, n, i, r)
							{
								function o(e)
								{
									switch (e)
									{
									case "W".charCodeAt(0):
										return "moveForward";
									case "S".charCodeAt(0):
										return "moveBackward";
									case "E".charCodeAt(0):
										return "moveUp";
									case "R".charCodeAt(0):
										return "moveDown";
									case "D".charCodeAt(0):
										return "moveRight";
									case "A".charCodeAt(0):
										return "moveLeft";
									default:
										return
									}
								}
								var s = e.call(this, r) || this;
								s.sessionService = t, s.viewService = n, s.container = i, s.uri = r, s.type = "empty", s._moveFlags = {
									moveForward: !1,
									moveBackward: !1,
									moveUp: !1,
									moveDown: !1,
									moveLeft: !1,
									moveRight: !1
								}, s._scratchMatrix3 = new Se, s._scratchMatrix4 = new _e;
								var a = function (e)
									{
										var t = o(e.keyCode);
										void 0 !== t && (s._moveFlags[t] = !0)
									},
									u = function (e)
									{
										var t = o(e.keyCode);
										void 0 !== t && (s._moveFlags[t] = !1)
									};
								return "undefined" != typeof document && s.presentChangeEvent.addEventListener(function ()
								{
									if (s.isPresenting) s.viewService.element.style.backgroundColor = "white", !s._aggregator && s.viewService.element && (s.viewService.element.disableRootEvents = !0, s._aggregator = new ie(s.viewService.element), document.addEventListener("keydown", a, !1), document && document.addEventListener("keyup", u, !1));
									else
									{
										delete s.viewService.element.style.backgroundColor, s._aggregator && s._aggregator.destroy(), s._aggregator = void 0, document && document.removeEventListener("keydown", a), document && document.removeEventListener("keyup", u);
										for (var e in s._moveFlags) s._moveFlags[e] = !1
									}
								}), s
							}
							return po(t, e), t.prototype.load = function ()
							{
								var e = this,
									t = this.container.createChild(),
									n = this.sessionService.addManagedSessionPort(this.uri);
								n.connectEvent.addEventListener(function ()
								{
									e.connectEvent.raiseEvent(n)
								}), t.registerInstance(Yn, new Wn(n, this.sessionService.configuration)), t.registerInstance(Jt,
								{
									role: Kt.REALITY_VIEWER,
									uri: this.uri,
									title: "Empty",
									version: this.sessionService.configuration.version,
									supportsCustomProtocols: !0,
									protocols: ["ar.configureStage@v1"]
								}), t.autoRegisterAll([Gn, hi, Di, kr, Xi, gr]);
								var i = t.get(kr),
									r = t.get(Xi),
									o = t.get(Gn),
									s = t.get(gr),
									a = t.get(bi);
								r.autoSubmitFrame = !1;
								var u, c;
								s.connectEvent.addEventListener(function (t)
								{
									t.on["ar.configureStage.setStageGeolocation"] = function (t)
									{
										var n = t.geolocation;
										u = se.fromRadians(n.longitude, n.latitude, n.height, void 0, u);
										var i = vn(u, void 0, e._scratchMatrix4),
											r = _e.getRotation(i, e._scratchMatrix3);
										c = Re.fromRotationMatrix(r, c)
									}, t.on["ar.configureStage.resetStageGeolocation"] = function ()
									{
										u = void 0, c = void 0
									}
								}), o.manager.connectEvent.addEventListener(function ()
								{
									o.manager.suppressErrorOnUnknownTopic = !0;
									var t = 0,
										n = 0,
										s = new Re,
										l = new Re,
										h = new Re,
										d = new se,
										f = new se,
										p = new Se,
										g = new se(0, 0, 1),
										y = new se(1, 0, 0),
										M = new se(0, -1, 0),
										v = new je,
										A = new se(0, 0, -1),
										E = r.stage,
										m = r.user,
										w = [],
										N = i.createEntityPose(m, E),
										D = function ()
										{
											r.suggestedGeolocationSubscription ? r.subscribeGeolocation(r.suggestedGeolocationSubscription) : r.unsubscribeGeolocation()
										};
									D();
									var T = r.suggestedGeolocationSubscriptionChangeEvent.addEventListener(D),
										I = r.frameStateEvent.addEventListener(function (E)
										{
											if (!o.manager.isClosed)
											{
												var m = e._aggregator,
													D = e._moveFlags;
												if (e.isPresenting)
												{
													if (on.clone(E.subviews, w), !r.strict)
													{
														if (Y(w[0].projectionMatrix, v), v.fov = a.subviews[0] && a.subviews[0].frustum.fov || Oe.PI_OVER_THREE, m && m.isMoving(re.WHEEL))
														{
															I = m.getMovement(re.WHEEL).endPosition.y;
															v.fov = Math.min(Math.max(v.fov - .02 * I, Math.PI / 8), Math.PI - Math.PI / 8)
														}
														if (m && m.isMoving(re.PINCH))
														{
															var T = m.getMovement(re.PINCH),
																I = T.distance.endPosition.y - T.distance.startPosition.y;
															v.fov = Math.min(Math.max(v.fov - .02 * I, Math.PI / 8), Math.PI - Math.PI / 8)
														}
														w.forEach(function (e)
														{
															var t = e.viewport.width / e.viewport.height;
															v.aspectRatio = isFinite(t) ? t : 1, _e.clone(v.projectionMatrix, e.projectionMatrix)
														})
													}
													var O = E.time;
													N.update(O);
													var S = !(N.status & li.KNOWN),
														_ = S ? Ln || jn ? "3DOF" : "6DOF" : r.userTracking;
													if (S)
													{
														var L = i.user,
															j = z(L, O, F = i.stage, d) || se.fromElements(0, "hand" === r.displayMode ? .75 * Wt : Wt, 0, d),
															x = P(L, O, F, s) || Re.clone(Re.IDENTITY, s);
														if (m && m.isMoving(re.LEFT_DRAG))
														{
															var b = m.getMovement(re.LEFT_DRAG);
															if (x)
															{
																var C = E.viewport;
																t += v.fov * (b.endPosition.x - b.startPosition.x) / C.width, n += v.fovy * (b.endPosition.y - b.startPosition.y) / C.height, n = Math.min(Math.max(-Oe.PI_OVER_TWO, n), Oe.PI_OVER_TWO);
																var R = Re.fromAxisAngle(se.UNIT_X, n, l),
																	U = Re.fromAxisAngle(se.UNIT_Y, t, h),
																	k = Re.multiply(U, R, s);
																L.orientation.setValue(k)
															}
														}
														Se.fromQuaternion(x, p), Se.multiplyByVector(p, se.UNIT_Y, g), Se.multiplyByVector(p, se.UNIT_X, y), Se.multiplyByVector(p, A, M);
														D.moveForward && (se.multiplyByScalar(M, .02, f), se.add(j, f, j)), D.moveBackward && (se.multiplyByScalar(M, -.02, f), se.add(j, f, j)), D.moveUp && (se.multiplyByScalar(g, .02, f), se.add(j, f, j)), D.moveDown && (se.multiplyByScalar(g, -.02, f), se.add(j, f, j)), D.moveLeft && (se.multiplyByScalar(y, -.02, f), se.add(j, f, j)), D.moveRight && (se.multiplyByScalar(y, .02, f), se.add(j, f, j)), L.position.setValue(j, F), L.orientation.setValue(x)
													}
													var B = !(!u || !c);
													if (B)
													{
														var F = i.stage;
														F.position.setValue(u, Pe.FIXED), F.orientation.setValue(c)
													}
													var Q = i.createFrameState(O, E.viewport, w,
													{
														overrideUser: S,
														overrideStage: B,
														userTracking: _
													});
													i.submitFrameState(Q), m && m.reset()
												}
												else m && m.reset()
											}
										});
									o.manager.closeEvent.addEventListener(function ()
									{
										T(), I()
									})
								}), o.connect()
							}, t
						}(hr)), e("EmptyRealityViewer", Mo = go([D(Gn, bi, zt), yo("design:paramtypes", ["function" == typeof (vo = void 0 !== Gn && Gn) && vo || Object, "function" == typeof (Ao = void 0 !== bi && bi) && Ao || Object, "function" == typeof (Eo = void 0 !== zt && zt) && Eo || Object, String])], Mo)), mo = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, wo = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, No = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("LiveRealityViewer", Do = function (e)
						{
							function t(t, n, i, r, o)
							{
								var s = e.call(this, o) || this;
								if (s.sessionService = t, s.viewService = n, s.contextService = i, s.deviceService = r, s.uri = o, s.userTracking = "3DOF", "undefined" != typeof document)
								{
									s.settingsIframe = document.createElement("iframe"), s.settingsIframe.width = "0", s.settingsIframe.height = "0", s.settingsIframe.src = "https://argonjs.io/tools.argonjs.io/", s.settingsIframe.style.display = "none", s.videoFov = Math.PI / 2, s.videoElement = document.createElement("video"), s.videoElement.style.width = "100%", s.videoElement.style.height = "height:100%", s.videoElement.controls = !1, s.videoElement.autoplay = !0, s.videoElement.style.display = "none";
									var a = s.viewService.element;
									a.insertBefore(s.settingsIframe, a.firstChild), a.insertBefore(s.videoElement, a.firstChild), s.canvas = document.createElement("canvas"), s.context = s.canvas.getContext("2d"), window.addEventListener("message", function (e)
									{
										"http://argonjs.io" === e.origin && (s.videoFov = e.data)
									})
								}
								return s.presentChangeEvent.addEventListener(function ()
								{
									"undefined" != typeof document && (s.videoElement.style.display = s.isPresenting ? "initial" : "none")
								}), s
							}
							return mo(t, e), t.prototype.destroy = function ()
							{
								e.prototype.destroy.call(this), "undefined" != typeof document && (this.settingsIframe.remove(), this.videoElement.remove(), this.canvas.remove())
							}, t.prototype.setupInternalSession = function (e)
							{
								var t = this;
								e.connectEvent.addEventListener(function ()
								{
									if (t.videoElement)
									{
										var n = t.videoElement,
											i = navigator.mediaDevices;
										(i.getUserMedia || i.mozGetUserMedia || i.msGetUserMedia || i.webkitGetUserMedia).bind(i)(
										{
											audio: !1,
											video: !0
										}).then(function (t)
										{
											var i = function ()
											{
												for (var e = 0, n = t.getTracks(); e < n.length; e++) n[e].stop()
											};
											e.isConnected ? (n.src = window.URL.createObjectURL(t), e.closeEvent.addEventListener(i)) : i()
										}).catch(function (t)
										{
											e.errorEvent.raiseEvent(t)
										});
										var r = -1,
											o = t.deviceService.suggestedGeolocationSubscriptionChangeEvent.addEventListener(function ()
											{
												t.deviceService.suggestedGeolocationSubscription ? t.deviceService.subscribeGeolocation(t.deviceService.suggestedGeolocationSubscription, e) : t.deviceService.unsubscribeGeolocation()
											}),
											s = t.deviceService.frameStateEvent.addEventListener(function (i)
											{
												if (n.currentTime != r)
												{
													r = n.currentTime;
													var o = t.contextService.createFrameState(i.time, i.viewport, i.subviews,
													{
														userTracking: t.userTracking
													});
													e.send("ar.reality.frameState", o)
												}
											});
										e.closeEvent.addEventListener(function ()
										{
											o(), s()
										})
									}
								})
							}, t.prototype.load = function ()
							{
								var e = this,
									t = this.sessionService.addManagedSessionPort(this.uri);
								t.connectEvent.addEventListener(function ()
								{
									e.connectEvent.raiseEvent(t)
								});
								var n = this.sessionService.createSessionPort(this.uri);
								n.suppressErrorOnUnknownTopic = !0, this.setupInternalSession(n), Promise.resolve().then(function ()
								{
									if (!e.sessionService.manager.isClosed)
									{
										var i = e.sessionService.createSynchronousMessageChannel();
										t.open(i.port1, e.sessionService.configuration), n.open(i.port2,
										{
											role: Kt.REALITY_VIEWER,
											title: "Live",
											uri: e.uri,
											version: e.sessionService.configuration.version
										})
									}
								})
							}, t.isAvailable = function ()
							{
								if ("undefined" != typeof navigator && navigator.mediaDevices)
								{
									var e = navigator.mediaDevices;
									return !!(e.getUserMedia || e.mozGetUserMedia || e.msGetUserMedia || e.webkitGetUserMedia)
								}
								return !1
							}, t.prototype.getVideoFrame = function (e, t, n, i)
							{
								return this.canvas.width = this.videoElement.videoWidth, this.canvas.height = this.videoElement.videoHeight, this.context.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height), this.context.getImageData(e, t, n, i)
							}, t
						}(hr)), e("LiveRealityViewer", Do = wo([D(Gn, bi, kr, Xi), No("design:paramtypes", ["function" == typeof (To = void 0 !== Gn && Gn) && To || Object, "function" == typeof (Io = void 0 !== bi && bi) && Io || Object, "function" == typeof (Oo = void 0 !== kr && kr) && Oo || Object, "function" == typeof (So = void 0 !== Xi && Xi) && So || Object, String])], Do)), _o = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, Lo = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, jo = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("HostedRealityViewer", xo = function (e)
						{
							function t(t, n, i)
							{
								var r = e.call(this, i) || this;
								if (r.sessionService = t, r.viewService = n, r.uri = i, r.type = "hosted", "undefined" != typeof document && document.createElement)
								{
									var o = r.iframeElement = document.createElement("iframe");
									o.name = O(), o.style.border = "0", o.width = "100%", o.height = "100%", o.style.position = "absolute", o.style.opacity = "0", o.style.pointerEvents = "none";
									var s = r.viewService.element;
									s.insertBefore(o, s.firstChild), r.presentChangeEvent.addEventListener(function ()
									{
										r.iframeElement.style.opacity = r.isPresenting ? "1" : "0"
									})
								}
								return r
							}
							return _o(t, e), t.prototype.destroy = function ()
							{
								e.prototype.destroy.call(this), this.iframeElement && this.iframeElement.remove()
							}, t.prototype.load = function ()
							{
								var e = this;
								if ("undefined" != typeof document && document.createElement)
								{
									var t = this.sessionService.addManagedSessionPort(this.uri);
									t.connectEvent.addEventListener(function ()
									{
										e.sessionService.manager.isClosed || e.connectEvent.raiseEvent(t)
									});
									var n = function (i)
									{
										if ("ARGON_SESSION" === i.data.type)
										{
											var r = i.data.name,
												o = i.ports && i.ports[0];
											if (!o) throw new Error("Received an ARGON_SESSION message without a MessagePort object");
											r === e.iframeElement.name && (window.removeEventListener("message", n), t.open(o, e.sessionService.configuration))
										}
									};
									window.addEventListener("message", n), this.iframeElement.src = "", this.iframeElement.src = this.uri
								}
							}, t
						}(hr)), e("HostedRealityViewer", xo = Lo([D(Gn, bi), jo("design:paramtypes", ["function" == typeof (bo = void 0 !== Gn && Gn) && bo || Object, "function" == typeof (Co = void 0 !== bi && bi) && Co || Object, String])], xo)), Ro = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, zo = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, Po = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("WebRTCRealityViewer", Uo = function (e)
						{
							function t(t, n, i, r, o)
							{
								function s(e)
								{
									switch (e)
									{
									case "W".charCodeAt(0):
										return "moveForward";
									case "S".charCodeAt(0):
										return "moveBackward";
									case "E".charCodeAt(0):
										return "moveUp";
									case "R".charCodeAt(0):
										return "moveDown";
									case "D".charCodeAt(0):
										return "moveRight";
									case "A".charCodeAt(0):
										return "moveLeft";
									default:
										return
									}
								}
								var a = e.call(this, o) || this;
								a.sessionService = t, a.viewService = n, a.contextService = i, a.container = r, a.uri = o, a.type = "webrtc", a.userTracking = "3DOF", a._sharedCanvasFinal = !1, a._scratchCartesian = new se, a._scratchQuaternion = new Re, a._artoolkitTrackerEntity = new ve(
								{
									position: new de(se.ZERO, a.contextService.user),
									orientation: new fe(Re.IDENTITY)
								}), a._markerEntities = new Map, a._moveFlags = {
									moveForward: !1,
									moveBackward: !1,
									moveUp: !1,
									moveDown: !1,
									moveLeft: !1,
									moveRight: !1
								}, a._scratchMatrix3 = new Se, a._scratchMatrix4 = new _e, a._artoolkitReady = new Promise(function (e, t)
								{
									a._resolveReady = e, a._rejectReady = t
								});
								var u = function (e)
									{
										var t = s(e.keyCode);
										void 0 !== t && (a._moveFlags[t] = !0)
									},
									c = function (e)
									{
										var t = s(e.keyCode);
										void 0 !== t && (a._moveFlags[t] = !1)
									};
								return "undefined" != typeof document && a.presentChangeEvent.addEventListener(function ()
								{
									if (a.isPresenting) a.viewService.element.style.backgroundColor = "white", !a._aggregator && a.viewService.element && (a.viewService.element.disableRootEvents = !0, a._aggregator = new ie(a.viewService.element), document.addEventListener("keydown", u, !1), document && document.addEventListener("keyup", c, !1));
									else
									{
										delete a.viewService.element.style.backgroundColor, a._aggregator && a._aggregator.destroy(), a._aggregator = void 0, document && document.removeEventListener("keydown", u), document && document.removeEventListener("keyup", c);
										for (var e in a._moveFlags) a._moveFlags[e] = !1
									}
								}), a.viewService.viewportChangeEvent.addEventListener(function (e)
								{
									a.updateViewport(e)
								}), a.initARToolKit().then(function ()
								{
									a._resolveReady()
								}, function (e)
								{
									a._rejectReady(e)
								}), a
							}
							return Ro(t, e), t.prototype.load = function ()
							{
								var e = this,
									t = this.container.createChild(),
									n = this.sessionService.addManagedSessionPort(this.uri);
								n.connectEvent.addEventListener(function ()
								{
									e.connectEvent.raiseEvent(n)
								}), t.registerInstance(Yn, new Wn(n, this.sessionService.configuration)), t.registerInstance(Jt,
								{
									role: Kt.REALITY_VIEWER,
									uri: this.uri,
									title: "WebRTC",
									version: this.sessionService.configuration.version,
									supportsCustomProtocols: !0,
									protocols: ["ar.configureStage@v1", "ar.jsartoolkit"],
									sharedCanvas: !0
								}), t.autoRegisterAll([Gn, hi, Di, kr, Xi, gr]);
								var i = t.get(kr),
									r = t.get(Xi),
									o = t.get(Gn),
									s = t.get(gr),
									a = t.get(bi);
								r.autoSubmitFrame = !1;
								var u, c;
								s.connectEvent.addEventListener(function (t)
								{
									t.on["ar.configureStage.setStageGeolocation"] = function (t)
									{
										var n = t.geolocation;
										u = se.fromRadians(n.longitude, n.latitude, n.height, void 0, u);
										var i = vn(u, void 0, e._scratchMatrix4),
											r = _e.getRotation(i, e._scratchMatrix3);
										c = Re.fromRotationMatrix(r, c)
									}, t.on["ar.configureStage.resetStageGeolocation"] = function ()
									{
										u = void 0, c = void 0
									}, t.on["ar.jsartoolkit.init"] = function ()
									{
										return console.log("*** ar.jsartoolkit.init ***"), new Promise(function (t, n)
										{
											e._artoolkitReady.then(function ()
											{
												var n = Re.fromAxisAngle(se.UNIT_X, Oe.PI);
												e._artoolkitTrackerEntity.orientation.setValue(n), e._arController.addEventListener("getMarker", function (t)
												{
													var n = t.data.marker,
														i = e._getIdForMarker(n.id),
														r = e.contextService.entities.getById(i);
													if (r)
													{
														var o = t.data.matrix,
															s = _e.getTranslation(o, e._scratchCartesian),
															a = _e.getRotation(o, e._scratchMatrix3),
															u = Re.fromRotationMatrix(a, e._scratchQuaternion);
														r.position instanceof de ? r.position.setValue(s, e._artoolkitTrackerEntity) : r.position = new de(s, e._artoolkitTrackerEntity), r.orientation instanceof fe ? r.orientation.setValue(u) : r.orientation = new fe(u)
													}
												}), t()
											}, function (e)
											{
												console.log(e), n(e)
											})
										})
									}, t.on["ar.jsartoolkit.addMarker"] = function (t)
									{
										return console.log("*** ar.jsartoolkit.addMarker ***"), console.log("*** url: " + t.url), new Promise(function (n, i)
										{
											e._arController.loadMarker(t.url, function (t)
											{
												var i = e._getIdForMarker(t),
													r = new ve(
													{
														id: i
													});
												e.contextService.entities.add(r), e._markerEntities.set(i, r), n(
												{
													id: i
												})
											}, function (e)
											{
												console.log(e), i(e)
											})
										})
									}
								}), o.manager.connectEvent.addEventListener(function ()
								{
									o.manager.suppressErrorOnUnknownTopic = !0;
									var t = new Re,
										n = new Re,
										s = new se,
										l = new se,
										h = new Se,
										d = new se(0, 0, 1),
										f = new se(1, 0, 0),
										p = new se(0, -1, 0),
										g = new je,
										y = r.stage,
										M = r.user,
										v = new se(0, 0, -1),
										A = [],
										E = i.createEntityPose(M, y),
										m = function ()
										{
											r.suggestedGeolocationSubscription ? r.subscribeGeolocation(r.suggestedGeolocationSubscription) : r.unsubscribeGeolocation()
										};
									m();
									var w = r.suggestedGeolocationSubscriptionChangeEvent.addEventListener(m),
										N = r.frameStateEvent.addEventListener(function (y)
										{
											if (!o.manager.isClosed)
											{
												var M = e._aggregator,
													m = e._moveFlags;
												if (e.isPresenting)
												{
													if (on.clone(y.subviews, A), !r.strict)
													{
														if (Y(A[0].projectionMatrix, g), g.fov = a.subviews[0] && a.subviews[0].frustum.fov || Oe.PI_OVER_THREE, M && M.isMoving(re.WHEEL))
														{
															N = M.getMovement(re.WHEEL).endPosition.y;
															g.fov = Math.min(Math.max(g.fov - .02 * N, Math.PI / 8), Math.PI - Math.PI / 8)
														}
														if (M && M.isMoving(re.PINCH))
														{
															var w = M.getMovement(re.PINCH),
																N = w.distance.endPosition.y - w.distance.startPosition.y;
															g.fov = Math.min(Math.max(g.fov - .02 * N, Math.PI / 8), Math.PI - Math.PI / 8)
														}
														A.forEach(function (t)
														{
															var n = t.viewport.width / t.viewport.height;
															g.aspectRatio = isFinite(n) ? n : 1, _e.clone(g.projectionMatrix, t.projectionMatrix), e._artoolkitProjection && _e.clone(e._artoolkitProjection, t.projectionMatrix)
														})
													}
													var D = y.time;
													E.update(D);
													var T = !(E.status & li.KNOWN);
													if (T)
													{
														var I = i.user,
															O = z(I, D, x = i.stage, s) || se.fromElements(0, r.suggestedUserHeight, 0, s),
															S = P(I, D, x, t) || Re.clone(Re.IDENTITY, t);
														if (M && M.isMoving(re.LEFT_DRAG))
														{
															var _ = M.getMovement(re.LEFT_DRAG);
															if (S)
															{
																var L = Re.fromAxisAngle(se.UNIT_Y, g.fov * (_.endPosition.x - _.startPosition.x) / y.viewport.width, n);
																S = Re.multiply(S, L, L), I.orientation.setValue(S)
															}
														}
														Se.fromQuaternion(S, h), Se.multiplyByVector(h, se.UNIT_Y, d), Se.multiplyByVector(h, se.UNIT_X, f), Se.multiplyByVector(h, v, p);
														m.moveForward && (se.multiplyByScalar(p, .02, l), se.add(O, l, O)), m.moveBackward && (se.multiplyByScalar(p, -.02, l), se.add(O, l, O)), m.moveUp && (se.multiplyByScalar(d, .02, l), se.add(O, l, O)), m.moveDown && (se.multiplyByScalar(d, -.02, l), se.add(O, l, O)), m.moveLeft && (se.multiplyByScalar(f, -.02, l), se.add(O, l, O)), m.moveRight && (se.multiplyByScalar(f, .02, l), se.add(O, l, O)), I.position.setValue(O, x), I.orientation.setValue(S)
													}
													var j = !(!u || !c);
													if (j)
													{
														var x = i.stage;
														x.position.setValue(u, Pe.FIXED), x.orientation.setValue(c)
													}
													e._arScene && (e._resetMarkers(), e._arScene.process(), e._arScene.renderOn(e._renderer));
													var b = i.createFrameState(D, y.viewport, A,
													{
														overrideUser: T,
														overrideStage: j,
														userTracking: e.userTracking
													});
													i.submitFrameState(b), M && M.reset()
												}
												else M && M.reset()
											}
										});
									o.manager.closeEvent.addEventListener(function ()
									{
										w(), N()
									})
								}), o.connect()
							}, t.prototype._getIdForMarker = function (e)
							{
								return "jsartoolkit_marker_" + e
							}, t.prototype._resetMarkers = function ()
							{
								this._markerEntities.forEach(function (e, t, n)
								{
									e.position = void 0, e.orientation = void 0
								})
							}, t.prototype.initARToolKit = function ()
							{
								var e = this;
								return new Promise(function (t, n)
								{
									var i = document.createElement("script");
									i.src = "https://rawgit.com/blairmacintyre/jsartoolkit5/master/build/artoolkit.min.js", i.onload = function ()
									{
										console.log("*** artoolkit.min.js loaded ***");
										var i = document.createElement("script");
										i.src = "https://rawgit.com/blairmacintyre/jsartoolkit5/master/js/artoolkit.api.js", i.onload = function ()
										{
											console.log("*** artoolkit.api.js loaded ***"), ko(), e.initARController().then(function ()
											{
												t()
											}, function (e)
											{
												n(e)
											})
										}, document.head.appendChild(i)
									}, document.head.appendChild(i)
								})
							}, t.prototype.initARController = function ()
							{
								var e = this;
								return new Promise(function (t, n)
								{
									ARController.getUserMediaThreeScene(
									{
										width: 240,
										height: 240,
										cameraParam: 45 * Math.PI / 180,
										onSuccess: function (n, i, r)
										{
											console.log("*** getUserMediaThreeScene success ***"), e._arScene = n, e._arController = i, e.updateViewport(e.viewService.viewport), document.body.className = i.orientation;
											var o;
											if (e.viewService.layers)
												for (var s = 0, a = e.viewService.layers; s < a.length; s++)
												{
													var u = a[s];
													u.source instanceof HTMLCanvasElement && (o = u.source)
												}
											if (e.isSharedCanvas && !o && console.log("sharedCanvas is true but no canvas registered with setLayers"), e.isSharedCanvas && o) console.log("Found argon canvas, video background is sharing its context"), e._renderer = new THREE.WebGLRenderer(
											{
												canvas: o,
												antialias: !1
											}), e._sharedCanvasFinal = !0;
											else
											{
												console.log("No argon shared canvas, creating one for video background");
												var c = new THREE.WebGLRenderer(
												{
													antialias: !1
												});
												c.setSize(e.viewService.renderWidth, e.viewService.renderHeight, !0), e.viewService.element.insertBefore(c.domElement, e.viewService.element.firstChild), c.domElement.style.zIndex = "0", e._renderer = c, e._sharedCanvasFinal = !1
											}
											t()
										},
										onError: function (e)
										{
											n(e)
										}
									})
								})
							}, t.prototype.updateViewport = function (e)
							{
								if (this._arController)
								{
									console.log("updateViewport size: " + e.width + ", " + e.height), console.log("camera image size: " + this._arController.image.videoWidth + ", " + this._arController.image.videoHeight);
									var t = e.width / e.height,
										n = this._arController.image.videoWidth / this._arController.image.videoHeight;
									console.log("canvasAspect: " + t), console.log("cameraAspect: " + n), t > n ? (console.log("canvas is wider than camera image"), this._arScene.videoPlane.scale.x = 1, this._arScene.videoPlane.scale.y = t / n) : (console.log("camera image is wider than canvas"), this._arScene.videoPlane.scale.x = n / t, this._arScene.videoPlane.scale.y = 1), !this._sharedCanvasFinal && this._renderer && this._renderer.setSize(this.viewService.renderWidth, this.viewService.renderHeight, !0), this.updateProjection(e)
								}
							}, t.prototype.updateProjection = function (e)
							{
								var t = new je,
									n = _e.fromArray(this._arController.getCameraMatrix());
								console.log("ARToolKit projection:"), console.log(_e.toArray(n)), n[4] *= -1, n[5] *= -1, n[6] *= -1, n[7] *= -1, n[8] *= -1, n[9] *= -1, n[10] *= -1, n[11] *= -1, console.log("Cesium-ready projection:"), console.log(_e.toArray(n));
								try
								{
									console.log("BEFORE:"), Y(n, t), console.log("projMatrix aspect: " + t.aspectRatio), console.log("projMatrix fov: " + t.fov), console.log("projMatrix near: " + t.near), console.log("projMatrix far: " + t.far), console.log("projMatrix fovy: " + t.fovy)
								}
								catch (e)
								{
									console.log("*** error: " + e)
								}
								var i = e.width / e.height;
								t.aspectRatio = i, t.near = Xt, t.far = Zt, n = t.projectionMatrix, this._artoolkitProjection = _e.clone(n);
								try
								{
									console.log("AFTER:"), Y(n, t), console.log("projMatrix aspect: " + t.aspectRatio), console.log("projMatrix fov: " + t.fov), console.log("projMatrix near: " + t.near), console.log("projMatrix far: " + t.far), console.log("projMatrix fovy: " + t.fovy)
								}
								catch (e)
								{
									console.log("*** error: " + e)
								}
							}, t
						}(hr)), e("WebRTCRealityViewer", Uo = zo([D(Gn, bi, kr, zt), Po("design:paramtypes", ["function" == typeof (Bo = void 0 !== Gn && Gn) && Bo || Object, "function" == typeof (Fo = void 0 !== bi && bi) && Fo || Object, "function" == typeof (Qo = void 0 !== kr && kr) && Qo || Object, "function" == typeof (Yo = void 0 !== zt && zt) && Yo || Object, String])], Uo)), ko = function ()
						{
							ARController.getUserMedia = function (e)
							{
								var t = e.onSuccess,
									n = e.onError || function (e)
									{
										console.error("ARController.getUserMedia", e)
									};
								//E: changed navigator.getUserMedia to navigator.mediaDevices.getUserMedia
								//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
								navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;
								var i = document.createElement("video");
								if (i.style.width = e.width + "px", i.style.height = e.height + "px", void 0 !== navigator.mediaDevices.getUserMedia)
								//E:
								{
									if (void 0 !== navigator.mediaDevices && void 0 !== navigator.mediaDevices.enumerateDevices) return navigator.mediaDevices.enumerateDevices().then(function (r)
									{
										var o = {
											audio: !1,
											video:
											{
												mandatory:
												{
													maxWidth: e.width,
													maxHeight: e.height
												}
											}
										};
										r.forEach(function (e)
										{
											"videoinput" === e.kind && (o.video.optional = [
											{
												sourceId: e.deviceId
											}])
										//E: changed navigator.getUserMedia to navigator.mediaDevices.getUserMedia
										}), navigator.mediaDevices.getUserMedia(o, function (e)
										{
											//E: changed src to srcObject
											//i.src = window.URL.createObjectURL(e), document.body.addEventListener("click", function ()
											i.srcObject = window.URL.createObjectURL(e), document.body.addEventListener("click", function ()
											{
												i.play()
											});
											var n = setInterval(function ()
											{
												i.videoWidth && (console.log("video element: " + i.videoWidth + ", " + i.videoHeight), t(i), clearInterval(n))
											}, 20)
										}, function (e)
										{
											console.log("Can't access user media", e), alert("Can't access user media :()"), n("Can't access user media", e)
										})
									}).catch(function (e)
									{
										console.log(e.name + ": " + e.message), n(e.name + ": " + e.message)
									}), i;
									n("browser does not support navigator.mediaDevices.enumerateDevices")
								}
								else n("browser does not support navigator.getUserMedia")
							}, ARController.getUserMediaThreeScene = function (e)
							{
								var t = {};
								for (var n in e) t[n] = e[n];
								var i = e.onSuccess;
								return t.onSuccess = function (e, t)
								{
									e.setProjectionNearPlane(.01), e.setProjectionFarPlane(1e5);
									var n = e.createThreeScene();
									i(n, e, t)
								}, this.getUserMediaARController(t)
							}, ARController.prototype.createThreeScene = function (e)
							{
								e = e || this.image;
								var t = new THREE.Texture(e);
								t.minFilter = THREE.LinearFilter, t.flipY = !1;
								var n = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial(
								{
									map: t,
									side: THREE.DoubleSide
								}));
								n.material.depthTest = !1, n.material.depthWrite = !1;
								var i = new THREE.OrthographicCamera(-.5, .5, -.5, .5, -.5, .5),
									r = new THREE.Scene;
								r.add(n), r.add(i), "portrait" === this.orientation && (n.rotation.z === 1 / 2 * Math.PI);
								var o = new THREE.Scene,
									s = new THREE.Camera;
								s.matrixAutoUpdate = !1, s.projectionMatrix.fromArray(this.getCameraMatrix()), o.add(s);
								var a = this;
								return {
									scene: o,
									videoScene: r,
									camera: s,
									videoCamera: i,
									arController: this,
									video: e,
									videoPlane: n,
									process: function ()
									{
										a.process(e)
									},
									renderOn: function (e)
									{
										if (e)
										{
											e.resetGLState(), t.needsUpdate = !0;
											var n = e.autoClear;
											e.autoClear = !1, e.clear(), e.render(this.videoScene, this.videoCamera), e.render(this.scene, this.camera), e.autoClear = n
										}
									}
								}
							}
						}, Go = function (e, t)
						{
							function n()
							{
								this.constructor = e
							}
							for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
							e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
						}, Vo = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, qo = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("TangoRealityViewer", Ho = function (e)
						{
							function t(t, n, i, r, o, s, a)
							{
								var u = e.call(this, s) || this;
								return u.sessionService = t, u.viewService = n, u.contextService = i, u.container = r, u.deviceService = o, u.uri = s, u.vrDisplay = a, u.type = "tango", u.userTracking = "6DOF", u._pointsToSkip = 0, u._frameData = new VRFrameData, u._renderPointCloud = !1, u._usePointCloudForOcclusion = !1, u._initFinished = !1, u._sharedCanvasFinal = !1, u._vrDisplay = void 0, u._lastGeoHorizontalAccuracy = 999, u._lastGeoHeadingAccuracy = 999, u._tangoOriginLost = !0, u._scratchMatrix3 = new Se, u._scratchMatrix4 = new _e, u._scratchCartesian = new se, u._scratchQuaternion = new Re, u.points_vertexShader = "attribute vec3 position;\nuniform float size;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 plane;\nuniform float distance;\nuniform float cameraNear;\nuniform float cameraFar;\nvarying float v_discard;\nvarying vec3 color;\nvoid main(void) {\n    vec4 v4Position = vec4(position, 1.0);\n    float d = dot(plane, v4Position);\n    v_discard = 0.0;\n    if (abs(d) < distance) v_discard = 1.0;\n    gl_PointSize = size;\n    gl_Position = projectionMatrix * modelViewMatrix * v4Position;\n    float depth = 1.0 - ((gl_Position.z - cameraNear) / (cameraFar - cameraNear));\n    color = vec3(depth);\n}", u.points_fragmentShader = "precision mediump float;\nvarying vec3 color;\nuniform float opacity;\nvarying float v_discard;\nvoid main(void) {\n    if (v_discard > 0.0) discard;\n    gl_FragColor = vec4( color, opacity );\n}", u.viewService.viewportChangeEvent.addEventListener(function (e)
								{
									u.updateViewport(e)
								}), u
							}
							return Go(t, e), t.prototype.load = function ()
							{
								var e = this,
									t = this.container.createChild(),
									n = this.sessionService.addManagedSessionPort(this.uri);
								n.connectEvent.addEventListener(function ()
								{
									e.connectEvent.raiseEvent(n)
								}), t.registerInstance(Yn, new Wn(n, this.sessionService.configuration)), t.registerInstance(Jt,
								{
									role: Kt.REALITY_VIEWER,
									uri: this.uri,
									title: "Tango",
									version: this.sessionService.configuration.version,
									supportsCustomProtocols: !0,
									protocols: ["ar.configureStage@v1", "ar.tango"],
									sharedCanvas: !0
								}), t.autoRegisterAll([Gn, hi, Di, kr, Xi, gr]);
								var i = t.get(kr),
									r = t.get(Xi),
									o = t.get(Gn),
									s = t.get(gr),
									a = new ve(
									{
										id: "tango",
										position: new de(void 0, i.stage),
										orientation: new fe(Re.IDENTITY)
									});
								r.autoSubmitFrame = !1;
								var u, c;
								s.connectEvent.addEventListener(function (t)
								{
									t.on["ar.configureStage.setStageGeolocation"] = function (t)
									{
										var n = t.geolocation;
										u = se.fromRadians(n.longitude, n.latitude, n.height, void 0, u);
										var i = vn(u, void 0, e._scratchMatrix4),
											r = _e.getRotation(i, e._scratchMatrix3);
										c = Re.fromRotationMatrix(r, c)
									}, t.on["ar.configureStage.resetStageGeolocation"] = function ()
									{
										u = void 0, c = void 0
									}, t.on["ar.tango.togglePointCloud"] = function ()
									{
										return e._renderPointCloud = !e._renderPointCloud, Promise.resolve(
										{
											result: e._renderPointCloud
										})
									}, t.on["ar.tango.getPickingPointAndPlaneInPointCloud"] = function (t)
									{
										var n = t.x,
											i = t.y;
										if (e._vrDisplay)
										{
											var r = e._vrDisplay.getPickingPointAndPlaneInPointCloud(n, i);
											return r ? Promise.resolve(
											{
												point: r.point,
												plane: r.plane
											}) : Promise.reject(new Error("Tango reality could not find a point and plane"))
										}
										return Promise.reject(new Error("vrDisplay not configured yet"))
									}, t.on["ar.tango.toggleOcclusion"] = function ()
									{
										return e._usePointCloudForOcclusion = !e._usePointCloudForOcclusion, Promise.resolve(
										{
											result: e._usePointCloudForOcclusion
										})
									}, t.on["ar.tango.addMarker"] = function (t)
									{
										return new Promise(function (t, n)
										{
											console.log(e.contextService)
										})
									}
								}), o.manager.connectEvent.addEventListener(function ()
								{
									o.manager.suppressErrorOnUnknownTopic = !0;
									var t = [],
										n = function ()
										{
											r.suggestedGeolocationSubscription ? r.subscribeGeolocation(r.suggestedGeolocationSubscription) : r.unsubscribeGeolocation()
										};
									n();
									var s = r.suggestedGeolocationSubscriptionChangeEvent.addEventListener(n),
										u = r.frameStateEvent.addEventListener(function (n)
										{
											if (!o.manager.isClosed)
											{
												on.clone(n.subviews, t);
												var r, s, u = n.time,
													c = i.user,
													l = i.stage;
												e._vrDisplay.getFrameData(e._frameData);
												var h = e._frameData.pose.position;
												if (r = new se(h[0], h[1], h[2]), e._tangoOriginLostPreviousFrame = e._tangoOriginLost, e._tangoOriginLost = r.equals(se.ZERO) || NaN === r.x, e._tangoOriginLost) r = void 0, s = void 0;
												else
												{
													var d = e._frameData.pose.orientation;
													s = new Re(d[0], d[1], d[2], d[3])
												}
												c.position.setValue(r, a), c.orientation.setValue(s);
												var f = e.deviceService.geoHorizontalAccuracy || 999,
													p = e.deviceService.geoHeadingAccuracy || 999,
													g = e._lastGeoHorizontalAccuracy > f,
													y = e._lastGeoHeadingAccuracy > p,
													M = e._tangoOriginLostPreviousFrame && !e._tangoOriginLost,
													v = g || M || y;
												if (r && s && v)
												{
													M ? (console.log("Tango origin has been reset."), e._lastGeoHeadingAccuracy = e._lastGeoHorizontalAccuracy = 999, e._tangoOriginLost = !1) : g ? (console.log("Current horizontal accuracy has been inproved to:" + e.deviceService.geoHorizontalAccuracy), e._lastGeoHorizontalAccuracy = f) : y && (console.log("Current heading accuracy has been inproved to:" + e.deviceService.geoHeadingAccuracy), e._lastGeoHeadingAccuracy = p), a.position.setValue(se.ZERO, Pe.FIXED), a.orientation.setValue(Re.IDENTITY);
													var A = mn(a, u, c, e._scratchCartesian),
														E = wn(a, u, c, e._scratchQuaternion);
													a.position.setValue(A, e.deviceService.user), a.orientation.setValue(E);
													var m = mn(a, u, Pe.FIXED, e._scratchCartesian),
														w = wn(a, u, Pe.FIXED, e._scratchQuaternion);
													a.position.setValue(m, Pe.FIXED), a.orientation.setValue(w)
												}
												if (l.position.setValue(se.fromElements(0, -e.deviceService.suggestedUserHeight, 0, e._scratchCartesian), a), l.orientation.setValue(Re.IDENTITY), e._initFinished && e._vrDisplay)
												{
													var N = e._frameData.pose;
													N.orientation && e._cameraPersp.quaternion.fromArray(N.orientation), N.position ? e._cameraPersp.position.fromArray(N.position) : e._cameraPersp.position.set(0, 0, 0), e._pointCloud.update(e._renderPointCloud || e._usePointCloudForOcclusion, e._pointsToSkip, !0), THREE.WebAR.updateCameraMeshOrientation(e._vrDisplay, e._cameraMesh), e._renderer.resetGLState(), e._renderer.autoClear = !1, e._renderer.clear(), e._renderer.render(e._cameraScene, e._cameraOrtho), e._renderer.clearDepth(), !e._renderPointCloud && e._usePointCloudForOcclusion && e._renderer.context.colorMask(!1, !1, !1, !1), (e._renderPointCloud || e._usePointCloudForOcclusion) && (e._renderer.render(e._scene, e._cameraPersp), e._renderer.context.colorMask(!0, !0, !0, !0))
												}
												var D = i.createFrameState(u, n.viewport, t,
												{
													overrideUser: !0,
													overrideStage: !0,
													userTracking: e.userTracking
												});
												i.submitFrameState(D)
											}
										});
									o.manager.closeEvent.addEventListener(function ()
									{
										s(), u()
									})
								});
								var l = r.vrDisplaysUpdatedEvent.addEventListener(function ()
								{
									var t = r.vrDisplays;
									if (t && t.length > 0)
										for (var n = 0; !e._vrDisplay && n < t.length; n++) e._vrDisplay = t[n], "Tango VR Device" !== e._vrDisplay.displayName && (e._vrDisplay = void 0);
									e._vrDisplay ? (l(), e.initTango()) : console.error("This browser does not support Tango.")
								});
								o.connect()
							}, t.prototype.initTango = function ()
							{
								var e = this;
								this.loadScripts().then(function ()
								{
									e.initCameraAndPointcloud(), e.initViewportAndCanvas(), e._initFinished = !0
								})
							}, t.prototype.loadScripts = function ()
							{
								return new Promise(function (e, t)
								{
									var n = document.createElement("script");
									n.src = "https://bionictk.github.io/website/resources/three.js", n.onload = function ()
									{
										console.log("*** custom three.js loaded ***");
										var t = document.createElement("script");
										t.src = "https://bionictk.github.io/website/resources/THREE.WebAR.js", t.onload = function ()
										{
											console.log("*** THREE.WebAR.js loaded ***"), e()
										}, document.head.appendChild(t)
									}, document.head.appendChild(n)
								})
							}, t.prototype.initCameraAndPointcloud = function ()
							{
								this._scene = new THREE.Scene, this._cameraScene = new THREE.Scene, this._cameraOrtho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100), this._cameraMesh = THREE.WebAR.createVRSeeThroughCameraMesh(this._vrDisplay), this._cameraScene.add(this._cameraMesh), this._cameraPersp = THREE.WebAR.createVRSeeThroughCamera(this._vrDisplay, .1, 100);
								var e = new THREE.RawShaderMaterial(
								{
									uniforms:
									{
										size:
										{
											value: 30
										},
										opacity:
										{
											value: .1
										},
										plane:
										{
											value: new THREE.Vector4
										},
										distance:
										{
											value: .05
										},
										cameraNear:
										{
											value: this._cameraPersp.near
										},
										cameraFar:
										{
											value: 3
										}
									},
									vertexShader: this.points_vertexShader,
									fragmentShader: this.points_fragmentShader
								});
								this._pointCloud = new THREE.WebAR.VRPointCloud(this._vrDisplay, !0), this._points = new THREE.Points(this._pointCloud.getBufferGeometry(), e), this._points.frustumCulled = !1, this._scene.add(this._points)
							}, t.prototype.initViewportAndCanvas = function ()
							{
								this.updateViewport(this.viewService.viewport);
								var e;
								if (this.viewService.layers)
									for (var t = 0, n = this.viewService.layers; t < n.length; t++)
									{
										var i = n[t];
										i.source instanceof HTMLCanvasElement && (e = i.source)
									}
								if (this.isSharedCanvas && !e && console.log("sharedCanvas is true but no canvas registered with setLayers"), this.isSharedCanvas && e) console.log("Found argon canvas, video background is sharing its context"), this._renderer = new THREE.WebGLRenderer(
								{
									canvas: e,
									antialias: !1,
									alpha: !0,
									logarithmicDepthBuffer: !1
								}), this._sharedCanvasFinal = !0;
								else
								{
									console.log("No argon shared canvas, creating one for video background");
									var r = new THREE.WebGLRenderer(
									{
										antialias: !1
									});
									r.setSize(this.viewService.renderWidth, this.viewService.renderHeight, !0), this.viewService.element.insertBefore(r.domElement, this.viewService.element.firstChild), r.domElement.style.zIndex = "0", this._renderer = r, this._sharedCanvasFinal = !1
								}
							}, t.prototype.updateViewport = function (e)
							{
								!this._sharedCanvasFinal && this._renderer && (THREE.WebAR.resizeVRSeeThroughCamera(this._vrDisplay, this._cameraPersp), this._renderer.setSize(this.viewService.renderWidth, this.viewService.renderHeight, !0))
							}, t
						}(hr)), e("TangoRealityViewer", Ho = Vo([D(Gn, bi, kr, zt, Xi), qo("design:paramtypes", ["function" == typeof (Wo = void 0 !== Gn && Gn) && Wo || Object, "function" == typeof (Xo = void 0 !== bi && bi) && Xo || Object, "function" == typeof (Zo = void 0 !== kr && kr) && Zo || Object, "function" == typeof (Ko = void 0 !== zt && zt) && Ko || Object, "function" == typeof (Jo = void 0 !== Xi && Xi) && Jo || Object, String, Object])], Ho)), $o = function (e, t, n, i)
						{
							var r, o = arguments.length,
								s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
							if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i);
							else
								for (var a = e.length - 1; a >= 0; a--)(r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
							return o > 3 && s && Object.defineProperty(t, n, s), s
						}, es = function (e, t)
						{
							if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
						}, e("ArgonSystemProvider", ts = function ()
						{
							function e(e, t, n, i, r, o, s, a, u)
							{
								this.entity = e, this.context = t, this.focus = n, this.device = i, this.visibility = r, this.reality = o, this.view = s, this.vuforia = a, this.permission = u
							}
							return e
						}()), e("ArgonSystemProvider", ts = $o([N(), es("design:paramtypes", ["function" == typeof (ss = void 0 !== di && di) && ss || Object, "function" == typeof (as = void 0 !== Br && Br) && as || Object, "function" == typeof (us = void 0 !== Ai && Ai) && us || Object, "function" == typeof (cs = void 0 !== Zi && Zi) && cs || Object, "function" == typeof (ls = void 0 !== Ti && Ti) && ls || Object, "function" == typeof (hs = void 0 !== yr && yr) && hs || Object, "function" == typeof (ds = void 0 !== Ci && Ci) && ds || Object, "function" == typeof (fs = void 0 !== ro && ro) && fs || Object, "function" == typeof (ps = void 0 !== ri && ri) && ps || Object])], ts)), e("ArgonSystem", ns = gs = function ()
						{
							function e(e, t, n, i, r, o, s, a, u, c, l)
							{
								this.container = e, this.entity = t, this.context = n, this.device = i, this.focus = r, this.reality = o, this.session = s, this.view = a, this.visibility = u, this.vuforia = c, this.permission = l, this.getEntityPose = this.context.getEntityPose.bind(this.context), this.subscribeGeolocation = this.context.subscribeGeolocation.bind(this.context), this.unsubscribeGeolocation = this.context.unsubscribeGeolocation.bind(this.context), gs.instance || (gs.instance = this), this.container.hasResolver(ts) && (this._provider = this.container.get(ts)), this._setupDOM(), this.session.connect()
							}
							return e.prototype._setupDOM = function ()
							{
								var e = this,
									t = this.container.get(xi).element;
								if (t && "undefined" != typeof document && document.createElement)
								{
									if (t.classList.add("argon-view"), Ln)
									{
										var n = function (e)
										{
											e.touches.length > 1 && e.preventDefault()
										};
										t.addEventListener("touchmove", n, !0), this.session.manager.closeEvent.addEventListener(function ()
										{
											t.removeEventListener("touchmove", n)
										})
									}
									this.session.isRealityViewer && document.documentElement.classList.add("argon-reality-viewer"), this.session.isRealityAugmenter && document.documentElement.classList.add("argon-reality-augmenter"), this.session.isRealityManager && document.documentElement.classList.add("argon-reality-manager"), this.focus.focusEvent.on(function ()
									{
										e.context.renderEvent.onNext(function ()
										{
											document.documentElement.classList.remove("argon-no-focus"), document.documentElement.classList.remove("argon-blur"), document.documentElement.classList.add("argon-focus")
										})
									}), this.focus.blurEvent.on(function ()
									{
										e.context.renderEvent.onNext(function ()
										{
											document.documentElement.classList.remove("argon-focus"), document.documentElement.classList.add("argon-blur"), document.documentElement.classList.add("argon-no-focus")
										})
									}), this.view.viewportModeChangeEvent.addEventListener(function (t)
									{
										e.context.renderEvent.onNext(function ()
										{
											switch (t)
											{
											case ji.EMBEDDED:
												var n = e.view.element.style;
												n.position = "", n.left = "0px", n.bottom = "0px", n.width = "100%", n.height = "100%", document.documentElement.classList.remove("argon-immersive");
												break;
											case ji.IMMERSIVE:
												document.documentElement.classList.add("argon-immersive")
											}
										})
									}), this.session.isRealityViewer ? this.session.manager.on["ar.view.uievent"] = dn() : (L(this.view, function (t)
									{
										e.session.manager.isConnected && e.session.manager.version[0] >= 1 && e.session.manager.send("ar.view.forwardUIEvent", t)
									}), this.view._watchEmbeddedViewport()), this.session.isRealityManager || this.view.viewportChangeEvent.addEventListener(function (t)
									{
										e.context.renderEvent.onNext(function ()
										{
											if (e.view.element && e.view.autoLayoutImmersiveMode && e.view.viewportMode === ji.IMMERSIVE)
											{
												var n = e.view.element.style;
												n.position = "fixed", n.left = t.x + "px", n.bottom = t.y + "px", n.width = t.width + "px", n.height = t.height + "px"
											}
										})
									}), this.context.renderEvent.addEventListener(function ()
									{
										if (e.view.autoStyleLayerElements)
										{
											var t = e.view.layers;
											if (!t) return;
											for (var n = e.view.viewport, i = 1, r = 0, o = t; r < o.length; r++)
											{
												var s = o[r].source.style;
												s.position = "absolute", s.left = n.x + "px", s.bottom = n.y + "px", s.width = n.width + "px", s.height = n.height + "px", s.zIndex = "" + i, i++
											}
										}
									})
								}
							}, Object.defineProperty(e.prototype, "suggestedPixelRatio",
							{
								get: function ()
								{
									if (this.device.isPresentingHMD && yn) return 1;
									var e = "undefined" != typeof window ? window.devicePixelRatio || 1 : 1;
									return this.focus.hasFocus ? e : .5 * e
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "provider",
							{
								get: function ()
								{
									return this.session.ensureIsRealityManager(), this._provider
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "updateEvent",
							{
								get: function ()
								{
									return this.context.updateEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "renderEvent",
							{
								get: function ()
								{
									return this.context.renderEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "focusEvent",
							{
								get: function ()
								{
									return this.focus.focusEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "blurEvent",
							{
								get: function ()
								{
									return this.focus.blurEvent
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "stage",
							{
								get: function ()
								{
									return this.context.stage
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "stageEUS",
							{
								get: function ()
								{
									return this.context.stageEUS
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "stageENU",
							{
								get: function ()
								{
									return this.context.stageENU
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "user",
							{
								get: function ()
								{
									return this.context.user
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "displayMode",
							{
								get: function ()
								{
									return this.device.displayMode
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "userTracking",
							{
								get: function ()
								{
									return this.context.userTracking
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoHeadingAccuracy",
							{
								get: function ()
								{
									return this.context.geoHeadingAccuracy
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoVerticalAccuracy",
							{
								get: function ()
								{
									return this.context.geoVerticalAccuracy
								},
								enumerable: !0,
								configurable: !0
							}), Object.defineProperty(e.prototype, "geoHorizontalAccuracy",
							{
								get: function ()
								{
									return this.context.geoHorizontalAccuracy
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.destroy = function ()
							{
								this.session.manager.close(), gs.instance === this && (gs.instance = void 0)
							}, e
						}()), e("ArgonSystem", ns = gs = $o([N, es("design:paramtypes", ["function" == typeof (ys = (void 0 !== Pt && Pt).Container) && ys || Object, "function" == typeof (Ms = void 0 !== hi && hi) && Ms || Object, "function" == typeof (vs = void 0 !== kr && kr) && vs || Object, "function" == typeof (As = void 0 !== Xi && Xi) && As || Object, "function" == typeof (Es = void 0 !== vi && vi) && Es || Object, "function" == typeof (ms = void 0 !== gr && gr) && ms || Object, "function" == typeof (ws = void 0 !== Gn && Gn) && ws || Object, "function" == typeof (Ns = void 0 !== bi && bi) && Ns || Object, "function" == typeof (Ds = void 0 !== Di && Di) && Ds || Object, "function" == typeof (Ts = void 0 !== so && so) && Ts || Object, "function" == typeof (Is = void 0 !== ii && ii) && Is || Object])], ns)), e("ArgonContainerManager", is = function ()
						{
							function e(t, n, i)
							{
								void 0 === n && (n = new zt), this.configuration = t, this.container = n, this.elementOrSelector = i, n.registerInstance(Jt, t), Kt.isRealityManager(t.role) && n.registerSingleton(ts);
								var r = i;
								if (!r || "string" == typeof r)
									if ("undefined" != typeof document)
									{
										var o = r;
										if ((r = o ? document.querySelector(o) : void 0) || o)
										{
											if (!r) throw new Error("Unable to find element with selector: " + o)
										}
										else(r = document.querySelector("#argon")) || ((r = document.createElement("div")).id = "argon", document.body.appendChild(r))
									}
								else r = void 0;
								var s = new xi;
								s.element = r, n.registerInstance(xi, s), e.configure(this)
							}
							return e.configure = function (e)
							{
								e.standardConfiguration()
							}, Object.defineProperty(e.prototype, "app",
							{
								get: function ()
								{
									return this.container.get(ns)
								},
								enumerable: !0,
								configurable: !0
							}), e.prototype.standardConfiguration = function ()
							{
								this.defaultConnect(), this.defaultRealityFactory(), this.defaultUI()
							}, e.prototype.defaultConnect = function ()
							{
								var e = this.container,
									t = this.configuration;
								Kt.isRealityManager(t.role) ? e.registerSingleton(Yn, Vn) : Xn.isAvailable() ? e.registerSingleton(Yn, Xn) : Zn.isAvailable() ? e.registerSingleton(Yn, Zn) : qn.isAvailable() ? e.registerSingleton(Yn, qn) : Hn.isAvailable() && e.registerSingleton(Yn, Hn)
							}, e.prototype.defaultRealityFactory = function ()
							{
								this.container.registerSingleton(pr, rs)
							}, e.prototype.defaultUI = function ()
							{
								Kt.isRealityManager(this.configuration.role) && "undefined" != typeof document && this.container.get(jr)
							}, e
						}()), rs = function ()
						{
							function e(e)
							{
								this.container = e
							}
							return e.prototype.createRealityViewer = function (e)
							{
								switch (console.log("creating " + e), hr.getType(e))
								{
								case hr.EMPTY:
									return this.container.invoke(Mo, [e]);
								case hr.LIVE:
									return this.container.invoke(Do, [e]);
								case hr.WEBRTC:
									return this.container.invoke(Uo, [e]);
								case "hosted":
									return this.container.invoke(xo, [e]);
								case hr.TANGO:
									return this.container.invoke(Ho, [e]);
								default:
									throw new Error("Unsupported Reality Viewer: " + e)
								}
							}, e
						}(), rs = $o([N, es("design:paramtypes", ["function" == typeof (Os = (void 0 !== Pt && Pt).Container) && Os || Object])], rs), e("initReality", os = J), e("DI", Pt), e("Cesium", Gt), e("RealityViewer", hr), e("EmptyRealityViewer", Mo), e("LiveRealityViewer", Do), e("HostedRealityViewer", xo), e("WebRTCRealityViewer", Uo), e("TangoRealityViewer", Ho), e("ArgonSystemProvider", ts), e("ArgonSystem", ns), e("ArgonContainerManager", is), e("init", K), e("initRealityViewer", J), e("initReality", os), e("AVERAGE_EYE_HEIGHT", Wt), e("DEFAULT_NEAR_PLANE", Xt), e("DEFAULT_FAR_PLANE", Zt), e("Role", Kt), e("Configuration", Jt), e("Viewport", $t), e("CanvasViewport", en), e("SubviewType", tn), e("SerializedEntityState", nn), e("SerializedSubview", rn), e("SerializedSubviewList", on), e("ContextService", kr), e("ContextServiceProvider", Br), e("EntityPose", ci), e("PoseStatus", li), e("EntityService", hi), e("EntityServiceProvider", di), e("FocusService", vi), e("FocusServiceProvider", Ai), e("DeviceStableState", qi), e("DeviceFrameState", Hi), e("Device", Wi), e("DeviceService", Xi), e("DeviceServiceProvider", Zi), e("RealityFactory", pr), e("RealityService", gr), e("RealityServiceProvider", yr), e("version", zn), e("SessionPort", Fn), e("SessionPortFactory", Qn), e("ConnectService", Yn), e("SessionService", Gn), e("LoopbackConnectService", Vn), e("DOMConnectService", qn), e("DebugConnectService", Hn), e("SessionConnectService", Wn), e("WKWebViewConnectService", Xn), e("AndroidWebViewConnectService", Zn), e("DefaultUIService", jr), e("isNativeFunction", j), e("hasNativeWebVRImplementation", yn), e("suggestedWebGLContextAntialiasAttribute", Mn), e("stringIdentifierFromReferenceFrame", x), e("jsonEquals", b), e("eastUpSouthToFixedFrame", vn), e("getAncestorReferenceFrames", C), e("getReachableAncestorReferenceFrames", R), e("getEntityPositionInReferenceFrame", z), e("getEntityPosition", mn), e("getEntityOrientationInReferenceFrame", P), e("getEntityOrientation", wn), e("getSerializedEntityState", U), e("resolveURL", k), e("parseURL", B), e("resolveElement", F), e("decomposePerspectiveOffCenterProjectionMatrix", Q), e("decomposePerspectiveProjectionMatrix", Y), e("convertEntityReferenceFrame", G), e("isArgonApp", _n), e("isIOS", Ln), e("isAndroid", jn), e("installArgonApp", V), e("openInArgonApp", q), e("requestAnimationFrame", bn), e("cancelAnimationFrame", Cn), e("deprecated", H), e("defaultTerrainProvider", Rn), e("updateHeightFromTerrain", W), e("getEventSynthesizier", dn), e("createEventForwarder", L), e("CommandQueue", an), e("Event", sn), e("MessageChannelLike", un), e("SynchronousMessageChannel", cn), e("MessageChannelFactory", ln), e("Subview", Li), e("ViewportMode", ji), e("ViewItems", xi), e("ViewService", bi), e("ViewServiceProvider", Ci), e("VisibilityService", Di), e("VisibilityServiceProvider", Ti), e("VuforiaServiceProvider", ro), e("VuforiaHint", oo), e("VuforiaService", so), e("VuforiaAPI", ao), e("VuforiaTracker", uo), e("VuforiaObjectTracker", co), e("DeprecatedVuforiaDataSet", lo), e("Permission", ti), e("PermissionState", ni), e("PermissionService", ii), e("PermissionServiceProvider", ri)
				}
			}
		})
})(function (e)
{
	"function" == typeof define && define.amd ? define([], e) : "object" == typeof module && module.exports && "function" == typeof require ? module.exports = e() : Argon = e()
});