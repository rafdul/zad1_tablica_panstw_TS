// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/index.ts":[function(require,module,exports) {
"use strict";
/**
 * Ściągnij wszystkie możliwe dane państw z pomocą API: https://restcountries.eu/. W dalszej części kursu będą one nazywane Tablicą Państw (TP).
 * Ściągnięte dane zapisz w sposób, który pozwoli na ich ponowne wykorzystanie po zamknięciu i ponownym otwarciu przeglądarki,
 *
 * Przy starcie aplikacji sprawdź, czy dane państw istnieją w pamięci przeglądarki. Jeśli nie, ściągnij je,
 * Przy starcie aplikacji sprawdź ile czasu minęło od poprzedniego ściągnięcia danych państw.
 * Jeśli od ostatniego razu minęło co najmniej 7 dni, ściągnij i zapisz je ponownie.
 *
 * Stwórz metodę, która przy ponownym ściąganiu danych państw porówna populację między starym
 * i nowym zestawem danych oraz wyświetli wszystkie nazwy państw, których populacja uległa zmianie.
 *
 * Kod powinien być w pełni otypowany.
 * Kod powinien posiadać pełen zestaw testów (Jest).
 * Kod może posiadać komentarze.
**/

window.onload = function () {
  console.log('App started!');
  tableWithStates.init();
};

; // zmienna zawierająca bibliotekę komunikatów w konsoli

var logsTexts = {
  tableWithStates: {
    init: {
      getFromStorage: 'Pobrałem dane zapisane w localStorage. Liczba państw w localStorage to: ',
      dataInStorage: 'Dane państw zapisane w localStorage: ',
      connectWithApi: 'Łączę się z API'
    },
    downloadFromAPI: {
      success: 'Dane państw pobrane z API:',
      failure: 'Brak łączności z API'
    },
    downloadFromApiAgain: {
      useDataFromStorage: 'Korzystam z localstorage i nie pobieram nowych danych z API. Od ostatniego pobrania z API upłynęło mniej niż ',
      useDataFromApi: 'Od ostatniego pobrania z API upłynęło więcej niż 6 dni, więc ponownie pobieram dane z API.'
    },
    countTimeFromLastApi: {
      timeFromLastApi: 'Od ostatniego pobrania z API minęło: '
    },
    infoAboutChangingPopulation: {
      stateWithChangedPopulation: 'Od ostatniego pobrania z API zmieniła się liczba ludności w krajach: ',
      noChangeOfPopulation: 'Od ostatniego pobrania z API nie zmieniła się liczba ludności w żadnym kraju.'
    }
  },
  storage: {
    saveStorage: {
      failure: 'Błąd zapisu w localStorage (brak przekazanych danych)'
    }
  }
};

var TableWithStates = function () {
  function TableWithStates() {
    this.url = "https://restcountries.com/v3/all";
    this.dateDownloadFromApi = 0;
    this.tableAfterComparison = [];
  }

  TableWithStates.prototype.init = function () {
    if (this.downloadFromApiAgain(storage.getStorage('date')) === false && storage.getStorage('states').length > 0) {
      console.log(logsTexts.tableWithStates.init.getFromStorage, storage.getStorage('states').length);
      console.log(logsTexts.tableWithStates.init.dataInStorage, storage.getStorage('states'));
    } else {
      console.log(logsTexts.tableWithStates.init.connectWithApi);
      this.downloadFromAPI();
    }
  }; // pobranie danych z API; zapisanie w local storage pobranych danych i timestamp pobrania (wersja async / await)
  // downloadFromAPI = async() => { 
  //     try {
  //         const response = await fetch(this.url);
  //         console.log('response typ:', typeof response, ' zawartość: ', response);
  //         const responseJson = await response.json();
  //         console.log('responseJson typ:', typeof responseJson, ', czy tablica?', Array.isArray(responseJson), ' zawartość: ', responseJson);
  //         console.log(logsTexts.tableWithStates.downloadFromAPI.a, responseJson);
  //         if(storage.getStorage('states').length > 0) {
  //             this.infoAboutChangingPopulation(storage.getStorage('states'), responseJson);
  //         }
  //         let time: any = new Date();
  //         this.dateDownloadFromApi = time.getTime();
  //         storage.saveStorage('date', this.dateDownloadFromApi);
  //         storage.saveStorage('states', responseJson);
  //     }
  //     catch(err) {
  //         throw new Error(logsTexts.tableWithStates.downloadFromAPI.b)
  //         // console.log(logsTexts.tableWithStates.downloadFromAPI.b, ' | ',err)
  //     }
  // }


  TableWithStates.prototype.downloadFromAPI = function () {
    var _this = this;

    fetch(this.url).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(logsTexts.tableWithStates.downloadFromAPI.success, data);

      if (storage.getStorage('states') && storage.getStorage('states').length > 0) {
        _this.infoAboutChangingPopulation(storage.getStorage('states'), data);
      }

      var time = new Date();
      _this.dateDownloadFromApi = time.getTime();
      storage.saveStorage('date', _this.dateDownloadFromApi);
      storage.saveStorage('states', data);
    }).catch(function (err) {
      throw new Error(logsTexts.tableWithStates.downloadFromAPI.failure);
    });
  }; // sprawdzenie, czy ponowanie pobrać dane z API (zwrócenie flagi true = pobrać, false = korzystać z localStorage)


  TableWithStates.prototype.downloadFromApiAgain = function (timeDownloadFromApi) {
    var MS_IN_6DAYS = 6 * 24 * 60 * 60 * 1000;
    var MS_FOR_TEST = 30 * 1000;
    var timeNow = new Date().getTime();
    var differenceInMs = 0;

    if (timeDownloadFromApi.length === 1) {
      differenceInMs = timeNow - timeDownloadFromApi[0];
      this.countTimeFromLastApi(differenceInMs);
    }

    if (differenceInMs <= MS_FOR_TEST) {
      console.log(logsTexts.tableWithStates.downloadFromApiAgain.useDataFromStorage, MS_FOR_TEST + 'ms');
      return false;
    } else {
      console.log(logsTexts.tableWithStates.downloadFromApiAgain.useDataFromApi);
      return true;
    }
  }; //  oblicza czas od ostaniego pobrania z API


  TableWithStates.prototype.countTimeFromLastApi = function (timeDownloadInMs) {
    var s = Math.floor(timeDownloadInMs / 1000 % 60);
    var m = Math.floor(timeDownloadInMs / 1000 / 60 % 60);
    var h = Math.floor(timeDownloadInMs / 1000 / 60 / 60 % 24);
    var d = Math.floor(timeDownloadInMs / 1000 / 60 / 60 / 24);
    var result = d + " dni, " + h + " godzin, " + m + " min, " + s + " sek";
    console.log(logsTexts.tableWithStates.countTimeFromLastApi.timeFromLastApi, result);
  }; // porównanie populacji z dwóch zbiorów danych


  TableWithStates.prototype.comparePopulationBetweenData = function (stateDataOld, stateDataNew) {
    if (stateDataOld.alpha3Code === stateDataNew.alpha3Code) {
      if (stateDataOld.population !== stateDataNew.population) {
        this.tableAfterComparison.push(stateDataOld.name);
        return;
      }
    }
  }; // pętla po starym zestawie danych


  TableWithStates.prototype.infoAboutChangingPopulation = function (oldData, newData) {
    var _this = this;

    var _loop_1 = function _loop_1(i) {
      if (newData.length > 0) {
        newData.filter(function (el) {
          return _this.comparePopulationBetweenData(el, oldData[i]);
        });
      }
    };

    for (var i = 0; i < oldData.length; i++) {
      _loop_1(i);
    }

    return this.tableAfterComparison.length > 0 ? console.log(logsTexts.tableWithStates.infoAboutChangingPopulation.stateWithChangedPopulation, this.tableAfterComparison) : console.log(logsTexts.tableWithStates.infoAboutChangingPopulation.noChangeOfPopulation);
  };

  return TableWithStates;
}();

var tableWithStates = new TableWithStates(); // klasa od localStorage; oddzielne metody do zapisu i odczytu danych o państwach oraz daty pobrania z API

var StorageBrowser = function () {
  function StorageBrowser() {}

  StorageBrowser.prototype.getStorage = function (key) {
    var content = [];
    var contentInLocalStorage = localStorage.getItem(key);

    if (contentInLocalStorage !== null) {
      var fromJSON = JSON.parse(contentInLocalStorage);

      if (typeof fromJSON === 'number') {
        var newTab = [];
        newTab.push(fromJSON);
        content = newTab;
      } else {
        content = fromJSON;
      }
    } else {
      content = [];
    } // console.log(key, 'content', typeof content, 'czy tablica: ', Array.isArray(content));


    return content;
  };

  StorageBrowser.prototype.saveStorage = function (key, item) {
    // console.log('item w saveStorage', typeof item, 'klucz', key, ' zawartość: ', item);
    if (item === null || item === undefined) {
      return console.log(logsTexts.storage.saveStorage.failure);
    }

    ;

    if (typeof item == 'number') {
      localStorage.setItem(key, "" + item);
    }

    ;
    localStorage.setItem(key, JSON.stringify(item));
  };

  return StorageBrowser;
}();

var storage = new StorageBrowser();
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62137" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map