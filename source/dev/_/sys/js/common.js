const html = document.querySelector('html');
const body = document.querySelector('body');
const inner = document.querySelector('.inner');
const mailPattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

document.addEventListener('DOMContentLoaded', function () {
  // FANCYBOX SETUP
  // Fancybox.bind("[data-fancybox]", {
  //   dragToClose: false,
  //   autoFocus: false,
  // });

  // CHECK INIT
  let checks = document.querySelectorAll('.check');
  if (checks) {
    checks.forEach((check) => {
      new Check(check);
    });
  }

  // SELECT INIT
  var selects = document.querySelectorAll('.select');
  selects.forEach(select => {
    new Select(select);
  });

  // ANIMATION
  let anBlocks = document.querySelectorAll('.an');

  function animatedBlocks() {
    let Y = window.scrollY;
    let visibleHeight = window.innerHeight - 100;
    anBlocks.forEach((block) => {
      if (!block.classList.contains('--loaded')) {
        let timeout = block.getAttribute('data-timeout');
        if (timeout) {
          block.style.transitionDelay = timeout;
        }
        if (block.getBoundingClientRect().top < visibleHeight) {
          block.classList.add('--loaded');
        }
      }
    });
  }

  setTimeout(() => {
    animatedBlocks();
    document.addEventListener('scroll', () => {
      animatedBlocks();
    });
  }, 500);

  // HEADER MENU NAV
  let menuHam = document.querySelector('.ham');
  let menuNav = document.querySelector('.header');

  if (menuHam) {
    for (let i = 0; i < 3; i++) {
      let div = document.createElement('div');
      menuHam.append(div);
    }

    menuHam.addEventListener('click', () => {
      menuHam.classList.toggle('--toggle');
      menuNav.classList.toggle('--toggle');
      html.classList.toggle('overflow-disable');
      body.classList.toggle('overflow-disable');
      inner.classList.toggle('overflow-disable');
    });
  }

  // SLIDER
  let sampleSlider = document.querySelector('.sample__slider');

  if (sampleSlider) {
    let sampleSliderSwiper = new Swiper(sampleSlider, {
      slidesPerView: 1,
      spaceBetween: 1,
      speed: 900,
      navigation: {
        prevEl: '.sample__arrow.swiper-button-prev',
        nextEl: '.sample__arrow.swiper-button-next',
      },
      pagination: {
        el: '.sample__pagination.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });
  }

  // MAP
  let map = document.querySelector('#map');

  if (map && ymaps) {
    ymaps.ready(mapInit);

    function mapInit() {
      let mapPosition, mapPlaceholder;

      mapPosition = map.getAttribute('data-map');
      mapPosition = mapPosition.split(',');

      for (let i = 0; i < mapPosition.length; i++) {
        mapPosition[i] = Number(mapPosition[i]);
      }

      mapPlaceholder = map.getAttribute('data-map');
      mapPlaceholder = mapPlaceholder.split(',');

      let ymap = new ymaps.Map(map, {
        center: [mapPosition[0], mapPosition[1]],
        controls: [],
        zoom: 16,
      });

      let placemark = new ymaps.Placemark(mapPlaceholder, {
      }, {
        iconLayout: 'default#image',
        iconImageHref: '_/uploads/icons/placemark-blue.svg',
        iconImageSize: [28, 33],
      }, {});
      ymap.geoObjects.add(placemark);

      ymap.behaviors.disable('scrollZoom');

      function setMapPostion() {
        let dw = window.innerWidth;

        if (dw > 1280) {
          ymap.setCenter([mapPosition[0], mapPosition[1]]);
        } else if (dw <= 1280 && dw > 767) {
          ymap.setCenter([mapPosition[0], mapPosition[1] - -0.004]);
        } else {
          ymap.setCenter(mapPosition);
        }
      }

      setMapPostion();
      window.addEventListener('resize', () => {
        setMapPostion();
      });
    }
  }

  // VALIDATOR
  let fields = document.querySelectorAll('.field');
  fields.forEach((field) => {
    field.wrap = field.querySelector('.field__wrap');
    field.area = field.querySelector('.field__area');

    field.addEventListener('focusin', () => {
      field.classList.add('--focus');
      field.classList.remove('--error');
    })
    field.addEventListener('focusout', () => {
      field.classList.remove('--focus');
    })

    field.area.addEventListener('change', () => {
      if (field.area.value.length >= 1) {
        field.classList.add('--filled');
      } else {
        field.classList.remove('--filled');
      }
    });

    if (field.classList.contains('--name')) {
      field.area.addEventListener('input', () => {
        field.area.value = field.area.value.replace(/[^\D]/g, '');
      });

    } else if (field.classList.contains('--tel')) {
      field.area.mask = IMask(field.area, {
        mask: '+{7} (000) 000-00-00',
        lazy: true
      });
      field.area.addEventListener('focusin', () => {
        field.area.mask.updateOptions({
          lazy: false
        })
      });
      field.area.addEventListener('focusout', () => {
        field.area.mask.updateOptions({
          lazy: true
        })
      })
    } else if (field.classList.contains('--date')) {
      field.area.mask = IMask(field.area, {
        mask: Date,
        lazy: false,
        min: new Date(Date.now()),
      });
      field.area.addEventListener('input', () => {
        if (Date.length >= 1) {
          field.classList.add('--filled');
        } else {
          field.classList.remove('--filled');
        }
      });

    } else {
      field.area.addEventListener('field', () => {
      });
    }
  });

  let validateForms = document.querySelectorAll('form');
  let modalThanks = document.getElementById('modal-thanks');
  if (validateForms) {
    validateForms.forEach((form) => {
      let btnSubmit = form.querySelector('.btn');
      let fieldsRequired = form.querySelectorAll('.field.--required');
      let checksRequired = form.querySelectorAll('.check.--required');
      let selectsRequired = form.querySelectorAll('.select.--required');
      let popupModalForm = form.querySelector('.modal__form');
      let popupSendOkAttr = form.getAttribute('data-message-ok');

      // SELECT VALIDATOR
      if (selectsRequired.length > 0) {

        selectsRequired.forEach((select) => {
          select.parse = select.querySelector('select');
          select.error = select.querySelector('.select__value');
          select.addEventListener('click', () => {
            if (select.classList.contains('--error')) {
              select.classList.remove('--error');
            }
          })
        })
      }

      btnSubmit.addEventListener('click', (event) => {
        let errors = 0;

        if (fieldsRequired.length > 0) {
          fieldsRequired.forEach((field) => {
            let value = field.area.value;

            if (field.classList.contains('--name')) {
              if (value.length < 2) {
                errors++;
                field.classList.add('--error');
              } else {
                field.classList.remove('--error');
              }
            }

            if (field.classList.contains('--tel')) {
              if (value.length < 18) {
                errors++;
                field.classList.add('--error');
              } else {
                field.classList.remove('--error');
              }
            }

            if (field.classList.contains('--email')) {
              if (!mailPattern.test(value)) {
                errors++;
                field.classList.add('--error');
              } else {
                field.classList.remove('--error');
              }
            }

            if (field.classList.contains('--date')) {
              if (field.area.mask.unmaskedValue.length < 10) {
                errors++;
                field.classList.add('--error');
              } else {
                field.classList.remove('--error');
              }
            }

          })
        }

        if (checksRequired.length > 0) {
          checksRequired.forEach((check) => {
            if (check.input.getAttribute('checked') != 'checked') {
              errors++;
              check.classList.add('--error');
            }
            else {
              check.classList.remove('--error');
            }
          })
        }

        if (selectsRequired.length > 0) {
          selectsRequired.forEach((select) => {
            if (!select.parse.querySelector('option[selected]')) {
              errors++;
              select.classList.add('--error');
            }
          })
        }

        if (errors == 0) {
          let xhr = new XMLHttpRequest();
          let formData = new FormData(form);
          xhr.open('POST', 'order.php');
          xhr.send(formData);

          xhr.onload = function () {
            if (xhr.response == "1") {
              Fancybox.close();

              Fancybox.show([{
                src: '#modal-thanks',
                type: 'inline'
              }]);

            }
          }
          event.preventDefault();

        } else {
          event.preventDefault();
        }
      })
    })
  }
})