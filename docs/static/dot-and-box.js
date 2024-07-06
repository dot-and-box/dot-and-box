var wt = Object.defineProperty;
var xt = (r, e, t) => e in r ? wt(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var o = (r, e, t) => (xt(r, typeof e != "symbol" ? e + "" : e, t), t);
var E = /* @__PURE__ */ ((r) => (r[r.NONE = 0] = "NONE", r[r.PLUS = 1] = "PLUS", r[r.MINUS = 2] = "MINUS", r))(E || {}), w = /* @__PURE__ */ ((r) => (r[r.PIXEL = 0] = "PIXEL", r[r.CELL = 1] = "CELL", r))(w || {});
const T = class T {
  constructor(e, t, s = E.NONE, n = w.PIXEL) {
    o(this, "x");
    o(this, "y");
    o(this, "sign");
    o(this, "unit");
    this.x = e, this.y = t, this.sign = s, this.unit = n;
  }
  clone() {
    return new T(this.x, this.y, this.sign, this.unit);
  }
  plus(e) {
    return new T(this.x + e.x, this.y + e.y, this.sign, this.unit);
  }
  minus(e) {
    return new T(this.x - e.x, this.y - e.y, E.NONE);
  }
  normalizeSign() {
    const e = this.sign == E.MINUS ? -this.x : this.x, t = this.sign == E.MINUS ? -this.y : this.y;
    return new T(e, t, E.NONE, this.unit);
  }
  normalizeUnit(e) {
    this.unit == w.CELL && (this.x = this.x * e, this.y = this.y * e, this.unit = w.PIXEL);
  }
};
o(T, "zero", () => new T(0, 0));
let d = T;
class U {
  constructor() {
    o(this, "id", "");
    o(this, "position", d.zero());
    o(this, "size", d.zero());
    o(this, "selected", !1);
    o(this, "visible", !0);
  }
  getPropertyUpdater(e) {
    throw new Error("not implemented exception");
  }
  get center() {
    return this.position;
  }
  updatePosition(e, t) {
    this.position.x = e, this.position.y = t;
  }
  normalizePositionUnit(e, t) {
    e.normalizeUnit(t);
  }
}
class $ extends U {
  constructor() {
    super();
    o(this, "position");
    o(this, "selected", !1);
    o(this, "visible", !0);
    this.id = "dummy", this.position = d.zero(), this.size = d.zero();
  }
  clone() {
    return new $();
  }
  draw(t) {
  }
  // @ts-ignore
  hitTest(t) {
    return !1;
  }
  static getInstance() {
    return new $();
  }
  getPropertyValue(t) {
    return d.zero();
  }
  animateEndByPropertyAndTarget(t, s) {
    return d.zero();
  }
}
const It = 6, bt = 0.1, yt = 2e-3, tt = "yellow", Ct = 2, D = "courier", M = 14, gt = 1, R = "white", L = "black", k = [
  "#F44336",
  "#673AB7",
  "#E91E63",
  "#FFC107",
  "#3F51B5",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FF9800",
  "#FF5722",
  "#673AB7",
  "#795548",
  "#2196F3",
  "#9E9E9E",
  "#607D8B"
], At = [
  22,
  14,
  16,
  17,
  12,
  32
], kt = At[0], C = $.getInstance(), A = "position", _ = "size";
class Y {
  constructor() {
    o(this, "dotAndBox");
  }
  updateModel(e) {
    this.dotAndBox = e;
  }
  // @ts-ignore
  move(e) {
  }
  // @ts-ignore
  up(e) {
  }
}
class O extends U {
  constructor(t, s, n, h, l, a, c, f = null) {
    super();
    o(this, "color");
    o(this, "text");
    o(this, "id");
    o(this, "selected");
    o(this, "visible");
    o(this, "fontSize");
    o(this, "radius");
    this.id = t, this.position = s, this.radius = n, this.color = h, this.size = new d(n * 2, n * 2), this.text = l, this.selected = c, this.visible = a, this.fontSize = f;
  }
  draw(t) {
    t.beginPath(), t.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, !1), t.fillStyle = this.color, t.fill(), this.selected && (t.lineWidth = gt, t.strokeStyle = tt, t.stroke()), t.closePath();
    let s = 0, n, h = this.fontSize != null ? this.fontSize : M;
    if (this.text.length > 3) {
      const l = this.fontSize;
      t.font = `${l}px ${D}`, n = t.measureText(this.text).width / 2;
    } else {
      let l = this.text.length > 1 ? this.radius * 0.8 : this.radius * 1.2;
      h = this.fontSize != null ? this.fontSize : l, s = l / 2 - l / 4 + 1, n = s * this.text.length;
    }
    t.font = `${h}px ${D}`, t.fillStyle = this.color != R ? R : L, t.fillText(this.text, this.position.x - n, this.position.y + s);
  }
  hitTest(t) {
    let s = this.position.x - t.x, n = this.position.y - t.y;
    return s * s + n * n <= this.size.x * this.size.x;
  }
  normalizePositionUnit(t, s) {
    t.unit == w.CELL && t.sign == E.NONE ? O.normalizeDotPosition(t, s) : super.normalizePositionUnit(t, s);
  }
  static normalizeDotPosition(t, s) {
    t.x = t.x * s + s / 2, t.y = t.y * s + s / 2, t.unit = w.PIXEL;
  }
  clone() {
    return new O(this.id.toString(), this.position.clone(), this.radius, this.color.toString(), this.text.toString(), this.visible, this.selected);
  }
  getPropertyUpdater(t) {
    if (t === A)
      return (s, n) => this.updatePosition(s, n);
    if (t == _)
      return (s, n) => {
        this.size = new d(Math.abs(s), Math.abs(s)), this.radius = this.size.x / 2;
      };
    throw new Error("not implemented");
  }
  getPropertyValue(t) {
    switch (t) {
      case A:
        return this.position;
      case _:
        return this.size;
      default:
        throw new Error("not implemented exception");
    }
  }
  animateEndByPropertyAndTarget(t, s) {
    if (t == A)
      return s.center;
    if (t == _)
      return s.size;
    throw new Error("not implemented");
  }
}
const ot = "style", nt = "color", rt = "border", ht = "code", _t = "width", Rt = "height", at = "debug", q = "experimental", lt = "controls", dt = "autoplay", ct = "keyboard", ut = "grid", Tt = "initialized", St = "empty-tool", et = "box-tool", st = "dot-tool", vt = "pan-zoom-tool";
class Pt extends Y {
  click(e) {
    const t = this.dotAndBox.model.controls, s = `${t.length + 1}`;
    t.push(new O(s, e, kt, k[t.length % k.length], s, !0, !1)), this.dotAndBox.resetTool();
  }
  get name() {
    return st;
  }
}
const X = class X extends Y {
  constructor() {
    super(...arguments);
    o(this, "dragStart", d.zero());
  }
  click(t) {
    this.dragStart = t;
    const s = [];
    this.dotAndBox.model.controls.forEach((n) => {
      n.hitTest(t) && s.push(n);
    }), s.length > 0 && (s.forEach((n) => n.selected = !n.selected), this.dotAndBox.model.applySelected(s));
  }
  move(t) {
    this.dotAndBox.model.offset = new d(
      t.x - this.dragStart.x,
      t.y - this.dragStart.y
    );
  }
  get name() {
    return X.NAME;
  }
};
o(X, "NAME", "pan-zoom-tool");
let B = X;
class it extends U {
  constructor(t, s, n, h, l, a, c) {
    super();
    o(this, "_centered", !1);
    o(this, "_color", "black");
    o(this, "_fontName", D);
    o(this, "_fontSize", M);
    o(this, "_spanX", 0);
    o(this, "_spanY", 0);
    o(this, "_text");
    o(this, "_textData");
    o(this, "drawn", !1);
    this.position = s, this._fontName = n, this._fontSize = h, this._text = t, this._color = l, this._centered = c, this._textData = [], this.size = a;
  }
  get centered() {
    return this._centered;
  }
  set centered(t) {
    this._centered = t;
  }
  get color() {
    return this._color;
  }
  set color(t) {
    this._color = t;
  }
  get fontName() {
    return this._fontName;
  }
  set fontName(t) {
    this._fontName = t;
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    this._fontSize = t, this._textData = [];
  }
  get text() {
    return this._text;
  }
  set text(t) {
    this._text !== t && (this._text = t, this._textData = []);
  }
  clone() {
    return new it(this._text, this.position, this._fontName, this._fontSize, this._color, this.size.clone(), this._centered);
  }
  updatePosition(t, s) {
    super.updatePosition(t, s), this._textData = [];
  }
  draw(t) {
    t.fillStyle = this._color, t.font = `${this._fontSize}px ${this._fontName}`, this._textData.length == 0 && this.wrapText(t);
    let s = 0;
    for (const n of this._textData)
      t.fillText(n, this.position.x + this._spanX, this.position.y + this._spanY + this._fontSize * s++);
    this.drawn || (this.drawn = !0);
  }
  // @ts-ignore
  hitTest(t) {
    return !1;
  }
  // quite inefficient - needs better implementation
  wrapText(t) {
    let s = 0, n = 0;
    const h = [], l = this._text.split(`
`);
    for (let a = 0; a < l.length; a++) {
      let c = "", f = l[a].split(" ");
      for (let u = 0; u < f.length; u++) {
        let p = c + f[u], b = t.measureText(p).width;
        b > n && (n = b), p += " ", b > this.size.x ? (h.push(c), c = f[u] + " ", s += this._fontSize) : c = p;
      }
      h.push(c), s += this._fontSize;
    }
    this._centered && (this._spanX = this.size.x < n ? 0 : (this.size.x - n) / 2, this._spanY = (this.size.y - h.length * this.fontSize) / 2 + this.fontSize / 2), this._textData = h;
  }
  getPropertyValue(t) {
    switch (t) {
      case A:
        return this.position;
      case _:
        return this.size;
      default:
        throw new Error("not implemented exception");
    }
  }
  animateEndByPropertyAndTarget(t, s) {
    throw new Error("unimplemented exception");
  }
}
const K = class K extends U {
  constructor(t, s, n, h, l, a, c, f) {
    super();
    o(this, "color");
    o(this, "size");
    o(this, "_text");
    o(this, "id");
    o(this, "selected");
    o(this, "visible");
    o(this, "_fontSize");
    o(this, "textControl");
    this.id = t, this.position = s, this.size = n, this._fontSize = h, this.color = l, this._text = a, this.selected = f, this.visible = c, this.textControl = new it(a, this.position, D, this._fontSize, L, this.size, !0);
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    this._fontSize = t;
  }
  get text() {
    return this._text;
  }
  set text(t) {
    this._text = t;
  }
  get center() {
    return new d(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
  }
  draw(t) {
    t.fillStyle = this.color != R ? R : L, t.strokeStyle = L, this.color != R && (t.fillStyle = this.color, t.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)), (this.selected || this.color != R) && (t.strokeStyle = this.selected ? tt : L, t.lineWidth = this.selected ? Ct : gt, t.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y)), this.textControl.fontSize = this._fontSize, this.textControl.color = this.color != R && this.color != "transparent" ? R : L, this.textControl.draw(t);
  }
  hitTest(t) {
    const s = t.x, n = t.y;
    return s >= this.position.x && s <= this.position.x + this.size.x && n >= this.position.y && n <= this.position.y + this.size.y;
  }
  clone() {
    return new K(this.id.toString(), this.position.clone(), this.size.clone(), this._fontSize, this.color.toString(), this._text.toString(), this.visible, this.selected);
  }
  getPropertyUpdater(t) {
    if (t == A)
      return (s, n) => {
        this.updatePosition(s, n);
      };
    if (t == _)
      return (s, n) => {
        this.size.x = Math.abs(s), this.size.y = Math.abs(n);
      };
    throw new Error("not implemented");
  }
  animateEndByPropertyAndTarget(t, s) {
    if (t == A)
      return new d(s.center.x - this.size.x / 2, s.center.y - this.size.y / 2);
    if (t == _)
      return this.size;
    throw new Error("not implemented");
  }
  getPropertyValue(t) {
    switch (t) {
      case A:
        return this.position;
      case _:
        return this.size;
      default:
        throw new Error("not implemented exception");
    }
  }
};
o(K, "counter", 1);
let z = K;
class Lt extends Y {
  constructor() {
    super(...arguments);
    o(this, "dragStart", d.zero());
  }
  click(t) {
    const s = this.dotAndBox.model.controls;
    this.dragStart = t;
    const n = `box ${z.counter++}`;
    this.dotAndBox.model.controls.push(
      new z(
        n,
        t,
        new d(this.dotAndBox.model.cellSize, this.dotAndBox.model.cellSize, E.NONE, w.CELL),
        M,
        k[s.length % k.length],
        n,
        !0,
        !1
      )
    ), this.dotAndBox.resetTool();
  }
  get name() {
    return et;
  }
}
var g = /* @__PURE__ */ ((r) => (r[r.START = 0] = "START", r[r.IN_PROGRESS = 1] = "IN_PROGRESS", r[r.STOPPED = 2] = "STOPPED", r[r.END = 3] = "END", r))(g || {}), m = /* @__PURE__ */ ((r) => (r[r.BACKWARD = 0] = "BACKWARD", r[r.FORWARD = 1] = "FORWARD", r[r.NONE = 2] = "NONE", r))(m || {});
class pt {
  constructor(e, t) {
    o(this, "_progress", 0);
    o(this, "actions", []);
    o(this, "_start", 0);
    o(this, "_end", 1);
    o(this, "instant", !0);
    o(this, "_startEndDiff", 1);
    this._start = e, this._end = t, this.calcDiff();
  }
  get start() {
    return this._start;
  }
  get end() {
    return this._end;
  }
  calcDiff() {
    this._startEndDiff = this._end - this._start;
  }
  addAction(e) {
    this.instant && (this.instant = e.instant), this.actions.push(e);
  }
  updateStartEnd(e, t) {
    this._start = e, this._end = t, this.calcDiff();
  }
  set progress(e) {
    let t;
    if (e <= this.start ? t = 0 : e >= this.end ? t = 1 : t = this._startEndDiff > 0 ? (e - this.start) / this._startEndDiff : 1, this._progress !== t) {
      t > 0 && this._progress == 0 ? this.actions.forEach((s) => s.onBeforeForward()) : t == 0 && this._progress > 0 && this.actions.forEach((s) => s.onAfterBackward()), this._progress = t;
      for (const s of this.actions)
        s.updateValue(this._progress);
    }
  }
  get progress() {
    return this._progress;
  }
  init() {
    this.actions.forEach((e) => e.init());
  }
}
class Et {
  constructor() {
    o(this, "sequences", []);
    o(this, "title", "");
    o(this, "_progress", 0);
    o(this, "direction", m.NONE);
    o(this, "state", g.START);
    o(this, "duration", 1e3);
  }
  init() {
    this.sequences.forEach((e) => e.init());
  }
  addParallelAction(e) {
    this.sequences.length == 0 && this.sequences.push(new pt(0, 1)), this.sequences[this.sequences.length - 1].addAction(e);
  }
  addSequentialAction(e) {
    const s = 1 / (this.sequences.reduce((h, l) => h + (l.instant ? 0 : 1), 0) + (e.instant ? 0 : 1));
    let n = 0;
    for (const h of this.sequences)
      h.instant ? h.updateStartEnd(n, n) : (h.updateStartEnd(n, n + s), n += s);
    this.sequences.push(new pt(1 - s, 1)), this.sequences[this.sequences.length - 1].addAction(e);
  }
  get progress() {
    return this._progress;
  }
  set progress(e) {
    e != this._progress && (this._progress = e, this.sequences.forEach((t) => t.progress = this._progress), this.updateState());
  }
  updateState() {
    this._progress == 0 ? (this.state = g.START, this.direction == m.BACKWARD && (this.direction = m.NONE)) : this._progress == 1 ? (this.state = g.END, this.direction == m.FORWARD && (this.direction = m.NONE)) : this.state = g.IN_PROGRESS;
  }
  pause() {
    this.state == g.IN_PROGRESS && (this.state = g.STOPPED);
  }
  unpause() {
    this.state == g.STOPPED && (this.state = g.IN_PROGRESS);
  }
  togglePause() {
    this.state == g.IN_PROGRESS ? this.pause() : this.unpause();
  }
  run() {
    this.direction != m.NONE && (this.state = g.IN_PROGRESS);
  }
  forward() {
    this.state != g.END && (this.direction = m.FORWARD, this.state = g.IN_PROGRESS);
  }
  backward() {
    this.state != g.START && (this.direction = m.BACKWARD, this.state = g.IN_PROGRESS);
  }
}
class y {
  static easeLinear(e) {
    return e;
  }
  static easeInQuad(e) {
    return e * e;
  }
  static inverseEaseInQuad(e) {
    return Math.sqrt(e);
  }
  static easeInCubic(e) {
    return e * e * e;
  }
  static inverseEaseInCubic(e) {
    return Math.pow(e, 1 / 3);
  }
  static getEasingByType(e) {
    switch (e) {
      case 0:
        return y.easeLinear;
      case 1:
        return y.easeInQuad;
      case 2:
        return y.easeInCubic;
      default:
        return y.easeLinear;
    }
  }
  static getInverseEasingByType(e) {
    switch (e) {
      case 0:
        return y.easeLinear;
      case 1:
        return y.inverseEaseInQuad;
      case 2:
        return y.inverseEaseInCubic;
      default:
        return y.easeLinear;
    }
  }
}
var j = /* @__PURE__ */ ((r) => (r[r.LINEAR = 0] = "LINEAR", r[r.IN_QUAD = 1] = "IN_QUAD", r[r.IN_CUBIC = 2] = "IN_CUBIC", r))(j || {});
const N = class N {
  constructor(e, t, s) {
    o(this, "title");
    o(this, "controls");
    o(this, "steps");
    o(this, "currentStep", new Et());
    o(this, "origin", d.zero());
    o(this, "cellSize", 50);
    o(this, "offset", d.zero());
    o(this, "zoom", 1);
    o(this, "selectedControls", []);
    o(this, "_currentStepIndex", 0);
    o(this, "_requestedStepProgress", 0);
    o(this, "lastTime", 0);
    o(this, "_width", 100);
    o(this, "_height", 100);
    o(this, "stepStartTime", 0);
    o(this, "autoPlay", !1);
    o(this, "easingFunc", y.getEasingByType(j.IN_QUAD));
    o(this, "inverseEasingFunc", y.getInverseEasingByType(j.IN_QUAD));
    // noinspection JSUnusedGlobalSymbols
    o(this, "onBeforeStepForwardCallback", () => {
    });
    o(this, "onBeforeStepBackwardCallback", () => {
    });
    o(this, "updateSubtitleCallback", () => {
    });
    this.title = e, this.controls = t, this.steps = s, this.origin = d.zero();
  }
  get height() {
    return this._height;
  }
  get width() {
    return this._width;
  }
  updateWidthAndHeight(e, t) {
    this._width = e, this._height = t, this.origin = new d(this._width / 2, this._height / 2), this.offset = new d(this._width / 2, this._height / 2);
  }
  get requestedStepProgress() {
    return this._requestedStepProgress;
  }
  set requestedStepProgress(e) {
    this._requestedStepProgress = e;
  }
  get currentStepIndex() {
    return this._currentStepIndex;
  }
  set currentStepIndex(e) {
    this.steps.length > e && (this._currentStepIndex = e, this.currentStep = this.steps[this._currentStepIndex]);
  }
  applySelected(e) {
    e.forEach((t) => {
      if (t.selected)
        this.selectedControls.push(t);
      else {
        const s = this.selectedControls.indexOf(t);
        s >= 0 && this.selectedControls.splice(s, 1);
      }
    });
  }
  deleteSelected() {
    this.controls = this.controls.filter((e) => !e.selected);
  }
  findControl(e) {
    if (e.startsWith(N.SELECTED_PREFIX)) {
      const t = parseInt(e.substring(N.SELECTED_PREFIX.length), 10);
      return t < this.selectedControls.length ? this.selectedControls[t] : void 0;
    } else
      return this.controls.find((t) => t.id === e);
  }
  updateStartTime() {
    this.currentStep.direction == m.FORWARD ? this.stepStartTime = this.lastTime - this.inverseEasingFunc(this.requestedStepProgress) * this.currentStep.duration : this.currentStep.direction === m.BACKWARD && (this.stepStartTime = this.lastTime - (1 - this.inverseEasingFunc(this.requestedStepProgress)) * this.currentStep.duration);
  }
  updateRequestedProgressIfInMove() {
    this.currentStep.direction != m.NONE && this.currentStep.state != g.STOPPED && (this.currentStep.direction === m.FORWARD ? this._requestedStepProgress = this.easingFunc((this.lastTime - this.stepStartTime) / this.currentStep.duration) : this.currentStep.direction == m.BACKWARD && (this._requestedStepProgress = this.easingFunc((this.currentStep.duration - (this.lastTime - this.stepStartTime)) / this.currentStep.duration)), (this._requestedStepProgress <= 1e-3 || this._requestedStepProgress > 1) && (this._requestedStepProgress = this._requestedStepProgress <= 1e-3 ? 0 : 1));
  }
  updateProgress() {
    this.currentStep.progress != this._requestedStepProgress && (this.currentStep.progress = this._requestedStepProgress, this.autoPlay && this.handleAutoPlay(), this.currentStep.state == g.START && this._currentStepIndex == 0 && this.updateSubtitleCallback(""));
  }
  handleAutoPlay() {
    this.currentStep.state == g.END && this._currentStepIndex < this.steps.length - 1 ? this.nextStep() : this.currentStep.state == g.START && this._currentStepIndex > 0 && this.singleBackward();
  }
  togglePause() {
    this.updateStartTime(), this.currentStep.togglePause(), this.currentStep.state == g.STOPPED && (this.autoPlay = !1);
  }
  singleForward() {
    this.currentStep.direction === m.FORWARD && this.currentStep.state === g.IN_PROGRESS && (this._requestedStepProgress = 1), this.nextStep(), this.currentStep.forward(), this.updateStartTime(), this.currentStep.run();
  }
  singleBackward() {
    this.currentStep.direction === m.BACKWARD && this.currentStep.state === g.IN_PROGRESS && (this._requestedStepProgress = 0), this.previousStep(), this.onBeforeStepBackwardCallback(this._currentStepIndex), this.currentStep.backward(), this.updateStartTime(), this.currentStep.run();
  }
  selectStep(e) {
    this.currentStepIndex !== e && (this.currentStepIndex = e);
  }
  previousStep() {
    this.currentStep.state == g.START && this._currentStepIndex > 0 && (this.selectStep(this._currentStepIndex - 1), this._requestedStepProgress = 1, this.updateSubtitleCallback(this.currentStep.title));
  }
  nextStep() {
    this.currentStep.state == g.END && this._currentStepIndex < this.steps.length - 1 && (this.selectStep(this._currentStepIndex + 1), this.currentStep.init(), this._requestedStepProgress = 0), this.onBeforeStepForwardCallback(this._currentStepIndex), this.currentStep.forward(), this.updateStartTime(), this.currentStep.run(), this.updateSubtitleCallback(this.currentStep.title);
  }
};
o(N, "SELECTED_PREFIX", "selected");
let G = N;
class mt extends Y {
  // @ts-ignore
  click(e) {
  }
  // @ts-ignore
  move(e) {
  }
  get name() {
    return St;
  }
}
o(mt, "NAME", "");
class Ot {
  constructor(e) {
    o(this, "canvas");
    o(this, "ctx");
    o(this, "model", new G("", [], []));
    o(this, "isDragging", !1);
    o(this, "initialPinchDistance", 0);
    o(this, "lastZoom", this.model.zoom);
    o(this, "fps", 1);
    o(this, "showDebug", !1);
    o(this, "showGrid", !1);
    o(this, "marginLeft", 0);
    o(this, "marginTop", 0);
    o(this, "panZoomTool", new B());
    o(this, "tools", /* @__PURE__ */ new Map([
      [St, new mt()],
      [st, new Pt()],
      [et, new Lt()],
      [vt, this.panZoomTool]
    ]));
    o(this, "tool", this.panZoomTool);
    o(this, "pointerPosition", d.zero());
    o(this, "rect", d.zero());
    this.ctx = e.getContext("2d"), this.canvas = e, this.attachCanvasEventHandlers();
  }
  // noinspection JSUnusedGlobalSymbols
  get requestedStepProgress() {
    return this.model.requestedStepProgress;
  }
  set requestedStepProgress(e) {
    this.model.requestedStepProgress = e;
  }
  get zoom() {
    return this.model.zoom;
  }
  set zoom(e) {
    this.model.zoom = e;
  }
  initModel(e) {
    this.requestedStepProgress = 0, this.model = e, this.model.currentStepIndex = 0;
    for (let t of this.tools.values())
      t.updateModel(this);
  }
  apply(e) {
    this.initModel(e), this.model.steps.length > 0 && (this.model.selectStep(0), this.model.currentStep.init());
  }
  updatePositionAndSize() {
    const e = this.canvas.getBoundingClientRect();
    this.model.updateWidthAndHeight(e.width, e.height);
  }
  updatePointerPosition(e, t) {
    this.pointerPosition.x = e - this.rect.x, this.pointerPosition.y = t - this.rect.y;
  }
  attachCanvasEventHandlers() {
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || this.addCanvasEvent("mousedown", (t) => {
      t.preventDefault(), t.stopPropagation(), this.updatePointerPosition(t.x, t.y), this.onPointerDown();
    }), this.addCanvasEvent("touchstart", (t) => this.handleTouch(t, this.onPointerDown)), this.addCanvasEvent("mouseup", (t) => this.onPointerUp()), this.addCanvasEvent("touchend", (t) => this.handleTouch(t, this.onPointerUp)), this.addCanvasEvent("mousemove", (t) => {
      t.preventDefault(), t.stopPropagation(), this.updatePointerPosition(t.x, t.y), this.onPointerMove();
    }), this.addCanvasEvent("touchmove", (t) => this.handleTouch(t, this.onPointerMove)), this.addCanvasEvent("wheel", (t) => this.handleScroll(t));
  }
  addCanvasEvent(e, t) {
    this.canvas.addEventListener(e, t);
  }
  selectTool(e) {
    this.tools.has(e) && (this.tool = this.tools.get(e));
  }
  resetTool() {
    this.selectTool(B.NAME);
  }
  fastForward() {
    this.model.autoPlay = !0, this.model.singleForward();
  }
  fastBackward() {
    this.model.autoPlay = !0, this.model.singleBackward();
  }
  forward() {
    this.model.autoPlay = !1, this.model.singleForward();
  }
  backward() {
    this.model.autoPlay = !1, this.model.singleBackward();
  }
  deleteSelected() {
    this.togglePause(), this.model.deleteSelected();
  }
  togglePause() {
    this.model.togglePause();
  }
  drawDebug(e) {
    this.fps = 1 / ((e - this.model.lastTime) / 1e3);
    const t = this.model.width - 210;
    this.drawText(`fps: ${Math.round(this.fps)} zoom: ${Math.round(this.model.zoom * 100) / 100} step: ${this.model.currentStepIndex} prog: ${Math.round(this.model.requestedStepProgress * 100) / 100}`, t, 10, 10, D);
  }
  draw(e) {
    this.canvas.width = this.model.width, this.canvas.height = this.model.height, this.showDebug && this.drawDebug(e), this.ctx.translate(this.model.origin.x, this.model.origin.y), this.ctx.scale(this.model.zoom, this.model.zoom), this.ctx.translate(-this.model.origin.x + this.model.offset.x, -this.model.origin.y + this.model.offset.y), this.model.updateRequestedProgressIfInMove(), this.model.updateProgress(), this.showGrid && this.drawGrid();
    for (const t of this.model.controls)
      t.visible && t.draw(this.ctx);
    this.model.lastTime = e, requestAnimationFrame((t) => this.draw(t));
  }
  drawText(e, t, s, n, h) {
    this.ctx.font = `${n}px ${h}`, this.ctx.fillText(e, t, s);
  }
  drawGrid() {
    for (let h = -250; h <= 250; h += 50)
      this.drawLine(h, -250, h, 250), this.drawLine(-250, h, 250, h);
  }
  drawLine(e, t, s, n) {
    const h = this.ctx;
    h.strokeStyle = "black", h.beginPath(), h.lineWidth = e == 0 || t == 0 ? 1 : 0.4, h.moveTo(e, t), h.lineTo(s, n), h.stroke();
  }
  onPointerDown() {
    this.isDragging = !0;
    const e = new d(
      this.pointerPosition.x / this.model.zoom - this.model.offset.x + this.model.origin.x - this.model.origin.x / this.model.zoom,
      this.pointerPosition.y / this.model.zoom - this.model.offset.y + this.model.origin.y - this.model.origin.y / this.model.zoom
    );
    this.tool.click(e), this.tool.name == B.NAME && (this.canvas.style.cursor = "all-scroll");
  }
  onPointerUp() {
    this.isDragging = !1, this.initialPinchDistance = 0, this.lastZoom = this.model.zoom, this.canvas.style.cursor = "default";
  }
  onPointerMove() {
    this.isDragging && this.tool.move(new d(
      this.pointerPosition.x / this.model.zoom + this.model.origin.x - this.model.origin.x / this.model.zoom,
      this.pointerPosition.y / this.model.zoom + this.model.origin.y - this.model.origin.y / this.model.zoom
    ));
  }
  handleTouch(e, t) {
    e.stopPropagation(), e.preventDefault(), e.touches.length == 1 ? (this.updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY), t.call(this)) : e.type == "touchmove" && e.touches.length > 1 && (this.isDragging = !1, this.handlePinch(e));
  }
  handlePinch(e) {
    const t = {
      x: e.touches[0].clientX + window.scrollX - this.marginLeft,
      y: e.touches[0].clientY + window.scrollY - this.marginTop
    }, s = {
      x: e.touches[1].clientX + window.scrollX - this.marginLeft,
      y: e.touches[1].clientY + window.scrollY - this.marginTop
    }, n = (t.x - s.x) ** 2 + (t.y - s.y) ** 2;
    this.initialPinchDistance == 0 ? this.initialPinchDistance = n : this.adjustZoom(null, n / this.initialPinchDistance);
  }
  handleScroll(e) {
    e.preventDefault(), this.adjustZoom(e.deltaY * yt, 1);
  }
  adjustZoom(e, t) {
    this.isDragging || (e ? this.model.zoom -= e : t && (this.model.zoom = t * this.lastZoom), this.model.zoom = Math.min(this.model.zoom, It), this.model.zoom = Math.max(this.model.zoom, bt));
  }
}
var i = /* @__PURE__ */ ((r) => (r.MINUS = "-", r.PLUS = "+", r.COMMA = ",", r.COLON = ":", r.EQUALS = "=", r.LEFT_BRACKET = "(", r.RIGHT_BRACKET = ")", r.LEFT_SQUARE_BRACKET = "[", r.RIGHT_SQUARE_BRACKET = "]", r.LESS_THAN = "<", r.ASTERIX = "*", r.GREATER_THAN = ">", r.ASSIGN = "<-", r.CLONE = "*->", r.SWAP = "<->", r.MOVE = "->", r.RESIZE = "+->", r.IDENTIFIER = "IDENTIFIER", r.NUMBER = "NUMBER", r.STRING = "STRING", r.TRUE = "true", r.FALSE = "false", r.ID = "id", r.TITLE = "title", r.TEXT = "text", r.DOT = "dot", r.DOTS = "dots", r.BOXES = "boxes", r.AT = "at", r.SIZE = "size", r.RADIUS = "radius", r.SPAN = "span", r.FONT_SIZE = "fontSize", r.END = "end", r.WIDTH = "width", r.COLOR = "color", r.COLORS = "colors", r.IDS = "ids", r.BOX = "box", r.LINE = "line", r.STEP = "step", r.DURATION = "duration", r.SELECTED = "selected", r.VISIBLE = "visible", r.LAYOUT = "layout", r))(i || {});
class zt {
  constructor(e, t, s) {
    o(this, "position");
    o(this, "type");
    o(this, "value");
    this.position = e, this.type = t, this.value = s || "";
  }
}
class F {
  static isKeyword(e) {
    return this.KEYWORDS_MAP.has(e);
  }
  static getKeywordByName(e) {
    return this.KEYWORDS_MAP.get(e);
  }
}
o(F, "KEYWORDS_MAP", /* @__PURE__ */ new Map([
  [i.ID.toString(), i.ID],
  [i.TRUE.toString(), i.TRUE],
  [i.FALSE.toString(), i.FALSE],
  [i.DOT.toString(), i.DOT],
  [i.DOTS.toString(), i.DOTS],
  [i.BOXES.toString(), i.BOXES],
  [i.TITLE.toString(), i.TITLE],
  [i.TEXT.toString(), i.TEXT],
  [i.BOX.toString(), i.BOX],
  [i.LINE.toString(), i.LINE],
  [i.AT.toString(), i.AT],
  [i.END.toString(), i.END],
  [i.SIZE.toString(), i.SIZE],
  [i.RADIUS.toString(), i.RADIUS],
  [i.SPAN.toString(), i.SPAN],
  [i.FONT_SIZE.toString(), i.FONT_SIZE],
  [i.WIDTH.toString(), i.WIDTH],
  [i.COLOR.toString(), i.COLOR],
  [i.COLORS.toString(), i.COLORS],
  [i.IDS.toString(), i.IDS],
  [i.STEP.toString(), i.STEP],
  [i.DURATION.toString(), i.DURATION],
  [i.SELECTED.toString(), i.SELECTED],
  [i.VISIBLE.toString(), i.VISIBLE],
  [i.LAYOUT.toString(), i.LAYOUT]
])), o(F, "ASSIGN_PROPERTIES", [i.SELECTED, i.TEXT, i.COLOR, i.VISIBLE, i.STRING]);
class Bt {
  constructor() {
    o(this, "start", 0);
    o(this, "position", 0);
    o(this, "line", 1);
    o(this, "tokens", []);
    o(this, "source", "");
  }
  scan(e) {
    for (this.source = e; this.position < e.length; ) {
      const t = this.advance();
      switch (t) {
        case " ":
        case "\r":
          break;
        case `
`:
          this.line++;
          break;
        case "	":
          break;
        case "(":
          this.addToken(i.LEFT_BRACKET);
          break;
        case ")":
          this.addToken(i.RIGHT_BRACKET);
          break;
        case "[":
          this.addToken(i.LEFT_SQUARE_BRACKET);
          break;
        case "]":
          this.addToken(i.RIGHT_SQUARE_BRACKET);
          break;
        case ":":
          this.addToken(i.COLON);
          break;
        case ",":
          this.addToken(i.COMMA);
          break;
        case "<":
          this.matchSwap() || this.addToken(i.LESS_THAN);
          break;
        case "*":
          this.matchClone() || this.addToken(i.ASTERIX);
          break;
        case "+":
          this.matchResize() || this.addToken(i.PLUS);
          break;
        case "-":
          this.match(">") ? this.addToken(i.MOVE) : this.addToken(i.MINUS);
          break;
        case "=":
          this.addToken(i.EQUALS);
          break;
        case ">":
          this.addToken(i.GREATER_THAN);
          break;
        case "/":
          if (this.match("/"))
            for (; this.peek() != `
` && !this.isAtEnd(); )
              this.advance();
          break;
        case "'":
          this.string();
          break;
        default:
          if (this.isDigit(t))
            this.number();
          else if (this.isAlpha(t))
            this.identifier();
          else
            throw new Error(`line: ${this.line} Unexpected character ${t} charcode: ${t.charCodeAt(0)}`);
      }
      this.start = this.position;
    }
    return this.tokens;
  }
  matchSwap() {
    return this.match("-") ? this.match(">") ? (this.addToken(i.SWAP), !0) : (this.addToken(i.ASSIGN), !0) : !1;
  }
  matchClone() {
    return this.match("-") && this.match(">") ? (this.addToken(i.CLONE), !0) : !1;
  }
  matchResize() {
    return this.match("-") && this.match(">") ? (this.addToken(i.RESIZE), !0) : !1;
  }
  addToken(e) {
    this.addTokenValue(e);
  }
  addTokenValue(e, t) {
    this.tokens.push(new zt(this.start, e, t));
  }
  advance() {
    return this.source.charAt(this.position++);
  }
  isAtEnd() {
    return this.position >= this.source.length;
  }
  peek() {
    return this.isAtEnd() ? "\0" : this.source.charAt(this.position);
  }
  match(e) {
    return this.isAtEnd() || this.source.charAt(this.position) != e ? !1 : (this.position++, !0);
  }
  isDigit(e) {
    return e >= "0" && e <= "9";
  }
  isDigitOrDot(e) {
    return this.isDigit(e) || e == ".";
  }
  number() {
    for (; this.isDigitOrDot(this.peek()); )
      this.advance();
    let e = this.source.substring(this.start, this.position);
    this.addTokenValue(i.NUMBER, e);
  }
  isAlpha(e) {
    return /[\p{Letter}\p{Mark}]+/gu.test(e) || e == "_";
  }
  isAlphanumeric(e) {
    return this.isAlpha(e) || this.isDigit(e);
  }
  string() {
    for (; this.peek() != "'" && !this.isAtEnd(); )
      this.peek() == `
` && this.line++, this.advance();
    if (this.isAtEnd())
      throw new Error(`line: ${this.line} Unterminated String`);
    this.advance();
    let e = this.source.substring(this.start + 1, this.position - 1);
    this.addTokenValue(i.STRING, e);
  }
  identifier() {
    for (; this.isAlphanumeric(this.peek()); )
      this.advance();
    let e = this.source.substring(this.start, this.position);
    const t = F.isKeyword(e) ? F.getKeywordByName(e) : i.IDENTIFIER;
    this.addTokenValue(t, e);
  }
}
class W {
  constructor(e) {
    o(this, "model");
    this.model = e;
  }
  init() {
  }
  onBeforeForward() {
  }
  onAfterBackward() {
  }
  get instant() {
    return !1;
  }
}
class ft extends W {
  constructor(t, s, n, h, l = "") {
    super(t);
    o(this, "start");
    o(this, "to");
    o(this, "end");
    o(this, "left", C);
    o(this, "right", C);
    o(this, "leftId");
    o(this, "rightId", "");
    o(this, "propertyName", "");
    o(this, "updateControlValue");
    this.propertyName = s, this.start = d.zero(), this.to = h, this.end = h, this.leftId = n, this.rightId = l, this.updateControlValue = () => {
    };
  }
  init() {
    super.init(), this.selectControls();
  }
  selectControls() {
    const t = this.model.findControl(this.leftId);
    if (t) {
      this.left = t, this.start = this.left.getPropertyValue(this.propertyName).clone();
      let s = this.to.clone();
      t.normalizePositionUnit(s, this.model.cellSize), this.end = this.calculateEnd(this.start, s), this.updateControlValue = this.left.getPropertyUpdater(this.propertyName);
    } else
      this.left = C;
    if (this.rightId !== "") {
      const s = this.model.findControl(this.rightId);
      s && (this.right = s, this.end = this.left.animateEndByPropertyAndTarget(this.propertyName, this.right), s.normalizePositionUnit(this.end, this.model.cellSize));
    }
  }
  onBeforeForward() {
    super.onBeforeForward(), this.selectControls();
  }
  calculateEnd(t, s) {
    return s.sign == E.NONE ? new d(s.x, s.y) : s.sign == E.PLUS ? new d(t.x + s.x, t.y + s.y) : new d(t.x - s.x, t.y - s.y);
  }
  updateValue(t) {
    t == 0 ? this.updateControlValue(this.start.x, this.start.y) : t == 1 ? this.updateControlValue(this.end.x, this.end.y) : this.updateControlValue(
      this.start.x + (this.end.x - this.start.x) * t,
      this.start.y + (this.end.y - this.start.y) * t
    );
  }
}
class Nt extends W {
  constructor(t, s, n) {
    super(t);
    o(this, "left", C);
    o(this, "right", C);
    o(this, "startLeft");
    o(this, "startRight");
    o(this, "endLeft");
    o(this, "endRight");
    o(this, "leftControlId");
    o(this, "rightControlId");
    this.startLeft = d.zero(), this.endLeft = d.zero(), this.startRight = d.zero(), this.endRight = d.zero(), this.leftControlId = s, this.rightControlId = n;
  }
  init() {
    super.init(), this.selectControls();
  }
  onBeforeForward() {
    super.onBeforeForward(), this.selectControls();
  }
  selectControls() {
    const t = this.model.findControl(this.leftControlId);
    this.left = t || C;
    const s = this.model.findControl(this.rightControlId);
    this.right = s || C, this.startLeft = this.left.position.clone(), this.endLeft = this.left.animateEndByPropertyAndTarget(A, this.right).clone(), this.startRight = this.right.position.clone(), this.endRight = this.right.animateEndByPropertyAndTarget(A, this.left).clone();
  }
  updateValue(t) {
    if (t == 0)
      this.left.updatePosition(this.startLeft.x, this.startLeft.y), this.right.updatePosition(this.startRight.x, this.startRight.y);
    else if (t == 1)
      this.left.updatePosition(this.endLeft.x, this.endLeft.y), this.right.updatePosition(this.endRight.x, this.endRight.y);
    else {
      const s = (this.endLeft.x - this.startLeft.x) * t, n = (this.endLeft.y - this.startLeft.y) * t;
      this.left.updatePosition(this.startLeft.x + s, this.startLeft.y + n);
      const h = (this.endRight.x - this.startRight.x) * t, l = (this.endRight.y - this.startRight.y) * t;
      this.right.updatePosition(this.startRight.x + h, this.startRight.y + l);
    }
  }
}
class Dt extends W {
  constructor(t, s, n) {
    super(t);
    o(this, "left", C);
    o(this, "right", C);
    o(this, "leftControlId");
    o(this, "rightControlId");
    o(this, "isAdded");
    this.isAdded = !1, this.leftControlId = s, this.rightControlId = n;
  }
  init() {
    super.init();
    const t = this.model.findControl(this.leftControlId);
    t ? this.left = t : this.left = C;
  }
  cloneAndAddControl() {
    this.isAdded || (this.right = this.left.clone(), this.right.id = this.rightControlId, this.model.controls.push(this.right), this.isAdded = !0);
  }
  onBeforeForward() {
    super.onBeforeForward(), this.cloneAndAddControl();
  }
  onAfterBackward() {
    super.onAfterBackward(), this.destroyControls();
  }
  destroyControls() {
    if (this.isAdded) {
      const t = this.model.controls.indexOf(this.right);
      t > -1 && (this.model.controls.splice(t, 1), this.isAdded = !1);
    }
  }
  // @ts-ignore
  updateValue(t) {
  }
  get instant() {
    return !0;
  }
}
class Q {
  constructor(e, t) {
    o(this, "controlId");
    o(this, "propertyChanges");
    this.controlId = e, this.propertyChanges = t;
  }
}
class Mt {
  constructor(e, t, s) {
    o(this, "property");
    o(this, "newValue");
    o(this, "oldValue");
    this.property = e, this.newValue = t, this.oldValue = s;
  }
}
class Ft extends W {
  constructor(t, s, n) {
    super(t);
    o(this, "control", C);
    o(this, "controlId");
    o(this, "properties");
    o(this, "change");
    o(this, "applied", !1);
    this.controlId = s, this.change = new Q(this.controlId, []), this.properties = n;
  }
  init() {
    super.init(), this.selectControls();
  }
  selectControls() {
    this.control = this.model.findControl(this.controlId);
  }
  onBeforeForward() {
    super.onBeforeForward(), this.selectControls(), this.applyChanges();
  }
  onAfterBackward() {
    super.onAfterBackward(), this.revertChanges();
  }
  applyChanges() {
    if (!this.applied && this.control) {
      this.applied = !0;
      let t = this.control, s = [];
      for (const n of this.properties.keys()) {
        const h = t[n], l = this.properties.get(n);
        t[n] = l, s.push(new Mt(n, l, h)), n === "selected" && this.model.applySelected([this.control]);
      }
      this.change = new Q(this.controlId, s);
    }
  }
  revertChanges() {
    if (this.applied && this.control) {
      this.applied = !1;
      let t = this.control;
      for (const s of this.change.propertyChanges)
        t[s.property] = s.oldValue;
      this.change = new Q(this.controlId, []);
    }
  }
  // @ts-ignore
  updateValue(t) {
  }
  get instant() {
    return !0;
  }
}
class Ut extends W {
  constructor(t, s) {
    super(t);
    o(this, "start", d.zero());
    o(this, "to", d.zero());
    this.to = s.clone(), this.to.normalizeUnit(t.cellSize);
  }
  onBeforeForward() {
    super.onBeforeForward(), this.start = this.model.offset.clone();
  }
  init() {
    super.init();
  }
  updateValue(t) {
    this.model.offset.x = this.start.x - this.to.x * t, this.model.offset.y = this.start.y - this.to.y * t;
  }
}
const Z = class Z extends U {
  constructor(t, s, n, h, l, a, c) {
    super();
    o(this, "color");
    o(this, "_end");
    o(this, "width");
    o(this, "selected");
    o(this, "visible");
    o(this, "distance", d.zero());
    this.id = t, this.position = s, this._end = n, this.distance = this._end.minus(this.position), this.width = h, this.color = l, this.selected = c, this.visible = a, this.size = new d(this.width, this.width);
  }
  get end() {
    return this._end;
  }
  set end(t) {
    this.distance = this.position.minus(this.end), this._end = t;
  }
  draw(t) {
    t.strokeStyle = this.color, this.selected && (t.strokeStyle = tt), t.beginPath(), t.lineWidth = this.width, t.lineCap = "round", t.moveTo(this.position.x, this.position.y), t.lineTo(this._end.x, this._end.y), t.stroke();
  }
  // @ts-ignore
  hitTest(t) {
    return !1;
  }
  clone() {
    return new Z(this.id.toString(), this.position.clone(), this.end.clone(), this.width, this.color.toString(), this.visible, this.selected);
  }
  updatePosition(t, s) {
    this.position.x = t, this.position.y = s, this._end.x = t + this.distance.x, this._end.y = s + this.distance.y;
  }
  getPropertyUpdater(t) {
    if (t == "position")
      return (s, n) => this.updatePosition(s, n);
    if (t == "size")
      return (s, n) => {
        this.size.x = Math.abs(s), this.size.y = Math.abs(n);
      };
    throw new Error("not implemented");
  }
  getPropertyValue(t) {
    switch (t) {
      case "position":
        return this.position;
      case "size":
        return this.size;
      default:
        throw new Error("not implemented exception");
    }
  }
  animateEndByPropertyAndTarget(t, s) {
    if (t == A)
      return this.position;
    if (t == _)
      return this.size;
    throw new Error("not implemented");
  }
};
o(Z, "counter", 1);
let J = Z;
var I = /* @__PURE__ */ ((r) => (r.COL = "COL", r.ROW = "ROW", r.TREE = "TREE", r))(I || {});
class H {
  constructor() {
    o(this, "scanner", new Bt());
    o(this, "model", H.newModel());
    o(this, "position", 0);
    o(this, "tokens", []);
    o(this, "cellSize", 50);
    o(this, "identifiesCounter", /* @__PURE__ */ new Map());
  }
  static newModel() {
    return new G("", [], []);
  }
  eof() {
    return this.tokens.length <= this.position;
  }
  advance() {
    return this.tokens[this.position++];
  }
  peek() {
    return this.tokens[this.position];
  }
  parse(e) {
    for (this.model = H.newModel(), this.tokens = this.scanner.scan(e); this.position < this.tokens.length; )
      switch (this.advance().type) {
        case i.TITLE:
          this.title();
          break;
        case i.BOX:
          this.box();
          break;
        case i.DOT:
          this.dot();
          break;
        case i.LINE:
          this.line();
          break;
        case i.DOTS:
          this.dots();
          break;
        case i.BOXES:
          this.boxes();
          break;
        case i.STEP:
          this.step();
          break;
      }
    return this.model;
  }
  calculateLayoutPosition(e, t, s, n) {
    let h = t.clone();
    switch (e) {
      case I.COL:
        h.x += s * n;
        break;
      case I.ROW:
        h.y += s * n;
        break;
      case I.TREE:
        throw new Error(`Unsupported layout TREE at ${this.peek().position}`);
    }
    return h;
  }
  boxes() {
    const e = [i.SIZE, i.AT, i.IDS, i.LAYOUT, i.SPAN, i.COLORS];
    let t = new d(this.cellSize, this.cellSize), s = new d(0, 0), n = "", h = "", l = [], a = [], c = 0, f = I.COL;
    for (; !this.eof() && e.includes(this.peek().type); )
      switch (this.advance().type) {
        case i.ID:
          h = this.propertyControlId();
          break;
        case i.AT:
          s = this.at();
          break;
        case i.SIZE:
          t = this.sizePoint();
          break;
        case i.SPAN:
          c = this.span();
          break;
        case i.IDS:
          l = this.ids();
          break;
        case i.COLORS:
          a = this.colors();
          break;
        case i.LAYOUT:
          f = this.layout();
          break;
      }
    if (l.length == 0)
      throw new Error(`ids attribute is mandatory for boxes at ${this.peek().position}`);
    s.unit == w.CELL && s.normalizeUnit(this.cellSize), a = a.length > 0 ? a : k;
    let u = t.x + this.cellSize * c, p = 0;
    for (h of l) {
      let x = this.calculateLayoutPosition(f, s, p, u), b = a[p % a.length];
      const P = this.getId(h != "" ? h : n), S = new z(P, x, t.clone(), M, b, h, !0, !1);
      this.model.controls.push(S), S.selected && this.model.selectedControls.push(S), p++;
    }
  }
  getId(e) {
    if (this.identifiesCounter.has(e.trim())) {
      let t = this.identifiesCounter.get(e) + 1;
      return this.identifiesCounter.set(e, t), t + "_" + e;
    } else
      return this.identifiesCounter.set(e, 0), e;
  }
  box() {
    const e = [i.ID, i.SIZE, i.AT, i.TEXT, i.COLOR, i.VISIBLE, i.SELECTED, i.FONT_SIZE];
    let t = new d(this.cellSize, this.cellSize), s = new d(0, 0), n, h = null, l = k[this.model.controls.length % k.length], a = !0, c = !1, f = M;
    for (n = this.textAfterColon(), n == null && (n = ""); !this.eof() && e.includes(this.peek().type); )
      switch (this.advance().type) {
        case i.ID:
          h = this.propertyControlId();
          break;
        case i.TEXT:
          n = this.text();
          break;
        case i.AT:
          s = this.at();
          break;
        case i.SIZE:
          t = this.sizePoint();
          break;
        case i.COLOR:
          l = this.color();
          break;
        case i.VISIBLE:
          a = this.visible();
          break;
        case i.SELECTED:
          c = this.selected();
          break;
        case i.FONT_SIZE:
          f = this.fontSize();
          break;
      }
    h == null && (h = "b" + this.model.controls.length), s.unit == w.CELL && s.normalizeUnit(this.cellSize);
    const u = this.getId(h != "" ? h : n), p = new z(u, s, t.clone(), f, l, n, a, c);
    this.model.controls.push(p), p.selected && this.model.selectedControls.push(p);
  }
  textAfterColon() {
    let e = null;
    return this.match(i.COLON) && (!this.eof() && this.peek().type === i.STRING || this.peek().type === i.IDENTIFIER) && (e = this.peek().value, this.advance()), e;
  }
  line() {
    const e = [i.ID, i.END, i.AT, i.WIDTH, i.COLOR, i.VISIBLE, i.SELECTED];
    let t = new d(100, 100), s = new d(0, 0), n = 1, h = null, l = L, a = !0, c = !1;
    for (; !this.eof() && e.includes(this.peek().type); )
      switch (this.advance().type) {
        case i.ID:
          h = this.propertyControlId();
          break;
        case i.AT:
          s = this.at(), s.normalizeUnit(this.cellSize);
          break;
        case i.END:
          t = this.end(), t.normalizeUnit(this.cellSize);
          break;
        case i.WIDTH:
          n = this.width();
          break;
        case i.COLOR:
          l = this.color();
          break;
        case i.VISIBLE:
          a = this.visible();
          break;
        case i.SELECTED:
          c = this.selected();
          break;
      }
    h == null && (h = "l" + this.model.controls.length);
    const f = this.getId(h), u = new J(f, s, t, n, l, a, c);
    this.model.controls.push(u), u.selected && this.model.selectedControls.push(u);
  }
  dots() {
    const e = [i.RADIUS, i.AT, i.IDS, i.LAYOUT, i.SPAN, i.COLORS];
    let t = 20, s = new d(0, 0), n = "", h = "", l = [], a = [], c = 0, f = I.COL;
    for (; !this.eof() && e.includes(this.peek().type); )
      switch (this.advance().type) {
        case i.ID:
          h = this.propertyControlId();
          break;
        case i.AT:
          s = this.at();
          break;
        case i.RADIUS:
          t = this.radius();
          break;
        case i.SPAN:
          c = this.span();
          break;
        case i.IDS:
          l = this.ids();
          break;
        case i.COLORS:
          a = this.colors();
          break;
        case i.LAYOUT:
          f = this.layout();
          break;
      }
    if (l.length == 0)
      throw new Error(`ids attribute is mandatory for dots at ${this.peek().position}`);
    a = a.length > 0 ? a : k;
    let u = 0, p = this.cellSize + c * this.cellSize;
    for (h of l) {
      const x = this.getId(h != "" ? h : n);
      s.unit == w.CELL && s.sign == E.NONE && O.normalizeDotPosition(s, this.cellSize);
      let b = this.calculateLayoutPosition(f, s, u, p), P = a[u % a.length];
      const S = new O(x, b, t, P, h, !0, !1);
      this.model.controls.push(S), S.selected && this.model.selectedControls.push(S), u++;
    }
  }
  dot() {
    const e = [i.ID, i.RADIUS, i.AT, i.TEXT, i.COLOR, i.VISIBLE, i.SELECTED, i.FONT_SIZE];
    let t = 20, s = new d(0, 0), n, h = "", l = k[this.model.controls.length % k.length], a = !0, c = !1, f = null;
    for (n = this.textAfterColon(); !this.eof() && e.includes(this.peek().type); )
      switch (this.advance().type) {
        case i.ID:
          h = this.propertyControlId();
          break;
        case i.TEXT:
          n = this.text();
          break;
        case i.COLOR:
          l = this.color();
          break;
        case i.AT:
          s = this.at();
          break;
        case i.RADIUS:
          t = this.radius();
          break;
        case i.VISIBLE:
          a = this.visible();
          break;
        case i.SELECTED:
          c = this.selected();
          break;
        case i.FONT_SIZE:
          f = this.fontSize();
          break;
      }
    h === "" && n === "" && (h = "d" + this.model.controls.length), n == null && (n = h);
    const u = this.getId(h != "" ? h : n), p = new O(u, s, t, l, n, a, c, f);
    p.normalizePositionUnit(p.position, this.cellSize), this.model.controls.push(p), p.selected && this.model.selectedControls.push(p);
  }
  text() {
    if (this.expectColon(), this.peek().type == i.STRING)
      return this.advance().value;
    let e = "";
    for (; !this.eof() && this.peek().type == i.IDENTIFIER; ) {
      const t = this.advance();
      e += " " + t.value.toString();
    }
    return e.trim();
  }
  fontSize() {
    return this.expectColon(), this.number();
  }
  color() {
    return this.expectColon(), this.colorValue();
  }
  colors() {
    this.expectColon();
    let e = [];
    for (; !this.eof() && this.canBeColor(this.peek().type); )
      e.push(this.colorValue());
    return e;
  }
  colorValue() {
    let e = "";
    if (this.peek().type == i.IDENTIFIER) {
      let t = this.advance();
      if (e += t.value, this.match(i.LEFT_BRACKET)) {
        for (e += "(", e += this.number().toString(); this.match(i.COMMA); )
          e += ",", e += this.number().toString();
        if (this.match(i.RIGHT_BRACKET))
          e += ")";
        else
          throw new Error(`Expected closing bracket at ${this.peek().position} got token ${this.peek().value} instead`);
      }
    }
    return e;
  }
  at() {
    return this.expectColon(), this.point();
  }
  end() {
    return this.expectColon(), this.point();
  }
  radius() {
    return this.expectColon(), this.number();
  }
  span() {
    return this.expectColon(), this.number();
  }
  layout() {
    if (this.expectColon(), this.eof())
      throw new Error("Expected proper layout got eof");
    let e = this.advance();
    switch (`${e.value.toString().toUpperCase()}`) {
      case I.COL:
        return I.COL;
      case I.ROW:
        return I.ROW;
      case I.TREE:
        return I.TREE;
      default:
        throw new Error(`Expected proper layout at ${e.position} got ${e.value}  instead`);
    }
  }
  sizePoint() {
    this.expectColon();
    const e = this.point();
    return e.unit == w.CELL && (e.x = e.x * this.cellSize, e.y = e.y * this.cellSize, e.unit = w.PIXEL), e;
  }
  width() {
    return this.expectColon(), this.number();
  }
  expectColon() {
    if (!this.match(i.COLON))
      throw new Error(`Expected colon at ${this.position} got ${this.peek().value} instead`);
  }
  number() {
    let e, t = this.peek();
    if (e = t.type == i.MINUS, e && this.advance(), t = this.advance(), t.type == i.NUMBER) {
      let s = t.value.includes(".") ? parseFloat(t.value) : parseInt(t.value, 10);
      return e ? -s : s;
    } else
      throw new Error(`Expected number at position: ${t.position} got token ${t.value} instead`);
  }
  title() {
    this.model.title = this.text();
  }
  duration() {
    this.expectColon();
    let e = this.number();
    const t = this.peek();
    return t.type == i.IDENTIFIER && t.value == "s" ? (e *= 1e3, this.advance()) : t.type == i.IDENTIFIER && t.value == "ms" && this.advance(), e;
  }
  step() {
    this.expectColon();
    let e = new Et();
    this.peek().type === i.STRING && (e.title = this.peek().value, this.advance()), this.match(i.DURATION) && (e.duration = this.duration());
    let t = this.action(), s = !0;
    for (; t != null; ) {
      if (s ? e.addParallelAction(t) : e.addSequentialAction(t), this.eof() || this.peek().type == i.STEP) {
        e.sequences.length > 0 && this.model.steps.push(e);
        return;
      }
      s = this.match(i.COMMA), t = this.action();
    }
  }
  action() {
    if (this.eof())
      return null;
    let e = this.controlId(), t = this.peek();
    switch (t.type) {
      case i.ASSIGN:
        return this.assign(e);
      case i.MOVE:
        return this.move(e);
      case i.RESIZE:
        return this.resize(e);
      case i.SWAP:
        return this.swap(e);
      case i.CLONE:
        if (this.advance(), t = this.peek(), t.type == i.IDENTIFIER)
          return this.advance(), new Dt(this.model, e, t.value);
        break;
    }
    return null;
  }
  propertyControlId() {
    return this.expectColon(), this.controlId();
  }
  controlId() {
    let e = this.advance();
    if (this.canBeId(e.type)) {
      let t = "";
      return e.type == i.NUMBER && !this.eof() && this.peek().value.startsWith("_") && (t = e.value, e = this.advance()), t + e.value;
    } else
      throw new Error(`Expected control identifier at ${e.position} got ${e.value} instead`);
  }
  canBeId(e) {
    return e == i.IDENTIFIER || e == i.STRING || e == i.NUMBER;
  }
  canBeColor(e) {
    return e == i.IDENTIFIER || e == i.STRING;
  }
  ids() {
    this.expectColon();
    let e = [];
    for (; !this.eof() && this.canBeId(this.peek().type); )
      e.push(this.controlId());
    return e;
  }
  move(e) {
    this.advance();
    let t = d.zero(), s = "";
    if (this.pointInBracketsAhead() ? t = this.point() : (s = this.peek().value, this.advance()), e == "camera") {
      if (t.sign == E.NONE)
        throw new Error("Only relative move for camera is currently supported");
      return new Ut(this.model, t);
    }
    return new ft(this.model, A, e, t, s);
  }
  resize(e) {
    this.advance();
    let t = d.zero(), s = "";
    return this.pointInBracketsAhead() ? t = this.point() : (s = this.peek().value, this.advance()), new ft(this.model, _, e, t, s);
  }
  pointInBracketsAhead() {
    const e = this.peek();
    return e.type == i.PLUS || e.type == i.MINUS || e.type == i.LEFT_BRACKET || e.type == i.LEFT_SQUARE_BRACKET;
  }
  assign(e) {
    this.advance();
    let t = this.peek(), s = /* @__PURE__ */ new Map();
    for (; !this.eof() && F.ASSIGN_PROPERTIES.includes(t.type); ) {
      let n = "", h = t.type;
      h == i.STRING ? n = "text" : (this.advance(), n = t.type.toString());
      const l = this.peek();
      let a;
      h == i.COLOR ? a = this.color() : h === i.SELECTED || h === i.VISIBLE ? (this.expectColon(), a = this.boolean()) : (a = l.value, this.advance()), s.set(n, a), t = this.peek();
    }
    return new Ft(this.model, e, s);
  }
  visible() {
    return this.expectColon(), this.boolean();
  }
  selected() {
    return this.expectColon(), this.boolean();
  }
  boolean() {
    const e = this.advance();
    switch (e.type) {
      case i.TRUE:
        return !0;
      case i.FALSE:
        return !1;
      default:
        throw new Error(`Expected boolean value: ${e.position} got token ${e.value} instead`);
    }
  }
  swap(e) {
    this.advance();
    const s = this.peek().value;
    return this.advance(), new Nt(this.model, e, s);
  }
  plus() {
    return this.match(i.PLUS);
  }
  minus() {
    return this.match(i.MINUS);
  }
  sign() {
    let e = E.NONE;
    return this.plus() && (e = E.PLUS), this.minus() && (e = E.MINUS), e;
  }
  point() {
    let e = this.sign(), t = w.PIXEL, s = this.match(i.LEFT_BRACKET), n = !1;
    !s && this.match(i.LEFT_SQUARE_BRACKET) && (n = !0, t = w.CELL);
    const h = s || n;
    let l = this.number();
    !h && e !== E.NONE && (l = -l, e = E.NONE);
    let a = this.advance();
    if (a.type != i.COMMA)
      throw new Error(`Expected comma at position: ${a.position} got token ${a} instead`);
    let c = this.number();
    if (s && !this.match(i.RIGHT_BRACKET))
      throw new Error(`Expected right bracket at position: ${a.position} got token ${a} instead`);
    if (n && !this.match(i.RIGHT_SQUARE_BRACKET))
      throw new Error(`Expected right square bracket at position: ${a.position} got token ${a} instead`);
    return new d(l, c, e, t);
  }
  match(e) {
    return this.eof() || this.peek().type != e ? !1 : (this.position++, !0);
  }
}
const v = class v extends HTMLElement {
  constructor() {
    super(...arguments);
    o(this, "dotAndBox");
    o(this, "_code", "");
    o(this, "color", "white");
    o(this, "debug", !1);
    o(this, "grid", !1);
    o(this, "border", "1px solid #ccc");
    o(this, "defaultWidth", 100);
    o(this, "defaultHeight", 100);
    o(this, "showControls", !1);
    o(this, "extendedMenu", !1);
    o(this, "experimental", !1);
    o(this, "autoplay", !1);
    o(this, "canvas");
    o(this, "keyboard", !1);
    o(this, "_initialized", !1);
    o(this, "_wrapper", null);
    o(this, "keyboardHandlerLambda", (t) => this.handleKeyDown(t));
  }
  get initialized() {
    return this._initialized;
  }
  get code() {
    return this._code;
  }
  set code(t) {
    this._code = t, this.reset();
  }
  reset() {
    this._code && this.dotAndBox && (this.updateCanvasStyle(this.canvas), this.applyCode(), this.dotAndBox.showDebug = this.debug, this.dotAndBox.showGrid = this.grid, this.dotAndBox.updatePositionAndSize(), this.dotAndBox.draw(0));
  }
  applyCode() {
    const t = new H().parse(this._code);
    t.onBeforeStepForwardCallback = (s) => this.dispatchOnBeforeStepForward(s), t.onBeforeStepBackwardCallback = (s) => this.dispatchOnBeforeStepBackward(s), t.updateSubtitleCallback = (s) => this.updateSubtitle(s), this.updateTitle(t.title), this.dotAndBox.apply(t);
  }
  connectedCallback() {
    const t = this.attachShadow({ mode: "open" });
    t.innerHTML = `
      <style>
      :host { display: block; padding: 0;border: ${this.border};}
      
      #title-wrapper {
        margin-top: 5px;
        margin-left: 5px;
        margin-right: 5px;
        position: absolute;  
        color: rgba(55,55,55);      
      }
      
      #title {
        font-size: 20px;
        font-weight: bold;
        font-family: Verdana, Geneva, sans-serif
      }
      
      #subtitle {     
        font-size: 18px;      
        font-family: Verdana, Geneva, sans-serif;
      }    
      
      #controls-menu {    
        position: relative;   
        height: 50px;
        left: 0;       
        top: -54px;
        overflow: hidden;
        background-color: transparent;
        display: ${this.showControls ? "flex" : "none"};
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }               
      
      #controls-menu-extended {    
        position: relative;   
        height: 50px;
        left: 0;
        padding-left: 10px;
        padding-right: 10px;
        top: -154px;
        overflow: hidden;
        background-color: transparent;          
        display: none;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }
            
      #controls-menu button, #controls-menu-extended  button {
        color:  rgba(23,23,23,0.7);
        background-color: white;
        font-size: 22px;                 
        width: 36px;
        height: 36px;
        margin-left: 3px;
        margin-right: 3px;
        padding: 0;
        border-radius: 50%;
        border: solid 1px gray;
      }
            
      #controls-menu button:hover  {
        color:  #2d2828;      
        border: solid 1px #2d2828;
      }
      
      .button-icon {
        fill: rgba(23,23,23,0.7);       
      }
      
      button:hover .button-icon {
        fill: black;
        stroke: black;
      }
      
      </style>
      <div id="wrapper">
       <div id="title-wrapper">
         <div id="title"></div>
         <div id="subtitle"></div>
       </div>              
       <canvas id="canvas"></canvas>         
       <div id="controls-menu"></div>
       <div id="controls-menu-extended"></div>
      </div>
    `, this.buildControls(t), this.canvas = this.getCanvas(t), this.dotAndBox = new Ot(this.canvas), this.reset(), this._initialized = !0, this._wrapper = this.shadowRoot.getElementById("wrapper"), this._wrapper.dispatchEvent(new CustomEvent(Tt, {
      bubbles: !0,
      cancelable: !1,
      composed: !0
    })), this.autoplay && this.fastForward(), this.onpointerdown = (s) => {
      s.stopPropagation();
      const n = this.getBoundingClientRect();
      this.dotAndBox.rect = new d(n.x, n.y);
    }, this.code || (this.code = "title: ''");
  }
  getCanvas(t) {
    return t.getElementById("canvas");
  }
  updateCanvasStyle(t) {
    t.width = this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth, t.height = this.offsetHeight ? this.offsetHeight - 2 : this.defaultHeight, t.style.background = this.color, t.style.padding = "0", t.style.margin = "0", t.style.overflow = "hidden", t.style.userSelect = "none";
  }
  updateTitle(t) {
    const s = this.shadowRoot.getElementById("title");
    s.style.width = `${this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth}px`, s.innerText = t;
  }
  updateSubtitle(t) {
    const s = this.shadowRoot.getElementById("subtitle");
    s.style.width = `${this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth}px`, s.innerText = t;
  }
  updateControls() {
    const t = this.shadowRoot.getElementById("controls-menu");
    t.style.display = this.showControls ? "flex" : "none";
    const s = this.shadowRoot.getElementById(q);
    s.style.display = this.experimental ? "flex" : "none";
  }
  dispatchOnBeforeStepForward(t) {
    const s = new CustomEvent(v.ON_BEFORE_STEP_FORWARD, {
      bubbles: !0,
      composed: !0,
      detail: { step: t }
    });
    this._wrapper.dispatchEvent(s);
  }
  dispatchOnBeforeStepBackward(t) {
    const s = new CustomEvent(v.ON_BEFORE_STEP_BACKWARD, {
      bubbles: !0,
      composed: !0,
      detail: { step: t }
    });
    this._wrapper.dispatchEvent(s);
  }
  buildControls(t) {
    const s = t.getElementById("controls-menu"), n = t.getElementById("controls-menu-extended"), h = document.createElement("button");
    h.onclick = (S) => this.backward(), h.innerHTML = ` 
          <svg class="button-icon" viewBox="0 0 36 36">
            <path d="M 9 17 L 24 10 L 24 24 Z"/>           
        </svg>
             `, s.append(h);
    const l = document.createElement("button");
    l.onclick = (S) => this.dotAndBox.togglePause(), l.innerHTML = ` 
         <svg class="button-icon" viewBox="0 0 36 36">
          <rect x="11" y="11" width="14" height="14" />
         </svg>`, s.append(l);
    const a = document.createElement("button");
    a.onclick = (S) => this.forward(), a.innerHTML = ` 
        <svg class="button-icon" viewBox="0 0 36 36">       
           <path d="M 12 10 L 27 17 L 12 24 Z"/>           
        </svg>`, s.append(a);
    const c = document.createElement("button");
    c.onclick = (S) => this.reset(), c.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
           <path d="M 22 11 L 22 17" stroke-width="2" stroke-linecap="round"/>        
           <path d="M 22 11 L 27 11" stroke-width="2" stroke-linecap="round"/>                   
           <path d="M 23 12 A 8 8 0 1 1 13 12" stroke-width="2" fill="transparent" />
        </svg>`, s.append(c);
    const f = document.createElement("button");
    f.onclick = (S) => this.toggleExtendedMenu(), f.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
           <circle cx="10" cy="18" r="1"  />
           <circle cx="18" cy="18" r="1"  />
           <circle cx="26" cy="18" r="1"  />
        </svg>`, s.append(f);
    const u = document.createElement("input");
    u.id = "progress-range", u.type = "range", u.min = "0", u.max = "1", u.step = "0.01", u.value = "0", u.style.height = "100%", u.style.width = "100%", u.oninput = (S) => {
      this.dotAndBox.requestedStepProgress = parseFloat(S.target.value);
    }, n.append(u);
    const p = document.createElement("div");
    p.id = q, p.style.display = this.experimental ? "flex" : "none";
    const x = document.createElement("button");
    x.onclick = (S) => this.dotAndBox.selectTool(st), x.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="8" stroke-width="2" fill="transparent"   />
        </svg>`, p.append(x);
    const b = document.createElement("button");
    b.onclick = (S) => this.dotAndBox.selectTool(et), b.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
            <rect x="11" y="11" width="14" height="14" stroke-width="2" fill="transparent" />
        </svg>`, p.append(b);
    const P = document.createElement("button");
    P.onclick = (S) => console.log(this.dotAndBox.model), P.append("ⅈ"), p.append(P), n.append(p);
  }
  toggleExtendedMenu() {
    this.extendedMenu ? this.hideExtendedMenu() : this.showExtendedMenu();
  }
  hideExtendedMenu() {
    if (this.extendedMenu) {
      const t = this.shadowRoot.getElementById("controls-menu-extended");
      this.extendedMenu = !1, t.style.display = "none";
    }
  }
  showExtendedMenu() {
    if (!this.extendedMenu) {
      const t = this.shadowRoot.getElementById("controls-menu-extended"), s = this.shadowRoot.getElementById("progress-range");
      s.value = `${this.dotAndBox.requestedStepProgress}`, this.extendedMenu = !0, t.style.display = "flex";
    }
  }
  updateKeyboardHandler() {
    this.keyboard ? document.addEventListener("keydown", this.keyboardHandlerLambda) : document.removeEventListener("keydown", this.keyboardHandlerLambda);
  }
  handleKeyDown(t) {
    t.key === "ArrowLeft" ? this.dotAndBox.backward() : t.key === "ArrowRight" ? this.dotAndBox.forward() : t.key === "Delete" && this.dotAndBox.deleteSelected();
  }
  forward() {
    this.hideExtendedMenu(), this.dotAndBox.forward();
  }
  fastForward() {
    this.dotAndBox.fastForward();
  }
  backward() {
    this.hideExtendedMenu(), this.dotAndBox.backward();
  }
  fastBackward() {
    this.dotAndBox.fastBackward();
  }
  resize() {
    this.canvas && (this.updateCanvasStyle(this.canvas), this.dotAndBox.updatePositionAndSize());
  }
  attributeChangedCallback(t, s, n) {
    switch (t) {
      case ot:
        this.resize();
        break;
      case ht:
        this._code = n.trim(), this.dotAndBox && this.applyCode();
        break;
      case nt:
        this.color = n;
        break;
      case rt:
        this.border = n;
        break;
      case lt:
        this.showControls = n != null, this.dotAndBox && this.updateControls();
        break;
      case q:
        this.experimental = n != null, this.dotAndBox && this.updateControls();
        break;
      case ct:
        this.keyboard = n != null, this.updateKeyboardHandler();
        break;
      case dt:
        this.autoplay = n != null, this.dotAndBox && this.fastForward();
        break;
      case at:
        this.debug = n != null, this.dotAndBox && (this.dotAndBox.showDebug = this.debug);
        break;
      case ut:
        this.grid = n != null, this.dotAndBox && (this.dotAndBox.showGrid = this.grid);
        break;
      default:
        console.log(t, s, n);
    }
  }
};
o(v, "ELEM_NAME", "dot-and-box"), o(v, "ON_BEFORE_STEP_FORWARD", "on_before_step_forward"), o(v, "ON_BEFORE_STEP_BACKWARD", "on_before_step_backward"), o(v, "observedAttributes", [ot, nt, rt, ht, _t, Rt, at, q, lt, dt, ct, ut]);
let V = v;
customElements.define(V.ELEM_NAME, V);
