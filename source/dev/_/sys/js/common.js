const html = document.querySelector('html');
const body = document.querySelector('body');
const inner = document.querySelector('.inner');
const mailPattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

window.onload = () => {
  // FANCYBOX SETUP
  Fancybox.bind("[data-fancybox]", {
    dragToClose: false,
    autoFocus: false,
  });

  Fancybox.bind("[data-fancybox='certs']", {
    dragToClose: false,
    autoFocus: false,
    Toolbar: {
      display: [
        "zoom",
        "fullscreen",
        "close",
      ]
    }
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
  let menuNav = document.querySelector('.header__main');

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

  let sidePanel = document.querySelector('.side-panel');
  let sidePanelClose = document.querySelector('.side-panel__close');

  if (sidePanel) {
    sidePanelClose.addEventListener('click', () => {
      sidePanel.classList.add('--hide');
    })
  }

  // ANCHORE
  const smoothLinks = document.querySelectorAll('a[href^="#"]');

  for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
      e.preventDefault();

      const id = smoothLink.getAttribute('href');

      menuHam.classList.remove('--toggle');
      menuNav.classList.remove('--toggle');
      html.classList.remove('overflow-disable');
      body.classList.remove('overflow-disable');
      inner.classList.remove('overflow-disable');

      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  // CERTS SLIDER
  let certsSlider = document.querySelector('.certs__slider');

  if (certsSlider) {
    let certsSliderSwiper = null;

    setTimeout(() => {
      certsSliderSwiper = new Swiper(certsSlider, {
        slidesPerView: 'auto',
        spaceBetween: 112,
        initialSlide: 1,
        slidesOffsetBefore: -65,
        centeredSlides: true,
        preventInteractionOnTransition: true,
        speed: 1000,
        navigation: {
          prevEl: '.certs__arrow.swiper-button-prev',
          nextEl: '.certs__arrow.swiper-button-next',
        },
        pagination: {
          el: '.certs__pagination.swiper-pagination',
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            slidesOffsetBefore: 0,
            spaceBetween: 20,
            centeredSlides: false,
          },
          768: {
            slidesPerView: 2,
            slidesOffsetBefore: 0,
            spaceBetween: 20,
            centeredSlides: false,
          },
          992: {
            slidesPerView: 'auto',
            slidesOffsetBefore: -50,
            spaceBetween: 60,
            centeredSlides: true,
          },
          1281: {
            slidesPerView: 'auto',
            slidesOffsetBefore: -65,
            spaceBetween: 112,
          }
        }
      });
    }, 1000);

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
      let popupModalForm = form.querySelector('.modal__form');
      let popupSendOkAttr = form.getAttribute('data-message-ok');

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

          })
        }

        if (errors == 0) {
          let xhr = new XMLHttpRequest();
          let formData = new FormData(form);
          xhr.open('POST', 'order.php');
          xhr.send(formData);

          xhr.onload = function () {
            Fancybox.close();

            Fancybox.show([{
              src: '#modal-thanks',
              type: 'inline'
            }]);

          }
          event.preventDefault();

        } else {
          event.preventDefault();
        }
      })
    })
  }
}