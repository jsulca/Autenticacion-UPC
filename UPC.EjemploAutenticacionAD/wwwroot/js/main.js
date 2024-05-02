function slideUpDown(t) {
    $(t).length > 0 && ($(t).hasClass("in") ? ($(t).removeClass("in"), $(t).slideUp()) : ($(t).addClass("in"), $(t).slideDown(), $(t).siblings(".in").slideUp(), $(t).siblings(".in").removeClass("in")))
}

function slideIcon(t) {
    $(t).length > 0 && ($(t).hasClass("in") ? $(t).removeClass("in") : ($(".acordion-icon.in").not(t).removeClass("in"), $(t).addClass("in")))
}

function tab(t, e) {
    $(t).length > 0 && (e = e || $('[data-href="' + t + '"]')[0], $(t).hasClass("in") || ($(t).addClass("in"), $(t).siblings(".in").removeClass("in"), $(e).parent().addClass("in"), $(e).parent().siblings(".in").removeClass("in")))
} ! function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof module && module.exports ? module.exports = t(require("jquery")) : t(jQuery)
}(function (t) {
    t.extend(t.fn, {
        validate: function (e) {
            if (!this.length) return void (e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
            var n = t.data(this[0], "validator");
            return n ? n : (this.attr("novalidate", "novalidate"), n = new t.validator(e, this[0]), t.data(this[0], "validator", n), n.settings.onsubmit && (this.on("click.validate", ":submit", function (e) {
                n.settings.submitHandler && (n.submitButton = e.target), t(this).hasClass("cancel") && (n.cancelSubmit = !0), void 0 !== t(this).attr("formnovalidate") && (n.cancelSubmit = !0)
            }), this.on("submit.validate", function (e) {
                function r() {
                    var r, i;
                    return !n.settings.submitHandler || (n.submitButton && (r = t("<input type='hidden'/>").attr("name", n.submitButton.name).val(t(n.submitButton).val()).appendTo(n.currentForm)), i = n.settings.submitHandler.call(n, n.currentForm, e), n.submitButton && r.remove(), void 0 !== i && i)
                }
                return n.settings.debug && e.preventDefault(), n.cancelSubmit ? (n.cancelSubmit = !1, r()) : n.form() ? n.pendingRequest ? (n.formSubmitted = !0, !1) : r() : (n.focusInvalid(), !1)
            })), n)
        },
        valid: function () {
            var e, n, r;
            return t(this[0]).is("form") ? e = this.validate().form() : (r = [], e = !0, n = t(this[0].form).validate(), this.each(function () {
                e = n.element(this) && e, e || (r = r.concat(n.errorList))
            }), n.errorList = r), e
        },
        rules: function (e, n) {
            if (this.length) {
                var r, i, s, a, o, l, u = this[0];
                if (e) switch (r = t.data(u.form, "validator").settings, i = r.rules, s = t.validator.staticRules(u), e) {
                    case "add":
                        t.extend(s, t.validator.normalizeRule(n)), delete s.messages, i[u.name] = s, n.messages && (r.messages[u.name] = t.extend(r.messages[u.name], n.messages));
                        break;
                    case "remove":
                        return n ? (l = {}, t.each(n.split(/\s/), function (e, n) {
                            l[n] = s[n], delete s[n], "required" === n && t(u).removeAttr("aria-required")
                        }), l) : (delete i[u.name], s)
                }
                return a = t.validator.normalizeRules(t.extend({}, t.validator.classRules(u), t.validator.attributeRules(u), t.validator.dataRules(u), t.validator.staticRules(u)), u), a.required && (o = a.required, delete a.required, a = t.extend({
                    required: o
                }, a), t(u).attr("aria-required", "true")), a.remote && (o = a.remote, delete a.remote, a = t.extend(a, {
                    remote: o
                })), a
            }
        }
    }), t.extend(t.expr[":"], {
        blank: function (e) {
            return !t.trim("" + t(e).val())
        },
        filled: function (e) {
            var n = t(e).val();
            return null !== n && !!t.trim("" + n)
        },
        unchecked: function (e) {
            return !t(e).prop("checked")
        }
    }), t.validator = function (e, n) {
        this.settings = t.extend(!0, {}, t.validator.defaults, e), this.currentForm = n, this.init()
    }, t.validator.format = function (e, n) {
        return 1 === arguments.length ? function () {
            var n = t.makeArray(arguments);
            return n.unshift(e), t.validator.format.apply(this, n)
        } : void 0 === n ? e : (arguments.length > 2 && n.constructor !== Array && (n = t.makeArray(arguments).slice(1)), n.constructor !== Array && (n = [n]), t.each(n, function (t, n) {
            e = e.replace(new RegExp("\\{" + t + "\\}", "g"), function () {
                return n
            })
        }), e)
    }, t.extend(t.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: t([]),
            errorLabelContainer: t([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function (t) {
                this.lastActive = t, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(t)))
            },
            onfocusout: function (t) {
                this.checkable(t) || !(t.name in this.submitted) && this.optional(t) || this.element(t)
            },
            onkeyup: function (e, n) {
                var r = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
                9 === n.which && "" === this.elementValue(e) || t.inArray(n.keyCode, r) !== -1 || (e.name in this.submitted || e.name in this.invalid) && this.element(e)
            },
            onclick: function (t) {
                t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode)
            },
            highlight: function (e, n, r) {
                "radio" === e.type ? this.findByName(e.name).addClass(n).removeClass(r) : t(e).addClass(n).removeClass(r)
            },
            unhighlight: function (e, n, r) {
                "radio" === e.type ? this.findByName(e.name).removeClass(n).addClass(r) : t(e).removeClass(n).addClass(r)
            }
        },
        setDefaults: function (e) {
            t.extend(t.validator.defaults, e)
        },
        messages: {
            required: "Este campo es obligatorio.",
            remote: "Por favor, llene este campo.",
            email: "Por favor, escriba un correo electrónico válido.",
            url: "Por favor, escriba una URL válida.",
            date: "Por favor, escriba una fecha válida.",
            dateISO: "Por favor, escriba una fecha (ISO) válida.",
            number: "Por favor, escriba un número válido.",
            digits: "Por favor, escriba sólo dígitos.",
            creditcard: "Por favor, escriba un número de tarjeta válido.",
            equalTo: "Por favor, escriba el mismo valor de nuevo.",
            extension: "Por favor, escriba un valor con una extensión permitida.",
            maxlength: t.validator.format("Por favor, no escriba más de {0} caracteres."),
            minlength: t.validator.format("Por favor, no escriba menos de {0} caracteres."),
            rangelength: t.validator.format("Por favor, escriba un valor entre {0} y {1} caracteres."),
            range: t.validator.format("Por favor, escriba un valor entre {0} y {1}."),
            max: t.validator.format("Por favor, escriba un valor entero menor o igual a {0}."),
            min: t.validator.format("Por favor, escriba un valor entero mayor o igual a {0}."),
            nifES: "Por favor, escriba un NIF válido.",
            nieES: "Por favor, escriba un NIE válido.",
            cifES: "Por favor, escriba un CIF válido.",
            step: t.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function () {
                function e(e) {
                    var n = t.data(this.form, "validator"),
                        r = "on" + e.type.replace(/^validate/, ""),
                        i = n.settings;
                    i[r] && !t(this).is(i.ignore) && i[r].call(n, this, e)
                }
                this.labelContainer = t(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || t(this.currentForm), this.containers = t(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                var n, r = this.groups = {};
                t.each(this.settings.groups, function (e, n) {
                    "string" == typeof n && (n = n.split(/\s/)), t.each(n, function (t, n) {
                        r[n] = e
                    })
                }), n = this.settings.rules, t.each(n, function (e, r) {
                    n[e] = t.validator.normalizeRule(r)
                }), t(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable]", e).on("click.validate", "select, option, [type='radio'], [type='checkbox']", e), this.settings.invalidHandler && t(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler), t(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
            },
            form: function () {
                return this.checkForm(), t.extend(this.submitted, this.errorMap), this.invalid = t.extend({}, this.errorMap), this.valid() || t(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
            },
            checkForm: function () {
                this.prepareForm();
                for (var t = 0, e = this.currentElements = this.elements() ; e[t]; t++) this.check(e[t]);
                return this.valid()
            },
            element: function (e) {
                var n, r, i = this.clean(e),
                    s = this.validationTargetFor(i),
                    a = this,
                    o = !0;
                return void 0 === s ? delete this.invalid[i.name] : (this.prepareElement(s), this.currentElements = t(s), r = this.groups[s.name], r && t.each(this.groups, function (t, e) {
                    e === r && t !== s.name && (i = a.validationTargetFor(a.clean(a.findByName(t))), i && i.name in a.invalid && (a.currentElements.push(i), o = o && a.check(i)))
                }), n = this.check(s) !== !1, o = o && n, n ? this.invalid[s.name] = !1 : this.invalid[s.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), t(e).attr("aria-invalid", !n)), o
            },
            showErrors: function (e) {
                if (e) {
                    var n = this;
                    t.extend(this.errorMap, e), this.errorList = t.map(this.errorMap, function (t, e) {
                        return {
                            message: t,
                            element: n.findByName(e)[0]
                        }
                    }), this.successList = t.grep(this.successList, function (t) {
                        return !(t.name in e)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function () {
                t.fn.resetForm && t(this.currentForm).resetForm(), this.invalid = {}, this.submitted = {}, this.prepareForm(), this.hideErrors();
                var e = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                this.resetElements(e)
            },
            resetElements: function (t) {
                var e;
                if (this.settings.unhighlight)
                    for (e = 0; t[e]; e++) this.settings.unhighlight.call(this, t[e], this.settings.errorClass, ""), this.findByName(t[e].name).removeClass(this.settings.validClass);
                else t.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
            },
            numberOfInvalids: function () {
                return this.objectLength(this.invalid)
            },
            objectLength: function (t) {
                var e, n = 0;
                for (e in t) t[e] && n++;
                return n
            },
            hideErrors: function () {
                this.hideThese(this.toHide)
            },
            hideThese: function (t) {
                t.not(this.containers).text(""), this.addWrapper(t).hide()
            },
            valid: function () {
                return 0 === this.size()
            },
            size: function () {
                return this.errorList.length
            },
            focusInvalid: function () {
                if (this.settings.focusInvalid) try {
                    t(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                } catch (e) { }
            },
            findLastActive: function () {
                var e = this.lastActive;
                return e && 1 === t.grep(this.errorList, function (t) {
                    return t.element.name === e.name
                }).length && e
            },
            elements: function () {
                var e = this,
                    n = {};
                return t(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
                    var r = this.name || t(this).attr("name");
                    return !r && e.settings.debug && window.console && console.error("%o has no name assigned", this), this.hasAttribute("contenteditable") && (this.form = t(this).closest("form")[0]), !(r in n || !e.objectLength(t(this).rules())) && (n[r] = !0, !0)
                })
            },
            clean: function (e) {
                return t(e)[0]
            },
            errors: function () {
                var e = this.settings.errorClass.split(" ").join(".");
                return t(this.settings.errorElement + "." + e, this.errorContext)
            },
            resetInternals: function () {
                this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = t([]), this.toHide = t([])
            },
            reset: function () {
                this.resetInternals(), this.currentElements = t([])
            },
            prepareForm: function () {
                this.reset(), this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function (t) {
                this.reset(), this.toHide = this.errorsFor(t)
            },
            elementValue: function (e) {
                var n, r, i = t(e),
                    s = e.type;
                return "radio" === s || "checkbox" === s ? this.findByName(e.name).filter(":checked").val() : "number" === s && "undefined" != typeof e.validity ? e.validity.badInput ? "NaN" : i.val() : (n = e.hasAttribute("contenteditable") ? i.text() : i.val(), "file" === s ? "C:\\fakepath\\" === n.substr(0, 12) ? n.substr(12) : (r = n.lastIndexOf("/"), r >= 0 ? n.substr(r + 1) : (r = n.lastIndexOf("\\"), r >= 0 ? n.substr(r + 1) : n)) : "string" == typeof n ? n.replace(/\r/g, "") : n)
            },
            check: function (e) {
                e = this.validationTargetFor(this.clean(e));
                var n, r, i, s = t(e).rules(),
                    a = t.map(s, function (t, e) {
                        return e
                    }).length,
                    o = !1,
                    l = this.elementValue(e);
                if ("function" == typeof s.normalizer) {
                    if (l = s.normalizer.call(e, l), "string" != typeof l) throw new TypeError("The normalizer should return a string value.");
                    delete s.normalizer
                }
                for (r in s) {
                    i = {
                        method: r,
                        parameters: s[r]
                    };
                    try {
                        if (n = t.validator.methods[r].call(this, l, e, i.parameters), "dependency-mismatch" === n && 1 === a) {
                            o = !0;
                            continue
                        }
                        if (o = !1, "pending" === n) return void (this.toHide = this.toHide.not(this.errorsFor(e)));
                        if (!n) return this.formatAndAdd(e, i), !1
                    } catch (u) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + i.method + "' method.", u), u instanceof TypeError && (u.message += ".  Exception occurred when checking element " + e.id + ", check the '" + i.method + "' method."), u
                    }
                }
                if (!o) return this.objectLength(s) && this.successList.push(e), !0
            },
            customDataMessage: function (e, n) {
                return t(e).data("msg" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()) || t(e).data("msg")
            },
            customMessage: function (t, e) {
                var n = this.settings.messages[t];
                return n && (n.constructor === String ? n : n[e])
            },
            findDefined: function () {
                for (var t = 0; t < arguments.length; t++)
                    if (void 0 !== arguments[t]) return arguments[t]
            },
            defaultMessage: function (e, n) {
                var r = this.findDefined(this.customMessage(e.name, n.method), this.customDataMessage(e, n.method), !this.settings.ignoreTitle && e.title || void 0, t.validator.messages[n.method], "<strong>Warning: No message defined for " + e.name + "</strong>"),
                    i = /\$?\{(\d+)\}/g;
                return "function" == typeof r ? r = r.call(this, n.parameters, e) : i.test(r) && (r = t.validator.format(r.replace(i, "{$1}"), n.parameters)), r
            },
            formatAndAdd: function (t, e) {
                var n = this.defaultMessage(t, e);
                this.errorList.push({
                    message: n,
                    element: t,
                    method: e.method
                }), this.errorMap[t.name] = n, this.submitted[t.name] = n
            },
            addWrapper: function (t) {
                return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))), t
            },
            defaultShowErrors: function () {
                var t, e, n;
                for (t = 0; this.errorList[t]; t++) n = this.errorList[t], this.settings.highlight && this.settings.highlight.call(this, n.element, this.settings.errorClass, this.settings.validClass), this.showLabel(n.element, n.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
                    for (t = 0; this.successList[t]; t++) this.showLabel(this.successList[t]);
                if (this.settings.unhighlight)
                    for (t = 0, e = this.validElements() ; e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
            },
            validElements: function () {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function () {
                return t(this.errorList).map(function () {
                    return this.element
                })
            },
            showLabel: function (e, n) {
                var r, i, s, a, o = this.errorsFor(e),
                    l = this.idOrName(e),
                    u = t(e).attr("aria-describedby");
                o.length ? (o.removeClass(this.settings.validClass).addClass(this.settings.errorClass), o.html(n)) : (o = t("<" + this.settings.errorElement + ">").attr("id", l + "-error").addClass(this.settings.errorClass).html(n || ""), r = o, this.settings.wrapper && (r = o.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(r) : this.settings.errorPlacement ? this.settings.errorPlacement(r, t(e)) : r.insertAfter(e), o.is("label") ? o.attr("for", l) : 0 === o.parents("label[for='" + this.escapeCssMeta(l) + "']").length && (s = o.attr("id"), u ? u.match(new RegExp("\\b" + this.escapeCssMeta(s) + "\\b")) || (u += " " + s) : u = s, t(e).attr("aria-describedby", u), i = this.groups[e.name], i && (a = this, t.each(a.groups, function (e, n) {
                    n === i && t("[name='" + a.escapeCssMeta(e) + "']", a.currentForm).attr("aria-describedby", o.attr("id"))
                })))), !n && this.settings.success && (o.text(""), "string" == typeof this.settings.success ? o.addClass(this.settings.success) : this.settings.success(o, e)), this.toShow = this.toShow.add(o)
            },
            errorsFor: function (e) {
                var n = this.escapeCssMeta(this.idOrName(e)),
                    r = t(e).attr("aria-describedby"),
                    i = "label[for='" + n + "'], label[for='" + n + "'] *";
                return r && (i = i + ", #" + this.escapeCssMeta(r).replace(/\s+/g, ", #")), this.errors().filter(i)
            },
            escapeCssMeta: function (t) {
                return t.replace(/([\\!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~])/g, "\\$1")
            },
            idOrName: function (t) {
                return this.groups[t.name] || (this.checkable(t) ? t.name : t.id || t.name)
            },
            validationTargetFor: function (e) {
                return this.checkable(e) && (e = this.findByName(e.name)), t(e).not(this.settings.ignore)[0]
            },
            checkable: function (t) {
                return /radio|checkbox/i.test(t.type)
            },
            findByName: function (e) {
                return t(this.currentForm).find("[name='" + this.escapeCssMeta(e) + "']")
            },
            getLength: function (e, n) {
                switch (n.nodeName.toLowerCase()) {
                    case "select":
                        return t("option:selected", n).length;
                    case "input":
                        if (this.checkable(n)) return this.findByName(n.name).filter(":checked").length
                }
                return e.length
            },
            depend: function (t, e) {
                return !this.dependTypes[typeof t] || this.dependTypes[typeof t](t, e)
            },
            dependTypes: {
                "boolean": function (t) {
                    return t
                },
                string: function (e, n) {
                    return !!t(e, n.form).length
                },
                "function": function (t, e) {
                    return t(e)
                }
            },
            optional: function (e) {
                var n = this.elementValue(e);
                return !t.validator.methods.required.call(this, n, e) && "dependency-mismatch"
            },
            startRequest: function (e) {
                this.pending[e.name] || (this.pendingRequest++, t(e).addClass(this.settings.pendingClass), this.pending[e.name] = !0)
            },
            stopRequest: function (e, n) {
                this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[e.name], t(e).removeClass(this.settings.pendingClass), n && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (t(this.currentForm).submit(), this.formSubmitted = !1) : !n && 0 === this.pendingRequest && this.formSubmitted && (t(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
            },
            previousValue: function (e, n) {
                return t.data(e, "previousValue") || t.data(e, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(e, {
                        method: n
                    })
                })
            },
            destroy: function () {
                this.resetForm(), t(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function (e, n) {
            e.constructor === String ? this.classRuleSettings[e] = n : t.extend(this.classRuleSettings, e)
        },
        classRules: function (e) {
            var n = {},
                r = t(e).attr("class");
            return r && t.each(r.split(" "), function () {
                this in t.validator.classRuleSettings && t.extend(n, t.validator.classRuleSettings[this])
            }), n
        },
        normalizeAttributeRule: function (t, e, n, r) {
            /min|max|step/.test(n) && (null === e || /number|range|text/.test(e)) && (r = Number(r), isNaN(r) && (r = void 0)), r || 0 === r ? t[n] = r : e === n && "range" !== e && (t[n] = !0)
        },
        attributeRules: function (e) {
            var n, r, i = {},
                s = t(e),
                a = e.getAttribute("type");
            for (n in t.validator.methods) "required" === n ? (r = e.getAttribute(n), "" === r && (r = !0), r = !!r) : r = s.attr(n), this.normalizeAttributeRule(i, a, n, r);
            return i.maxlength && /-1|2147483647|524288/.test(i.maxlength) && delete i.maxlength, i
        },
        dataRules: function (e) {
            var n, r, i = {},
                s = t(e),
                a = e.getAttribute("type");
            for (n in t.validator.methods) r = s.data("rule" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()), this.normalizeAttributeRule(i, a, n, r);
            return i
        },
        staticRules: function (e) {
            var n = {},
                r = t.data(e.form, "validator");
            return r.settings.rules && (n = t.validator.normalizeRule(r.settings.rules[e.name]) || {}), n
        },
        normalizeRules: function (e, n) {
            return t.each(e, function (r, i) {
                if (i === !1) return void delete e[r];
                if (i.param || i.depends) {
                    var s = !0;
                    switch (typeof i.depends) {
                        case "string":
                            s = !!t(i.depends, n.form).length;
                            break;
                        case "function":
                            s = i.depends.call(n, n)
                    }
                    s ? e[r] = void 0 === i.param || i.param : (t.data(n.form, "validator").resetElements(t(n)), delete e[r])
                }
            }), t.each(e, function (r, i) {
                e[r] = t.isFunction(i) && "normalizer" !== r ? i(n) : i
            }), t.each(["minlength", "maxlength"], function () {
                e[this] && (e[this] = Number(e[this]))
            }), t.each(["rangelength", "range"], function () {
                var n;
                e[this] && (t.isArray(e[this]) ? e[this] = [Number(e[this][0]), Number(e[this][1])] : "string" == typeof e[this] && (n = e[this].replace(/[\[\]]/g, "").split(/[\s,]+/), e[this] = [Number(n[0]), Number(n[1])]))
            }), t.validator.autoCreateRanges && (null != e.min && null != e.max && (e.range = [e.min, e.max], delete e.min, delete e.max), null != e.minlength && null != e.maxlength && (e.rangelength = [e.minlength, e.maxlength], delete e.minlength, delete e.maxlength)), e
        },
        normalizeRule: function (e) {
            if ("string" == typeof e) {
                var n = {};
                t.each(e.split(/\s/), function () {
                    n[this] = !0
                }), e = n
            }
            return e
        },
        addMethod: function (e, n, r) {
            t.validator.methods[e] = n, t.validator.messages[e] = void 0 !== r ? r : t.validator.messages[e], n.length < 3 && t.validator.addClassRules(e, t.validator.normalizeRule(e))
        },
        methods: {
            required: function (e, n, r) {
                if (!this.depend(r, n)) return "dependency-mismatch";
                if ("select" === n.nodeName.toLowerCase()) {
                    var i = t(n).val();
                    return i && i.length > 0
                }
                return this.checkable(n) ? this.getLength(e, n) > 0 : e.length > 0
            },
            email: function (t, e) {
                return this.optional(e) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t)
            },
            url: function (t, e) {
                return this.optional(e) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(t)
            },
            date: function (t, e) {
                return this.optional(e) || !/Invalid|NaN/.test(new Date(t).toString())
            },
            dateISO: function (t, e) {
                return this.optional(e) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(t)
            },
            number: function (t, e) {
                return this.optional(e) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
            },
            digits: function (t, e) {
                return this.optional(e) || /^\d+$/.test(t)
            },
            minlength: function (e, n, r) {
                var i = t.isArray(e) ? e.length : this.getLength(e, n);
                return this.optional(n) || i >= r
            },
            maxlength: function (e, n, r) {
                var i = t.isArray(e) ? e.length : this.getLength(e, n);
                return this.optional(n) || i <= r
            },
            rangelength: function (e, n, r) {
                var i = t.isArray(e) ? e.length : this.getLength(e, n);
                return this.optional(n) || i >= r[0] && i <= r[1]
            },
            min: function (t, e, n) {
                return this.optional(e) || t >= n
            },
            max: function (t, e, n) {
                return this.optional(e) || t <= n
            },
            range: function (t, e, n) {
                return this.optional(e) || t >= n[0] && t <= n[1]
            },
            step: function (e, n, r) {
                var i = t(n).attr("type"),
                    s = "Step attribute on input type " + i + " is not supported.",
                    a = ["text", "number", "range"],
                    o = new RegExp("\\b" + i + "\\b"),
                    l = i && !o.test(a.join());
                if (l) throw new Error(s);
                return this.optional(n) || e % r === 0
            },
            equalTo: function (e, n, r) {
                var i = t(r);
                return this.settings.onfocusout && i.not(".validate-equalTo-blur").length && i.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                    t(n).valid()
                }), e === i.val()
            },
            remote: function (e, n, r, i) {
                if (this.optional(n)) return "dependency-mismatch";
                i = "string" == typeof i && i || "remote";
                var s, a, o, l = this.previousValue(n, i);
                return this.settings.messages[n.name] || (this.settings.messages[n.name] = {}), l.originalMessage = l.originalMessage || this.settings.messages[n.name][i], this.settings.messages[n.name][i] = l.message, r = "string" == typeof r && {
                    url: r
                } || r, o = t.param(t.extend({
                    data: e
                }, r.data)), l.old === o ? l.valid : (l.old = o, s = this, this.startRequest(n), a = {}, a[n.name] = e, t.ajax(t.extend(!0, {
                    mode: "abort",
                    port: "validate" + n.name,
                    dataType: "json",
                    data: a,
                    context: s.currentForm,
                    success: function (t) {
                        var r, a, o, u = t === !0 || "true" === t;
                        s.settings.messages[n.name][i] = l.originalMessage, u ? (o = s.formSubmitted, s.resetInternals(), s.toHide = s.errorsFor(n), s.formSubmitted = o, s.successList.push(n), s.invalid[n.name] = !1, s.showErrors()) : (r = {}, a = t || s.defaultMessage(n, {
                            method: i,
                            parameters: e
                        }), r[n.name] = l.message = a, s.invalid[n.name] = !0, s.showErrors(r)), l.valid = u, s.stopRequest(n, u)
                    }
                }, r)), "pending")
            }
        }
    });
    var e, n = {};
    t.ajaxPrefilter ? t.ajaxPrefilter(function (t, e, r) {
        var i = t.port;
        "abort" === t.mode && (n[i] && n[i].abort(), n[i] = r)
    }) : (e = t.ajax, t.ajax = function (r) {
        var i = ("mode" in r ? r : t.ajaxSettings).mode,
            s = ("port" in r ? r : t.ajaxSettings).port;
        return "abort" === i ? (n[s] && n[s].abort(), n[s] = e.apply(this, arguments), n[s]) : e.apply(this, arguments)
    })
}),
function () {
    var t, e, n, r, i, s, a, o, l, u, d, h, c, f, p, g, m, v, b, y, w, C, x, k, S, $, q, L, R, E, A, T, F, P, N, M, j, z, I, O, D, H, U, B, _, V, W, Z, X, G = [].slice,
        Q = {}.hasOwnProperty,
        J = function (t, e) {
            function n() {
                this.constructor = t
            }
            for (var r in e) Q.call(e, r) && (t[r] = e[r]);
            return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
        },
        K = [].indexOf || function (t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
    for (w = {
        catchupTime: 100,
        initialRate: .03,
        minTime: 250,
        ghostTime: 100,
        maxProgressPerFrame: 20,
        easeFactor: 1.25,
        startOnPageLoad: !0,
        restartOnPushState: !0,
        restartOnRequestAfter: 500,
        target: "body",
        elements: {
        checkInterval: 100,
        selectors: ["body"]
    },
        eventLag: {
        minSamples: 10,
        sampleCount: 3,
        lagThreshold: 3
    },
        ajax: {
        trackMethods: ["GET"],
        trackWebSockets: !0,
        ignoreURLs: []
    }
    }, R = function () {
            var t;
            return null != (t = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance.now() : void 0) ? t : +new Date
    }, A = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, y = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == A && (A = function (t) {
            return setTimeout(t, 50)
    }, y = function (t) {
            return clearTimeout(t)
    }), F = function (t) {
            var e, n;
            return e = R(), (n = function () {
                var r;
                return r = R() - e, r >= 33 ? (e = R(), t(r, function () {
                    return A(n)
    })) : setTimeout(n, 33 - r)
    })()
    }, T = function () {
            var t, e, n;
            return n = arguments[0], e = arguments[1], t = 3 <= arguments.length ? G.call(arguments, 2) : [], "function" == typeof n[e] ? n[e].apply(n, t) : n[e]
    }, C = function () {
            var t, e, n, r, i, s, a;
            for (e = arguments[0], r = 2 <= arguments.length ? G.call(arguments, 1) : [], s = 0, a = r.length; a > s; s++)
                if (n = r[s])
                    for (t in n) Q.call(n, t) && (i = n[t], null != e[t] && "object" == typeof e[t] && null != i && "object" == typeof i ? C(e[t], i) : e[t] = i);
            return e
    }, m = function (t) {
            var e, n, r, i, s;
            for (n = e = 0, i = 0, s = t.length; s > i; i++) r = t[i], n += Math.abs(r), e++;
            return n / e
    }, k = function (t, e) {
            var n, r, i;
            if (null == t && (t = "options"), null == e && (e = !0), i = document.querySelector("[data-pace-" + t + "]")) {
                if (n = i.getAttribute("data-pace-" + t), !e) return n;
                try {
                    return JSON.parse(n)
    } catch (s) {
                    return r = s, "undefined" != typeof console && null !== console ? console.error("Error parsing inline pace options", r) : void 0
    }
    }
    }, a = function () {
            function t() { }
            return t.prototype.on = function (t, e, n, r) {
                var i;
                return null == r && (r = !1), null == this.bindings && (this.bindings = {}), null == (i = this.bindings)[t] && (i[t] = []), this.bindings[t].push({
        handler: e,
        ctx: n,
        once: r
    })
    }, t.prototype.once = function (t, e, n) {
                return this.on(t, e, n, !0)
    }, t.prototype.off = function (t, e) {
                var n, r, i;
                if (null != (null != (r = this.bindings) ? r[t] : void 0)) {
                    if (null == e) return delete this.bindings[t];
                    for (n = 0, i = []; n < this.bindings[t].length;) i.push(this.bindings[t][n].handler === e ? this.bindings[t].splice(n, 1) : n++);
                    return i
    }
    }, t.prototype.trigger = function () {
                var t, e, n, r, i, s, a, o, l;
                if (n = arguments[0], t = 2 <= arguments.length ? G.call(arguments, 1) : [], null != (a = this.bindings) ? a[n] : void 0) {
                    for (i = 0, l = []; i < this.bindings[n].length;) o = this.bindings[n][i], r = o.handler, e = o.ctx, s = o.once, r.apply(null != e ? e : this, t), l.push(s ? this.bindings[n].splice(i, 1) : i++);
                    return l
    }
    }, t
    }(), u = window.Pace || {}, window.Pace = u, C(u, a.prototype), E = u.options = C({}, w, window.paceOptions, k()), W = ["ajax", "document", "eventLag", "elements"], U = 0, _ = W.length; _ > U; U++) j = W[U], E[j] === !0 && (E[j] = w[j]);
    l = function (t) {
        function e() {
            return Z = e.__super__.constructor.apply(this, arguments)
        }
        return J(e, t), e
    }(Error), e = function () {
        function t() {
            this.progress = 0
        }
        return t.prototype.getElement = function () {
            var t;
            if (null == this.el) {
                if (t = document.querySelector(E.target), !t) throw new l;
                this.el = document.createElement("div"), this.el.className = "pace pace-active", document.body.className = document.body.className.replace(/pace-done/g, ""), document.body.className += " pace-running", this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != t.firstChild ? t.insertBefore(this.el, t.firstChild) : t.appendChild(this.el)
            }
            return this.el
        }, t.prototype.finish = function () {
            var t;
            return t = this.getElement(), t.className = t.className.replace("pace-active", ""), t.className += " pace-inactive", document.body.className = document.body.className.replace("pace-running", ""), document.body.className += " pace-done"
        }, t.prototype.update = function (t) {
            return this.progress = t, this.render()
        }, t.prototype.destroy = function () {
            try {
                this.getElement().parentNode.removeChild(this.getElement())
            } catch (t) {
                l = t
            }
            return this.el = void 0
        }, t.prototype.render = function () {
            var t, e, n, r, i, s, a;
            if (null == document.querySelector(E.target)) return !1;
            for (t = this.getElement(), r = "translate3d(" + this.progress + "%, 0, 0)", a = ["webkitTransform", "msTransform", "transform"], i = 0, s = a.length; s > i; i++) e = a[i], t.children[0].style[e] = r;
            return (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (t.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"), this.progress >= 98 ? n = "98" : (n = this.progress < 10 ? "0" : "", n += 0 | this.progress), t.children[0].setAttribute("data-progress", "" + n)), this.lastRenderedProgress = this.progress
        }, t.prototype.done = function () {
            return this.progress >= 98
        }, t
    }(), o = function () {
        function t() {
            this.bindings = {}
        }
        return t.prototype.trigger = function (t, e) {
            var n, r, i, s, a;
            if (null != this.bindings[t]) {
                for (s = this.bindings[t], a = [], r = 0, i = s.length; i > r; r++) n = s[r], a.push(n.call(this, e));
                return a
            }
        }, t.prototype.on = function (t, e) {
            var n;
            return null == (n = this.bindings)[t] && (n[t] = []), this.bindings[t].push(e)
        }, t
    }(), H = window.XMLHttpRequest, D = window.XDomainRequest, O = window.WebSocket, x = function (t, e) {
        var n, r, i, s;
        s = [];
        for (r in e.prototype) try {
            i = e.prototype[r], s.push(null == t[r] && "function" != typeof i ? t[r] = i : void 0)
        } catch (a) {
            n = a
        }
        return s
    }, q = [], u.ignore = function () {
        var t, e, n;
        return e = arguments[0], t = 2 <= arguments.length ? G.call(arguments, 1) : [], q.unshift("ignore"), n = e.apply(null, t), q.shift(), n
    }, u.track = function () {
        var t, e, n;
        return e = arguments[0], t = 2 <= arguments.length ? G.call(arguments, 1) : [], q.unshift("track"), n = e.apply(null, t), q.shift(), n
    }, M = function (t) {
        var e;
        if (null == t && (t = "GET"), "track" === q[0]) return "force";
        if (!q.length && E.ajax) {
            if ("socket" === t && E.ajax.trackWebSockets) return !0;
            if (e = t.toUpperCase(), K.call(E.ajax.trackMethods, e) >= 0) return !0
        }
        return !1
    }, d = function (t) {
        function e() {
            var t, n = this;
            e.__super__.constructor.apply(this, arguments), t = function (t) {
                var e;
                return e = t.open, t.open = function (r, i) {
                    return M(r) && n.trigger("request", {
                        type: r,
                        url: i,
                        request: t
                    }), e.apply(t, arguments)
                }
            }, window.XMLHttpRequest = function (e) {
                var n;
                return n = new H(e), t(n), n
            };
            try {
                x(window.XMLHttpRequest, H)
            } catch (r) { }
            if (null != D) {
                window.XDomainRequest = function () {
                    var e;
                    return e = new D, t(e), e
                };
                try {
                    x(window.XDomainRequest, D)
                } catch (r) { }
            }
            if (null != O && E.ajax.trackWebSockets) {
                window.WebSocket = function (t, e) {
                    var r;
                    return r = null != e ? new O(t, e) : new O(t), M("socket") && n.trigger("request", {
                        type: "socket",
                        url: t,
                        protocols: e,
                        request: r
                    }), r
                };
                try {
                    x(window.WebSocket, O)
                } catch (r) { }
            }
        }
        return J(e, t), e
    }(o), B = null, S = function () {
        return null == B && (B = new d), B
    }, N = function (t) {
        var e, n, r, i;
        for (i = E.ajax.ignoreURLs, n = 0, r = i.length; r > n; n++)
            if (e = i[n], "string" == typeof e) {
                if (-1 !== t.indexOf(e)) return !0
            } else if (e.test(t)) return !0;
        return !1
    }, S().on("request", function (e) {
        var n, r, i, s, a;
        return s = e.type, i = e.request, a = e.url, N(a) ? void 0 : u.running || E.restartOnRequestAfter === !1 && "force" !== M(s) ? void 0 : (r = arguments, n = E.restartOnRequestAfter || 0, "boolean" == typeof n && (n = 0), setTimeout(function () {
            var e, n, a, o, l, d;
            if (e = "socket" === s ? i.readyState < 2 : 0 < (o = i.readyState) && 4 > o) {
                for (u.restart(), l = u.sources, d = [], n = 0, a = l.length; a > n; n++) {
                    if (j = l[n], j instanceof t) {
                        j.watch.apply(j, r);
                        break
                    }
                    d.push(void 0)
                }
                return d
            }
        }, n))
    }), t = function () {
        function t() {
            var t = this;
            this.elements = [], S().on("request", function () {
                return t.watch.apply(t, arguments)
            })
        }
        return t.prototype.watch = function (t) {
            var e, n, r, i;
            return r = t.type, e = t.request, i = t.url, N(i) ? void 0 : (n = "socket" === r ? new f(e) : new p(e), this.elements.push(n))
        }, t
    }(), p = function () {
        function t(t) {
            var e, n, r, i, s, a, o = this;
            if (this.progress = 0, null != window.ProgressEvent)
                for (n = null, t.addEventListener("progress", function (t) {
                        return o.progress = t.lengthComputable ? 98 * t.loaded / t.total : o.progress + (98 - o.progress) / 2
                }, !1), a = ["load", "abort", "timeout", "error"], r = 0, i = a.length; i > r; r++) e = a[r], t.addEventListener(e, function () {
                    return o.progress = 98
                }, !1);
            else s = t.onreadystatechange, t.onreadystatechange = function () {
                var e;
                return 0 === (e = t.readyState) || 4 === e ? o.progress = 100 : 3 === t.readyState && (o.progress = 50), "function" == typeof s ? s.apply(null, arguments) : void 0
            }
        }
        return t
    }(), f = function () {
        function t(t) {
            var e, n, r, i, s = this;
            for (this.progress = 0, i = ["error", "open"], n = 0, r = i.length; r > n; n++) e = i[n], t.addEventListener(e, function () {
                return s.progress = 98
            }, !1)
        }
        return t
    }(), r = function () {
        function t(t) {
            var e, n, r, s;
            for (null == t && (t = {}), this.elements = [], null == t.selectors && (t.selectors = []), s = t.selectors, n = 0, r = s.length; r > n; n++) e = s[n], this.elements.push(new i(e))
        }
        return t
    }(), i = function () {
        function t(t) {
            this.selector = t, this.progress = 0, this.check()
        }
        return t.prototype.check = function () {
            var t = this;
            return document.querySelector(this.selector) ? this.done() : setTimeout(function () {
                return t.check()
            }, E.elements.checkInterval)
        }, t.prototype.done = function () {
            return this.progress = 98
        }, t
    }(), n = function () {
        function t() {
            var t, e, n = this;
            this.progress = null != (e = this.states[document.readyState]) ? e : 100, t = document.onreadystatechange, document.onreadystatechange = function () {
                return null != n.states[document.readyState] && (n.progress = n.states[document.readyState]), "function" == typeof t ? t.apply(null, arguments) : void 0
            }
        }
        return t.prototype.states = {
            loading: 0,
            interactive: 50,
            complete: 100
        }, t
    }(), s = function () {
        function t() {
            var t, e, n, r, i, s = this;
            this.progress = 0, t = 0, i = [], r = 0, n = R(), e = setInterval(function () {
                var a;
                return a = R() - n - 50, n = R(), i.push(a), i.length > E.eventLag.sampleCount && i.shift(), t = m(i), ++r >= E.eventLag.minSamples && t < E.eventLag.lagThreshold ? (s.progress = 98, clearInterval(e)) : s.progress = 98 * (3 / (t + 3))
            }, 50)
        }
        return t
    }(), c = function () {
        function t(t) {
            this.source = t, this.last = this.sinceLastUpdate = 0, this.rate = E.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = T(this.source, "progress"))
        }
        return t.prototype.tick = function (t, e) {
            var n;
            return null == e && (e = T(this.source, "progress")), e >= 98 && (this.done = !0), e === this.last ? this.sinceLastUpdate += t : (this.sinceLastUpdate && (this.rate = (e - this.last) / this.sinceLastUpdate), this.catchup = (e - this.progress) / E.catchupTime, this.sinceLastUpdate = 0, this.last = e), e > this.progress && (this.progress += this.catchup * t), n = 1 - Math.pow(this.progress / 100, E.easeFactor), this.progress += n * this.rate * t, this.progress = Math.min(this.lastProgress + E.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress
        }, t
    }(), z = null, P = null, v = null, I = null, g = null, b = null, u.running = !1, $ = function () {
        return E.restartOnPushState ? u.restart() : void 0
    }, null != window.history.pushState && (V = window.history.pushState, window.history.pushState = function () {
        return $(), V.apply(window.history, arguments)
    }), null != window.history.replaceState && (X = window.history.replaceState, window.history.replaceState = function () {
        return $(), X.apply(window.history, arguments)
    }), h = {
        ajax: t,
        elements: r,
        document: n,
        eventLag: s
    }, (L = function () {
        var t, n, r, i, s, a, o, l;
        for (u.sources = z = [], a = ["ajax", "elements", "document", "eventLag"], n = 0, i = a.length; i > n; n++) t = a[n], E[t] !== !1 && z.push(new h[t](E[t]));
        for (l = null != (o = E.extraSources) ? o : [], r = 0, s = l.length; s > r; r++) j = l[r], z.push(new j(E));
        return u.bar = v = new e, P = [], I = new c
    })(), u.stop = function () {
        return u.trigger("stop"), u.running = !1, v.destroy(), b = !0, null != g && ("function" == typeof y && y(g), g = null), L()
    }, u.restart = function () {
        return u.trigger("restart"), u.stop(), u.start()
    }, u.go = function () {
        var t;
        return u.running = !0, v.render(), t = R(), b = !1, g = F(function (e, n) {
            var r, i, s, a, o, l, d, h, f, p, g, m, y, w, C, x;
            for (h = 100 - v.progress, i = g = 0, s = !0, l = m = 0, w = z.length; w > m; l = ++m)
                for (j = z[l], p = null != P[l] ? P[l] : P[l] = [], o = null != (x = j.elements) ? x : [j], d = y = 0, C = o.length; C > y; d = ++y) a = o[d], f = null != p[d] ? p[d] : p[d] = new c(a), s &= f.done, f.done || (i++, g += f.tick(e));
            return r = g / i, v.update(I.tick(e, r)), v.done() || s || b ? (v.update(100), u.trigger("done"), setTimeout(function () {
                return v.finish(), u.running = !1, u.trigger("hide")
            }, Math.max(E.ghostTime, Math.max(E.minTime - (R() - t), 0)))) : n()
        })
    }, u.start = function (t) {
        C(E, t), u.running = !0;
        try {
            v.render()
        } catch (e) {
            l = e
        }
        return document.querySelector(".pace") ? (u.trigger("start"), u.go()) : setTimeout(u.start, 50)
    }, "function" == typeof define && define.amd ? define(function () {
        return u
    }) : "object" == typeof exports ? module.exports = u : E.startOnPageLoad && u.start()
}.call(this), + function (t) {
    "use strict";

    function e(e) {
        e && 3 === e.which || (t(i).remove(), t(s).each(function () {
            var r = n(t(this)),
                i = {
                    relatedTarget: this
                };
            r.hasClass("open") && (r.trigger(e = t.Event("hide.bs.dropdown", i)), e.isDefaultPrevented() || r.removeClass("open").trigger("hidden.bs.dropdown", i))
        }))
    }

    function n(e) {
        var n = e.attr("data-target");
        n || (n = e.attr("href"), n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
        var r = n && t(n);
        return r && r.length ? r : e.parent()
    }

    function r(e) {
        return this.each(function () {
            var n = t(this),
                r = n.data("bs.dropdown");
            r || n.data("bs.dropdown", r = new a(this)), "string" == typeof e && r[e].call(n)
        })
    }
    var i = ".dropdown-backdrop",
        s = '[data-toggle="dropdown"]',
        a = function (e) {
            t(e).on("click.bs.dropdown", this.toggle)
        };
    a.VERSION = "3.2.0", a.prototype.toggle = function (r) {
        var i = t(this);
        if (!i.is(".disabled, :disabled")) {
            var s = n(i),
                a = s.hasClass("open");
            if (e(), !a) {
                "ontouchstart" in document.documentElement && !s.closest(".navbar-nav").length && t('<div class="dropdown-backdrop"/>').insertAfter(t(this)).on("click", e);
                var o = {
                    relatedTarget: this
                };
                if (s.trigger(r = t.Event("show.bs.dropdown", o)), r.isDefaultPrevented()) return;
                i.trigger("focus"), s.toggleClass("open").trigger("shown.bs.dropdown", o)
            }
            return !1
        }
    }, a.prototype.keydown = function (e) {
        if (/(38|40|27)/.test(e.keyCode)) {
            var r = t(this);
            if (e.preventDefault(), e.stopPropagation(), !r.is(".disabled, :disabled")) {
                var i = n(r),
                    a = i.hasClass("open");
                if (!a || a && 27 == e.keyCode) return 27 == e.which && i.find(s).trigger("focus"), r.trigger("click");
                var o = " li:not(.divider):visible a",
                    l = i.find('[role="menu"]' + o + ', [role="listbox"]' + o);
                if (l.length) {
                    var u = l.index(l.filter(":focus"));
                    38 == e.keyCode && u > 0 && u--, 40 == e.keyCode && u < l.length - 1 && u++, ~u || (u = 0), l.eq(u).trigger("focus")
                }
            }
        }
    };
    var o = t.fn.dropdown;
    t.fn.dropdown = r, t.fn.dropdown.Constructor = a, t.fn.dropdown.noConflict = function () {
        return t.fn.dropdown = o, this
    }, t(document).on("click.bs.dropdown.data-api", e).on("click.bs.dropdown.data-api", ".dropdown form", function (t) {
        t.stopPropagation()
    }).on("click.bs.dropdown.data-api", s, a.prototype.toggle).on("keydown.bs.dropdown.data-api", s + ', [role="menu"], [role="listbox"]', a.prototype.keydown)
}(jQuery), $(function () {
    $(".homelink").click(function (t) {
        t.preventDefault(), $(location).attr("href", document.location.origin)
    }), $(".bars").click(function () {
        $(".bars").hasClass("is-active") ? ($(".bars").removeClass("is-active"), $("nav#menu-mobile").removeClass("is-active")) : ($(".bars").addClass("is-active"), $("nav#menu-mobile").addClass("is-active"))
    }), $("nav#menu-mobile a").click(function () {
        sb = $(this).siblings("ul"), exite_sb = sb.length, exite_sb > 0 && (sb.hasClass("is-active") ? (sb.removeClass("is-active"), sb.slideUp()) : (sb.addClass("is-active"), sb.slideDown()))
    }), $(".Slectbox").length > 0 && $("select.Slectbox").SumoSelect(), $(".Slectbox2").length > 0 && $("select.Slectbox2").SumoSelect({
        forceCustomRendering: true
    }), $("input.calendario").length > 0 && $("input.calendario").datepicker(), $("input.timepicker").length > 0 && $("input.timepicker").wickedpicker({
        title: "Seleccione la hora"
    }), $('input[type="file"]').change(function () {
        var t = $(this).val(),
            e = t.match(/([^\\\/]+)$/)[0],
            n = e;
        e.length > 20 && (n = "..." + e.substring(e.length - 20)), $("label.file-single").length > 0 && $(this).siblings("label.file-single").text(n)
    }), $('[data-toggle="collapse"]').click(function () {
        var t = $(this).data("href");
        slideUpDown(t), $(this).hasClass("acordion-icon") && slideIcon(this)
    });
    var t = location.href;
    t.indexOf("#") > 0 && (t = t.substr(t.indexOf("#")), $('[data-toggle="collapse"]').length > 0 && slideUpDown(t), $('[data-toggle="tab"]'.length > 0) && tab(t)), $('[data-toggle="tab"]').click(function () {
        var t = $(this).data("href");
        tab(t, this)
    }), $('input[type="submit"]').click(function (t) {
        var e = $(this).filter('[data-name="descarga"]').length,
            n = $(this).filter('[data-name="sendCorreo"]').length;
        1 == $("form").valid() && 0 == e && 0 == n && ($("#preload").length > 0 && $("#preload").remove(), $('<div id="preload" class=""></div>').prependTo("body"), $('<div id="status"></div>').prependTo("#preload"), $('<div id="statustext">Espere por favor...</div>').prependTo("#status"), $("#preload").delay(20).queue(function () {
            $(this).addClass("on")
        }))
    }), $('button[type="submit"]').click(function (t) {
        var e = $(this).filter('[data-name="descarga"]').length,
            n = $(this).filter('[data-name="sendCorreo"]').length;
        1 == $("form").valid() && 0 == e && 0 == n && ($("#preload").length > 0 && $("#preload").remove(), $('<div id="preload" class=""></div>').prependTo("body"), $('<div id="status"></div>').prependTo("#preload"), $('<div id="statustext">Espere por favor...</div>').prependTo("#status"), $("#preload").delay(20).queue(function () {
            $(this).addClass("on")
        }))
    })
});