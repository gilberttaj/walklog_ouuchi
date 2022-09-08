document.addEventListener("DOMContentLoaded", function () {
    // start here
    initImageSliderComparisons(); // init image compare related to p-imageCompare and object/project/_imageCompare.scss
    /**
     * FOR PARTSLIST PAGE
     */
    let btnShowMenu = document.querySelector('.partslist__floatMenu__toggle');
    let showMenuLinks = btnShowMenu.parentElement.querySelectorAll('.partslist__floatMenu__item > a');
    scrollToAnchorPoint(showMenuLinks);
    btnShowMenu.addEventListener("click", (e) => {
        btnShowMenu.parentElement.classList.toggle('isOpen');
    });
    let fileUpload = new FileUpload('#test_fileUpload');
    fileUpload.watch();
    let fileUpload2 = new FileUpload('#test_fileUpload_modal');
    fileUpload2.watch();
    let dummyForm = new FormModal('#test_formModal');
    dummyForm.mount();
});
 /**
  * FOR CONTACT AJAX
  */
//  $(function () {
//      $('#form').submit(function (event) {
//          event.preventDefault();
//          var form = $(this);
//          $.ajax({
//              type: form.attr('method'),
//              url: form.attr('action'),
//              data: form.serialize(),
//              // dataType: 'json',
//              success: function (response) {
//                  let parsedResponse = JSON.parse(response);
//                  if (parsedResponse['redirect'] !== undefined) {
//                      window.location.href = parsedResponse['redirect'];
//                  }
//                  if (parsedResponse['field_error'] !== undefined) {
//                      let existing_error_message = document.querySelectorAll('.error');
//                      if (existing_error_message.length > 0) {
//                          existing_error_message.forEach(item => {
//                              item.remove();
//                          });
//                      }
//                      $.each(parsedResponse['field_error'], function (key, value) {
//                          let error_element = document.querySelector(`#${key}`);
//                          let error_message = document.createElement('p');
//                          error_message.className = 'error';
//                          $.each(value, function (rule, result) {
//                              error_message.innerText = result.message;
//                          });
//                          error_element.parentElement.appendChild(error_message);
//                      });
//                  }
//              },
//          });
//      });
//  });
function FileUpload(selector = '.c-file01', ) {
    var _this = this;
    this.targetSelector = document.querySelector(selector);
    this.fileUpload = this.targetSelector.querySelector('input[type="file"]');
    this.fileUploadIndicator = this.targetSelector.querySelector('.c-file01__indicator');
    this.watch = () => {
        let fileUpload = this.fileUpload;
        if (fileUpload) {
            fileUpload.addEventListener('change', (e) => {
                let fileName = fileUpload.files[0].name !== undefined ? fileUpload.files[0].name : 'No file chosen...';
                _this.fileUploadIndicator.innerText = fileName;
            });
        }
    }
}
function FormModal(form = 'form') {
    var _this = this;
    this.targetName = form;
    this.targetElement = document.querySelector(this.targetName);
    if (this.targetElement) {
        this.isActive = this.targetElement.hasAttribute('form-modal') ? this.targetElement.getAttribute('form-modal') : 'true';
        this.isTriggered = this.targetElement.hasAttribute('form-modal-trigger') ? this.targetElement.getAttribute('form-modal-trigger') : 'false';
        this.title = this.targetElement.hasAttribute('form-title') ? this.targetElement.getAttribute('form-title') : 'Default Title';
        this.titleSuccess = this.targetElement.hasAttribute('form-title-success') ? this.targetElement.getAttribute('form-title-success') : 'Default Title Success';
        this.titleError = this.targetElement.hasAttribute('form-title-error') ? this.targetElement.getAttribute('form-title-error') : 'Default Title Error';
        this.role = this.targetElement.hasAttribute('form-Modal-Role') ? this.targetElement.getAttribute('form-Modal-Role') : 'Confirmation';
        this.confirmButton = null;
        this.isSuccess = false;
        this.isError = false;
        this.isResponse = {};
        this.modalData = [];
    }

    this.mount = () => {
        if (this.isActive === 'true') {
            initialize();
            watchChanges();
        }
    }
    /**
     * Setter
     */
    /**
     * getter
     */
    getResponse = () => {
        return this.isResponse;
    }
    getTargetElement = () => {
        return this.targetElement;
    }
    getIsTriggered = () => {
        return this.isTriggered;
    }
    getIsSuccess = () => {
        return this.isSuccess;
    }
    getIsError = () => {
        return this.isError;
    }
    /**
     * end of getter
     */
    initialize = () => {
        // register input field
        let _el = this.targetElement;
        for (let i = 0; i < _el.length; i++) {
            let element = _el.elements[i];
            if (element.tagName === 'BUTTON' && element.type == 'submit') {
                // add event to confirmButton to open modal
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    // check if function exist
                    if (typeof displayConfirmModal == 'function') {
                        displayConfirmModal();
                    }
                });
                _this.confirmButton = element;
            } else if (element.tagName === 'INPUT' && element.type == 'hidden') {
                continue;
            } else {
                let searchLabel = element.labels != null ? cleanString(document.querySelector(`label[for=${element.id}]`).textContent) : '';
                _this.modalData.push({
                    element: element,
                    id: element.id,
                    tag: element.tagName,
                    type: element.type,
                    label: searchLabel
                });
            }
        }
    }
    displayConfirmModal = () => {
        let modalContainer = document.createElement('div'),
            modalOverlay = document.createElement('div'),
            modalTitle = document.createElement('p'),
            modalContent = document.createElement('div'),
            modalIcon = document.createElement('div'),
            modalDataList = document.createElement('ul'),
            modalButtonArea = document.createElement('div');
        // add class to the generated modal
        modalContainer.className = 'p-modal p-modal--active';
        modalOverlay.className = 'p-modal__background';
        modalContent.className = 'p-modal__contents';
        modalTitle.className = 'p-modal__title';
        modalIcon.className = 'p-modal__check';
        modalDataList.className = 'p-modal__list';
        modalButtonArea.className = 'p-modal__buttonArea';
        // add event to background to close/delete modal
        modalOverlay.addEventListener('click', (e) => {
            closeModal(modalContainer, true);
        });
        // append children to parent
        modalContainer.append(modalOverlay);
        modalContainer.append(modalContent);
        modalContent.append(modalTitle);
        if (getIsSuccess()) {
            // set title
            modalTitle.innerText = this.titleSuccess;
            modalIcon.innerHTML += '<i class="s s-5x s-icon_success"></i>'
            modalContent.append(modalIcon);
        } else if (getIsError()) {
            // set title
            modalTitle.innerText = this.titleError;
            modalIcon.innerHTML += '<i class="s s-5x s-icon_error"></i>'
            modalContent.append(modalIcon);
        } else {
            // set title
            modalTitle.innerText = this.title;
            modalDataList.innerHTML = insertInputData();
            modalContent.append(modalDataList);
        }
        // prepare buttons
        preparedModalButtons(modalContainer, modalButtonArea);
        modalContent.appendChild(modalButtonArea);
        // inject modal to body tag
        document.body.appendChild(modalContainer);
    }
    insertInputData = () => {
        let html = '';
        let _el = this.modalData;
        for (let i = 0; i < _el.length; i++) {
            let v = _el[i].element.value;
            let l = cleanString(_el[i].label);
            if (v) {
                html += `<li class=p-modal__list__item><span class=label id=label_${_el[i].id}> ${l} </span><p class=data id=data_${_el[i].id}> ${v} </p></li>`;
            }
        }
        return html;
    }

    preparedModalButtons = (modalContainer, buttonArea) => {
        let buttonCancel = document.createElement('button');
        let buttonSubmit = document.createElement('button');
        let buttonReturn = document.createElement('button');
        buttonCancel.className = 'p-modal__button p-modal__button--l p-modal__button--main p-modal__button--cancel';
        buttonSubmit.className = 'p-modal__button p-modal__button--l p-modal__button--accent p-modal__button--submit';
        buttonReturn.className = 'p-modal__button p-modal__button--l p-modal__button--accent p-modal__button--return';
        buttonCancel.innerText = 'Cancel';
        buttonSubmit.innerText = 'Submit';
        buttonReturn.innerText = 'Return';
        //event
        buttonCancel.addEventListener('click', function (e) {
            e.preventDefault;
            closeModal(modalContainer, true);
        });
        buttonReturn.addEventListener('click', function (e) {
            e.preventDefault;
            closeModal(modalContainer, true);
        });
        buttonSubmit.addEventListener('click', function (e) {
            e.preventDefault();
            let _form = $(getTargetElement());
            let _formData = new FormData(_form[0]);
            let _loader = document.createElement('div');
            _loader.className = 'c-loader';
            $.ajax({
                type: _form.attr('method'),
                url: _form.attr('action'),
                processData: false,
                contentType: false,
                data: _formData,
                beforeSend: function () {
                    document.querySelector('.p-modal--active .p-modal__contents').appendChild(_loader);
                },
                success: function (response) {
                    let parsedResponse;
                    try {
                        parsedResponse = JSON.parse(response);
                    } catch (e) {
                        parsedResponse = response;
                    }
                    _this.isResponse = parsedResponse;
                    _this.isTriggered = "true";
                    _this.targetElement.setAttribute('form-modal-trigger', getIsTriggered());
                    getTargetElement().reset(); // remove form input data
                },
                error: function ($xhr, XMLHttpRequest, textStatus, errorThrown) {
                    var string = $xhr.responseJSON;
                    _this.isResponse = string;
                    _this.isTriggered = "true";
                    _this.targetElement.setAttribute('form-modal-trigger', getIsTriggered());
                },
                complete: function () {
                    _loader.remove();
                },
            });
        });
        if (getIsSuccess() || getIsError()) {
            buttonArea.appendChild(buttonReturn);
        } else {
            buttonArea.appendChild(buttonCancel);
            buttonArea.appendChild(buttonSubmit);
        }
    }
    watchChanges = () => {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes") {
                    // if form is submitted
                    if ('success' in getResponse()) {
                        _this.isSuccess = true;
                        _this.isError = false;
                    } else if ('error' in getResponse()) {
                        _this.isSuccess = false;
                        _this.isError = true;
                    } else {
                        _this.isSuccess = false;
                        _this.isError = false;
                    }
                    // remove old modal
                    closeModal(document.querySelector('.p-modal'));
                    // generate new modal
                    displayConfirmModal();
                }
            });
        });
        observer.observe(this.targetElement, {
            attributes: true,
            // attributeFilter: ['id', 'class'], // filter you don't want to watch
        });
    }
    /**
     * function
     */
    const closeModal = (x, reset = false) => {
        if (reset) {
            // reset isSuccess and isError
            resetData();
        }
        return x.remove();
    }
    const resetData = () => {
        _this.isSuccess = false;
        _this.isError = false;
    }
    const cleanString = (x) => {
        return x.replace(/[^\w ]/g, '');
    }
}
/** FUNCTION SECTION */
const removeElements = (elms) => elms.forEach(el => el.remove());
// helper function from jquery $.css
const css = (el, styles) => {
    for (var property in styles)
        el.style[property] = styles[property];
};
const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        document.body.setAttribute('style', 'overflow:hidden;');
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 28);
        setTimeout(function () {
            document.body.setAttribute('style', 'overflow-x:hidden;');
        }, 500);
    }
};
const scrollToAnchorPoint = (elements) => {
    if (elements.length > 0) {
        elements.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                document.querySelector(item.getAttribute("href")).scrollIntoView({
                    behavior: "smooth",
                });
            });
        });
    } else {
        throw "scrollToAnchorPoint() need parameter to be a collection of links:href";
    }
};
const scrollClass = (targetElement, classes = {
    default: "scrolling",
    up: 'scroll-up',
    down: 'scroll-down',
    top: 'scrolling-reached-top',
    bottom: 'scrolling-reached-bottom',
}) => {

    /**
     * check if there are unsetted classes
     */
    classes = {
        default: typeof classes.default !== 'undefined' ? classes.default : "scrolling",
        up: typeof classes.up !== 'undefined' ? classes.up : 'scroll-up',
        down: typeof classes.down !== 'undefined' ? classes.down : 'scroll-down',
        top: typeof classes.top !== 'undefined' ? classes.top : 'scrolling-reached-top',
        bottom: typeof classes.bottom !== 'undefined' ? classes.bottom : 'scrolling-reached-bottom',
    }
    /**
     * check if page position is top or bottom then set class
     */
    if (window.pageYOffset === document.body.offsetTop) {
        targetElement.classList.add(classes.top);
    } else if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        targetElement.classList.add(classes.bottom);
    }
    /**
     * set class when scroll
     */
    let pageY = 0;
    let prevY = 0;
    document.addEventListener('scroll', () => {
        prevY = pageY;
        pageY = window.pageYOffset;
        if (targetElement) {
            // console.log('prevY = ' + prevY + 'currentY = ' + pageY);
            if (window.pageYOffset === document.body.offsetTop) {
                // console.log("you're at the top of the page");
                targetElement.classList.add(classes.top);
                if (targetElement.classList.contains(classes.up) || targetElement.classList.contains(classes.down)) {
                    targetElement.classList.remove(classes.default);
                    targetElement.classList.remove(classes.up);
                    targetElement.classList.remove(classes.down);
                }
            } else if ((pageY - prevY) < 0) {
                // console.log("is scrolling up");
                targetElement.classList.add(classes.default);
                if (targetElement.classList.contains(classes.bottom)) {
                    targetElement.classList.remove(classes.bottom);
                }
                if (targetElement.classList.contains(classes.down)) {
                    targetElement.classList.replace(classes.down, classes.up);
                } else {
                    targetElement.classList.add(classes.up);
                }
            } else if ((pageY - prevY) > 0) {
                // console.log("is scrolling down");
                targetElement.classList.add(classes.default);
                if (targetElement.classList.contains(classes.top)) {
                    targetElement.classList.remove(classes.top);
                }
                if (targetElement.classList.contains(classes.up)) {
                    targetElement.classList.replace(classes.up, classes.down);
                } else {
                    targetElement.classList.add(classes.down);
                }
            }
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                // console.log("you're at the bottom of the page");
                targetElement.classList.add(classes.bottom);
                if (targetElement.classList.contains(classes.up) || targetElement.classList.contains(classes.down)) {
                    targetElement.classList.remove(classes.default);
                    targetElement.classList.remove(classes.up);
                    targetElement.classList.remove(classes.down);
                }
            }
        }
    });
};
const toggleDisplay = function (initiator = {
    elem: null,
    class: null,
    childClass: null
}, target = {
    elem: null,
    class: null
}) {
    this.initiatorElement = initiator.elem;
    this.initiatorClassToggle = initiator.class;
    this.initiatorChildClassToggle = initiator.childClass;
    this.targetElement = target.elem;
    this.targetClassToggle = target.class;
    this.mount = () => {
        let initiator = this.initiatorElement;
        let target = this.targetElement;
        initiator.addEventListener('click', (e) => {
            initiator.classList.toggle(this.initiatorClassToggle);
            this.initiatorChildClassToggle != null ? initiator.children[0].classList.toggle(this.initiatorChildClassToggle) : '';
            target.classList.toggle(this.targetClassToggle);
        });
    }
}
const isScrolledIntoView = (el) => {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
};

function initImageSliderComparisons() {
    /* ind all elements with an "frame" class in p-imageCompare */
    var frame = document.querySelectorAll('.p-imageCompare__frame');
    frame.forEach(element => {
        injectFrameBackground(element);
    });
    window.onresize = resizeFrame;

    function resizeFrame() {
        frame.forEach(e => {
            css(e, {
                "height": `${frameDimension(e)[0]}px`,
                "width": `${frameDimension(e)[1]}px`,
            });
        });
    }

    function injectFrameBackground(e) {
        let src = frameSrc(e);
        let h = frameDimension(e)[0];
        let w = frameDimension(e)[1];
        css(e, {
            "background-image": `url('${src}')`,
            "background-repeat": "no-repeat",
            "background-position": "center",
            "background-size": "cover",
            "height": `${h}px`,
            "width": `${w}px`,
        });
    }

    function frameSrc(e) {
        return e.querySelector('img').getAttribute('src');
    }

    function frameDimension(e) {
        let dimensionH = e.parentElement.parentElement.getBoundingClientRect().height;
        let dimensionW = e.parentElement.parentElement.getBoundingClientRect().width;
        return [dimensionH, dimensionW];
    }

    var x, i;
    /* Find all elements with an "overlay" class: */
    x = document.getElementsByClassName("p-imageCompare__overlayImage");
    for (i = 0; i < x.length; i++) {
        /* Once for each "overlay" element:
        pass the "overlay" element as a parameter when executing the compareImages function: */
        compareImages(x[i]);
    }

    function compareImages(img) {
        var slider, img, clicked = 0,
            w, h;
        /* Get the width and height of the img element */
        w = img.offsetWidth;
        h = img.offsetHeight;
        /* Set the width of the img element to 50%: */
        img.style.width = (w / 2) + "px";
        /* Create slider: */
        slider = document.createElement("DIV");
        sliderBtn = document.createElement("DIV");
        slider.setAttribute("class", "p-imageCompare__slider");
        sliderBtn.setAttribute("class", "p-imageCompare__slider__btn");
        /* Insert slider */
        img.parentElement.insertBefore(slider, img);
        /* Insert slider btn */
        slider.appendChild(sliderBtn);
        /* Position the slider in the middle: */
        // slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
        slider.style.top = 0;
        slider.style.left = (w / 2) - (slider.offsetWidth / 2) + "px";
        /* Execute a function when the mouse button is pressed: */
        slider.addEventListener("mousedown", slideReady);
        /* And another function when the mouse button is released: */
        window.addEventListener("mouseup", slideFinish);
        /* Or touched (for touch screens: */
        slider.addEventListener("touchstart", slideReady);
        /* And released (for touch screens: */
        window.addEventListener("touchend", slideFinish);

        function slideReady(e) {
            /* Prevent any other actions that may occur when moving over the image: */
            e.preventDefault();
            /* The slider is now clicked and ready to move: */
            clicked = 1;
            /* Execute a function when the slider is moved: */
            window.addEventListener("mousemove", slideMove);
            window.addEventListener("touchmove", slideMove);
        }

        function slideFinish() {
            /* The slider is no longer clicked: */
            clicked = 0;
        }

        function slideMove(e) {
            var pos;
            /* If the slider is no longer clicked, exit this function: */
            if (clicked == 0) return false;
            /* Get the cursor's x position: */
            pos = getCursorPos(e)
            /* Prevent the slider from being positioned outside the image: */
            if (pos < 0) pos = 0;
            if (pos > w) pos = w;
            /* Execute a function that will resize the overlay image according to the cursor: */
            slide(pos);
        }

        function getCursorPos(e) {
            var a, x = 0;
            e = (e.changedTouches) ? e.changedTouches[0] : e;
            /* Get the x positions of the image: */
            a = img.getBoundingClientRect();
            /* Calculate the cursor's x coordinate, relative to the image: */
            x = e.pageX - a.left;
            /* Consider any page scrolling: */
            x = x - window.pageXOffset;
            return x;
        }

        function slide(x) {
            /* Resize the image: */
            img.style.width = x + "px";
            /* Position the slider: */
            slider.style.left = img.offsetWidth - (slider.offsetWidth / 2) + "px";
        }
    }
}