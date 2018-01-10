function pluginBegin() {
  if (!$.sso_loadComplete) try {
    $.checkNPPlugin()
  } catch (t) {}
  $.sso_loadComplete = !0, $.report.setSpeedPoint($.plugin_isd_flag, 1, (new Date).getTime()), window.setTimeout(function (t) {
    $.report.isdSpeed($.plugin_isd_flag, .05)
  }, 2e3)
}

function ptui_qlogin_CB(t, e, i) {
  switch (window.clearTimeout(pt.qlogin.__getstClock), ptui_qlogin_CB.called = !0, t) {
    case '0':
      var n = function () {
        pt.plogin.redirect(pt.ptui.target, e)
      }
      return void('0' != pt.ptui.pt_3rd_aid ? pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 0, n) : n());
    case '10006':
      pt.plogin.force_qrlogin(), pt.plogin.show_err(i, !0)
      break;
    default:
      pt.plogin.switchpage(pt.LoginState.PLogin), pt.plogin.show_err(i, !0)
  }
  '0' != pt.ptui.pt_3rd_aid && pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 1)
}

function ptui_fetch_dev_uin_CB(t) {
  if (t && 22028 == t.errcode) {
    for (var e = t.data, i = [], n = 0; n < e.length; n++) {
      var o = e[n]
      i.push({
        uin: o,
        name: $.str.utf8ToUincode($.cookie.get('ptnick_' + o)) || o,
        uinString: o,
        type: 0,
        nick: $.str.utf8ToUincode($.cookie.get('ptnick_' + o)) || o,
        flag: 0,
        loginType: pt.qlogin.OneKeyPush
      })
    }
    pt.qlogin.setOneKeyList(i), pt.qlogin.buildUnifiedQloginList(), e.length && pt.plogin.isMailLogin && pt.plogin.switchpage(pt.LoginState.QLogin)
  }
}

function ptui_getuins_CB(t) {
  if (ptui_getuins_CB.called = !0, t) {
    pt.plogin.hide_err();
    for (var e = [], i = 0; i < t.length; i++) {
      var n = t[i]
      e.push({
        uin: n.uin,
        name: n.account,
        uinString: n.uin,
        type: 0,
        face: n.face_index,
        nick: n.nickname,
        flag: n.uin_flag,
        loginType: pt.qlogin.PCSvrQlogin
      })
    }
    pt.qlogin.setPCSvrQloginList(e), pt.qlogin.buildUnifiedQloginList(), t.length && pt.plogin.isMailLogin && pt.plogin.switchpage(pt.LoginState.QLogin), $.report.monitor(508158, 1), navigator.userAgent.match(/\bmac\b/i) && $.report.monitor(2423545, 1), __pt_ieZeroLogin && $.report.monitor(2129653, 1), __pt_webkitZeroLogin && $.report.monitor(2129655, 1), window.localStorage && localStorage.setItem('newQQ', !0)
  }
}

function ptui_getst_CB(t) {
  if (ptui_getst_CB.called = !0, t) {
    if (pt.plogin.hideLoading(), ptui_getst_CB.submitUrl) {
      var e = ptui_getst_CB.submitUrl.replace('{{hash_clientkey}}', $.str.hash33($.cookie.get('clientkey')))
      t.keyindex && (e = e.replace(/keyindex=\d+/, 'keyindex=' + t.keyindex), $.report.monitor(2423538, 1)), pt.qlogin.reportPCMgr(t.uin, 2), $.http.loadScript(e)
    }
    $.report.monitor(508159, 1)
  }
}

function ptui_qrcode_CB(t) {
  switch (pt.plogin.hideLoading(), clearTimeout(pt.qlogin.__onekeyClock), t && parseInt(t.ec)) {
    case 0:
      pt.plogin.go_onekey_step(2), pt.plogin.cancle_qrlogin(), pt.qlogin.__onekeyFirst || pt.plogin.show_err(t.em), pt.plogin.qrlogin_clock = window.setInterval('pt.plogin.qrlogin_submit();', 3e3)
      break;
    case 313:
      pt.plogin.go_onekey_step(1), t && pt.plogin.show_err(t.em), pt.qlogin.fetchOnekeyList()
      break;
    default:
      t && pt.plogin.show_err(t.em)
  }
}

function pt_request_guid_callback(t) {
  if (pt_request_guid_callback.called = !0, !(t && t.hasOwnProperty('ret') && 1 == t.ret && t.hasOwnProperty('data') && t.data.hasOwnProperty('serverdata') && t.data.serverdata.hasOwnProperty('status') && t.hasOwnProperty('session'))) return pt.qlogin.fetchOnekeyListByGUID(), $.report.nlog('pt_request_guid_callback result:' + $.str.json2str(t), 2732842), 0;
  switch (parseInt(t.data.serverdata.status)) {
    case 1:
      t.data.serverdata.hasOwnProperty('guidsig') ? (pt.qlogin.fetchOnekeyListByGUID(t.data.serverdata.guidsig), pt.qlogin.QQProtectGUID = t.data.serverdata.guidsig, $.report.monitor(2732843)) : ($.report.nlog('pt_request_guid_callback result:' + $.str.json2str(t), 2732842), pt.qlogin.fetchOnekeyListByGUID())
      break;
    case 2:
      pt.qlogin.QQProtectSession = t.session, pt.qlogin.callQQProtect({
        service: 103,
        action: 2,
        callbackName: 'pt_request_guid_callback',
        timeoutCallback: function () {
          pt.qlogin.fetchOnekeyListByGUID(), $.report.monitor(2751524)
        }
      })
      break;
    default:
      pt.qlogin.fetchOnekeyListByGUID(), $.report.nlog('pt_request_guid_callback result:' + $.str.json2str(t), 2732842)
  }
}

function ptui_pc_querystatus_CB(t) {
  ptui_pc_querystatus_CB.called = !0, t && (pt.qlogin.PCMgrSession = t.actionString, pt.qlogin.processPCMgrStatus(t.qqpcstatus, t.wording, t.bautoCheck))
}

function ptui_qqprotect_querystatus_CB(t) {
  ptui_qqprotect_querystatus_CB.called = !0, t && t.hasOwnProperty('ret') && 1 == t.ret && t.hasOwnProperty('data') && (pt.qlogin.PCMgrSession || (pt.qlogin.PCMgrSession2 = t.data.actionstring, pt.qlogin.processPCMgrStatus(t.data.qqpcstatus, t.data.wording, t.data.bautoCheck)))
}

function ptui_qqprotect_result_CB() {
  ptui_qqprotect_result_CB.called = !0
}

function ptui_action_result_CB() {
  ptui_action_result_CB.called = !0
}

function pt_qqprotect_version(t) {
  pt_qqprotect_version.called = !0, pt.qlogin.callQQProtect({
    service: 103,
    action: 1,
    callbackName: 'pt_request_guid_callback',
    timeoutCallback: function () {
      pt.qlogin.fetchOnekeyListByGUID(), $.report.monitor(2751523)
    }
  })
}

function ptuiCB(t, e, i, n, o, p) {
  function r() {
    pt.plogin.is_mibao(i) && (i += '&style=' + pt.ptui.style + '&proxy_url=' + encodeURIComponent(pt.ptui.proxy_url), i += '#login_href=' + encodeURIComponent(pt.ptui.href)), pt.plogin.redirect(n, i)
  }
  var s = $('p'),
    a = !(!pt.plogin.at_account || !s.value && !pt.plogin.armSafeEdit.safepwd)
  clearTimeout(pt.plogin.loginClock), a && (pt.plogin.lastCheckAccount = ''), pt.plogin.hasSubmit = !0;
  var l = !1
  switch (t) {
    case '0':
      var c = function () {
        a || pt.plogin.is_mibao(i) ? r() : (window.clearInterval(pt.plogin.qrlogin_clock), r())
      }
      return void('0' != pt.ptui.pt_3rd_aid ? pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 0, c) : c());
    case '3':
      $('p').value = '', pt.plogin.domFocus($('p')), pt.plogin.passwordErrorNum++, '101' != e && '102' != e && '103' != e || pt.plogin.showVC(), pt.plogin.check()
      break;
    case '4':
      pt.plogin.check()
      break;
    case '12':
    case '51':
      pt.plogin.check(), l = !0
      break;
    case '65':
      return void(0 != pt.plogin.onekeyVerifyClock ? pt.plogin.onekeyVerify('invalid') : pt.plogin.set_qrlogin_invalid());
    case '66':
      return;
    case '67':
      return void pt.plogin.go_qrlogin_step(2);
    case '22005':
    case '68':
      pt.plogin.onekeyVerify('hide')
      break;
    case '10005':
    case '10006':
    case '22009':
      pt.plogin.force_qrlogin(), pt.plogin.isNewStyle && pt.qlogin.buildUnifiedQloginList(10006 == t ? 2 : 1), pt.plogin.check()
      break;
    case '10008':
      return void pt.plogin.onekeyVerify('normal', e, o);
    default:
      pt.plogin.needVc && !pt.plogin.needShowNewVc ? pt.plogin.changeVC() : pt.plogin.check()
  }
  if (0 != t && a && pt.plogin.show_err(o, l), !pt.plogin.hasCheck() && a && '1' != pt.ptui.pt_vcode_v1 && (pt.plogin.showVC(), $('verifycode').focus(), $('verifycode').select()), Math.random() < .2) {
    pt.plogin.isdTime['7808-7-2-1'] = (new Date).getTime();
    var u = 1
    pt.ptui.isHttps && (u = 2);
    var g = 'flag1=7808&flag2=7&flag3=2&' + u + '=' + (pt.plogin.isdTime['7808-7-2-1'] - pt.plogin.isdTime['7808-7-2-0'])
    $.report.simpleIsdSpeed(g)
  }
  '0' != pt.ptui.pt_3rd_aid && pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 1)
}

function ptui_checkVC(t, e, i, n, o) {
  switch (clearTimeout(pt.plogin.checkClock), pt.plogin.isRandSalt = o, pt.plogin.salt = i, pt.plogin.checkRet = t, pt.plogin.lastCheckAccount = pt.plogin.account, '2' == t ? pt.plogin.loginState == pt.LoginState.PLogin && pt.plogin.show_err(pt.str.inv_uin) : '3' == t || pt.plogin.hasSubmit, t + '') {
    case '0':
    case '2':
    case '3':
      pt.plogin.hideVC(), '1' == pt.ptui.pt_vcode_v1 && (pt.plogin.needShowNewVc = !1), $('verifycode').value = e || 'abcd', pt.plogin.needVc = !1, $.report.monitor('330321', .05), e || $.report.nlog('check no code return,ret=' + t + ',code=' + e + ',uin=' + $.str.bin2String(i))
      break;
    case '1':
      pt.plogin.cap_cd = e, '1' == pt.ptui.pt_vcode_v1 ? pt.plogin.needShowNewVc = !0 : (pt.plogin.showVC(), $.css.show($('vc_tips'))), pt.plogin.needVc = !0, $.report.monitor('330320', .05)
  }
  1 == pt.ptui.pt_vcode_v1 && 1 == t || (pt.plogin.pt_verifysession = n), pt.plogin.hasCheck(!0), pt.plogin.checkTime = (new Date).getTime(), pt.plogin.check.cb && pt.plogin.check.cb()
}

function ptui_auth_CB(t, e) {
  switch (t = parseInt(t), 2 === t && '0' != pt.ptui.pt_3rd_aid && (t = 0), t) {
    case 0:
      pt.plogin.authUin = $.cookie.get('superuin').replace(/^o0*/, ''), pt.plogin.authSubmitUrl = e, pt.qlogin.buildUnifiedQloginList(), pt.plogin.isMailLogin && pt.plogin.switchpage(pt.LoginState.QLogin)
      break;
    case 1:
      break;
    case 2:
      var i = e + '&regmaster=' + pt.ptui.regmaster + '&aid=' + pt.ptui.appid + '&s_url=' + encodeURIComponent(pt.ptui.s_url)
      '1' == pt.ptui.pt_light && (i += '&pt_light=1'), pt.plogin.redirect(pt.ptui.target, i)
      break;
    default:
      pt.preload.init()
  }
}!window.console && (window.console = {
  log: function () {},
  warn: function () {},
  error: function () {}
});
var $ = window.Simple = function (t) {
  return 'string' == typeof t ? document.getElementById(t) : t
}
$.cookie = {
    get: function (t) {
      var e
      return function (t) {
        if (!t) return t;
        for (; t != unescape(t);) t = unescape(t);
        for (var e = ['<', '>', "'", '"', '%3c', '%3e', '%27', '%22', '%253c', '%253e', '%2527', '%2522'], i = ['&#x3c;', '&#x3e;', '&#x27;', '&#x22;', '%26%23x3c%3B', '%26%23x3e%3B', '%26%23x27%3B', '%26%23x22%3B', '%2526%2523x3c%253B', '%2526%2523x3e%253B', '%2526%2523x27%253B', '%2526%2523x22%253B'], n = 0; n < e.length; n++) t = t.replace(new RegExp(e[n], 'gi'), i[n]);
        return t
      }((e = document.cookie.match(RegExp('(^|;\\s*)' + t + '=([^;]*)(;|$)'))) ? unescape(e[2]) : '')
    },
    set: function (t, e, i, n, o) {
      var p = new Date
      o ? (p.setTime(p.getTime() + 36e5 * o), document.cookie = t + '=' + e + '; expires=' + p.toGMTString() + '; path=' + (n || '/') + '; ' + (i ? 'domain=' + i + ';' : '')) : document.cookie = t + '=' + e + '; path=' + (n || '/') + '; ' + (i ? 'domain=' + i + ';' : '')
    },
    del: function (t, e, i) {
      document.cookie = t + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=' + (i || '/') + '; ' + (e ? 'domain=' + e + ';' : '')
    },
    uin: function () {
      var t = $.cookie.get('uin')
      return t ? parseInt(t.substring(1, t.length), 10) : null
    }
  }, $.http = {
    getXHR: function () {
      return window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest
    },
    ajax: function (url, para, cb, method, type) {
      var xhr = $.http.getXHR()
      return xhr.open(method, url), xhr.onreadystatechange = function () {
        4 == xhr.readyState && (xhr.status >= 200 && xhr.status < 300 || 304 === xhr.status || 1223 === xhr.status || 0 === xhr.status ? void 0 === type && xhr.responseText ? cb(eval('(' + xhr.responseText + ')')) : (cb(xhr.responseText), !xhr.responseText && $.badjs._smid && $.badjs('HTTP Empty[xhr.status]:' + xhr.status, url, 0, $.badjs._smid)) : $.badjs._smid && $.badjs('HTTP Error[xhr.status]:' + xhr.status, url, 0, $.badjs._smid), xhr = null)
      }, xhr.send(para), xhr
    },
    post: function (t, e, i, n) {
      var o = ''
      for (var p in e) o += '&' + p + '=' + e[p];
      return $.http.ajax(t, o, i, 'POST', n)
    },
    get: function (t, e, i, n) {
      var o = []
      for (var p in e) o.push(p + '=' + e[p]);
      return -1 == t.indexOf('?') && (t += '?'), t += o.join('&'), $.http.ajax(t, null, i, 'GET', n)
    },
    jsonp: function (t) {
      var e = document.createElement('script')
      e.src = t, document.getElementsByTagName('head')[0].appendChild(e)
    },
    loadScript: function (t, e, i) {
      var n = document.createElement('script')
      n.onload = n.onreadystatechange = function () {
        this.readyState && 'loaded' !== this.readyState && 'complete' !== this.readyState || ('function' == typeof e && e(), n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n))
      }, n.src = t, document.getElementsByTagName('head')[0].appendChild(n)
    },
    preload: function (t) {
      var e = document.createElement('img')
      e.src = t, e = null
    }
  }, $.get = $.http.get, $.post = $.http.post, $.jsonp = $.http.jsonp, $.browser = function (t) {
    if (void 0 === $.browser.info) {
      var e = {
          type: ''
        },
        i = navigator.userAgent.toLowerCase() /
        webkit / .test(i) ? e = {
          type: 'webkit',
          version: /webkit[\/ ]([\w.]+)/
        } : /opera/.test(i) ? e = {
          type: 'opera',
          version: /version/.test(i) ? /version[\/ ]([\w.]+)/ : /opera[\/ ]([\w.]+)/
        } : /msie/.test(i) ? e = {
          type: 'msie',
          version: /msie ([\w.]+)/
        } : /mozilla/.test(i) && !/compatible/.test(i) && (e = {
          type: 'ff',
          version: /rv:([\w.]+)/
        }),
        e.version = (e.version && e.version.exec(i) || [0, '0'])[1],
        $.browser.info = e
    }
    return $.browser.info[t]
  }, $.e = {
    _counter: 0,
    _uid: function () {
      return 'h' + $.e._counter++
    },
    add: function (t, e, i) {
      if ('object' != typeof t && (t = $(t)), document.addEventListener) t.addEventListener(e, i, !1)
      else if (document.attachEvent) {
        if (-1 != $.e._find(t, e, i)) return;
        var n = function (e) {
          e || (e = window.event);
          var n = {
            _event: e,
            type: e.type,
            target: e.srcElement,
            currentTarget: t,
            relatedTarget: e.fromElement ? e.fromElement : e.toElement,
            eventPhase: e.srcElement == t ? 2 : 3,
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            keyCode: e.keyCode,
            data: e.data,
            origin: e.origin,
            stopPropagation: function () {
              this._event.cancelBubble = !0
            },
            preventDefault: function () {
              this._event.returnValue = !1
            }
          }
          Function.prototype.call ? i.call(t, n) : (t._currentHandler = i, t._currentHandler(n), t._currentHandler = null)
        }
        t.attachEvent('on' + e, n);
        var o = {
            element: t,
            eventType: e,
            handler: i,
            wrappedHandler: n
          },
          p = t.document || t,
          r = p.parentWindow,
          s = $.e._uid()
        r._allHandlers || (r._allHandlers = {}), r._allHandlers[s] = o, t._handlers || (t._handlers = []), t._handlers.push(s), r._onunloadHandlerRegistered || (r._onunloadHandlerRegistered = !0, r.attachEvent('onunload', $.e._removeAllHandlers))
      }
    },
    remove: function (t, e, i) {
      if (document.addEventListener) t.removeEventListener(e, i, !1)
      else if (document.attachEvent) {
        var n = $.e._find(t, e, i)
        if (-1 == n) return;
        var o = t.document || t,
          p = o.parentWindow,
          r = t._handlers[n],
          s = p._allHandlers[r]
        t.detachEvent('on' + e, s.wrappedHandler), t._handlers.splice(n, 1), delete p._allHandlers[r]
      }
    },
    _find: function (t, e, i) {
      var n = t._handlers
      if (!n) return -1;
      for (var o = t.document || t, p = o.parentWindow, r = n.length - 1; r >= 0; r--) {
        var s = n[r],
          a = p._allHandlers[s]
        if (a.eventType == e && a.handler == i) return r
      }
      return -1
    },
    _removeAllHandlers: function () {
      var t = this
      for (id in t._allHandlers) {
        var e = t._allHandlers[id]
        e.element.detachEvent('on' + e.eventType, e.wrappedHandler), delete t._allHandlers[id]
      }
    },
    src: function (t) {
      return t ? t.target : event.srcElement
    },
    stopPropagation: function (t) {
      t ? t.stopPropagation() : event.cancelBubble = !0
    },
    trigger: function (t, e) {
      var i = {
        HTMLEvents: 'abort,blur,change,error,focus,load,reset,resize,scroll,select,submit,unload',
        UIEevents: 'keydown,keypress,keyup',
        MouseEvents: 'click,mousedown,mousemove,mouseout,mouseover,mouseup'
      }
      if (document.createEvent) {
        var n = ''
        'mouseleave' == e && (e = 'mouseout'), 'mouseenter' == e && (e = 'mouseover');
        for (var o in i)
          if (i[o].indexOf(e)) {
            n = o;
            break
          }
        var p = document.createEvent(n)
        p.initEvent(e, !0, !1), t.dispatchEvent(p)
      } else document.createEventObject && t.fireEvent('on' + e)
    }
  }, $.bom = {
    query: function (t) {
      var e = window.location.search.match(new RegExp('(\\?|&)' + t + '=([^&]*)(&|$)'))
      return e ? decodeURIComponent(e[2]) : ''
    },
    getHash: function (t) {
      var e = window.location.hash.match(new RegExp('(#|&)' + t + '=([^&]*)(&|$)'))
      return e ? decodeURIComponent(e[2]) : ''
    }
  }, $.winName = {
    set: function (t, e) {
      var i = window.name || ''
      i.match(new RegExp(';' + t + '=([^;]*)(;|$)')) ? window.name = i.replace(new RegExp(';' + t + '=([^;]*)'), ';' + t + '=' + e) : window.name = i + ';' + t + '=' + e
    },
    get: function (t) {
      var e = window.name || '',
        i = e.match(new RegExp(';' + t + '=([^;]*)(;|$)'))
      return i ? i[1] : ''
    },
    clear: function (t) {
      var e = window.name || ''
      window.name = e.replace(new RegExp(';' + t + '=([^;]*)'), '')
    }
  }, $.localData = function () {
    function t() {
      var t = document.createElement('link')
      return t.style.display = 'none', t.id = o, document.getElementsByTagName('head')[0].appendChild(t), t.addBehavior('#default#userdata'), t
    }

    function e() {
      if (void 0 === n)
        if (window.localStorage) n = localStorage;
        else try {
          n = t(), n.load(o)
        } catch (t) {
          return n = !1, !1
        }
      return !0
    }

    function i(t) {
      return 'string' == typeof t && p.test(t)
    }
    var n, o = 'ptlogin2.qq.com',
      p = /^[0-9A-Za-z_-]*$/
    return {
      set: function (t, p) {
        var r = !1
        if (i(t) && e()) try {
          p += '', window.localStorage ? (n.setItem(t, p), r = !0) : (n.setAttribute(t, p), n.save(o), r = n.getAttribute(t) === p)
        } catch (t) {}
        return r
      },
      get: function (t) {
        if (i(t) && e()) try {
          return window.localStorage ? n.getItem(t) : n.getAttribute(t)
        } catch (t) {}
        return null
      },
      remove: function (t) {
        if (i(t) && e()) try {
          return window.localStorage ? n.removeItem(t) : n.removeAttribute(t), !0
        } catch (t) {}
        return !1
      }
    }
  }(), $.str = function () {
    var htmlDecodeDict = {
        quot: '"',
        lt: '<',
        gt: '>',
        amp: '&',
        nbsp: ' ',
        '#34': '"',
        '#60': '<',
        '#62': '>',
        '#38': '&',
        '#160': ' '
      },
      htmlEncodeDict = {
        '"': '#34',
        '<': '#60',
        '>': '#62',
        '&': '#38',
        ' ': '#160'
      }
    return {
      decodeHtml: function (t) {
        return t += '', t.replace(/&(quot|lt|gt|amp|nbsp);/gi, function (t, e) {
          return htmlDecodeDict[e]
        }).replace(/&#u([a-f\d]{4});/gi, function (t, e) {
          return String.fromCharCode(parseInt('0x' + e))
        }).replace(/&#(\d+);/gi, function (t, e) {
          return String.fromCharCode(+e)
        })
      },
      encodeHtml: function (t) {
        return t += '', t.replace(/["<>& ]/g, function (t) {
          return '&' + htmlEncodeDict[t] + ';'
        })
      },
      trim: function (t) {
        t += '';
        for (var t = t.replace(/^\s+/, ''), e = /\s/, i = t.length; e.test(t.charAt(--i)););
        return t.slice(0, i + 1)
      },
      uin2hex: function (str) {
        var maxLength = 16
        str = parseInt(str);
        for (var hex = str.toString(16), len = hex.length, i = len; i < maxLength; i++) hex = '0' + hex;
        for (var arr = [], j = 0; j < maxLength; j += 2) arr.push('\\x' + hex.substr(j, 2));
        var result = arr.join('')
        return eval('result="' + result + '"'), result
      },
      bin2String: function (t) {
        for (var e = [], i = 0, n = t.length; i < n; i++) {
          var o = t.charCodeAt(i).toString(16)
          1 == o.length && (o = '0' + o), e.push(o)
        }
        return e = '0x' + e.join(''), e = parseInt(e, 16)
      },
      str2bin: function (str) {
        for (var arr = [], i = 0; i < str.length; i += 2) arr.push(eval("'\\x" + str.charAt(i) + str.charAt(i + 1) + "'"));
        return arr.join('')
      },
      utf8ToUincode: function (t) {
        var e = ''
        try {
          var n = t.length,
            o = []
          for (i = 0; i < n; i += 2) o.push('%' + t.substr(i, 2));
          e = decodeURIComponent(o.join('')), e = $.str.decodeHtml(e)
        } catch (t) {
          e = ''
        }
        return e
      },
      json2str: function (t) {
        var e = ''
        if ('undefined' != typeof JSON) e = JSON.stringify(t)
        else {
          var i = []
          for (var n in t) i.push('"' + n + '":"' + t[n] + '"');
          e = '{' + i.join(',') + '}'
        }
        return e
      },
      time33: function (t) {
        for (var e = 0, i = 0, n = t.length; i < n; i++) e = (33 * e + t.charCodeAt(i)) % 4294967296;
        return e
      },
      hash33: function (t) {
        for (var e = 0, i = 0, n = t.length; i < n; ++i) e += (e << 5) + t.charCodeAt(i);
        return 2147483647 & e
      }
    }
  }(), $.css = function () {
    var t = document.documentElement
    return {
      getComputedStyle: function (t) {
        return window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle
      },
      getCurrentPixelStyle: function (t, e) {
        if (window.getComputedStyle) var i = parseInt(window.getComputedStyle(t)[e])
        else {
          var i = t.currentStyle[e] || 0
          if ('auto' === i) switch (e || '') {
            case 'width':
            case 'height':
              return t.offsetHeight
          }
          var n = t.style.left,
            o = t.runtimeStyle.left
          t.runtimeStyle.left = t.currentStyle.left, t.style.left = 'fontSize' === e ? '1em' : i, i = t.style.pixelLeft + 'px', t.style.left = n, t.runtimeStyle.left = o
        }
        return parseInt(i)
      },
      getPageScrollTop: function () {
        return window.pageYOffset || t.scrollTop || document.body.scrollTop || 0
      },
      getPageScrollLeft: function () {
        return window.pageXOffset || t.scrollLeft || document.body.scrollLeft || 0
      },
      getOffsetPosition: function (e) {
        e = $(e);
        var i = 0,
          n = 0
        if (t.getBoundingClientRect && e.getBoundingClientRect) {
          var o = e.getBoundingClientRect(),
            p = t.clientTop || document.body.clientTop || 0,
            r = t.clientLeft || document.body.clientLeft || 0
          i = o.top + this.getPageScrollTop() - p, n = o.left + this.getPageScrollLeft() - r
        } else
          do {
            i += e.offsetTop || 0, n += e.offsetLeft || 0, e = e.offsetParent
          } while (e);
        return {
          left: n,
          top: i
        }
      },
      getWidth: function (t) {
        return $(t).offsetWidth
      },
      getHeight: function (t) {
        return $(t).offsetHeight
      },
      show: function (t) {
        t.style.display = 'block'
      },
      hide: function (t) {
        t.style.display = 'none'
      },
      hasClass: function (t, e) {
        if (!t.className) return !1;
        for (var i = t.className.split(' '), n = 0, o = i.length; n < o; n++)
          if (e == i[n]) return !0;
        return !1
      },
      addClass: function (t, e) {
        $.css.updateClass(t, e, !1)
      },
      removeClass: function (t, e) {
        $.css.updateClass(t, !1, e)
      },
      updateClass: function (t, e, i) {
        for (var n = t.className.split(' '), o = {}, p = 0, r = n.length; p < r; p++) n[p] && (o[n[p]] = !0);
        if (e) {
          var s = e.split(' ')
          for (p = 0, r = s.length; p < r; p++) s[p] && (o[s[p]] = !0)
        }
        if (i) {
          var a = i.split(' ')
          for (p = 0, r = a.length; p < r; p++) a[p] && delete o[a[p]]
        }
        var l = []
        for (var c in o) l.push(c);
        t.className = l.join(' ')
      },
      setClass: function (t, e) {
        t.className = e
      }
    }
  }(), $.animate = {
    fade: function (t, e, i, n, o) {
      if (t = $(t)) {
        t.effect || (t.effect = {});
        var p = Object.prototype.toString.call(e),
          r = 100
        isNaN(e) ? '[object Object]' == p && e && e.to && (isNaN(e.to) || (r = e.to), isNaN(e.from) || (t.style.opacity = e.from / 100, t.style.filter = 'alpha(opacity=' + e.from + ')')) : r = e, void 0 === t.effect.fade && (t.effect.fade = 0), window.clearInterval(t.effect.fade);
        var i = i || 1,
          n = n || 20,
          s = window.navigator.userAgent.toLowerCase(),
          a = function (t) {
            var e
            if (-1 != s.indexOf('msie')) {
              var i = (t.currentStyle || {}).filter || ''
              e = i.indexOf('opacity') >= 0 ? parseFloat(i.match(/opacity=([^)]*)/)[1]) + '' : '100'
            } else {
              var n = t.ownerDocument.defaultView
              n = n && n.getComputedStyle, e = 100 * (n && n(t, null).opacity || 1)
            }
            return parseFloat(e)
          }(t),
          l = a < r ? 1 : -1 -
          1 != s.indexOf('msie') && n < 15 && (i = Math.floor(15 * i / n), n = 15);
        var c = function () {
          a += i * l, (Math.round(a) - r) * l >= 0 ? (t.style.opacity = r / 100, t.style.filter = 'alpha(opacity=' + r + ')', window.clearInterval(t.effect.fade), 'function' == typeof o && o(t)) : (t.style.opacity = a / 100, t.style.filter = 'alpha(opacity=' + a + ')')
        }
        t.effect.fade = window.setInterval(c, n)
      }
    },
    animate: function (t, e, i, n, o) {
      if (t = $(t)) {
        t.effect || (t.effect = {}), void 0 === t.effect.animate && (t.effect.animate = 0);
        for (var p in e) e[p] = parseInt(e[p]) || 0;
        window.clearInterval(t.effect.animate);
        var i = i || 10,
          n = n || 20,
          r = function (t) {
            return {
              left: t.offsetLeft,
              top: t.offsetTop
            }
          }(t),
          s = {
            width: t.clientWidth,
            height: t.clientHeight,
            left: r.left,
            top: r.top
          },
          a = []
        if (-1 == window.navigator.userAgent.toLowerCase().indexOf('msie') || 'BackCompat' != document.compatMode) {
          var l = document.defaultView ? document.defaultView.getComputedStyle(t, null) : t.currentStyle,
            c = e.width || 0 == e.width ? parseInt(e.width) : null,
            u = e.height || 0 == e.height ? parseInt(e.height) : null 'number' == typeof c && (a.push('width'), e.width = c - l.paddingLeft.replace(/\D/g, '') - l.paddingRight.replace(/\D/g, '')),
            'number' == typeof u && (a.push('height'), e.height = u - l.paddingTop.replace(/\D/g, '') - l.paddingBottom.replace(/\D/g, '')), n < 15 && (i = Math.floor(15 * i / n), n = 15)
        }
        var g = e.left || 0 == e.left ? parseInt(e.left) : null,
          d = e.top || 0 == e.top ? parseInt(e.top) : null 'number' == typeof g && (a.push('left'), t.style.position = 'absolute'),
          'number' == typeof d && (a.push('top'), t.style.position = 'absolute');
        for (var h = [], f = a.length, p = 0; p < f; p++) h[a[p]] = s[a[p]] < e[a[p]] ? 1 : -1;
        var _ = t.style,
          m = function () {
            for (var n = !0, p = 0; p < f; p++) s[a[p]] = s[a[p]] + h[a[p]] * Math.abs(e[a[p]] - s[a[p]]) * i / 100, (Math.round(s[a[p]]) - e[a[p]]) * h[a[p]] >= 0 ? (n = n && !0, _[a[p]] = e[a[p]] + 'px') : (n = n && !1, _[a[p]] = s[a[p]] + 'px');
            n && (window.clearInterval(t.effect.animate), 'function' == typeof o && o(t))
          }
        t.effect.animate = window.setInterval(m, n)
      }
    },
    animate2: function (t, e, i, n, o) {
      var p = i || 1,
        r = n || 20,
        s = $(t),
        a = $.css.getComputedStyle(s),
        l = {},
        c = {}
      for (var u in e) l[u] = a[u].replace(/[-\d\s]/g, '') || e[u].replace(/[-\d\s]/g, '') || '', e[u] = parseFloat(e[u]), c[u] = parseFloat(a[u]);
      var g = 100 / p,
        d = 0,
        h = setInterval(function () {
          if (d++ >= g) return void clearInterval(h);
          for (var t in e) s.style[t] = (e[t] - c[t]) * d / g + c[t] + l[t]
        }, r)
    }
  }, $.check = {
    isHttps: function () {
      return 'https:' == document.location.protocol
    },
    isSsl: function () {
      return /^ssl./i.test(document.location.host)
    },
    isIpad: function () {
      return /ipad/i.test(navigator.userAgent.toLowerCase())
    },
    isQQ: function (t) {
      return /^[1-9]{1}\d{4,9}$/.test(t)
    },
    isQQMail: function (t) {
      return /^[1-9]{1}\d{4,9}@qq\.com$/.test(t)
    },
    isNullQQ: function (t) {
      return /^\d{1,4}$/.test(t)
    },
    isNick: function (t) {
      return /^[a-zA-Z]{1}([a-zA-Z0-9]|[-_]){0,19}$/.test(t)
    },
    isName: function (t) {
      return '<请输入帐号>' != t && /[\u4E00-\u9FA5]{1,8}/.test(t)
    },
    isPhone: function (t) {
      return /^(?:86|886|)1\d{10}\s*$/.test(t)
    },
    isSeaPhone: function (t) {
      return /^(00)?(?:852|853|886(0)?\d{1})\d{8}$/.test(t)
    },
    isMail: function (t) {
      return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(t)
    },
    isQiyeQQ800: function (t) {
      return /^(800)\d{7}$/.test(t)
    },
    isPassword: function (t) {
      return t && t.length >= 16
    },
    isForeignPhone: function (t) {
      return /^00\d{7,}/.test(t)
    },
    needVip: function (t) {
      for (var e = ['21001601', '21000110', '21000121', '46000101', '716027609', '716027610', '549000912', '637009801'], i = !0, n = 0, o = e.length; n < o; n++)
        if (e[n] == t) {
          i = !1;
          break
        }
      return i
    },
    isPaipai: function () {
      return /paipai.com$/.test(window.location.hostname)
    },
    is_weibo_appid: function (t) {
      return 46000101 == t || 607000101 == t || 558032501 == t || 682023901 == t
    }
  }, $.report = {
    monitor: function (t, e) {
      if (!(Math.random() > (e || 1))) try {
        var i = location.protocol + '//ui.ptlogin2.qq.com/cgi-bin/report?id=' + t
        $.http.preload(i)
      } catch (t) {}
    },
    nlog: function (t, e, i, n) {
      if (!(Math.random() >= (i || 1))) try {
        var o = '//ui.ptlogin2.qq.com/cgi-bin/report?',
          p = encodeURIComponent(t + '|_|' + location.href + '|_|' + window.navigator.userAgent)
        e = e || 0, n && (o += 'u=' + n + '&'), o += 'id=' + e + '&msg=' + p + '&v=' + Math.random(), $.http.preload(o)
      } catch (t) {}
    },
    simpleIsdSpeed: function (t, e) {
      if (Math.random() < (e || 1)) {
        var i = 'http://isdspeed.qq.com/cgi-bin/r.cgi?'
        $.check.isHttps() && (i = 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi?'), i += t, $.http.preload(i)
      }
    },
    isdSpeed: function (t, e) {
      var i = !1,
        n = 'http://isdspeed.qq.com/cgi-bin/r.cgi?'
      if ($.check.isHttps() && (n = 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi?'), n += t, Math.random() < (e || 1)) {
        var o = $.report.getSpeedPoints(t)
        for (var p in o) o[p] && o[p] < 3e4 && (n += '&' + p + '=' + o[p], i = !0);
        n += '&v=' + Math.random(), i && $.http.preload(n)
      }
      $.report.setSpeedPoint(t)
    },
    speedPoints: {},
    basePoint: {},
    setBasePoint: function (t, e) {
      $.report.basePoint[t] = e
    },
    setSpeedPoint: function (t, e, i) {
      e ? ($.report.speedPoints[t] || ($.report.speedPoints[t] = {}), $.report.speedPoints[t][e] = i - $.report.basePoint[t]) : $.report.speedPoints[t] = {}
    },
    setSpeedPoints: function (t, e) {
      $.report.speedPoints[t] = e
    },
    getSpeedPoints: function (t) {
      return $.report.speedPoints[t]
    }
  }, $.sso_ver = 0, $.sso_state = 0, $.plugin_isd_flag = '', $.nptxsso = null, $.activetxsso = null, $.sso_loadComplete = !0, $.np_clock = 0, $.loginQQnum = 0, $.suportActive = function () {
    var t = !0
    try {
      window.ActiveXObject || window.ActiveXObject.prototype ? (t = !0, window.ActiveXObject.prototype && !window.ActiveXObject && $.report.nlog('activeobject 判断有问题')) : t = !1
    } catch (e) {
      t = !1
    }
    return t
  }, $.getLoginQQNum = function () {
    try {
      var t = 0
      if ($.suportActive()) {
        $.plugin_isd_flag = 'flag1=7808&flag2=1&flag3=20', $.report.setBasePoint($.plugin_isd_flag, new Date);
        var e = new ActiveXObject('SSOAxCtrlForPTLogin.SSOForPTLogin2')
        $.activetxsso = e;
        var i = e.CreateTXSSOData()
        e.InitSSOFPTCtrl(0, i);
        t = e.DoOperation(2, i).GetArray('PTALIST').GetSize();
        try {
          var n = e.QuerySSOInfo(1)
          $.sso_ver = n.GetInt('nSSOVersion')
        } catch (t) {
          $.sso_ver = 0
        }
      } else if (navigator.mimeTypes['application/nptxsso'])
        if ($.plugin_isd_flag = 'flag1=7808&flag2=1&flag3=21', $.report.setBasePoint($.plugin_isd_flag, (new Date).getTime()), $.nptxsso || ($.nptxsso = document.createElement('embed'), $.nptxsso.type = 'application/nptxsso', $.nptxsso.style.width = '0px', $.nptxsso.style.height = '0px', document.body.appendChild($.nptxsso)), 'function' != typeof $.nptxsso.InitPVANoST) $.sso_loadComplete = !1, $.report.nlog('没有找到插件的InitPVANoST方法', 269929)
      else {
        var o = $.nptxsso.InitPVANoST()
        o && (t = $.nptxsso.GetPVACount(), $.sso_loadComplete = !0);
        try {
          $.sso_ver = $.nptxsso.GetSSOVersion()
        } catch (t) {
          $.sso_ver = 0
        }
      } else $.report.nlog('插件没有注册成功', 263744), $.sso_state = 2
    } catch (t) {
      var p = null
      try {
        p = $.http.getXHR()
      } catch (t) {
        return 0
      }
      var r = t.message || t
      return /^pt_windows_sso/.test(r) ? (/^pt_windows_sso_\d+_3/.test(r) ? $.report.nlog('QQ插件不支持该url' + t.message, 326044) : $.report.nlog('QQ插件抛出内部错误' + t.message, 325361), $.sso_state = 1) : p && 'msie' == $.browser('type') ? 'Win64' != window.navigator.platform ? ($.report.nlog('可能没有安装QQ' + t.message, 322340), $.sso_state = 2) : $.report.nlog('使用64位IE' + t.message, 343958) : ($.report.nlog('获取登录QQ号码出错' + t.message, 263745), window.ActiveXObject && 'Win32' == window.navigator.platform && ($.sso_state = 1)), 0
    }
    return $.loginQQnum = t, t
  }, $.checkNPPlugin = function () {
    var t = 10
    window.clearInterval($.np_clock), $.np_clock = window.setInterval(function () {
      'function' == typeof $.nptxsso.InitPVANoST || 0 == t ? (window.clearInterval($.np_clock), 'function' == typeof $.nptxsso.InitPVANoST && pt.plogin.auth()) : t--
    }, 200)
  }, $.guanjiaPlugin = null, $.initGuanjiaPlugin = function () {
    try {
      window.ActiveXObject ? $.guanjiaPlugin = new ActiveXObject('npQMExtensionsIE.Basic') : navigator.mimeTypes['application/qqpcmgr-extensions-mozilla'] && ($.guanjiaPlugin = document.createElement('embed'), $.guanjiaPlugin.type = 'application/qqpcmgr-extensions-mozilla', $.guanjiaPlugin.style.width = '0px', $.guanjiaPlugin.style.height = '0px', document.body.appendChild($.guanjiaPlugin));
      var t = $.guanjiaPlugin.QMGetVersion().split('.')
      4 == t.length && t[2] >= 9319 || ($.guanjiaPlugin = null)
    } catch (t) {
      $.guanjiaPlugin = null
    }
  },
  function () {
    '' != $.cookie.get('nohost_guid') && $.http.loadScript('/nohost_htdocs/js/SwitchHost.js', function () {
      var t = window.SwitchHost && window.SwitchHost.init
      t && t()
    })
  }(), setTimeout(function () {
    $.report.setBasePoint('flag1=7808&flag2=1&flag3=9', 0), void 0 !== window.postMessage ? $.report.setSpeedPoint('flag1=7808&flag2=1&flag3=9', 1, 2e3) : $.report.setSpeedPoint('flag1=7808&flag2=1&flag3=9', 1, 1e3), $.report.isdSpeed('flag1=7808&flag2=1&flag3=9', .01)
  }, 500), document.getElementsByClassName || (document.getElementsByClassName = function (t) {
    for (var e = [], i = new RegExp('(^| )' + t + '( |$)'), n = document.getElementsByTagName('*'), o = 0, p = n.length; o < p; o++) i.test(n[o].className) && e.push(n[o]);
    return e
  }), $ = window.$ || {}, $pt = window.$pt || {}, $.RSA = $pt.RSA = function () {
    function t(t, e) {
      return new r(t, e)
    }

    function e(t, e) {
      if (e < t.length + 11) return uv_alert('Message too long for RSA'), null;
      for (var i = [], n = t.length - 1; n >= 0 && e > 0;) {
        var o = t.charCodeAt(n--)
        i[--e] = o
      }
      i[--e] = 0;
      for (var p = new Y, s = []; e > 2;) {
        for (s[0] = 0; 0 == s[0];) p.nextBytes(s);
        i[--e] = s[0]
      }
      return i[--e] = 2, i[--e] = 0, new r(i)
    }

    function i() {
      this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null
    }

    function n(e, i) {
      null != e && null != i && e.length > 0 && i.length > 0 ? (this.n = t(e, 16), this.e = parseInt(i, 16)) : uv_alert('Invalid RSA public key')
    }

    function o(t) {
      return t.modPowInt(this.e, this.n)
    }

    function p(t) {
      var i = e(t, this.n.bitLength() + 7 >> 3)
      if (null == i) return null;
      var n = this.doPublic(i)
      if (null == n) return null;
      var o = n.toString(16)
      return 0 == (1 & o.length) ? o : '0' + o
    }

    function r(t, e, i) {
      null != t && ('number' == typeof t ? this.fromNumber(t, e, i) : null == e && 'string' != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
    }

    function s() {
      return new r(null)
    }

    function a(t, e, i, n, o, p) {
      for (; --p >= 0;) {
        var r = e * this[t++] + i[n] + o
        o = Math.floor(r / 67108864), i[n++] = 67108863 & r
      }
      return o
    }

    function l(t, e, i, n, o, p) {
      for (var r = 32767 & e, s = e >> 15; --p >= 0;) {
        var a = 32767 & this[t],
          l = this[t++] >> 15,
          c = s * a + l * r
        a = r * a + ((32767 & c) << 15) + i[n] + (1073741823 & o), o = (a >>> 30) + (c >>> 15) + s * l + (o >>> 30), i[n++] = 1073741823 & a
      }
      return o
    }

    function c(t, e, i, n, o, p) {
      for (var r = 16383 & e, s = e >> 14; --p >= 0;) {
        var a = 16383 & this[t],
          l = this[t++] >> 14,
          c = s * a + l * r
        a = r * a + ((16383 & c) << 14) + i[n] + o, o = (a >> 28) + (c >> 14) + s * l, i[n++] = 268435455 & a
      }
      return o
    }

    function u(t) {
      return at.charAt(t)
    }

    function g(t, e) {
      var i = lt[t.charCodeAt(e)]
      return null == i ? -1 : i
    }

    function d(t) {
      for (var e = this.t - 1; e >= 0; --e) t[e] = this[e];
      t.t = this.t, t.s = this.s
    }

    function h(t) {
      this.t = 1, this.s = t < 0 ? -1 : 0, t > 0 ? this[0] = t : t < -1 ? this[0] = t + DV : this.t = 0
    }

    function f(t) {
      var e = s()
      return e.fromInt(t), e
    }

    function _(t, e) {
      var i
      if (16 == e) i = 4
      else if (8 == e) i = 3
      else if (256 == e) i = 8
      else if (2 == e) i = 1
      else if (32 == e) i = 5
      else {
        if (4 != e) return void this.fromRadix(t, e);
        i = 2
      }
      this.t = 0, this.s = 0;
      for (var n = t.length, o = !1, p = 0; --n >= 0;) {
        var s = 8 == i ? 255 & t[n] : g(t, n)
        s < 0 ? '-' == t.charAt(n) && (o = !0) : (o = !1, 0 == p ? this[this.t++] = s : p + i > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - p) - 1) << p, this[this.t++] = s >> this.DB - p) : this[this.t - 1] |= s << p, (p += i) >= this.DB && (p -= this.DB))
      }
      8 == i && 0 != (128 & t[0]) && (this.s = -1, p > 0 && (this[this.t - 1] |= (1 << this.DB - p) - 1 << p)), this.clamp(), o && r.ZERO.subTo(this, this)
    }

    function m() {
      for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t;) --this.t
    }

    function $(t) {
      if (this.s < 0) return '-' + this.negate().toString(t);
      var e
      if (16 == t) e = 4
      else if (8 == t) e = 3
      else if (2 == t) e = 1
      else if (32 == t) e = 5
      else {
        if (4 != t) return this.toRadix(t);
        e = 2
      }
      var i, n = (1 << e) - 1,
        o = !1,
        p = '',
        r = this.t,
        s = this.DB - r * this.DB % e
      if (r-- > 0)
        for (s < this.DB && (i = this[r] >> s) > 0 && (o = !0, p = u(i)); r >= 0;) s < e ? (i = (this[r] & (1 << s) - 1) << e - s, i |= this[--r] >> (s += this.DB - e)) : (i = this[r] >> (s -= e) & n, s <= 0 && (s += this.DB, --r)), i > 0 && (o = !0), o && (p += u(i));
      return o ? p : '0'
    }

    function v() {
      var t = s()
      return r.ZERO.subTo(this, t), t
    }

    function y() {
      return this.s < 0 ? this.negate() : this
    }

    function w(t) {
      var e = this.s - t.s
      if (0 != e) return e;
      var i = this.t
      if (0 != (e = i - t.t)) return e;
      for (; --i >= 0;)
        if (0 != (e = this[i] - t[i])) return e;
      return 0
    }

    function k(t) {
      var e, i = 1
      return 0 != (e = t >>> 16) && (t = e, i += 16), 0 != (e = t >> 8) && (t = e, i += 8), 0 != (e = t >> 4) && (t = e, i += 4), 0 != (e = t >> 2) && (t = e, i += 2), 0 != (e = t >> 1) && (t = e, i += 1), i
    }

    function b() {
      return this.t <= 0 ? 0 : this.DB * (this.t - 1) + k(this[this.t - 1] ^ this.s & this.DM)
    }

    function q(t, e) {
      var i
      for (i = this.t - 1; i >= 0; --i) e[i + t] = this[i];
      for (i = t - 1; i >= 0; --i) e[i] = 0;
      e.t = this.t + t, e.s = this.s
    }

    function S(t, e) {
      for (var i = t; i < this.t; ++i) e[i - t] = this[i];
      e.t = Math.max(this.t - t, 0), e.s = this.s
    }

    function C(t, e) {
      var i, n = t % this.DB,
        o = this.DB - n,
        p = (1 << o) - 1,
        r = Math.floor(t / this.DB),
        s = this.s << n & this.DM
      for (i = this.t - 1; i >= 0; --i) e[i + r + 1] = this[i] >> o | s, s = (this[i] & p) << n;
      for (i = r - 1; i >= 0; --i) e[i] = 0;
      e[r] = s, e.t = this.t + r + 1, e.s = this.s, e.clamp()
    }

    function T(t, e) {
      e.s = this.s;
      var i = Math.floor(t / this.DB)
      if (i >= this.t) return void(e.t = 0);
      var n = t % this.DB,
        o = this.DB - n,
        p = (1 << n) - 1
      e[0] = this[i] >> n;
      for (var r = i + 1; r < this.t; ++r) e[r - i - 1] |= (this[r] & p) << o, e[r - i] = this[r] >> n;
      n > 0 && (e[this.t - i - 1] |= (this.s & p) << o), e.t = this.t - i, e.clamp()
    }

    function x(t, e) {
      for (var i = 0, n = 0, o = Math.min(t.t, this.t); i < o;) n += this[i] - t[i], e[i++] = n & this.DM, n >>= this.DB;
      if (t.t < this.t) {
        for (n -= t.s; i < this.t;) n += this[i], e[i++] = n & this.DM, n >>= this.DB;
        n += this.s
      } else {
        for (n += this.s; i < t.t;) n -= t[i], e[i++] = n & this.DM,
          n >>= this.DB;
        n -= t.s
      }
      e.s = n < 0 ? -1 : 0, n < -1 ? e[i++] = this.DV + n : n > 0 && (e[i++] = n), e.t = i, e.clamp()
    }

    function L(t, e) {
      var i = this.abs(),
        n = t.abs(),
        o = i.t
      for (e.t = o + n.t; --o >= 0;) e[o] = 0;
      for (o = 0; o < n.t; ++o) e[o + i.t] = i.am(0, n[o], e, o, 0, i.t);
      e.s = 0, e.clamp(), this.s != t.s && r.ZERO.subTo(e, e)
    }

    function N(t) {
      for (var e = this.abs(), i = t.t = 2 * e.t; --i >= 0;) t[i] = 0;
      for (i = 0; i < e.t - 1; ++i) {
        var n = e.am(i, e[i], t, 2 * i, 0, 1);
        (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, n, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV, t[i + e.t + 1] = 1)
      }
      t.t > 0 && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)), t.s = 0, t.clamp()
    }

    function E(t, e, i) {
      var n = t.abs()
      if (!(n.t <= 0)) {
        var o = this.abs()
        if (o.t < n.t) return null != e && e.fromInt(0), void(null != i && this.copyTo(i));
        null == i && (i = s());
        var p = s(),
          a = this.s,
          l = t.s,
          c = this.DB - k(n[n.t - 1])
        c > 0 ? (n.lShiftTo(c, p), o.lShiftTo(c, i)) : (n.copyTo(p), o.copyTo(i));
        var u = p.t,
          g = p[u - 1]
        if (0 != g) {
          var d = g * (1 << this.F1) + (u > 1 ? p[u - 2] >> this.F2 : 0),
            h = this.FV / d,
            f = (1 << this.F1) / d,
            _ = 1 << this.F2,
            m = i.t,
            $ = m - u,
            v = null == e ? s() : e
          for (p.dlShiftTo($, v), i.compareTo(v) >= 0 && (i[i.t++] = 1, i.subTo(v, i)), r.ONE.dlShiftTo(u, v), v.subTo(p, p); p.t < u;) p[p.t++] = 0;
          for (; --$ >= 0;) {
            var y = i[--m] == g ? this.DM : Math.floor(i[m] * h + (i[m - 1] + _) * f)
            if ((i[m] += p.am(0, y, i, $, 0, u)) < y)
              for (p.dlShiftTo($, v), i.subTo(v, i); i[m] < --y;) i.subTo(v, i)
          }
          null != e && (i.drShiftTo(u, e), a != l && r.ZERO.subTo(e, e)), i.t = u, i.clamp(), c > 0 && i.rShiftTo(c, i), a < 0 && r.ZERO.subTo(i, i)
        }
      }
    }

    function P(t) {
      var e = s()
      return this.abs().divRemTo(t, null, e), this.s < 0 && e.compareTo(r.ZERO) > 0 && t.subTo(e, e), e
    }

    function A(t) {
      this.m = t
    }

    function I(t) {
      return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
    }

    function Q(t) {
      return t
    }

    function M(t) {
      t.divRemTo(this.m, null, t)
    }

    function D(t, e, i) {
      t.multiplyTo(e, i), this.reduce(i)
    }

    function B(t, e) {
      t.squareTo(e), this.reduce(e)
    }

    function H() {
      if (this.t < 1) return 0;
      var t = this[0]
      if (0 == (1 & t)) return 0;
      var e = 3 & t
      return e = e * (2 - (15 & t) * e) & 15, e = e * (2 - (255 & t) * e) & 255, e = e * (2 - ((65535 & t) * e & 65535)) & 65535, e = e * (2 - t * e % this.DV) % this.DV, e > 0 ? this.DV - e : -e
    }

    function U(t) {
      this.m = t, this.mp = t.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << t.DB - 15) - 1, this.mt2 = 2 * t.t
    }

    function O(t) {
      var e = s()
      return t.abs().dlShiftTo(this.m.t, e), e.divRemTo(this.m, null, e), t.s < 0 && e.compareTo(r.ZERO) > 0 && this.m.subTo(e, e), e
    }

    function j(t) {
      var e = s()
      return t.copyTo(e), this.reduce(e), e
    }

    function V(t) {
      for (; t.t <= this.mt2;) t[t.t++] = 0;
      for (var e = 0; e < this.m.t; ++e) {
        var i = 32767 & t[e],
          n = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM
        for (i = e + this.m.t, t[i] += this.m.am(0, n, t, e, 0, this.m.t); t[i] >= t.DV;) t[i] -= t.DV, t[++i]++
      }
      t.clamp(), t.drShiftTo(this.m.t, t), t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
    }

    function R(t, e) {
      t.squareTo(e), this.reduce(e)
    }

    function F(t, e, i) {
      t.multiplyTo(e, i), this.reduce(i)
    }

    function G() {
      return 0 == (this.t > 0 ? 1 & this[0] : this.s)
    }

    function z(t, e) {
      if (t > 4294967295 || t < 1) return r.ONE;
      var i = s(),
        n = s(),
        o = e.convert(this),
        p = k(t) - 1
      for (o.copyTo(i); --p >= 0;)
        if (e.sqrTo(i, n), (t & 1 << p) > 0) e.mulTo(n, o, i)
      else {
        var a = i
        i = n, n = a
      }
      return e.revert(i)
    }

    function W(t, e) {
      var i
      return i = t < 256 || e.isEven() ? new A(e) : new U(e), this.exp(t, i)
    }

    function X(t) {
      ut[gt++] ^= 255 & t, ut[gt++] ^= t >> 8 & 255, ut[gt++] ^= t >> 16 & 255, ut[gt++] ^= t >> 24 & 255, gt >= ft && (gt -= ft)
    }

    function Z() {
      X((new Date).getTime())
    }

    function K() {
      if (null == ct) {
        for (Z(), ct = nt(), ct.init(ut), gt = 0; gt < ut.length; ++gt) ut[gt] = 0;
        gt = 0
      }
      return ct.next()
    }

    function J(t) {
      var e
      for (e = 0; e < t.length; ++e) t[e] = K()
    }

    function Y() {}

    function tt() {
      this.i = 0, this.j = 0, this.S = []
    }

    function et(t) {
      var e, i, n
      for (e = 0; e < 256; ++e) this.S[e] = e;
      for (i = 0, e = 0; e < 256; ++e) i = i + this.S[e] + t[e % t.length] & 255, n = this.S[e], this.S[e] = this.S[i], this.S[i] = n;
      this.i = 0, this.j = 0
    }

    function it() {
      var t
      return this.i = this.i + 1 & 255, this.j = this.j + this.S[this.i] & 255, t = this.S[this.i], this.S[this.i] = this.S[this.j], this.S[this.j] = t, this.S[t + this.S[this.i] & 255]
    }

    function nt() {
      return new tt
    }

    function ot(t, e, n) {
      e = 'e9a815ab9d6e86abbf33a4ac64e9196d5be44a09bd0ed6ae052914e1a865ac8331fed863de8ea697e9a7f63329e5e23cda09c72570f46775b7e39ea9670086f847d3c9c51963b131409b1e04265d9747419c635404ca651bbcbc87f99b8008f7f5824653e3658be4ba73e4480156b390bb73bc1f8b33578e7a4e12440e9396f2552c1aff1c92e797ebacdc37c109ab7bce2367a19c56a033ee04534723cc2558cb27368f5b9d32c04d12dbd86bbd68b1d99b7c349a8453ea75d1b2e94491ab30acf6c46a36a75b721b312bedf4e7aad21e54e9bcbcf8144c79b6e3c05eb4a1547750d224c0085d80e6da3907c3d945051c13c7c1dcefd6520ee8379c4f5231ed', n = '10001';
      var o = new i
      return o.setPublic(e, n), o.encrypt(t)
    }
    i.prototype.doPublic = o, i.prototype.setPublic = n, i.prototype.encrypt = p;
    var pt 'Microsoft Internet Explorer' == navigator.appName ? (r.prototype.am = l, pt = 30) : 'Netscape' != navigator.appName ? (r.prototype.am = a, pt = 26) : (r.prototype.am = c, pt = 28), r.prototype.DB = pt,
      r.prototype.DM = (1 << pt) - 1,
      r.prototype.DV = 1 << pt;
    r.prototype.FV = Math.pow(2, 52), r.prototype.F1 = 52 - pt, r.prototype.F2 = 2 * pt - 52;
    var rt, st, at = '0123456789abcdefghijklmnopqrstuvwxyz',
      lt = []
    for (rt = '0'.charCodeAt(0), st = 0; st <= 9; ++st) lt[rt++] = st;
    for (rt = 'a'.charCodeAt(0), st = 10; st < 36; ++st) lt[rt++] = st;
    for (rt = 'A'.charCodeAt(0), st = 10; st < 36; ++st) lt[rt++] = st;
    A.prototype.convert = I, A.prototype.revert = Q, A.prototype.reduce = M, A.prototype.mulTo = D, A.prototype.sqrTo = B, U.prototype.convert = O, U.prototype.revert = j, U.prototype.reduce = V, U.prototype.mulTo = F, U.prototype.sqrTo = R, r.prototype.copyTo = d, r.prototype.fromInt = h, r.prototype.fromString = _, r.prototype.clamp = m, r.prototype.dlShiftTo = q, r.prototype.drShiftTo = S, r.prototype.lShiftTo = C, r.prototype.rShiftTo = T, r.prototype.subTo = x, r.prototype.multiplyTo = L, r.prototype.squareTo = N, r.prototype.divRemTo = E, r.prototype.invDigit = H, r.prototype.isEven = G, r.prototype.exp = z, r.prototype.toString = $, r.prototype.negate = v, r.prototype.abs = y, r.prototype.compareTo = w, r.prototype.bitLength = b, r.prototype.mod = P, r.prototype.modPowInt = W, r.ZERO = f(0), r.ONE = f(1);
    var ct, ut, gt
    if (null == ut) {
      ut = [], gt = 0;
      var dt
      if ('Netscape' == navigator.appName && navigator.appVersion < '5' && window.crypto && window.crypto.random) {
        var ht = window.crypto.random(32)
        for (dt = 0; dt < ht.length; ++dt) ut[gt++] = 255 & ht.charCodeAt(dt)
      }
      for (; gt < ft;) dt = Math.floor(65536 * Math.random()), ut[gt++] = dt >>> 8, ut[gt++] = 255 & dt;
      gt = 0, Z()
    }
    Y.prototype.nextBytes = J, tt.prototype.init = et, tt.prototype.next = it;
    var ft = 256
    return {
      rsa_encrypt: ot
    }
  }(),
  function (t) {
    function e() {
      return Math.round(4294967295 * Math.random())
    }

    function i(t, e, i) {
      (!i || i > 4) && (i = 4);
      for (var n = 0, o = e; o < e + i; o++) n <<= 8, n |= t[o];
      return (4294967295 & n) >>> 0
    }

    function n(t, e, i) {
      t[e + 3] = i >> 0 & 255, t[e + 2] = i >> 8 & 255, t[e + 1] = i >> 16 & 255, t[e + 0] = i >> 24 & 255
    }

    function o(t) {
      if (!t) return '';
      for (var e = '', i = 0; i < t.length; i++) {
        var n = Number(t[i]).toString(16)
        1 == n.length && (n = '0' + n), e += n
      }
      return e
    }

    function p(t) {
      for (var e = '', i = 0; i < t.length; i += 2) e += String.fromCharCode(parseInt(t.substr(i, 2), 16));
      return e
    }

    function r(t, e) {
      if (!t) return '';
      e && (t = s(t));
      for (var i = [], n = 0; n < t.length; n++) i[n] = t.charCodeAt(n);
      return o(i)
    }

    function s(t) {
      var e, i, n = [],
        o = t.length
      for (e = 0; e < o; e++) i = t.charCodeAt(e), i > 0 && i <= 127 ? n.push(t.charAt(e)) : i >= 128 && i <= 2047 ? n.push(String.fromCharCode(192 | i >> 6 & 31), String.fromCharCode(128 | 63 & i)) : i >= 2048 && i <= 65535 && n.push(String.fromCharCode(224 | i >> 12 & 15), String.fromCharCode(128 | i >> 6 & 63), String.fromCharCode(128 | 63 & i));
      return n.join('')
    }

    function a(t) {
      m = new Array(8), $ = new Array(8), v = y = 0, b = !0, _ = 0;
      var i = t.length,
        n = 0
      _ = (i + 10) % 8, 0 != _ && (_ = 8 - _), w = new Array(i + _ + 10), m[0] = 255 & (248 & e() | _);
      for (var o = 1; o <= _; o++) m[o] = 255 & e();
      _++;
      for (var o = 0; o < 8; o++) $[o] = 0;
      for (n = 1; n <= 2;) _ < 8 && (m[_++] = 255 & e(), n++), 8 == _ && c();
      for (var o = 0; i > 0;) _ < 8 && (m[_++] = t[o++], i--), 8 == _ && c();
      for (n = 1; n <= 7;) _ < 8 && (m[_++] = 0, n++), 8 == _ && c();
      return w
    }

    function l(t) {
      var e = 0,
        i = new Array(8),
        n = t.length
      if (k = t, n % 8 != 0 || n < 16) return null;
      if ($ = g(t), _ = 7 & $[0], (e = n - _ - 10) < 0) return null;
      for (var o = 0; o < i.length; o++) i[o] = 0;
      w = new Array(e), y = 0, v = 8, _++;
      for (var p = 1; p <= 2;)
        if (_ < 8 && (_++, p++), 8 == _ && (i = t, !d())) return null;
      for (var o = 0; 0 != e;)
        if (_ < 8 && (w[o] = 255 & (i[y + _] ^ $[_]), o++, e--, _++), 8 == _ && (i = t, y = v - 8, !d())) return null;
      for (p = 1; p < 8; p++) {
        if (_ < 8) {
          if (0 != (i[y + _] ^ $[_])) return null;
          _++
        }
        if (8 == _ && (i = t, y = v, !d())) return null
      }
      return w
    }

    function c() {
      for (var t = 0; t < 8; t++) m[t] ^= b ? $[t] : w[y + t];
      for (var e = u(m), t = 0; t < 8; t++) w[v + t] = e[t] ^ $[t], $[t] = m[t];
      y = v, v += 8, _ = 0, b = !1
    }

    function u(t) {
      for (var e = 16, o = i(t, 0, 4), p = i(t, 4, 4), r = i(f, 0, 4), s = i(f, 4, 4), a = i(f, 8, 4), l = i(f, 12, 4), c = 0; e-- > 0;) c += 2654435769, c = (4294967295 & c) >>> 0, o += (p << 4) + r ^ p + c ^ (p >>> 5) + s, o = (4294967295 & o) >>> 0, p += (o << 4) + a ^ o + c ^ (o >>> 5) + l, p = (4294967295 & p) >>> 0;
      var u = new Array(8)
      return n(u, 0, o), n(u, 4, p), u
    }

    function g(t) {
      for (var e = 16, o = i(t, 0, 4), p = i(t, 4, 4), r = i(f, 0, 4), s = i(f, 4, 4), a = i(f, 8, 4), l = i(f, 12, 4), c = 3816266640; e-- > 0;) p -= (o << 4) + a ^ o + c ^ (o >>> 5) + l, p = (4294967295 & p) >>> 0, o -= (p << 4) + r ^ p + c ^ (p >>> 5) + s, o = (4294967295 & o) >>> 0, c -= 2654435769, c = (4294967295 & c) >>> 0;
      var u = new Array(8)
      return n(u, 0, o), n(u, 4, p), u
    }

    function d() {
      for (var t = (k.length, 0); t < 8; t++) $[t] ^= k[v + t];
      return $ = g($), v += 8, _ = 0, !0
    }

    function h(t, e) {
      var i = []
      if (e)
        for (var n = 0; n < t.length; n++) i[n] = 255 & t.charCodeAt(n);
      else
        for (var o = 0, n = 0; n < t.length; n += 2) i[o++] = parseInt(t.substr(n, 2), 16);
      return i
    }
    var f = '',
      _ = 0,
      m = [],
      $ = [],
      v = 0,
      y = 0,
      w = [],
      k = [],
      b = !0
    t.TEA = {
      encrypt: function (t, e) {
        return o(a(h(t, e)))
      },
      enAsBase64: function (t, e) {
        for (var i = h(t, e), n = a(i), o = '', p = 0; p < n.length; p++) o += String.fromCharCode(n[p]);
        return btoa(o)
      },
      decrypt: function (t) {
        return o(l(h(t, !1)))
      },
      initkey: function (t, e) {
        f = h(t, e)
      },
      bytesToStr: p,
      strToBytes: r,
      bytesInStr: o,
      dataFromStr: h
    };
    var q = {}
    q.PADCHAR = '=', q.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', q.getbyte = function (t, e) {
      var i = t.charCodeAt(e)
      if (i > 255) throw 'INVALID_CHARACTER_ERR: DOM Exception 5';
      return i
    }, q.encode = function (t) {
      if (1 != arguments.length) throw 'SyntaxError: Not enough arguments';
      var e, i, n = q.PADCHAR,
        o = q.ALPHA,
        p = q.getbyte,
        r = []
      t = '' + t;
      var s = t.length - t.length % 3
      if (0 == t.length) return t;
      for (e = 0; e < s; e += 3) i = p(t, e) << 16 | p(t, e + 1) << 8 | p(t, e + 2), r.push(o.charAt(i >> 18)), r.push(o.charAt(i >> 12 & 63)), r.push(o.charAt(i >> 6 & 63)), r.push(o.charAt(63 & i));
      switch (t.length - s) {
        case 1:
          i = p(t, e) << 16, r.push(o.charAt(i >> 18) + o.charAt(i >> 12 & 63) + n + n)
          break;
        case 2:
          i = p(t, e) << 16 | p(t, e + 1) << 8, r.push(o.charAt(i >> 18) + o.charAt(i >> 12 & 63) + o.charAt(i >> 6 & 63) + n)
      }
      return r.join('')
    }, window.btoa || (window.btoa = q.encode)
  }(window), $ = window.$ || {}, $pt = window.$pt || {}, $.Encryption = $pt.Encryption = function () {
    function t(t) {
      return e(t)
    }

    function e(t) {
      return u(i(c(t), t.length * m))
    }

    function i(t, e) {
      t[e >> 5] |= 128 << e % 32, t[14 + (e + 64 >>> 9 << 4)] = e;
      for (var i = 1732584193, n = -271733879, l = -1732584194, c = 271733878, u = 0; u < t.length; u += 16) {
        var g = i,
          d = n,
          h = l,
          f = c
        i = o(i, n, l, c, t[u + 0], 7, -680876936), c = o(c, i, n, l, t[u + 1], 12, -389564586), l = o(l, c, i, n, t[u + 2], 17, 606105819), n = o(n, l, c, i, t[u + 3], 22, -1044525330), i = o(i, n, l, c, t[u + 4], 7, -176418897), c = o(c, i, n, l, t[u + 5], 12, 1200080426), l = o(l, c, i, n, t[u + 6], 17, -1473231341), n = o(n, l, c, i, t[u + 7], 22, -45705983), i = o(i, n, l, c, t[u + 8], 7, 1770035416), c = o(c, i, n, l, t[u + 9], 12, -1958414417), l = o(l, c, i, n, t[u + 10], 17, -42063), n = o(n, l, c, i, t[u + 11], 22, -1990404162), i = o(i, n, l, c, t[u + 12], 7, 1804603682), c = o(c, i, n, l, t[u + 13], 12, -40341101), l = o(l, c, i, n, t[u + 14], 17, -1502002290), n = o(n, l, c, i, t[u + 15], 22, 1236535329), i = p(i, n, l, c, t[u + 1], 5, -165796510), c = p(c, i, n, l, t[u + 6], 9, -1069501632), l = p(l, c, i, n, t[u + 11], 14, 643717713), n = p(n, l, c, i, t[u + 0], 20, -373897302), i = p(i, n, l, c, t[u + 5], 5, -701558691), c = p(c, i, n, l, t[u + 10], 9, 38016083), l = p(l, c, i, n, t[u + 15], 14, -660478335), n = p(n, l, c, i, t[u + 4], 20, -405537848), i = p(i, n, l, c, t[u + 9], 5, 568446438), c = p(c, i, n, l, t[u + 14], 9, -1019803690), l = p(l, c, i, n, t[u + 3], 14, -187363961), n = p(n, l, c, i, t[u + 8], 20, 1163531501), i = p(i, n, l, c, t[u + 13], 5, -1444681467), c = p(c, i, n, l, t[u + 2], 9, -51403784), l = p(l, c, i, n, t[u + 7], 14, 1735328473), n = p(n, l, c, i, t[u + 12], 20, -1926607734), i = r(i, n, l, c, t[u + 5], 4, -378558), c = r(c, i, n, l, t[u + 8], 11, -2022574463), l = r(l, c, i, n, t[u + 11], 16, 1839030562), n = r(n, l, c, i, t[u + 14], 23, -35309556), i = r(i, n, l, c, t[u + 1], 4, -1530992060), c = r(c, i, n, l, t[u + 4], 11, 1272893353), l = r(l, c, i, n, t[u + 7], 16, -155497632), n = r(n, l, c, i, t[u + 10], 23, -1094730640), i = r(i, n, l, c, t[u + 13], 4, 681279174), c = r(c, i, n, l, t[u + 0], 11, -358537222), l = r(l, c, i, n, t[u + 3], 16, -722521979), n = r(n, l, c, i, t[u + 6], 23, 76029189), i = r(i, n, l, c, t[u + 9], 4, -640364487), c = r(c, i, n, l, t[u + 12], 11, -421815835), l = r(l, c, i, n, t[u + 15], 16, 530742520), n = r(n, l, c, i, t[u + 2], 23, -995338651), i = s(i, n, l, c, t[u + 0], 6, -198630844), c = s(c, i, n, l, t[u + 7], 10, 1126891415), l = s(l, c, i, n, t[u + 14], 15, -1416354905), n = s(n, l, c, i, t[u + 5], 21, -57434055), i = s(i, n, l, c, t[u + 12], 6, 1700485571), c = s(c, i, n, l, t[u + 3], 10, -1894986606), l = s(l, c, i, n, t[u + 10], 15, -1051523), n = s(n, l, c, i, t[u + 1], 21, -2054922799), i = s(i, n, l, c, t[u + 8], 6, 1873313359), c = s(c, i, n, l, t[u + 15], 10, -30611744), l = s(l, c, i, n, t[u + 6], 15, -1560198380), n = s(n, l, c, i, t[u + 13], 21, 1309151649), i = s(i, n, l, c, t[u + 4], 6, -145523070), c = s(c, i, n, l, t[u + 11], 10, -1120210379), l = s(l, c, i, n, t[u + 2], 15, 718787259), n = s(n, l, c, i, t[u + 9], 21, -343485551), i = a(i, g), n = a(n, d), l = a(l, h), c = a(c, f)
      }
      return 16 == v ? Array(n, l) : Array(i, n, l, c)
    }

    function n(t, e, i, n, o, p) {
      return a(l(a(a(e, t), a(n, p)), o), i)
    }

    function o(t, e, i, o, p, r, s) {
      return n(e & i | ~e & o, t, e, p, r, s)
    }

    function p(t, e, i, o, p, r, s) {
      return n(e & o | i & ~o, t, e, p, r, s)
    }

    function r(t, e, i, o, p, r, s) {
      return n(e ^ i ^ o, t, e, p, r, s)
    }

    function s(t, e, i, o, p, r, s) {
      return n(i ^ (e | ~o), t, e, p, r, s)
    }

    function a(t, e) {
      var i = (65535 & t) + (65535 & e)
      return (t >> 16) + (e >> 16) + (i >> 16) << 16 | 65535 & i
    }

    function l(t, e) {
      return t << e | t >>> 32 - e
    }

    function c(t) {
      for (var e = Array(), i = (1 << m) - 1, n = 0; n < t.length * m; n += m) e[n >> 5] |= (t.charCodeAt(n / m) & i) << n % 32;
      return e
    }

    function u(t) {
      for (var e = _ ? '0123456789ABCDEF' : '0123456789abcdef', i = '', n = 0; n < 4 * t.length; n++) i += e.charAt(t[n >> 2] >> n % 4 * 8 + 4 & 15) + e.charAt(t[n >> 2] >> n % 4 * 8 & 15);
      return i
    }

    function g(t) {
      for (var e = [], i = 0; i < t.length; i += 2) e.push(String.fromCharCode(parseInt(t.substr(i, 2), 16)));
      return e.join('')
    }

    function d(t, e) {
      if (!(Math.random() > (e || 1))) try {
        var i = location.protocol + '//ui.ptlogin2.qq.com/cgi-bin/report?id=' + t
        document.createElement('img').src = i
      } catch (t) {}
    }

    function h(e, i, n, o) {
      n = n || '', e = e || '';
      for (var p = o ? e : t(e), r = g(p), s = t(r + i), a = TEA.strToBytes(n.toUpperCase(), !0), l = Number(a.length / 2).toString(16); l.length < 4;) l = '0' + l;
      TEA.initkey(s);
      var c = TEA.encrypt(p + TEA.strToBytes(i) + l + a)
      TEA.initkey('');
      for (var u = Number(c.length / 2).toString(16); u.length < 4;) u = '0' + u;
      var h = $pt.RSA.rsa_encrypt(g(u + c))
      return setTimeout(function () {
        d(488358, 1)
      }, 0), btoa(g(h)).replace(/[\/\+=]/g, function (t) {
        return {
          '/': '-',
          '+': '*',
          '=': '_'
        }[t]
      })
    }

    function f(e, i, n) {
      var o = n ? e : t(e),
        p = o + i.toUpperCase()
      return $.RSA.rsa_encrypt(p)
    }
    var _ = 1,
      m = 8,
      v = 32
    return {
      getEncryption: h,
      getRSAEncryption: f,
      md5: t
    }
  }(), pt.headerCache = {
    update: function (t) {
      var e = $('img_' + t)
      e ? pt.headerCache[t] && pt.headerCache[t].indexOf('sys.getface.qq.com') > -1 ? e.src = pt.plogin.dftImg : e.src = pt.headerCache[t] || pt.plogin.dftImg : pt.headerCache[t] && pt.headerCache[t].indexOf('sys.getface.qq.com') > -1 ? $('auth_face').src = pt.plogin.dftImg : $('auth_face').src = pt.headerCache[t] || pt.plogin.dftImg
    }
  }, pt.setHeader = function (t) {
    for (var e in t) pt.headerCache[e] = t[e], '' != e && pt.headerCache.update(e)
  };
var __pt_ieZeroLogin = !1,
  __pt_webkitZeroLogin = !1
pt.qlogin = function () {
  var t = {
      17: 2,
      19: 3,
      20: 2,
      21: 3,
      22: 3,
      23: 3,
      25: 3,
      32: 3,
      33: 3,
      34: 3,
      40: 2
    },
    e = {
      17: 240,
      19: 300,
      20: 240,
      21: 360,
      22: 360,
      23: 300,
      25: 300,
      32: 360,
      33: 300,
      34: 300,
      40: 240
    },
    i = [],
    n = [],
    o = [],
    p = [],
    r = 0,
    s = 0,
    a = 9,
    l = '<a hidefocus=true draggable=false href="javascript:void(0);" tabindex="#tabindex#" uin="#uin#" type="#type#" onclick="pt.qlogin.imgClick(this);return false;" onfocus="pt.qlogin.imgFocus(this);" onblur="pt.qlogin.imgBlur(this);" onmouseover="pt.qlogin.imgMouseover(this);" onmousedown="pt.qlogin.imgMouseDowm(this)" onmouseup="pt.qlogin.imgMouseUp(this)" onmouseout="pt.qlogin.imgMouseUp(this)" class="face"  >          <img  id="img_#uin#" uin="#uin#" type="#type#" src="#src#"    onerror="pt.qlogin.imgErr(this);" />           <span id="mengban_#uin#"></span>          <span class="uin_menban"></span>          <span class="uin">#uin#</span>          <span id="img_out_#uin#" uin="#uin#" type="#type#"  class="img_out"  ></span>          <span id="nick_#uin#" class="#nick_class#">#nick#</span>          <span class="#vip_logo#"></span>          <span class="#onekey_logo#"></span>      </a><a  class="#return#" onclick="pt.qlogin.buildUnifiedQloginList();pt.plogin.hide_err();return false;">#return_text#</a>',
    c = 1,
    u = t[pt.ptui.style],
    g = e[pt.ptui.style],
    d = 1,
    h = null,
    f = [4300, 4302, 4304, 4306, 4308],
    _ = [4301, 4303, 4305, 4307, 4309],
    m = function (t) {
      function e() {
        $('qlogin_list').style.left = 1 == t ? r * o - d * n + 'px' : (2 - d) * n - r * o + 'px', ++r > p && window.clearInterval(i)
      }
      if (!(1 == t && d <= 1 || 2 == t && d >= c)) {
        var i = 0,
          n = $('qlogin_show').offsetWidth || g,
          o = 10,
          p = Math.ceil(n / o),
          r = 0
        1 == t ? (d--, d <= 1 ? ($.css.hide($('prePage')), $.css.show($('nextPage'))) : ($.css.show($('nextPage')), $.css.show($('prePage')))) : (d++, d >= c ? ($.css.hide($('nextPage')), $.css.show($('prePage'))) : ($.css.show($('nextPage')), $.css.show($('prePage')))), i = window.setInterval(e, 1)
      }
    },
    v = function () {
      if (n.length = 0, !pt.plogin.isTim) {
        if ($.suportActive()) try {
          var t = $.activetxsso,
            e = t.CreateTXSSOData()
          t.InitSSOFPTCtrl(0, e);
          var i = t.DoOperation(1, e)
          if (null == i) return;
          for (var o = i.GetArray('PTALIST'), p = o.GetSize(), r = 0; r < p; r++) {
            var s = o.GetData(r),
              l = s.GetDWord('dwSSO_Account_dwAccountUin'),
              c = s.GetDWord('dwSSO_Account_dwAccountUin'),
              u = '',
              g = s.GetByte('cSSO_Account_cAccountType'),
              d = l
            if (1 == g) try {
              u = s.GetArray('SSO_Account_AccountValueList'), d = u.GetStr(0)
            } catch (t) {}
            var h = 0
            try {
              h = s.GetWord('wSSO_Account_wFaceIndex')
            } catch (t) {
              h = 0
            }
            var f = ''
            try {
              f = s.GetStr('strSSO_Account_strNickName')
            } catch (t) {
              f = ''
            }
            for (var _ = s.GetBuf('bufST_PTLOGIN'), m = '', v = _.GetSize(), y = 0; y < v; y++) {
              var w = _.GetAt(y).toString('16')
              1 == w.length && (w = '0' + w), m += w
            }
            var b = s.GetDWord('dwSSO_Account_dwUinFlag'),
              q = {
                uin: l,
                name: d,
                uinString: c,
                type: g,
                face: h,
                nick: f,
                flag: b,
                key: m,
                loginType: 2
              }
            n.push(q)
          }
          0 == p && (__pt_ieZeroLogin = !0, k(), $.report.monitor(2129652, 1))
        } catch (t) {
          k(), $.report.nlog('IE获取快速登录信息失败：' + t.message, '391626', .05)
        } else try {
          var S = $.nptxsso,
            C = S.InitPVA(),
            T = 0
          if (0 != C) {
            T = S.GetPVACount();
            for (var y = 0; y < T; y++) {
              var q = {
                uin: S.GetUin(y),
                name: S.GetAccountName(y),
                uinString: S.GetUinString(y),
                type: 0,
                face: S.GetFaceIndex(y),
                nick: S.GetNickname(y) || S.GetUinString(y),
                flag: S.GetUinFlag(y),
                key: S.GetST(y),
                loginType: 2
              }
              n.push(q)
            }
            'function' == typeof S.GetKeyIndex && (a = S.GetKeyIndex())
          }
          C && 0 != T || (__pt_webkitZeroLogin = !0, k(), $.report.monitor(2129654, 1))
        } catch (t) {
          k(), $.report.nlog('非IE获取快速登录信息失败：' + (t.message || t), '391627', .05)
        }
        n.length && pt.plogin.isMailLogin && pt.plogin.switchpage(pt.LoginState.QLogin)
      }
    },
    y = function (t) {
      for (var e = 0, i = n.length; e < i; e++) {
        var o = n[e]
        if (o.uinString == t) return o
      }
      return null
    },
    w = function (t, e, i, n, o) {
      if (!/linux/i.test(navigator.userAgent) && ($.cookie.get('pt_local_token') || ($.cookie.set('pt_local_token', Math.random(), 'ptlogin2.' + pt.ptui.domain), $.cookie.get('pt_local_token')))) {
        var p = pt.ptui.isHttps ? _ : f,
          r = 'http' + (pt.ptui.isHttps ? 's' : '') + '://localhost.ptlogin2.' + pt.ptui.domain + ':[port]/' + t + '&r=' + Math.random() + '&pt_local_tk=' + $.cookie.get('pt_local_token')
        z(r, p, e, window[i], n, o)
      }
    },
    k = function () {
      if (0 != pt.ptui.enable_qlogin) {
        w('pt_get_uins?callback=ptui_getuins_CB', 300, 'ptui_getuins_CB')
      }
    },
    b = function () {
      if (/windows/i.test(navigator.userAgent)) {
        var t = 'pc_querystatus?callback=ptui_pc_querystatus_CB&appid=ptlogin&subappid=' + pt.ptui.pt_3rd_aid
        w(t, 100, 'ptui_pc_querystatus_CB', null, function () {
          pt.qlogin.callQQProtect({
            service: 104,
            action: 3,
            wparam: $.str.json2str({
              appid: 'ptlogin',
              subappid: pt.ptui.pt_3rd_aid,
              qqnum: '123456',
              msgid: 1
            }),
            callbackName: 'ptui_qqprotect_querystatus_CB'
          })
        })
      }
    },
    q = '0',
    S = function (t, e, i, n) {
      if (!/windows/i.test(navigator.userAgent)) return void('function' == typeof n && n());
      switch (parseInt(i)) {
        case 0:
        case 1:
          t = q
          break;
        default:
          q = t
      }
      if (pt.qlogin.PCMgrSession) {
        var o = 'pc_action?callback=ptui_action_result_CB&appid=ptlogin&subappid=' + pt.ptui.pt_3rd_aid + '&operator=' + pt.qlogin.PCMgrChecked + '&actionstring=' + encodeURIComponent(pt.qlogin.PCMgrSession) + '&qqnum=' + encodeURIComponent(t) + '&loginType=' + e
        switch (parseInt(i)) {
          case 0:
            o += '&errcode=0'
            break;
          case 1:
            o += '&errcode=1'
        }
        w(o, 100, 'ptui_action_result_CB', n, n)
      } else if (pt.qlogin.PCMgrSession2) {
        var p = {
          appid: 'ptlogin',
          subappid: pt.ptui.pt_3rd_aid,
          qqnum: t,
          ActionString: pt.qlogin.PCMgrSession2
        }
        switch (pt.qlogin.PCMgrChecked) {
          case 1:
          case 3:
            p.check = 1
            break;
          default:
            p.check = 0
        }
        switch (parseInt(i)) {
          case 0:
            p.msgid = 3, p.result = 1
            break;
          case 1:
            p.msgid = 3, p.result = 0
            break;
          default:
            p.msgid = 2
        }
        pt.qlogin.callQQProtect({
          service: 104,
          action: 1,
          callbackName: 'ptui_qqprotect_result_CB',
          wparam: $.str.json2str(p),
          callback: n,
          timeoutCallback: n
        })
      } else 'function' == typeof n && n()
    },
    C = function (t) {
      t && (pt.plogin.showLoading(), w('pt_get_st?clientuin=' + t + '&callback=ptui_getst_CB', 300, 'ptui_getst_CB', null, function () {
        pt.qlogin.__getstClock = setTimeout(function () {
          pt.plogin.hideLoading(), ptui_qlogin_CB('-1234', '', '快速登录失败，请检查QQ客户端是否打开。')
        }, 3e3)
      }), ptui_getst_CB.submitUrl = E({
        uin: t,
        pt_local_tk: '{{hash_clientkey}}'
      }))
    },
    T = function (t, e) {
      if (pt.plogin.isNewStyle) {
        if (1 == e) switch (t) {
          case 1:
            $.css.hide($('qlogin_tips_0')), $.css.hide($('qlogin_tips_1')), $.css.show($('qlogin_tips_2')), $.css.hide($('qlogin_tips_3')), $('qlogin_tips_4') && $.css.hide($('qlogin_tips_4'))
            break;
          case 2:
            $.css.hide($('qlogin_tips_0')), $.css.hide($('qlogin_tips_1')), $.css.hide($('qlogin_tips_2')), $.css.show($('qlogin_tips_3')), $('qlogin_tips_4') && $.css.hide($('qlogin_tips_4'))
            break;
          case 3:
            $.css.hide($('qlogin_tips_0')), $.css.hide($('qlogin_tips_1')), $.css.hide($('qlogin_tips_2')), $.css.hide($('qlogin_tips_3')), $('qlogin_tips_4') && $.css.show($('qlogin_tips_4'))
            break;
          default:
            $.css.show($('qlogin_tips_0')), $.css.hide($('qlogin_tips_1')), $.css.hide($('qlogin_tips_2')), $.css.hide($('qlogin_tips_3')), $('qlogin_tips_4') && $.css.hide($('qlogin_tips_4'))
        } else $.css.hide($('qlogin_tips_0')), $.css.show($('qlogin_tips_1')), $.css.hide($('qlogin_tips_2')), $.css.hide($('qlogin_tips_3')), $('qlogin_tips_4') && $.css.hide($('qlogin_tips_4'))
        t ? ($.css.show($('title_1')), $.css.hide($('title_0'))) : ($.css.hide($('title_1')), $.css.show($('title_0')))
      }
    },
    x = function (t) {
      if (t) {
        v();
        var e = y(t)
        if (null == e) pt.plogin.show_err(pt.str.qlogin_expire), $.report.monitor(231544, 1)
        else {
          var i = E(e)
          S(t, 2), $.http.loadScript(i), pt.plogin.showLoading(), window.clearTimeout(pt.qlogin.__getstClock), pt.qlogin.__getstClock = window.setTimeout('pt.plogin.hideLoading();pt.plogin.showAssistant(0);', 1e4)
        }
      }
    },
    L = function (t, e, i) {
      var n = t.split('#'),
        o = n[0].indexOf('?') > 0 ? '&' : '?'
      return '?' == n[0].substr(n[0].length - 1, 1) && (o = ''), n[1] ? n[1] = '#' + n[1] : n[1] = '', n[0] + o + e + '=' + i + n[1]
    },
    N = function (t) {
      var e = pt.ptui.s_url
      return 1 == pt.ptui.low_login && pt.plogin.low_login_enable && pt.plogin.isMailLogin && (e = L(e, 'ss', 1)), pt.plogin.isMailLogin && t && (e = L(e, 'account', encodeURIComponent(t))), e
    },
    E = function (t) {
      var e = pt.ptui.isHttps ? 'https://ssl.ptlogin2.' : 'http://ptlogin2.',
        i = e + pt.ptui.domain + '/' + (pt.ptui.jumpname || 'jump') + '?'
      switch (pt.ptui.domain) {
        case 'tencent.com':
        case 'bkcloud.cc':
        case 'bkclouds.cc':
          i = pt.ptui.isHttps ? 'https' : 'http://ptlogin2.' + pt.ptui.domain + '/jump?'
      }
      return i += 'clientuin=' + t.uin + '&keyindex=' + a + '&pt_aid=' + pt.ptui.appid + (pt.ptui.daid ? '&daid=' + pt.ptui.daid : '') + '&u1=' + encodeURIComponent(N()), void 0 !== t.key ? i += '&clientkey=' + t.key : i += '&pt_local_tk=' + t.pt_local_tk, 1 == pt.ptui.low_login && pt.plogin.low_login_enable && !pt.plogin.isMailLogin && (i += '&low_login_enable=1&low_login_hour=' + pt.plogin.low_login_hour), '0' != pt.ptui.csimc && pt.ptui.csimc && (i += '&csimc=' + pt.ptui.csimc + '&csnum=' + pt.ptui.csnum + '&authid=' + pt.ptui.authid), '1' == pt.ptui.pt_qzone_sig && (i += '&pt_qzone_sig=1'), '1' == pt.ptui.pt_light && (i += '&pt_light=1'), pt.ptui.pt_3rd_aid && (i += '&pt_3rd_aid=' + pt.ptui.pt_3rd_aid), i += '&ptopt=1', i += '&style=' + pt.ptui.style, pt.qlogin.hasOneKeyList() && (i += '&has_onekey=1'), pt.ptui.regmaster && (i += '&regmaster=' + pt.ptui.regmaster), pt.qlogin.QQProtectGUID && (i += '&pt_guid_sig=' + pt.qlogin.QQProtectGUID), i
    },
    P = function () {
      var t = A()
      pt.plogin.redirect(pt.ptui.target, t), pt.plogin.showLoading()
    },
    A = function () {
      var t = pt.plogin.authSubmitUrl
      return t += '&regmaster=' + pt.ptui.regmaster + '&aid=' + pt.ptui.appid + '&s_url=' + encodeURIComponent(N()), 1 == pt.ptui.low_login && pt.plogin.low_login_enable && (t += '&low_login_enable=1&low_login_hour=' + pt.plogin.low_login_hour), '1' == pt.ptui.pt_light && (t += '&pt_light=1'), pt.qlogin.hasOneKeyList() && (t += '&has_onekey=1'), pt.qlogin.QQProtectGUID && (t += '&pt_guid_sig=' + pt.qlogin.QQProtectGUID), t
    },
    I = function (t, e) {
      var i = 'https://ssl.ptlogin2.' + pt.ptui.domain + '/ptqrshow?qr_push_uin=' + t + '&type=1&qr_push=1&appid=' + pt.ptui.appid + '&t=' + Math.random() + '&ptlang=' + pt.ptui.lang
      pt.ptui.daid && (i += '&daid=' + pt.ptui.daid), pt.ptui.pt_3rd_aid && (i += '&pt_3rd_aid=' + pt.ptui.pt_3rd_aid), pt.qlogin.__onekeyClock = setTimeout(function () {
        pt.plogin.hideLoading(), pt.plogin.showAssistant(0)
      }, 5e3), pt.plogin.showLoading(), $.http.loadScript(i), pt.qlogin.__onekeyUin = t, pt.qlogin.__onekeyFirst = !!e
    },
    Q = function (t) {
      return t.onerror = null, t.src != pt.plogin.dftImg && (t.src = pt.plogin.dftImg), !1
    },
    M = function (t) {
      var e = parseInt(t.getAttribute('type')),
        i = t.getAttribute('uin')
      switch (e) {
        case 1:
          pt.qlogin.reportPath(i, 2), P()
          break;
        case 2:
          x(i), pt.qlogin.reportPath(i, 1)
          break;
        case 4:
          C(i), pt.qlogin.reportPath(i, 1)
          break;
        case 5:
          I(i, !0), pt.qlogin.reportPath(i, 4)
      }
    },
    D = function (t) {
      if (t) {
        var e = t.getAttribute('uin')
        e && ($('img_out_' + e).className = 'img_out_focus')
      }
    },
    B = function (t) {
      if (t) {
        var e = t.getAttribute('uin')
        e && ($('img_out_' + e).className = 'img_out')
      }
    },
    H = function (t) {
      t && (h != t && (B(h), h = t), D(t))
    },
    U = function (t) {
      if (t) {
        var e = t.getAttribute('uin'),
          i = $('mengban_' + e)
        i && (i.className = 'face_mengban')
      }
    },
    O = function (t) {
      if (t) {
        var e = t.getAttribute('uin'),
          i = $('mengban_' + e)
        i && (i.className = '')
      }
    },
    j = function () {
      var t = $('qlogin_list'),
        e = t.getElementsByTagName('a')
      e.length > 0 && (h = e[0])
    },
    V = function () {
      try {
        h.focus()
      } catch (t) {}
    },
    R = function () {
      var t = $('prePage'),
        e = $('nextPage')
      t && $.e.add(t, 'click', function (t) {
        m(1)
      }), e && $.e.add(e, 'click', function (t) {
        m(2)
      });
      for (var i = document.getElementsByClassName('guanjia_checkbox'), n = 0; n < i.length; ++n) $.e.add(i[n], 'change', function (t) {
        pt.qlogin.PCMgrChecked = t.target.checked;
        for (var e = 0; e < i.length; ++e) i[e].checked = pt.qlogin.PCMgrChecked
      })
    },
    F = function () {
      for (var t = p.length, e = 0; e < t; e++) p[e].uinString && (p[e].uinString in pt.headerCache ? pt.headerCache.update(p[e].uinString) : $.http.loadScript((pt.ptui.isHttps ? 'https://ssl.ptlogin2.' : 'http://ptlogin2.') + pt.ptui.domain + '/getface?appid=' + pt.ptui.appid + '&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=' + p[e].uinString + '&r=' + Math.random()))
    },
    G = function (t) {
      var e = r,
        i = p
      if (pt.plogin.loginState == pt.LoginState.QLogin) {
        var n = $('qlogin_list'),
          o = $('qr_area')
        if (o && n.removeChild(o), n.innerHTML = '', o && n.appendChild(o), 3 == e ? $.css.hide(o) : o.style.display = '', pt.plogin.isNewStyle) var s = i.length
        else var s = i.length > 5 ? 5 : i.length
        if (0 == s) return void pt.plogin.switchpage(pt.LoginState.PLogin, !0);
        for (var a = 0; a < (e ? 1 : i.length); a++) 4 != i[a].loginType && 2 != i[a].loginType || (pt.qlogin.hasBuildQlogin = !0)
        pt.plogin.isNewStyle ? T(e, s) : pt.plogin.isNewQr && (1 == s ? ($('qlogin_tips') && $.css.hide($('qlogin_tips')), $('qlogin_show').style.top = '25px') : ($('qlogin_tips') && $.css.show($('qlogin_tips')), $('qlogin_show').style.top = ''));
        for (var h = '', f = 0; f < s; f++) {
          var _ = i[f],
            m = $.str.encodeHtml(_.uinString + ''),
            v = $.str.encodeHtml(_.nick)
          '' == $.str.trim(_.nick) && (v = m);
          var y = _.flag,
            w = 4 == (4 & y),
            k = 5 == _.loginType,
            b = pt.plogin.dftImg
          if (3 == _.loginType) {
            var o = $('qr_area')
            1 == s ? (o && ($('qr_area').className = 'qr_0'), '1033' == pt.ptui.lang && ($('qlogin_show').style.height = $('qlogin_show').offsetHeight + 10 + 'px')) : o && ($('qr_area').className = 'qr_1')
          } else h += l.replace(/#uin#/g, m).replace(/#nick#/g, function () {
            return v
          }).replace(/#nick_class#/, w ? 'nick red' : 'nick').replace(/#vip_logo#/, w ? 'vip_logo' : '').replace(/#onekey_logo#/, k ? 'onekey_logo' : '').replace(/#type#/g, _.loginType).replace(/#src#/g, b).replace(/#tabindex#/, f + 1).replace(/#class#/g, 1 == _.loginType ? 'auth' : 'hide').replace(/#return#/g, 3 == e ? 'return' : 'hide').replace(/#return_text#/g, pt.str.onekey_return)
        }
        h = n.innerHTML + h, n.innerHTML = h, setTimeout(function () {
          var o = $('qlogin_show').offsetWidth || g,
            p = pt.plogin.isMailLogin ? 93 : 100
          if (pt.plogin.isNewStyle && (u = 3 != e && 1 == s ? 3 : Math.floor(o / p)), c = Math.ceil(s / u), pt.plogin.isNewStyle) {
            var r = $('qlogin_show')
            o = 3 != e && 1 == s ? 3 * p : u * p, r.style.width = o + 'px', r.style.left = '50%', r.style.marginLeft = 50 * -u + 'px'
          }
          c >= 2 ? $.css.show($('nextPage')) : ($.css.hide($('prePage')), $.css.hide($('nextPage'))), d = 1, $('qlogin_list').style.left = '';
          var a = o
          if (pt.plogin.isNewStyle) var l = 1 == c ? a : a / u * s
          else var l = 1 == c ? a : s * p
          n.style.width = l + 'px', pt.plogin.isMailLogin && (n.style.width = l + 14 + 'px');
          for (var h = 0; h < s; h++)
            if (3 == i[h].loginType) {
              pt.plogin.begin_qrlogin();
              break
            }
          setTimeout(function () {
            'function' == typeof t && t()
          }, 0)
        }, 0), j(), V(), F(), pt.plogin.resetQrTips()
      }
    },
    z = function (t, e, i, n, o, p) {
      var r = 0,
        s = function () {
          clearInterval(l), 'function' == typeof o && o()
        },
        a = function () {
          if (r >= e.length) return clearInterval(l), void(n.called || 'function' != typeof p || p());
          $.http.loadScript(t.replace('[port]', e[r++]), s)
        }
      n.called = !1;
      var l = setInterval(a, i)
      a()
    }
  return function () {
    R(), setTimeout(function () {
      $.report.monitor(492804, .05)
    }, 0)
  }(), {
    hasBuildQlogin: !1,
    imgClick: M,
    imgFocus: D,
    imgBlur: B,
    imgMouseover: H,
    imgMouseDowm: U,
    imgMouseUp: O,
    imgErr: Q,
    focusHeader: V,
    authLoginSubmit: P,
    __getstClock: 0,
    __onekeyClock: 0,
    __onekeyUin: 0,
    __onekeyFirst: !0,
    getSurl: N,
    PCSvrQlogin: 4,
    OneKeyPush: 5,
    onekeyPush: I,
    setPCSvrQloginList: function (t) {
      n = t
    },
    setOneKeyList: function (t) {
      o = t
    },
    hasOneKeyList: function () {
      return !!o.length
    },
    buildUnifiedQloginList: function (t, e) {
      r = void 0 === t ? 0 : t, s = e;
      var a = [],
        l = {}
      if (i.length = 0, pt.plogin.isNewQr && a.push({
          loginType: 3
        }), 1 == t || 2 == t) return p = a, void G();
      if (pt.plogin.authUin && '0' == pt.ptui.auth_mode && '' == pt.ptui.regmaster && '1' != pt.ptui.noAuth && !pt.plogin.isTim) {
        var c = {
          name: pt.plogin.authUin,
          uinString: pt.plogin.authUin,
          nick: $.str.utf8ToUincode($.cookie.get('ptnick_' + pt.plogin.authUin)) || pt.plogin.authUin,
          loginType: 1
        }
        a.push(c), l[c.name] = c, i.push(c)
      }
      if ('1' == pt.ptui.enable_qlogin && !pt.plogin.isTim)
        for (var u in n) l[n[u].name] || l[n[u].uinString] || (a.push(n[u]), l[n[u].uinString] = n[u], i.push(n[u]));
      if ('1' == pt.ptui.enable_qlogin && !pt.plogin.isTim)
        for (var u in o) l[o[u].name] || l[o[u].uinString] || (a.push(o[u]), l[o[u].uinString] = o[u], i.push(o[u]));
      3 == t && l[e] && (a.length = 0, a.push(l[e])), p = a, G()
    },
    buildQloginDom: G,
    fetchQloginList: v,
    QQProtectSession: '',
    QQProtectPortList: [9410, 16873],
    QQProtectGUID: '',
    callQQProtect: function (t) {
      if (/windows/i.test(navigator.userAgent)) {
        var e = $.cookie.get('_qpsvr_localtk')
        if (e || $.cookie.set('_qpsvr_localtk', Math.random(), 'qq.com'), e = $.cookie.get('_qpsvr_localtk')) {
          switch (t.timeout || (t.timeout = 200), t.wparam || (t.wparam = ''), t.lparam || (t.lparam = ''), parseInt(t.service)) {
            case 103:
              var i = 1,
                n = pt.qlogin.QQProtectSession
              break;
            case 104:
            default:
              var i = 0,
                n = ''
          }
          var o = [9410, 16873],
            p = 'https://localhost.sec.qq.com:[port]/?cmd=101&service=' + encodeURIComponent(t.service) + '&action=' + encodeURIComponent(t.action) + '&timeout=5000&_tk=' + encodeURIComponent(e) + '&encrypt=' + i + '&_ts=' + (new Date).getTime() + '&callback=' + encodeURIComponent(t.callbackName) + '&wparam=' + encodeURIComponent(t.wparam) + '&lparam=' + encodeURIComponent(t.lparam) + '&session=' + encodeURIComponent(n)
          z(p, o, t.timeout, window[t.callbackName], t.callback, t.timeoutCallback)
        }
      }
    },
    fetchOnekeyListByGUID: function (t) {
      if (t) var e = 'https://ssl.ptlogin2.' + pt.ptui.domain + '/pt_fetch_dev_uin?r=' + Math.random() + '&pt_guid_sig=' + t
      else {
        var i = $.cookie.get('pt_guid_sig')
        if (!i) return;
        var e = 'https://ssl.ptlogin2.' + pt.ptui.domain + '/pt_fetch_dev_uin?r=' + Math.random() + '&pt_guid_token=' + $.str.hash33(i)
      }
      $.http.loadScript(e)
    },
    fetchOnekeyList: function () {
      if (pt.plogin.isNewStyle && !pt.plogin.isTim && '0' != pt.ptui.enable_qlogin) return navigator.userAgent.match(/Windows/) ? void pt.qlogin.callQQProtect({
        service: 1,
        callbackName: 'pt_qqprotect_version',
        timeoutCallback: function () {
          pt.qlogin.fetchOnekeyListByGUID(), $.report.monitor(2732844)
        }
      }) : pt.qlogin.fetchOnekeyListByGUID()
    },
    hasNoQlogin: function () {
      return 0 == i.length
    },
    detectPCMgr: b,
    reportPCMgr: S,
    PCMgrSession: '',
    PCMgrSession2: '',
    PCMgrChecked: 3,
    processPCMgrStatus: function (t, e, i) {
      for (var n = document.getElementsByClassName('guanjia'), o = 0; o < n.length; ++o) $.css.show(n[o]);
      for (var p = document.getElementsByClassName('guanjia_tips'), o = 0; o < p.length; ++o) p[o].innerHTML = $.str.encodeHtml(e);
      switch (parseInt(t)) {
        case 0:
          return;
        case 1:
          for (var r = document.getElementsByClassName('guanjia_logo'), o = 0; o < r.length; ++o) r[o].style.display = 'inline';
          for (var o = 0; o < n.length; ++o) {
            n[o].style.opacity = 0, n[o].style.filter = 'alpha(opacity=0)';
            var s = $.css.getCurrentPixelStyle(n[o], 'top')
            n[o].style.top = s + 10 + 'px', $.animate.animate2(n[o], {
              top: s + 'px'
            }, 5), $.animate.fade(n[o], 100, 5)
          }
          break;
        case 2:
          for (var a = document.getElementsByClassName('guanjia_checkbox'), o = 0; o < a.length; ++o) {
            a[o].style.display = 'inline';
            var l = 'true' == i.toString().toLowerCase() || '1' == i
            a[o].checked = l, pt.qlogin.PCMgrChecked = l ? 1 : 2
          }
      }
      for (var c = document.getElementsByClassName('bottom'), o = 0; o < c.length; ++o) $.css.addClass(c[o], 'center')
    },
    reportPath: function (t, e) {
      for (var i = 0, n = 0, o = 0, r = 0, s = 0, a = 0; a < p.length; ++a) {
        switch (p[a].loginType) {
          case 1:
            n++
            break;
          case 5:
            r++
            break;
          case 2:
          case 4:
            o++
        }
        if (p[a].uinString == t) switch (a < u && (s = 1), p[a].loginType) {
          case 1:
            i = 2
            break;
          case 5:
            i = 4
            break;
          case 2:
          case 4:
            i = 1
        }
      }
      $.http.loadScript('//ui.ptlogin2.qq.com/cgi-bin/report?ct=2&path=' + e + '-' + i + '-' + s + '-' + n + '-' + o + '-' + r)
    }
  }
}(), pt.LoginState = {
  PLogin: 1,
  QLogin: 2,
  OneKeyLogin: 3
}, pt.plogin = {
  account: '',
  at_account: '',
  uin: '',
  salt: '',
  checkState: !1,
  lastCheckAccount: '',
  needVc: !1,
  vcFlag: !1,
  ckNum: {},
  action: [0, 0],
  passwordErrorNum: 1,
  isIpad: !1,
  seller_id: 703010802,
  checkUrl: '',
  loginUrl: '',
  verifycodeUrl: '',
  needShowNewVc: !1,
  pt_verifysession: '',
  checkClock: 0,
  isCheckTimeout: !1,
  cntCheckTimeout: 0,
  checkTime: 0,
  submitTime: 0,
  errclock: 0,
  loginClock: 0,
  login_param: pt.ptui.href.substring(pt.ptui.href.indexOf('?') + 1),
  err_m: $('err_m'),
  low_login_enable: !0,
  low_login_hour: 720,
  low_login_isshow: !1,
  list_index: [-1, 2],
  keyCode: {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    TAB: 9,
    BACK: 8,
    DEL: 46,
    F5: 116
  },
  knownEmail: 25 == pt.ptui.style ? ['qq.com', 'vip.qq.com', 'foxmail.com'] : ['qq.com', 'foxmail.com', 'gmail.com', 'hotmail.com', 'yahoo.com', 'sina.com', '163.com', '126.com', 'vip.qq.com', 'vip.sina.com', 'sina.cn', 'sohu.com', 'yahoo.cn', 'yahoo.com.cn', '139.com', 'wo.com.cn', '189.cn', 'live.com', 'msn.com', 'live.hk', 'live.cn', 'hotmail.com.cn', 'hinet.net', 'msa.hinet.net', 'cm1.hinet.net', 'umail.hinet.net', 'xuite.net', 'yam.com', 'pchome.com.tw', 'netvigator.com', 'seed.net.tw', 'anet.net.tw'],
  qrlogin_clock: 0,
  qrlogin_timeout: 0,
  qrlogin_timeout_time: 6e5,
  qrlogin_invalid: !1,
  isQrLogin: !1,
  qr_uin: '',
  qr_nick: '',
  onekey_verify_timeout: 36e5,
  onekeyVerifyClock: 0,
  dftImg: '',
  need_hide_operate_tips: !0,
  js_type: 1,
  xuiState: 1,
  delayTime: 5e3,
  delayMonitorId: '294059',
  hasSubmit: !1,
  isdTime: {},
  authUin: '',
  authSubmitUrl: '',
  loginState: pt.LoginState.PLogin,
  aqScanLink: "<a href='javascript:void(0)'; onclick='pt.plogin.switch_qrlogin()'>" + ('2052' == pt.ptui.lang ? '立即扫描' : '1028' == pt.ptui.lang ? '立即掃描' : 'Scan now') + '</a>',
  isNewQr: !1,
  hasNoQlogin: !1,
  checkRet: -1,
  cap_cd: 0,
  authTimes: 0,
  checkErr: {
    2052: '网络繁忙，请稍后重试。',
    1028: '網絡繁忙，請稍後重試。',
    1033: 'The network is busy, please try again later.'
  },
  isTenpay: 34 == pt.ptui.style,
  isMailLogin: 25 == pt.ptui.style || 30 == pt.ptui.style,
  isPwdFirst: function () {
    if (pt.ptui.lockuin) return !0;
    if ('0' == $.bom.query('pt_pwd')) return !1;
    var t = [/\bqcloud\.com$/, /\bcloud\.tencent\.com$/, /\b110\.qq\.com$/, /\baq\.qq\.com$/, /\breg\.t\.qq\.com$/, /\bb\.qq\.com$/, /\bmail\.qq\.com$/, /\bqmail\.com$/],
      e = function (t) {
        var e = document.createElement('a')
        return e.href = t, e
      }(document.referrer)
    for (var i in t)
      if (e.hostname.match(t[i])) return !0;
    if ('1' == $.bom.query('pt_pwd')) {
      t = [/\bjiazhang.qq.com$/];
      for (var i in t)
        if (e.hostname.match(t[i])) return !0
    }
    return !1
  },
  isQcloud: function () {
    return !! function (t) {
      var e = document.createElement('a')
      return e.href = t, e
    }(document.referrer).hostname.match(/\b(qcloud\.com|cloud\.tencent\.com)$/)
  },
  isNewStyle: pt.ptui.style >= 40,
  isTim: 41 == pt.ptui.style,
  switchpageCount: 0,
  isUIStyle: pt.ptui.fromStyle,
  domFocus: function (t) {
    try {
      window.setTimeout(function () {
        t.focus()
      }, 0)
    } catch (t) {}
  },
  formFocus: function () {
    var t = document.loginform
    try {
      var e = t.u,
        i = t.p,
        n = t.verifycode
      if ('' == e.value) return void e.focus();
      if ('' == i.value) return void i.focus();
      '' == n.value && n.focus()
    } catch (t) {}
  },
  getAuthUrl: function () {
    var t = (pt.ptui.isHttps ? 'https://ssl.' : 'http://') + 'ptlogin2.' + pt.ptui.domain + '/pt4_auth?daid=' + pt.ptui.daid + '&appid=' + pt.ptui.appid + '&auth_token=' + $.str.time33($.cookie.get('supertoken'))
    return /^https/.test(pt.ptui.s_url) && (t += '&pt4_shttps=1'), '1' == pt.ptui.pt_qzone_sig && (t += '&pt_qzone_sig=1'), t
  },
  auth: function () {
    pt.plogin.authTimes++, pt.ptui.isHttps = $.check.isHttps();
    var t = pt.plogin.getAuthUrl(),
      e = $.cookie.get('superuin')
    pt.ptui.daid && '1' != pt.ptui.noAuth && !pt.plogin.isTim && '' != e && '' == pt.ptui.regmaster && '0' == pt.ptui.pt_3rd_aid && $.http.loadScript(t)
  },
  initAuthInfo: function (t) {
    var e = $.cookie.get('uin').replace(/^o0*/, ''),
      i = $.str.utf8ToUincode($.cookie.get('ptnick_' + e)) || e
    $('auth_uin').innerHTML = $.str.encodeHtml(e), $('auth_nick').innerHTML = $.str.encodeHtml(i), $('auth_area').setAttribute('authUrl', $.str.encodeHtml(t)), $.http.loadScript((pt.ptui.isHttps ? 'https://ssl.ptlogin2.' : 'http://ptlogin2.') + pt.ptui.domain + '/getface?appid=' + pt.ptui.appid + '&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=' + e + '&r=' + Math.random())
  },
  showAuth: function (t, e) {
    2 == t && $.css.hide($('cancleAuthOuter')), pt.plogin.initAuthInfo(e);
    var i = pt.ptui.style
    22 != i && 23 != i || ($.css.hide($('header')), $.css.hide($('authHeader'))), $('authLogin').style.height = $('login').offsetHeight - (11 == i ? 2 : 4) + 'px', $.css.show($('authLogin')), pt.plogin.ptui_notifySize('login')
  },
  cancleAuth: function () {
    var t = pt.ptui.style
    22 != t && 23 != t || ($.css.show($('header')), $.css.show($('authHeader'))), $.css.hide($('authLogin')), pt.plogin.ptui_notifySize('login')
  },
  authLogin: function () {
    pt.qlogin.authLoginSubmit()
  },
  authMouseDowm: function (t) {
    var e = $('auth_mengban')
    e && (e.className = 'face_mengban')
  },
  authMouseUp: function (t) {
    var e = $('auth_mengban')
    e && (e.className = '')
  },
  onQloginSwitch: function (t) {
    t.preventDefault(), pt.plogin.switchpage(pt.LoginState.QLogin), $.report.monitor('331284', .05)
  },
  switchpage: function (t, e) {
    pt.plogin.switchpageCount++;
    var i
    switch (pt.plogin.loginState = t, e || pt.plogin.hide_err(), t) {
      case 1:
        pt.plogin.hideQrTips(), $.css.hide($('bottom_qlogin')), $.css.hide($('qlogin')), $.css.show($('web_qr_login')), $('qrswitch') && $.css.show($('qrswitch')), pt.plogin.isNewStyle || ($('switcher_plogin').className = 'switch_btn_focus', $('switcher_qlogin').className = 'switch_btn'), i = $('switcher_plogin').offsetWidth, $('switcher_plogin').parentNode.offsetWidth - i, 'ff' != $.browser('type') && window.setTimeout(function () {
          pt.plogin.formFocus()
        }, 0), pt.plogin.isNewQr && pt.plogin.cancle_qrlogin(), pt.plogin.armSafeEdit && pt.plogin.armSafeEdit.everSafe && (pt.plogin.armSafeEdit.lockToggle(), pt.plogin.armSafeEdit.everSafe = !1), 0 != pt.plogin.onekeyVerifyClock && pt.plogin.onekeyVerify('normal'), pt.plogin.hasCheck(!1)
        break;
      case 2:
        $.css.hide($('web_qr_login')), $.css.show($('qlogin')), pt.plogin.isNewStyle || ($('switcher_plogin').className = 'switch_btn', $('switcher_qlogin').className = 'switch_btn_focus'), $('qrswitch') && $.css.hide($('qrswitch')), $.css.show($('bottom_qlogin')), pt.qlogin.focusHeader(), 0, i = $('switcher_qlogin').offsetWidth, pt.plogin.armSafeEdit.isSafe && (pt.plogin.armSafeEdit.lockToggle(), pt.plogin.armSafeEdit.everSafe = !0), pt.qlogin.buildQloginDom()
    }
    pt.plogin.ptui_notifySize('login')
  },
  detectCapsLock: function (t) {
    var e = t.keyCode || t.which,
      i = t.shiftKey || 16 == e || !1
    return !!(e >= 65 && e <= 90 && !i || e >= 97 && e <= 122 && i)
  },
  generateEmailTips: function (t) {
    var e = t.indexOf('@'),
      i = ''
    i = -1 == e ? t : t.substring(0, e);
    for (var n = [], o = 0, p = pt.plogin.knownEmail.length; o < p; o++) n.push(i + '@' + pt.plogin.knownEmail[o]);
    for (var r = [], s = 0, p = n.length; s < p; s++) n[s].indexOf(t) > -1 && r.push($.str.encodeHtml(n[s]));
    return 19 == pt.ptui.style && (r = []), r
  },
  createEmailTips: function (t) {
    var e = pt.plogin.generateEmailTips(t),
      i = e.length,
      n = [],
      o = ''
    if (0 == (i = Math.min(i, 4))) return pt.plogin.list_index[0] = -1, void pt.plogin.hideEmailTips();
    for (var p = 0; p < i; p++) {
      if (t == e[p]) return void pt.plogin.hideEmailTips();
      o = 'emailTips_' + p, 0 == p ? n.push('<li id=' + o + " class='hover' >" + e[p] + '</li>') : n.push('<li id=' + o + '>' + e[p] + '</li>')
    }
    $('email_list').innerHTML = n.join(' '), pt.plogin.list_index[0] = 0
  },
  showEmailTips: function () {
    $.css.show($('email_list')), pt.plogin.__isShowEmailTips = !0
  },
  hideEmailTips: function () {
    $.css.hide($('email_list')), pt.plogin.__isShowEmailTips = !1
  },
  setUrl: function () {
    var t = pt.ptui.domain,
      e = $.check.isHttps() && $.check.isSsl()
    pt.plogin.checkUrl = (pt.ptui.isHttps ? 'https://ssl.' : 'http://check.') + 'ptlogin2.' + t + '/check', pt.plogin.loginUrl = (pt.ptui.isHttps ? 'https://ssl.' : 'http://') + 'ptlogin2.' + t + '/', pt.plogin.verifycodeUrl = (pt.ptui.isHttps ? 'https://ssl.' : 'http://') + 'captcha.' + t + '/getimage', e && 'qq.com' != t && 'tenpay.com' != t && (pt.plogin.verifycodeUrl = 'https://ssl.ptlogin2.' + t + '/ptgetimage'), pt.plogin.dftImg = pt.ptui.isHttps ? 'https://ui.ptlogin2.qq.com/style/0/images/1.gif' : 'http://imgcache.qq.com/ptlogin/v4/style/0/images/1.gif'
  },
  VCCallback: function (t) {
    0 == t.ret ? pt.plogin.vcodeMessage(t) : pt.plogin.hideVC()
  },
  init: function (t) {
    pt.ptui.login_sig = pt.ptui.login_sig || $.cookie.get('pt_login_sig'), pt.plogin.setLowloginCheckbox(), pt.plogin.isNewQr = !(25 != pt.ptui.style && 32 != pt.ptui.style && 33 != pt.ptui.style && !pt.plogin.isNewStyle && !pt.plogin.isTenpay), pt.ptui.isHttps = $.check.isHttps(), pt.plogin.setUrl(), pt.plogin.bindEvent(), $('login_button') && ($('login_button').disabled = !1), pt.plogin.set_default_uin(pt.ptui.defaultUin), pt.plogin.isTenpay && pt.ptui.defaultUin && (pt.ptui.lockuin = 1), $.check.is_weibo_appid(pt.ptui.appid) && $('u') && ($('u').style.imeMode = 'auto'), pt.ptui.isHttps && (pt.plogin.delayTime = 7e3, pt.plogin.delayMonitorId = '294060'), pt.plogin.hideVipLink(), '0' != pt.ptui.pt_3rd_aid && pt.qlogin.detectPCMgr(), pt.ptui.lockuin ? pt.plogin.doLockuin() : (pt.qlogin.fetchOnekeyList(), pt.qlogin.fetchQloginList()), !pt.plogin.isTim && pt.plogin.formFocus(), !(pt.plogin.isTenpay && $.sso_ver >= 1093) || pt.plogin.isWin8() && $.suportActive() || pt.plogin.armSafeEdit(), pt.qlogin.buildUnifiedQloginList(), window.setTimeout(function () {
      pt.plogin.domLoad()
    }, 100)
  },
  isWin8: function () {
    var t = navigator.userAgent.toLowerCase()
    return t.indexOf('windows nt 6.2') > -1 || t.indexOf('windows nt 6.3') > -1
  },
  aq_patch: function () {
    Math.random() < .05 && !pt.ptui.isHttps && $.http.loadScript('http://mat1.gtimg.com/www/js/common_v2.js', function () {
      if ('function' == typeof checkNonTxDomain) try {
        checkNonTxDomain(1, 5)
      } catch (t) {}
    })
  },
  hideVipLink: function () {
    var t = $('vip_link2'),
      e = $('vip_dot') !t || !e || $.check.needVip(pt.ptui.appid) && '2052' == pt.ptui.lang || ($.css.addClass(t, 'hide'), $.css.addClass(e, 'hide'))
  },
  set_default_uin: function (t) {
    '0' != t && (t || (t = $.cookie.get('ptui_loginuin'), $.check.is_weibo_appid(pt.ptui.appid) || !$.check.isNick(t) && !$.check.isName(t) || (t = $.cookie.get('pt2gguin').replace(/^o/, '') - 0, t = 0 == t ? '' : t)), $('u').value = t, t && ($.css.hide($('uin_tips')), $('uin_del') && $.css.show($('uin_del')), pt.plogin.set_account()))
  },
  doLockuin: function () {
    pt.plogin.switchpage(pt.LoginState.PLogin, !0), $('u').readOnly = !0, $('qlogin_entry') && ($('qlogin_entry').style.display = 'none');
    var t = $('uinArea')
    $.css.hasClass(t, 'default') || $.css.addClass(t, 'default');
    var e = $('uin_del')
    e && e.parentNode.removeChild(e), $.e.remove($('switcher_qlogin'), 'click', pt.plogin.onQloginSwitch), $('switcher_qlogin').className = 'switch_btn_disabled', $('p').focus()
  },
  set_account: function () {
    var t = $.str.trim($('u').value),
      e = pt.ptui.appid
    if (pt.plogin.account = t, pt.plogin.at_account = t, $.check.isQiyeQQ800(t)) return pt.plogin.at_account = '@' + t, !0;
    if ($.check.is_weibo_appid(e)) {
      if ($.check.isQQ(t) || $.check.isMail(t)) return !0;
      if ($.check.isNick(t) || $.check.isName(t)) return pt.plogin.at_account = '@' + t, !0;
      if ($.check.isPhone(t)) return pt.plogin.at_account = '@' + t.replace(/^(86|886)/, ''), !0;
      if ($.check.isSeaPhone(t)) return pt.plogin.at_account = '@00' + t.replace(/^(00)/, ''), /^(@0088609)/.test(pt.plogin.at_account) && (pt.plogin.at_account = pt.plogin.at_account.replace(/^(@0088609)/, '@008869')), !0
    } else {
      if ($.check.isQQ(t) || $.check.isMail(t)) return !0;
      if ($.check.isPhone(t)) return pt.plogin.at_account = '@' + t.replace(/^(86|886)/, ''), !0;
      if ($.check.isNick(t)) return $('u').value = t + '@qq.com', pt.plogin.account = t + '@qq.com', pt.plogin.at_account = t + '@qq.com', !0
    }
    return $.check.isForeignPhone(t) && (pt.plogin.at_account = '@' + t), !0
  },
  adjustErrTips: function () {
    if (pt.plogin.isNewStyle) {
      var t, e = $('error_tips'),
        i = $('loading_tips')
      'block' == $.css.getComputedStyle($('qlogin_tips_0')).display && 'block' == $.css.getComputedStyle($('qlogin')).display && (t = $('qlogin_tips_0')), 'block' == $.css.getComputedStyle($('qlogin_tips_1')).display && 'block' == $.css.getComputedStyle($('qlogin')).display && (t = $('qlogin_tips_1')), 'block' == $.css.getComputedStyle($('qlogin_tips_2')).display && 'block' == $.css.getComputedStyle($('qlogin')).display && (t = $('qlogin_tips_2')), 'block' == $.css.getComputedStyle($('qlogin_tips_3')).display && 'block' == $.css.getComputedStyle($('qlogin')).display && (t = $('qlogin_tips_3')), $('qlogin_tips_4') && 'block' == $.css.getComputedStyle($('qlogin_tips_4')).display && 'block' == $.css.getComputedStyle($('qlogin')).display && (t = $('qlogin_tips_4')), 'block' == $.css.getComputedStyle($('tips')).display && 'block' == $.css.getComputedStyle($('web_qr_login')).display && (t = $('tips')), e.style.top = $.css.getOffsetPosition(t).top + parseInt($.css.getCurrentPixelStyle(t, 'height')) + 'px', i.style.top = $.css.getOffsetPosition(t).top + parseInt($.css.getCurrentPixelStyle(t, 'height')) + 'px'
    }
  },
  show_err: function (t, e) {
    var i = $('onekey_step2')
    i && 'block' == $.css.getComputedStyle(i).display ? $('onekey_tips').innerHTML = t : (pt.plogin.hideLoading(), pt.plogin.adjustErrTips(), $.css.show($('error_tips')), pt.plogin.err_m.innerHTML = t), clearTimeout(pt.plogin.errclock), e || (pt.plogin.errclock = setTimeout('pt.plogin.hide_err()', 5e3))
  },
  hide_err: function () {
    var t = $('onekey_step2')
    t && 'block' == $.css.getComputedStyle(t).display ? $('onekey_tips').innerHTML = '' : ($.css.hide($('error_tips')), pt.plogin.err_m.innerHTML = '')
  },
  showAssistant: function (t) {
    if ('2052' == pt.ptui.lang) {
      pt.plogin.hideLoading(), pt.plogin.adjustErrTips(), $.css.show($('error_tips'));
      var e = ''
      switch (t) {
        case 0:
          e = '快速登录异常，试试 {/assistant/troubleshooter.html,登录助手,} 修复', $.report.monitor('315785')
          break;
        case 1:
          e = '快速登录异常，试试 {/assistant/troubleshooter.html,登录助手,} 修复', $.report.monitor('315786')
          break;
        case 2:
          e = '登录异常，试试 {/assistant/troubleshooter.html,登录助手,} 修复', $.report.monitor('315787')
          break;
        case 3:
          e = "快速登录异常，试试 {http://im.qq.com/qq/2013/,升级QQ,onclick='$.report.monitor(326049);'} 修复", $.report.monitor('326046')
          break;
        case 4:
          e = '快速登录异常，试试 {http://im.qq.com/macqq/index.shtml#im.qqformac.plusdown,安装插件,} 并重启浏览器'
      }
      pt.plogin.err_m.innerHTML = e.replace(/{([^,]+?),([^,]+?),(.*?)}/, "<a class='tips_link' style='color: #29B1F1' href='$1' target='_blank' $3>$2</a>")
    }
  },
  showGuanjiaTips: function () {
    $.initGuanjiaPlugin(), $.guanjiaPlugin ? ($.guanjiaPlugin.QMStartUp(16, '/traytip=3 /tipProblemid=1401 /tipSource=18 /tipType=0 /tipIdParam=0 /tipIconUrl="http://dldir2.qq.com/invc/xfspeed/qqpcmgr/clinic/image/tipsicon_qq.png" /tipTitle="QQ快速登录异常?" /tipDesc="不能用已登录的QQ号快速登录，只能手动输入账号密码，建议用电脑诊所一键修复。"'), $.report.monitor('316548')) : $.report.monitor('316549')
  },
  showLoading: function (t) {
    pt.plogin.isNewStyle ? pt.plogin.adjustErrTips() : (t = pt.plogin.loginState == pt.LoginState.QLogin ? 10 : 20, $('loading_tips').style.top = t + 'px'), pt.plogin.hide_err(), $.css.show($('loading_tips'))
  },
  hideLoading: function () {
    $.css.hide($('loading_tips'))
  },
  showLowList: function () {
    var t = $('combox_list')
    t && ($.css.show(t), pt.plogin.low_login_isshow = !0)
  },
  hideLowList: function () {
    var t = $('combox_list')
    t && ($.css.hide(t), pt.plogin.low_login_isshow = !1)
  },
  u_focus: function () {
    '' == $('u').value && ($.css.show($('uin_tips')), $('uin_tips').className = 'input_tips_focus'), $('u').parentNode.className = 'inputOuter_focus'
  },
  u_blur: function () {
    if (!pt.plogin.__isShowEmailTips) {
      /^\+/.test(this.value) && (this.value = this.value.replace(/^\+/, ''), /^00/.test(this.value) || (this.value = '00' + this.value));
      var t = $('u')
      if ('' == t.value) {
        var e = $('uin_tips')
        $.css.show(e), e.className = 'input_tips'
      } else pt.plogin.set_account(), pt.plogin.check();
      t.parentNode.className = 'inputOuter'
    }
  },
  u_mouseover: function () {
    'inputOuter_focus' == $('u').parentNode.className || ($('u').parentNode.className = 'inputOuter_hover')
  },
  u_mouseout: function () {
    'inputOuter_focus' == $('u').parentNode.className || ($('u').parentNode.className = 'inputOuter')
  },
  window_blur: function () {
    pt.plogin.lastCheckAccount = ''
  },
  u_refresh_dom: function () {
    '' == $('u').value ? ($.css.show($('uin_tips')), $('uin_tips').className = 'input_tips_focus', $('uin_del') && $.css.hide($('uin_del'))) : ($.css.hide($('uin_tips')), $('uin_del') && $.css.show($('uin_del')))
  },
  u_change: function () {
    pt.plogin.set_account(), pt.plogin.passwordErrorNum = 1, pt.plogin.hasCheck(!1), pt.plogin.hasSubmit = !1
  },
  list_keydown: function (t, e) {
    var i = $('email_list'),
      n = $('u')
    1 == e && (i = $('combox_list'));
    var o = i.getElementsByTagName('li'),
      p = o.length
    switch (t.keyCode) {
      case pt.plogin.keyCode.UP:
        o[pt.plogin.list_index[e]].className = '', pt.plogin.list_index[e] = (pt.plogin.list_index[e] - 1 + p) % p, o[pt.plogin.list_index[e]].className = 'hover'
        break;
      case pt.plogin.keyCode.DOWN:
        o[pt.plogin.list_index[e]].className = '', pt.plogin.list_index[e] = (pt.plogin.list_index[e] + 1) % p, o[pt.plogin.list_index[e]].className = 'hover'
        break;
      case pt.plogin.keyCode.ENTER:
        var r = o[pt.plogin.list_index[e]].innerHTML
        0 == e && (n.value = $.str.decodeHtml(r)), pt.plogin.hideEmailTips(), pt.plogin.hideLowList(), t.preventDefault()
        break;
      case pt.plogin.keyCode.TAB:
        pt.plogin.hideEmailTips(), pt.plogin.hideLowList()
    }
    1 == e && ($('combox_box').innerHTML = o[pt.plogin.list_index[e]].innerHTML, $('low_login_hour').value = o[pt.plogin.list_index[e]].getAttribute('value'))
  },
  u_keydown: function (t) {
    $.css.hide($('uin_tips')), -1 != pt.plogin.list_index[0] && pt.plogin.list_keydown(t, 0)
  },
  u_keyup: function (t) {
    '' == this.value ? ($.css.show($('uin_tips')), $('uin_tips').className = 'input_tips_focus', $('uin_del') && $.css.hide($('uin_del'))) : $('uin_del') && $.css.show($('uin_del'));
    var e = t.keyCode
    e != pt.plogin.keyCode.UP && e != pt.plogin.keyCode.DOWN && e != pt.plogin.keyCode.ENTER && e != pt.plogin.keyCode.TAB && e != pt.plogin.keyCode.F5 && ($('u').value.indexOf('@') > -1 ? (pt.plogin.showEmailTips(), pt.plogin.createEmailTips($('u').value)) : pt.plogin.hideEmailTips())
  },
  email_mousemove: function (t) {
    var e = t.target
    if ('li' == e.tagName.toLowerCase()) {
      var i = $('emailTips_' + pt.plogin.list_index[0])
      i && (i.className = ''), e.className = 'hover', pt.plogin.list_index[0] = parseInt(e.getAttribute('id').substring(10)), t.stopPropagation()
    }
  },
  email_click: function (t) {
    if ('li' == t.target.tagName.toLowerCase()) {
      var e = $('emailTips_' + pt.plogin.list_index[0])
      e && ($('u').value = $.str.decodeHtml(e.innerHTML), pt.plogin.set_account(), pt.plogin.check()), pt.plogin.hideEmailTips(), t.stopPropagation()
    }
  },
  p_focus: function () {
    '' == this.value && ($.css.show($('pwd_tips')), $('pwd_tips').className = 'input_tips_focus'), this.parentNode.className = 'inputOuter_focus', pt.plogin.check()
  },
  p_blur: function () {
    '' == this.value && ($.css.show($('pwd_tips')), $('pwd_tips').className = 'input_tips'), $.css.hide($('caps_lock_tips')), this.parentNode.className = 'inputOuter'
  },
  p_mouseover: function () {
    'inputOuter_focus' == $('p').parentNode.className || ($('p').parentNode.className = 'inputOuter_hover')
  },
  p_mouseout: function () {
    'inputOuter_focus' == $('p').parentNode.className || ($('p').parentNode.className = 'inputOuter')
  },
  p_keydown: function (t) {
    $.css.hide($('pwd_tips'))
  },
  p_keyup: function () {
    '' == this.value && $.css.show($('pwd_tips'))
  },
  p_keypress: function (t) {
    pt.plogin.detectCapsLock(t) ? $.css.show($('caps_lock_tips')) : $.css.hide($('caps_lock_tips'))
  },
  p_refresh_dom: function () {
    '' == $('p').value ? ($.css.show($('pwd_tips')), $('pwd_tips').className = 'input_tips_focus') : $.css.hide($('pwd_tips'))
  },
  vc_focus: function () {
    '' == this.value && ($.css.show($('vc_tips')), $('vc_tips').className = 'input_tips_focus'), this.parentNode.className = 'inputOuter_focus'
  },
  vc_blur: function () {
    '' == this.value && ($.css.show($('vc_tips')), $('vc_tips').className = 'input_tips'), this.parentNode.className = 'inputOuter'
  },
  vc_keydown: function () {
    $.css.hide($('vc_tips'))
  },
  vc_keyup: function () {
    '' == this.value && $.css.show($('vc_tips'))
  },
  document_click: function () {
    pt.plogin.action[0]++, pt.plogin.hideEmailTips(), pt.plogin.hideLowList()
  },
  document_keydown: function () {
    pt.plogin.action[1]++
  },
  setLowloginCheckbox: function () {
    pt.plogin.isMailLogin && (pt.plogin.low_login_enable = !1), 1 == pt.ptui.low_login && (pt.plogin.low_login_enable ? ($('q_low_login_enable').className = 'checked', $('p_low_login_enable').className = 'checked', $('auth_low_login_enable').className = 'checked') : ($('q_low_login_enable').className = 'uncheck', $('p_low_login_enable').className = 'uncheck', $('auth_low_login_enable').className = 'uncheck'))
  },
  checkbox_click: function () {
    pt.plogin.low_login_enable ? ($('q_low_login_enable').className = 'uncheck', $('p_low_login_enable').className = 'uncheck', $('auth_low_login_enable').className = 'uncheck') : ($('q_low_login_enable').className = 'checked', $('p_low_login_enable').className = 'checked', $('auth_low_login_enable').className = 'checked'), pt.plogin.low_login_enable = !pt.plogin.low_login_enable
  },
  feedback: function (t) {
    var e = t ? t.target : null
    e && e.id;
    window.open('https://support.qq.com/products/14800')
  },
  bind_account: function () {
    $.css.hide($('operate_tips')), pt.plogin.need_hide_operate_tips = !0, window.open('http://id.qq.com/index.html#account'), $.report.monitor('234964')
  },
  combox_click: function (t) {
    pt.plogin.low_login_isshow ? pt.plogin.hideLowList() : pt.plogin.showLowList(), t.stopPropagation()
  },
  delUin: function (t) {
    t && $.css.hide(t.target), $('u').value = '', pt.plogin.domFocus($('u')), pt.plogin.hasCheck(!1)
  },
  check_cdn_img: function () {
    if (window.g_cdn_js_fail && !pt.ptui.isHttps) {
      var t = new Image
      t.onload = function () {
        t.onload = t.onerror = null
      }, t.onerror = function () {
        t.onload = t.onerror = null;
        var e = $('main_css').innerHTML
        e = e.replace(new RegExp('http://imgcache.qq.com/ptlogin/v4/style/', 'g'), 'http://ui.ptlogin2.qq.com/style/'), pt.plogin.insertInlineCss(e), $.report.monitor(312520)
      }, t.src = 'http://imgcache.qq.com/ptlogin/v4/style/20/images/c_icon_1.png'
    }
  },
  insertInlineCss: function (t) {
    if (document.createStyleSheet) {
      document.createStyleSheet('').cssText = t
    } else {
      var e = document.createElement('style')
      e.type = 'text/css', e.textContent = t, document.getElementsByTagName('head')[0].appendChild(e)
    }
  },
  createLink: function (t) {
    var e = document.createElement('link')
    e.setAttribute('type', 'text/css'), e.setAttribute('rel', 'stylesheet'), e.setAttribute('href', t), document.getElementsByTagName('head')[0].appendChild(e)
  },
  checkInputLable: function () {
    try {
      $('u').value && $.css.hide($('uin_tips')), window.setTimeout(function () {
        $('p').value && $.css.hide($('pwd_tips'))
      }, 1e3)
    } catch (t) {}
  },
  domLoad: function (t) {
    if (!pt.plogin.hasDomLoad) {
      if (pt.plogin.hasDomLoad = !0, !pt.plogin.isPwdFirst() && pt.plogin.switchpage(pt.LoginState.QLogin), '1' == $.bom.query('pt_disable_pwd')) {
        pt.plogin.switchpage(pt.LoginState.QLogin);
        var e = $('switcher_plogin')
        e && $.css.hide(e)
      }
      pt.plogin.checkInputLable(), pt.plogin.checkNPLoad(), pt.plogin.loadQrTipsPic();
      var i = $('loading_img')
      if (i && i.setAttribute('src', i.getAttribute('place_src')), pt.plogin.check_cdn_img(), pt.plogin.ptui_notifySize('login'), $.report.monitor('373507&union=256042', .05), navigator.cookieEnabled || ($.report.monitor(408084), $.cookie.get('ptcz') && $.report.monitor(408085)), pt.plogin.isTenpay && ($.sso_ver >= 1093 ? $.report.monitor('451205') : $.report.monitor('451206')), pt.plogin.dottedShow(), pt.plogin.webLoginReport(), pt.plogin.monitorQQNum(), pt.plogin.aq_patch(), pt.plogin.gzipReport(), setTimeout(function () {
          pt.plogin.isNewStyle && pt.qlogin.hasNoQlogin() && !pt.plogin.isPwdFirst() && pt.plogin.showQrTips()
        }, 1e3), pt.plogin.isNewStyle && setTimeout('window.scrollTo(0, 0)', 100), pt.plogin.isTim) {
        var n = $(bottom_qlogin)
        n && $.css.hide(n)
      }
      if (pt.plogin.isQcloud() || 527 == pt.ptui.daid) {
        var o = $('uin_tips')
        o && (o.innerHTML = $.str.encodeHtml(o.getAttribute('data-onlyqq')))
      }
      var p = $('qr_tips_pic')
      if (p) switch (parseInt(pt.ptui.lang)) {
        case 1033:
          p.style.background = 'url(//imgcache.qq.com/ptlogin/v4/style/40/images/scanQRcode.png)'
          break;
        case 1028:
          p.style.background = 'url(//imgcache.qq.com/ptlogin/v4/style/40/images/scanQRcode_cht.png)'
      }!pt.plogin.isTim && $.http.loadScript((pt.ptui.isHttps ? 'https://ssl.captcha.qq.com/' : 'http://captcha.qq.com/') + 'template/TCapIframeApi.js?aid=' + pt.ptui.appid + '&rand=' + Math.random() + '&clientype=2&lang=' + pt.ptui.lang + '&apptype=2', function () {
        var t = $('newVcodeArea'),
          e = document.createElement('div'),
          i = document.createElement('div')
        i.id = 'newVcodeIframe', pt.plogin.isQcloud() ? (e.innerHTML = '<div style=" width: 300px; left:50%; margin-left:-150px; position: relative"><div style="position: relative; margin-left: 10px"><a href="javascript:pt.plogin.hideVC();" style="color: #007aff; text-decoration: none;">返回</a></div></div>', i.style.cssText = 'background: none #FFFFFF; position: relative; width: 300px; left:50%; margin-left:-150px; z-index:9999;', t.appendChild(i), t.appendChild(e)) : (e.innerHTML = '<div style="border-bottom: 1px solid #d7d7d7;"><div style="position: absolute; margin-left: 10px"><a href="javascript:pt.plogin.hideVC();" style="color: #007aff; text-decoration: none;">返回</a></div><div style="width: 100%; text-align: center; font-size: 16px; font-weight: bold">安全验证</div></div>', i.style.cssText = 'background: none #FFFFFF; position: absolute; width: 300px; left:50%; margin-left:-150px; z-index:9999;', t.appendChild(e), t.appendChild(i)), e.style.cssText = 'margin: 0px; padding: 0px; line-height: 40px'
      })
    }
  },
  dottedShow: function () {
    try {
      var t = $('bottom_qlogin')
      if (!t) return;
      var e = t.getElementsByTagName('span')
      if (!e || 0 == e.length) return;
      for (var i = e[e.length - 1], n = i, o = !1; n;) {
        if ('a' == (n.tagName && n.tagName.toLowerCase())) {
          o = !0;
          break
        }
        n = n.nextSibling
      }
      o || (i.style.display = 'none')
    } catch (t) {
      $.report.nlog('dotted show ' + t.message)
    }
  },
  checkNPLoad: function () {
    navigator.mimeTypes['application/nptxsso'] && !$.sso_loadComplete && $.checkNPPlugin()
  },
  gzipReport: function () {
    if ('1' == pt.ptui.gzipEnable || pt.ptui.isHttps || pt.plogin.isUIStyle)
    else {
      $.report.monitor('455847');
      var t = $.http.getXHR()
      if (t) {
        var e = '/cgi-bin/xver?t=' + Math.random()
        t.open('get', e), t.onreadystatechange = function () {
          if (4 == t.readyState)
            if (t.status >= 200 && t.status < 300 || 304 === t.status || 1223 === t.status || 0 === t.status) {
              try {
                var e = document.createElement('script')
                e.innerHTML = t.responseText, document.getElementsByTagName('head')[0].appendChild(e)
              } catch (t) {}
              window._gz || $.report.nlog('gzip探测异常，返回内容：' + t.responseText + '返回码：' + t.status + 'uin=' + $.cookie.get('pt2gguin'), '462348')
            } else $.report.nlog('gzip探测异常，返回内容：' + t.responseText + '返回码：' + t.status + 'uin=' + $.cookie.get('pt2gguin'), '462348')
        }, t.send()
      }
    }
  },
  monitorQQNum: function () {
    switch ($.loginQQnum) {
      case 0:
        $.report.monitor('330314', .05)
        break;
      case 1:
        $.report.monitor('330315', .05)
        break;
      case 2:
        $.report.monitor('330316', .05)
        break;
      case 3:
        $.report.monitor('330317', .05)
        break;
      case 4:
        $.report.monitor('330318', .05)
        break;
      default:
        $.report.monitor('330319', .05)
    }
  },
  noscript_err: function () {
    $.report.nlog('noscript_err', 316648), $('noscript_area').style.display = 'none'
  },
  bindEvent: function () {
    var t = $('u'),
      e = $('p'),
      i = $('verifycode'),
      n = $('verifyimgArea'),
      o = $('login_button'),
      p = $('p_low_login_box'),
      r = $('q_low_login_box'),
      s = $('auth_low_login_box'),
      a = $('email_list'),
      l = ($('feedback_web'), $('feedback_qr'), $('feedback_qlogin'), $('close')),
      c = $('switcher_qlogin'),
      u = $('switcher_plogin'),
      g = $('uin_del'),
      d = $('bind_account'),
      h = $('cancleAuth'),
      f = $('authClose'),
      _ = $('auth_area'),
      m = ($('auth_low_login_enable'), $('qr_invalid'), $('goBack')),
      v = $('qr_img_box'),
      y = $('qrlogin_img'),
      w = $('qr_info_link'),
      k = $('qrswitch_logo')
    k && $.e.add(k, 'click', pt.plogin.switch_qrlogin), w && $.e.add(y, 'click', function (t) {
      $.report.monitor('331287', .05)
    }), v && ($.e.add(v, 'mouseover', pt.plogin.showQrTips), $.e.add(v, 'mouseout', pt.plogin.hideQrTips)), m && $.e.add(m, 'click', function (t) {
      t.preventDefault(), pt.plogin.go_qrlogin_step(1), $.report.monitor('331288', .05)
    }), _ && ($.e.add(_, 'click', pt.plogin.authLogin), $.e.add(_, 'mousedown', pt.plogin.authMouseDowm), $.e.add(_, 'mouseup', pt.plogin.authMouseUp)), h && $.e.add(h, 'click', pt.plogin.cancleAuth), f && $.e.add(f, 'click', pt.plogin.ptui_notifyClose), c && $.e.add(c, 'click', pt.plogin.onQloginSwitch), u && $.e.add(u, 'click', function (t) {
      t.preventDefault(), pt.plogin.switchpage(pt.LoginState.PLogin), $.report.monitor('331285', .05)
    }), d && ($.e.add(d, 'click', pt.plogin.bind_account), $.e.add(d, 'mouseover', function (t) {
      pt.plogin.need_hide_operate_tips = !1
    }), $.e.add(d, 'mouseout', function (t) {
      pt.plogin.need_hide_operate_tips = !0
    })), l && $.e.add(l, 'click', pt.plogin.ptui_notifyClose), 1 == pt.ptui.low_login && p && r && ($.e.add(p, 'click', pt.plogin.checkbox_click), $.e.add(r, 'click', pt.plogin.checkbox_click)), 1 == pt.ptui.low_login && s && $.e.add(s, 'click', pt.plogin.checkbox_click), $.e.add(t, 'focus', pt.plogin.u_focus), $.e.add(t, 'blur', pt.plogin.u_blur), $.e.add(t, 'change', pt.plogin.u_change), $.e.add(t, 'keydown', pt.plogin.u_keydown), $.e.add(t, 'paste', function () {
      setTimeout(pt.plogin.u_refresh_dom, 0)
    }), $.e.add(t, 'keyup', pt.plogin.u_keyup), $.e.add(g, 'click', pt.plogin.delUin), $.e.add(e, 'focus', pt.plogin.p_focus), $.e.add(e, 'blur', pt.plogin.p_blur), $.e.add(e, 'keydown', pt.plogin.p_keydown), $.e.add(e, 'keyup', pt.plogin.p_keyup), $.e.add(e, 'keypress', pt.plogin.p_keypress), $.e.add(e, 'paste', function () {
      setTimeout(pt.plogin.p_refresh_dom, 0)
    }), $.e.add(o, 'click', function (t) {
      t && t.preventDefault(), 1 == pt.plogin.needShowNewVc ? pt.plogin.showVC() : pt.plogin.submit(t)
    }), $.e.add(n, 'click', pt.plogin.changeVC), $.e.add(a, 'mousemove', pt.plogin.email_mousemove), $.e.add(a, 'click', pt.plogin.email_click), $.e.add(document, 'click', pt.plogin.document_click), $.e.add(document, 'keydown', pt.plogin.document_keydown), $.e.add(i, 'focus', pt.plogin.vc_focus), $.e.add(i, 'blur', pt.plogin.vc_blur), $.e.add(i, 'keydown', pt.plogin.vc_keydown), $.e.add(i, 'keyup', pt.plogin.vc_keyup), $.e.add(window, 'load', pt.plogin.domLoad);
    var b = $('noscript_img')
    b && ($.e.add(b, 'load', pt.plogin.noscript_err), $.e.add(b, 'error', pt.plogin.noscript_err));
    var q = $('vip_link2')
    q && $.e.add(q, 'click', function (t) {
      window.open('http://pay.qq.com/qqvip/index.shtml?aid=vip.gongneng.other.red.dengluweb_wording2_open'), t.preventDefault(), $.report.monitor('263482')
    }), pt.plogin.isNewQr && $.e.add(document, 'visibilitychange', function (t) {
      var e = $('onekey_step2')
      if (!e || 'block' != $.css.getComputedStyle(e).display) {
        switch (document.visibilityState) {
          case 'hidden':
            pt.plogin.cancle_qrlogin()
            break;
          case 'visible':
            pt.plogin.loginState == pt.LoginState.QLogin && pt.plogin.qrlogin_invalid && pt.plogin.begin_qrlogin()
        }
      }
    })
  },
  vcodeMessage: function (t) {
    t.randstr && t.ticket || $.report.nlog('vcode postMessage error：' + t), $('verifycode').value = t.randstr, pt.plogin.pt_verifysession = t.ticket, pt.plogin.hideVC(), pt.plogin.submit()
  },
  newVCFirst: !0,
  showNewVC: function () {
    var t = $('newVcodeArea')
    t.style.cssText = 'background: none #FFFFFF; position: absolute; top: 0; width: 100%; z-index:9999;', t.style.height = $('login').offsetHeight - (21 == pt.ptui.style ? 2 : 4) + 'px', $.css.show(t), pt.plogin.newVCFirst ? (pt.plogin.newVCFirst = !1, capInit($('newVcodeIframe'), {
      callback: pt.plogin.VCCallback,
      type: 'embed',
      uin: pt.plogin.at_account,
      capcd: pt.plogin.cap_cd
    })) : capRefresh({
      uin: pt.plogin.at_account,
      capcd: pt.plogin.cap_cd
    })
  },
  hideNewVC: function () {
    $('newVcodeArea') && $.css.hide($('newVcodeArea'))
  },
  changeNewVC: function () {
    pt.plogin.showNewVC()
  },
  showVC: function () {
    pt.plogin.vcFlag = !0, '1' == pt.ptui.pt_vcode_v1 ? pt.plogin.showNewVC() : ($.css.show($('verifyArea')), $('verifycode').value = '', $('verifyimg').src = pt.plogin.getVCUrl()), pt.plogin.ptui_notifySize('login')
  },
  hideVC: function () {
    pt.plogin.vcFlag = !1, '1' == pt.ptui.pt_vcode_v1 ? pt.plogin.hideNewVC() : $.css.hide($('verifyArea')), pt.plogin.ptui_notifySize('login')
  },
  changeVC: function (t) {
    t && t.preventDefault(), '1' == pt.ptui.pt_vcode_v1 ? pt.plogin.changeNewVC() : $('verifyimg').src = pt.plogin.getVCUrl(), t && $.report.monitor('330322', .05)
  },
  getVCUrl: function () {
    var t = pt.plogin.at_account,
      e = (pt.ptui.domain, pt.ptui.appid)
    return pt.plogin.verifycodeUrl + '?uin=' + t + '&aid=' + e + '&cap_cd=' + pt.plogin.cap_cd + '&' + Math.random()
  },
  checkValidate: function (t) {
    try {
      var e = t.u,
        i = t.p,
        n = t.verifycode,
        o = $('safe_edit')
      if ('' == $.str.trim(e.value)) return pt.plogin.show_err(pt.str.no_uin), pt.plogin.domFocus(e), !1;
      if ($.check.isNullQQ(e.value)) return pt.plogin.show_err(pt.str.inv_uin), pt.plogin.domFocus(e), !1;
      var p = i.value
      if (pt.plogin.armSafeEdit.isSafe && o && (p = o.GetPwdHash(), 'D41D8CD98F00B204E9800998ECF8427E' == p && (p = ''), pt.plogin.armSafeEdit.safepwd = p), !p) return pt.plogin.show_err(pt.str.no_pwd), pt.plogin.domFocus(i), !1;
      if ('' == n.value) return pt.plogin.needVc || pt.plogin.vcFlag ? (pt.plogin.show_err(pt.str.no_vcode), pt.plogin.domFocus(n)) : (pt.plogin.checkResultReport(14), clearTimeout(pt.plogin.checkClock), pt.plogin.showVC()), !1;
      if (n.value.length < 4) return pt.plogin.show_err(pt.str.inv_vcode), pt.plogin.domFocus(n), n.select(), !1
    } catch (t) {}
    return !0
  },
  checkTimeout: function () {
    var t = $.str.trim($('u').value);
    ($.check.isQQ(t) || $.check.isQQMail(t)) && (pt.plogin.cap_cd = 0, pt.plogin.salt = $.str.uin2hex(t.replace('@qq.com', '')), pt.plogin.needVc = !0, '1' == pt.ptui.pt_vcode_v1 ? pt.plogin.needShowNewVc = !0 : pt.plogin.showVC(), pt.plogin.isCheckTimeout = !0, pt.plogin.checkRet = 1, pt.plogin.cntCheckTimeout++), $.report.monitor(216082)
  },
  loginTimeout: function () {
    pt.plogin.showAssistant(2);
    $.report.simpleIsdSpeed('flag1=7808&flag2=7&flag3=1&1=1000')
  },
  hasCheck: function (t) {
    if (void 0 === t) return pt.plogin.checkState;
    pt.plogin.checkState = t
  },
  check: function (t) {
    if (0 === pt.plogin.checkState) return pt.plogin.check.cb = t;
    if (pt.plogin.account || pt.plogin.set_account(), $.check.isNullQQ(pt.plogin.account)) return pt.plogin.show_err(pt.str.inv_uin), !1;
    if (pt.plogin.account != pt.plogin.lastCheckAccount && '' != pt.plogin.account) {
      pt.plogin.hasCheck(0);
      var e = pt.ptui.appid,
        i = pt.plogin.getCheckUrl(pt.plogin.at_account, e)
      pt.plogin.isCheckTimeout = !1, clearTimeout(pt.plogin.checkClock), pt.plogin.checkClock = setTimeout('pt.plogin.checkTimeout();', 5e3), $.http.loadScript(i), pt.plogin.check.cb = t
    }
  },
  getCheckUrl: function (t, e) {
    var i = pt.plogin.checkUrl + '?regmaster=' + pt.ptui.regmaster + '&pt_tea=2&pt_vcode=' + pt.ptui.pt_vcode_v1 + '&'
    return i += 'uin=' + t + '&appid=' + e + '&js_ver=' + pt.ptui.ptui_version + '&js_type=' + pt.plogin.js_type + '&login_sig=' + pt.ptui.login_sig + '&u1=' + encodeURIComponent(pt.ptui.s_url) + '&r=' + Math.random() + '&pt_uistyle=' + pt.ptui.style, window.TDC && TDC.getInfo && TDC.getInfo().tokenid && (i += '&pt_jstoken=' + TDC.getInfo().tokenid), i
  },
  getSubmitUrl: function (t) {
    var e = pt.plogin.loginUrl + t + '?',
      i = {}
    if ('pt_susp_repush' == t) return e += 'appid=' + pt.ptui.appid + '&daid=' + pt.ptui.daid;
    if ('login' == t) {
      i.u = encodeURIComponent(pt.plogin.at_account), i.verifycode = $('verifycode').value, pt.plogin.needShowNewVc ? i.pt_vcode_v1 = 1 : i.pt_vcode_v1 = 0, i.pt_verifysession_v1 = pt.plogin.pt_verifysession || $.cookie.get('verifysession');
      var n = $('p').value
      pt.plogin.armSafeEdit.isSafe && (n = pt.plogin.armSafeEdit.safepwd), i.p = $.Encryption.getEncryption(n, pt.plogin.salt, i.verifycode, pt.plogin.armSafeEdit.isSafe), i.pt_randsalt = pt.plogin.isRandSalt || 0, window.TDC && TDC.getInfo && TDC.getInfo().tokenid && (i.pt_jstoken = TDC.getInfo().tokenid)
    }
    i.u1 = 'login' == t ? encodeURIComponent(pt.qlogin.getSurl($('u').value)) : encodeURIComponent(pt.qlogin.getSurl()), 'ptqrlogin' == t && (i.ptqrtoken = $.str.hash33($.cookie.get('qrsig'))), 'pt_susp_poll' == t && (i.pt_susp_poll_token = $.str.hash33($.cookie.get('pt_susp_sig'))), i.ptredirect = pt.ptui.target, i.h = 1, i.t = 1, i.g = 1, i.from_ui = 1, i.ptlang = pt.ptui.lang, i.action = pt.plogin.action.join('-') + '-' + (new Date - 0), i.js_ver = pt.ptui.ptui_version, i.js_type = pt.plogin.js_type, i.login_sig = pt.ptui.login_sig, i.pt_uistyle = pt.ptui.style, 1 == pt.ptui.low_login && pt.plogin.low_login_enable && !pt.plogin.isMailLogin && (i.low_login_enable = 1, i.low_login_hour = pt.plogin.low_login_hour), '0' != pt.ptui.csimc && (i.csimc = pt.ptui.csimc, i.csnum = pt.ptui.csnum, i.authid = pt.ptui.authid), i.aid = pt.ptui.appid, pt.ptui.daid && (i.daid = pt.ptui.daid), '0' != pt.ptui.pt_3rd_aid && (i.pt_3rd_aid = pt.ptui.pt_3rd_aid), pt.ptui.regmaster && (i.regmaster = pt.ptui.regmaster), pt.ptui.mibao_css && (i.mibao_css = pt.ptui.mibao_css), '1' == pt.ptui.pt_qzone_sig && (i.pt_qzone_sig = 1), '1' == pt.ptui.pt_light && (i.pt_light = 1);
    for (var o in i) e += o + '=' + i[o] + '&';
    return pt.plogin.isTim && (e += 'tim=1&'), pt.qlogin.hasOneKeyList() && (e += 'has_onekey=1&'), pt.qlogin.QQProtectGUID && (e += '&pt_guid_sig=' + pt.qlogin.QQProtectGUID), e
  },
  submit: function (t) {
    if (pt.plogin.cntCheckTimeout >= 2) return pt.plogin.show_err(pt.plogin.checkErr[pt.ptui.lang]), pt.plogin.needVc = !1, void(pt.plogin.needShowNewVc = !1);
    if (pt.plogin.submitTime = (new Date).getTime(), t && t.preventDefault(), pt.plogin.lastCheckAccount != pt.plogin.account && !pt.plogin.hasCheck()) return void pt.plogin.check(arguments.callee);
    if (!pt.plogin.ptui_onLogin(document.loginform)) return !1;
    if ($.cookie.set('ptui_loginuin', escape(document.loginform.u.value), pt.ptui.domain, '/', 720), -1 == pt.plogin.checkRet || 3 == pt.plogin.checkRet) return pt.plogin.show_err(pt.plogin.checkErr[pt.ptui.lang]), pt.plogin.lastCheckAccount = '', pt.plogin.domFocus($('p')), void pt.plogin.check();
    clearTimeout(pt.plogin.loginClock), pt.plogin.loginClock = setTimeout('pt.plogin.loginTimeout();', 5e3);
    var e = pt.plogin.getSubmitUrl('login')
    return $.winName.set('login_href', encodeURIComponent(pt.ptui.href)), pt.plogin.showLoading(), pt.plogin.isVCSessionTimeOut() && !pt.plogin.needVc ? (pt.plogin.lastCheckAccount = '', pt.plogin.check(arguments.callee)) : (pt.qlogin.reportPCMgr(pt.plogin.at_account, 1), pt.qlogin.reportPath(pt.plogin.at_account, 0), $.http.loadScript(e), pt.plogin.isdTime['7808-7-2-0'] = (new Date).getTime()), !1
  },
  isVCSessionTimeOut: function () {
    return pt.plogin.checkTime = pt.plogin.checkTime || (new Date).getTime(), pt.plogin.submitTime - pt.plogin.checkTime > 12e5 && ($.report.monitor(330323, .05), !0)
  },
  webLoginReport: function () {
    window.setTimeout(function () {
      try {
        var t = ['navigationStart', 'unloadEventStart', 'unloadEventEnd', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'],
          e = {},
          i = window.performance ? window.performance.timing : null
        if (i) {
          for (var n = i[t[0]], o = 1, p = t.length; o < p; o++) i[t[o]] && (e[o] = i[t[o]] - n);
          loadJs && loadJs.onloadTime && (e[o++] = loadJs.onloadTime - n), i.domContentLoadedEventEnd - i.navigationStart > pt.plogin.delayTime && i.navigationStart > 0 && $.report.nlog('访问ui延时超过' + pt.plogin.delayTime / 1e3 + 's:delay=' + (i.domContentLoadedEventEnd - i.navigationStart) + ';domContentLoadedEventEnd=' + i.domContentLoadedEventEnd + ';navigationStart=' + i.navigationStart + ';clientip=' + pt.ptui.clientip + ';serverip=' + pt.ptui.serverip, pt.plogin.delayMonitorId, 1), i.connectStart <= i.connectEnd && i.responseStart <= i.responseEnd && pt.plogin.ptui_speedReport(e)
        }
      } catch (t) {}
    }, 1e3)
  },
  ptui_speedReport: function (t) {
    if ('msie' == $.browser('type') || 'webkit' == $.browser('type')) {
      var e = 'http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=1'
      if (pt.ptui.isHttps) {
        if (Math.random() > 1) return;
        e = 'msie' == $.browser('type') ? $.check.isSsl() ? 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=3' : 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=2' : $.check.isSsl() ? 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=6' : 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=5'
      } else {
        if (Math.random() > .2) return;
        e = 'msie' == $.browser('type') ? 'http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=1' : 'http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=5&flag3=4'
      }
      for (var i in t) t[i] > 15e3 || t[i] < 0 || (e += '&' + i + '=' + t[i] || 1);
      (new Image).src = e
    }
  },
  resultReport: function (t, e, i) {
    var n = 'http://isdspeed.qq.com/cgi-bin/v.cgi?flag1=' + t + '&flag2=' + e + '&flag3=' + i;
    (new Image).src = n
  },
  crossMessage: function (t) {
    if (pt.plogin.isUIStyle && pt.plogin.uistyleCM(t), void 0 !== window.postMessage) window.parent.postMessage($.str.json2str(t), '*')
    else if (pt.ptui.proxy_url) {
      var e = pt.ptui.proxy_url + '#'
      for (var i in t) e += i + '=' + t[i] + '&';
      $('proxy') && ($('proxy').innerHTML = '<iframe src="' + encodeURI(e) + '"></iframe>')
    } else try {
      navigator.ptlogin_callback && navigator.ptlogin_callback($.str.json2str(t))
    } catch (t) {
      $.report.nlog('ptlogin_callback ' + t.message)
    }
  },
  uistyleCM: function (t) {
    var e = encodeURIComponent($.str.json2str(t)),
      i = document.location.protocol + '//ui.ptlogin2.' + pt.ptui.domain + '/cross_proxy.html#' + e,
      n = $('proxy')
    n && (n.innerHTML = '<iframe  allowtransparency="true" scrolling="no" frameborder="0" width="1" height="1" src="' + i + '">')
  },
  ptui_notifyClose: function (t) {
    t && t.preventDefault();
    var e = {}
    e.action = 'close', pt.plogin.crossMessage(e), pt.plogin.cancle_qrlogin()
  },
  ptui_notifySize: function (t) {
    pt.plogin.loginState == pt.LoginState.PLogin && ($('bottom_web') && $.css.hide($('bottom_web')), pt.plogin.adjustLoginsize(), $('bottom_web') && $.css.show($('bottom_web')));
    var e = $(t),
      i = {}
    pt.plogin.isNewStyle && (e.style.height = '100%'), i.action = 'resize', i.width = e.offsetWidth || 1, i.height = e.offsetHeight || 1, pt.plogin.isNewStyle && (i.height -= $.css.getCurrentPixelStyle(e, 'border-top-width') + $.css.getCurrentPixelStyle(e, 'border-bottom-width'), e.style.height = i.height - $.css.getCurrentPixelStyle(e, 'border-top-width') - $.css.getCurrentPixelStyle(e, 'border-bottom-width') + 'px'), pt.plogin.crossMessage(i)
  },
  ptui_onLogin: function (t) {
    return pt.plogin.checkValidate(t)
  },
  ptui_uin: function (t) {},
  is_mibao: function (t) {
    return /^http(s)?:\/\/(ssl\.)?ui.ptlogin2.(\S)+\/cgi-bin\/mibao_vry/.test(t)
  },
  __get_polling_url: function (t) {
    var e = pt.ptui.isHttps ? 'https://ssl.' : 'http://',
      i = e + 'ptlogin2.' + pt.ptui.domain + '/' + t + '?'
    return i += 'appid=' + pt.ptui.appid + '&e=2&l=M&s=3&d=72&v=4&t=' + Math.random(), pt.ptui.regmaster && (i += '&regmaster=' + pt.ptui.regmaster), pt.ptui.daid && (i += '&daid=' + pt.ptui.daid), pt.plogin.isTim && (i += '&tim=1'), pt.ptui.pt_3rd_aid && (i += '&pt_3rd_aid=' + pt.ptui.pt_3rd_aid), i
  },
  get_qrlogin_pic: function () {
    return pt.plogin.__get_polling_url('ptqrshow')
  },
  go_qrlogin_step: function (t) {
    switch (t) {
      case 1:
        pt.plogin.begin_qrlogin(), pt.plogin.isNewQr ? $.css.hide($('qrlogin_step2')) : ($.css.show($('qrlogin_step1')), $.css.hide($('qrlogin_step2')))
        break;
      case 2:
        pt.plogin.isNewQr ? ($('qrlogin_step2').style.height = $('login').offsetHeight - 8 + 'px', $.css.show($('qrlogin_step2'))) : ($.css.show($('qrlogin_step2')), $.css.hide($('qrlogin_step1')))
    }
  },
  go_onekey_step: function (t) {
    var e = $('onekey_step2')
    switch (t) {
      case 1:
        $.css.hide(e), pt.plogin.begin_qrlogin()
        break;
      case 2:
        $.css.show(e), pt.plogin.showLoading(), pt.plogin.hideLoading()
    }
  },
  begin_qrlogin: function (t) {
    if (!pt.ptui.lockuin) {
      var e = $('qr_invalid'),
        i = $('qrlogin_img')
      e && $.css.hide(e), i && (i.onload = function () {
        try {
          $('qrlogin_img').onload = $('qrlogin_img').onerror = null, pt.plogin.cancle_qrlogin(), pt.plogin.qrlogin_clock = window.setInterval('pt.plogin.qrlogin_submit();', 3e3), pt.plogin.qrlogin_timeout = window.setTimeout(function () {
            pt.plogin.set_qrlogin_invalid()
          }, pt.plogin.qrlogin_timeout_time)
        } catch (t) {}
      }, i.onerror = function () {
        try {
          $('qrlogin_img').onload = $('qrlogin_img').onerror = null, pt.plogin.set_qrlogin_invalid()
        } catch (t) {}
      }, pt.plogin.qrlogin_invalid = !1, setTimeout(function () {
        try {
          $('qrlogin_img').src = pt.plogin.get_qrlogin_pic()
        } catch (t) {}
      }, 0))
    }
  },
  cancle_qrlogin: function () {
    window.clearInterval(pt.plogin.qrlogin_clock), window.clearTimeout(pt.plogin.qrlogin_timeout), pt.plogin.qrlogin_invalid = !0
  },
  set_qrlogin_invalid: function () {
    pt.plogin.cancle_qrlogin(), pt.plogin.switch_qrlogin(), $('qr_invalid') && $.css.show($('qr_invalid')), pt.plogin.hideQrTips()
  },
  createLink: function (t) {
    var e = document.createElement('link')
    e.setAttribute('type', 'text/css'), e.setAttribute('rel', 'stylesheet'), e.setAttribute('href', t), document.getElementsByTagName('head')[0].appendChild(e)
  },
  loadQrTipsPic: function () {
    if (pt.plogin.isNewQr) {
      var t = $('qr_tips_pic'),
        e = 'chs'
      switch (pt.ptui.lang + '') {
        case '2052':
          e = 'chs'
          break;
        case '1033':
          e = 'en'
          break;
        case '1028':
          e = 'cht'
      }
      $.css.addClass(t, 'qr_tips_pic_' + e)
    } else {
      var i = pt.ptui.cssPath + '/c_qr_login.css'
      $('qrswitch_logo') && pt.plogin.createLink(i)
    }
  },
  showQrTips: function () {
    if (!pt.plogin.inTipsAnimate && !pt.plogin.isTim) {
      var t, e, i = {}
      e = $.css.getOffsetPosition('qrlogin_img'), t = $.css.getOffsetPosition('login'), i.left = e.left - t.left, i.right = $('login').offsetWidth - $('qrlogin_img').offsetWidth - i.left, pt.qlogin.hasNoQlogin() || (i.left = i.left + $.css.getWidth('qrlogin_img') + 10, $('qr_tips').style.left = i.left + 'px');
      var n = function () {
        $.css.show($('qr_tips')), $('qr_tips_pic').style.opacity = 0, $('qr_tips_pic').style.filter = 'alpha(opacity=0)', $('qr_tips_menban').className = 'qr_tips_menban', $.animate.fade('qr_tips_pic', 100, 10, 10, function () {
          pt.plogin.inTipsAnimate = !1
        })
      }
      if (pt.plogin.inTipsAnimate = !0, pt.qlogin.hasNoQlogin())
        if (pt.plogin.isMailLogin) {
          var o = i.right - 160 + 12
          $.animate.animate('qrlogin_img', {
            left: o
          }, 10, 10, n)
        } else $.animate.animate('qrlogin_img', {
          left: pt.plogin.isNewStyle ? -55 : -30
        }, 10, 10, n);
      else n();
      pt.plogin.hideQrTipsClock = window.setTimeout('pt.plogin.hideQrTips()', 5e3), $.report.monitor('331286', .05)
    }
  },
  hideQrTips: function () {
    pt.plogin.inTipsAnimate || pt.plogin.isTim || pt.plogin.isNewQr && (pt.plogin.inTipsAnimate = !0, window.clearTimeout(pt.plogin.hideQrTipsClock), $('qr_tips_menban').className = '', $.animate.fade('qr_tips_pic', 0, 10, 10, function () {
      pt.qlogin.hasNoQlogin() ? ($.css.hide($('qr_tips')), $.animate.animate('qrlogin_img', {
        left: 12
      }, 10, 10, function () {
        pt.plogin.inTipsAnimate = !1
      })) : ($.css.hide($('qr_tips')), pt.plogin.inTipsAnimate = !1)
    }))
  },
  resetQrTips: function () {
    pt.plogin.isTim || pt.plogin.isNewQr && ($('qrlogin_img') && ($('qrlogin_img').style.cssText = ''), $('qr_tips') && $.css.hide($('qr_tips')))
  },
  qr_load: function (t) {},
  qr_error: function (t) {},
  switch_qrlogin_animate: function () {
    var t = pt.plogin.isQrLogin,
      e = $('web_qr_login_show'),
      i = 0
    t ? (pt.plogin.isNewStyle || (i = -$('web_login').offsetHeight, $('web_qr_login').style.height = ($('qrlogin').offsetHeight || 265) + 'px'), $('qrlogin').style.visibility = 'visible', $('web_login').style.visibility = 'hidden') : (pt.plogin.isNewStyle || (i = 0, $('web_qr_login').style.height = $('web_login').offsetHeight + 'px'), $('web_login').style.visibility = 'visible', $('qrlogin').style.visibility = 'hidden'), $.animate.animate(e, {
      top: i
    }, 30, 20)
  },
  switch_qrlogin: function (t) {
    pt.plogin.isNewQr || (t && t.preventDefault(), pt.plogin.hide_err(), pt.plogin.isQrLogin ? ($('qrlogin').style.visibility = 'hidden', pt.plogin.cancle_qrlogin(), $('qrswitch_logo').title = '二维码登录', $('qrswitch_logo').className = 'qrswitch_logo', $.report.monitor('273368', .05)) : ($('qrlogin').style.visibility = 'visible', pt.plogin.go_qrlogin_step(1), $('qrswitch_logo').title = '返回', $('qrswitch_logo').className = 'qrswitch_logo_qr', pt.plogin.begin_qrlogin(), $.report.monitor('273367', .05)), pt.plogin.isQrLogin = !pt.plogin.isQrLogin, pt.plogin.switch_qrlogin_animate(), pt.plogin.ptui_notifySize('login'))
  },
  adjustLoginsize: function () {
    if (!pt.plogin.isNewStyle) {
      var t = pt.plogin.isQrLogin
      $('web_qr_login').style.height = t ? ($('qrlogin').offsetHeight || 265) + 'px' : $('web_login').offsetHeight + 'px'
    }
  },
  qrlogin_submit: function () {
    var t = pt.plogin.getSubmitUrl('ptqrlogin')
    $.winName.set('login_href', encodeURIComponent(pt.ptui.href)), $.http.loadScript(t)
  },
  force_qrlogin: function () {
    if (!pt.ptui.lockuin) switch (parseInt(pt.ptui.style)) {
      case 21:
      case 22:
      case 23:
        pt.plogin.switch_qrlogin()
        break;
      default:
        pt.plogin.switchpage(pt.LoginState.QLogin)
    }
  },
  redirect: function (t, e) {
    switch (t + '') {
      case '0':
        location.replace(e)
        break;
      case '1':
        top.location.replace(e)
        break;
      case '2':
        parent.location.replace(e)
        break;
      default:
        top.location.replace(e)
    }
  },
  armSafeEdit: function () {
    function t() {
      if (pt.plogin.armSafeEdit.isSafe) i.style.display = 'block', i.value = '', setTimeout(function () {
        try {
          i.focus()
        } catch (t) {}
      }, 0), e.removeChild(s), o.style.backgroundPosition = '-130px -130px', pt.plogin.armSafeEdit.isSafe = !1
      else {
        var t = $('safe_edit')
        t ? s.style.display = 'block' : (s.innerHTML = ($.suportActive() ? a : l) + c, e.appendChild(s), t = $('safe_edit'), $.e.add(t, 'focus', pt.plogin.check));
        try {
          t.CreateSafeEdit(), t.ClearAllInput(), setTimeout(function () {
            t.focus()
          }, 200), i.style.display = 'none', o.style.backgroundPosition = '-117px -130px', pt.plogin.armSafeEdit.isSafe = !0
        } catch (t) {
          pt.plogin.show_err('安全控件加载失败'), i.focus(), pt.plogin.armSafeEdit.isSafe = !1, s.style.display = 'none', e.removeChild(s), $.report.monitor('456099')
        }
        $.report.monitor('456098')
      }
      return pt.plogin.armSafeEdit.isSafe ? e.style.height = '74px' : e.style.height = n, pt.plogin.ptui_notifySize('login'), !1
    }
    var e = $('pwdArea'),
      i = $('p'),
      n = e.style.height
    i.style.width = '208px';
    var o = document.createElement('a')
    o.tabIndex = 1, o.id = 'safe_lock', o.title = '安全控件登录开关';
    var p = {
      background: 'url(https://ui.ptlogin2.qq.com/style/34/images/icon_5.png) no-repeat -130px -130px',
      width: '13px',
      height: '20px',
      display: 'block',
      margin: '-29px 20px 0 0',
      cursor: 'pointer',
      webkitUserSelect: 'none',
      outline: 'none',
      marginLeft: '220px'
    }
    '6.0' == $.browser('version') && (p.background = p.background.replace('icon_5.png', 'icon_5_8.png'));
    for (var r in p) o.style[r] = p[r];
    o.style.style = 'right', pt.plogin.armSafeEdit.isSafe = !1, e.appendChild(o);
    var s = document.createElement('div')
    p = {
      position: 'absolute',
      top: '2px',
      left: '1px'
    };
    for (var r in p) s.style[r] = p[r];
    var a = '<object id="safe_edit" classid="CLSID:EAAED308-7322-4b9b-965E-171933ADD473" width="208" height="38">                    <param name="bkColor" value="16777215"/>                    <param name="fontColor" value="0"/>                    <param name="fontHeight" value="0.25" />                    <param name="caretHeight" value="0.2" />                    <param name="borderType" value="2" />                    <param name="borderColor" value="16777215" />                </object>',
      l = '<embed id="safe_edit" type="application/nptxsso"     width="208" height="38" bkcolor="16777215" fontcolor="0"     fontheight="0.25" caretheight="0.8" bordertype="2" bordercolor="16777215" />',
      c = '<div class="safe-edit-tips"     style="color: #2C9E62; height: 28px; line-height: 34px; width: 208px;">    当前为安全登录模式，使用密码控件</div>'
    $.e.add(o, 'click', t), pt.plogin.armSafeEdit.lockToggle = t
  },
  onekeyVerify: function (t, e, i) {
    var n = $('onekey_verify'),
      o = $('ov_retry_wrap'),
      p = $('ov_retry'),
      r = $('ov_back'),
      s = $('p'),
      a = document.loginform
    if (n) {
      clearInterval(pt.plogin.onekeyVerifyClock), e = parseInt(e) || pt.plogin.onekeyVerify.__style || 1, pt.plogin.onekeyVerify.__style = e;
      for (var l = n.getElementsByTagName('span'), c = ['占位'], u = 0; u < l.length; u++) l[u].className.indexOf('ov-tips') > -1 && c.push(l[u]);
      p.onclick = function () {
        $.http.loadScript(pt.plogin.getSubmitUrl('pt_susp_repush'))
      }, 'hide' == t ? function () {
        pt.plogin.onekeyVerifyClock = 0, pt.plogin.hide_err(), $.css.hide(n), $.css.show(a), setTimeout(function () {
          s.value = '', pt.plogin.domFocus(s)
        }, 0)
      }() : ('invalid' == t ? function () {
        pt.plogin.onekeyVerifyClock = 0, $.css.addClass(n, 'invalid'), pt.plogin.hide_err(), $.e.add(r, 'click', function () {
          pt.plogin.onekeyVerify('hide')
        })
      }() : function () {
        $.css.setClass(n, 'ov-' + e), c[e] && c[e].appendChild(o), i = i || pt.plogin.onekeyVerify.__tips || '你的帐号千金难求。为确保安全，请务必对手机收到的登录请求进行确认。', pt.plogin.onekeyVerify.__tips = i, pt.plogin.show_err(i, !0), pt.plogin.onekeyVerifyClock = setInterval(function () {
          $.http.loadScript(pt.plogin.getSubmitUrl('pt_susp_poll'))
        }, 3e3), setTimeout(function () {
          clearInterval(pt.plogin.onekeyVerifyClock), pt.plogin.onekeyVerify('invalid')
        }, pt.plogin.onekey_verify_timeout)
      }(), $.css.show(n), $.css.hide(a))
    }
  }
}, pt.plogin.auth(), pt.plogin.init()