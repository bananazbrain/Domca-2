function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// CHECK
class Check {
  static addError(element, message) {
    element.classList.add(Check.classError);

    if (message) {
      element.querySelector('.check__message').innerText = message;
    }
  }

  constructor(element) {
    this.element = element;
    this.input = this.element.input = this.element.querySelector('.check__input');
    this.type = this.input.type;
    this.checkChecked();
    this.onClick();

    this.element.input = this.input;
  }

  onClick() {
    this.element.addEventListener('click', (event) => {
      this.element.classList.remove('--error');
      if (event.target.closest('[data-popup]') || this.element.classList.contains('--disabled')) {
        return false;
      }
      if (this.type == 'checkbox') {
        this.element.classList.toggle('--checked');
        this.checked = this.input.getAttribute('checked');

        if (this.checked) {
          this.input.removeAttribute('checked');
        } else {
          this.input.setAttribute('checked', 'checked');
        }

      } else if (this.type == 'radio') {
        if (this.element.closest('--checked')) {
          return false;
        }

        this.name = this.input.name;
        let parent = this.element.closest('.checks') ? this.element.closest('.checks') : this.element.closest('form') ? this.element.closest('form') : document.body;
        let radios = parent.querySelectorAll('.check input[type="radio"][name="' + this.name + '"]');
        radios.forEach(radio => {
          radio.removeAttribute('checked');
          radio.closest('.check').classList.remove('--checked');
        });
        this.element.classList.add('--checked');
        this.input.setAttribute('checked', 'checked');
      }
    });
  }

  checkChecked() {
    if (this.input.getAttribute('checked')) {
      this.element.classList.add('--checked');
    }
  }
}

// SELECT
class Select {
  constructor(element) {
    _defineProperty(this, "classWrap", 'select__wrap');

    _defineProperty(this, "classArea", 'select__area');

    _defineProperty(this, "classIcon", 'select__icon');

    _defineProperty(this, "classTitle", 'select__title');

    _defineProperty(this, "classChevron", 'select__chevron');

    _defineProperty(this, "classDrop", 'select__drop');

    _defineProperty(this, "classList", 'select__list');

    _defineProperty(this, "classItem", 'select__item');

    _defineProperty(this, "classSelected", '--selected');

    _defineProperty(this, "classOpen", '--open');

    var wrap = document.createElement('div'),
      area = document.createElement('div'),
      icon = document.createElement('div'),
      title = document.createElement('div'),
      chevron = document.createElement('div'),
      drop = document.createElement('div'),
      list = document.createElement('div'),
      options = element.querySelectorAll('option'),
      placeholder = element.getAttribute('data-placeholder'),
      current = placeholder ? null : options[0];
    wrap.className = this.classWrap;
    area.className = this.classArea;
    icon.className = this.classIcon;
    title.className = this.classTitle;
    chevron.className = this.classChevron;
    drop.className = this.classDrop;
    list.className = this.classList;
    element.append(wrap);
    wrap.append(area);
    area.append(icon);
    area.append(title);
    area.append(chevron);
    wrap.append(drop);
    drop.append(list);

    options.forEach(option => {
      var item = document.createElement('div'),
        text = option.innerText,
        value = option.getAttribute('value'),
        selected = option.getAttribute('selected'),
        group = option.getAttribute('data-group');
      item.className = this.classItem;
      list.append(item);
      item.innerText = text;

      if (value) {
        item.setAttribute('data-value', value);
      }

      if (selected) {
        current = option;
      }

      if (group) {
        item.setAttribute('data-group', group);
      }
    });

    if (placeholder) {
      title.innerText = placeholder;
    } else {
      if (element.classList.contains('--title-value')) {
        title.innerText = current.getAttribute('value');
      } else {
        title.innerText = current.innerText;
      }
    }

    if (current) {
      current.setAttribute('selected', 'selected');
      var currentItem = list.querySelector('.' + this.classItem + '[data-value = "' + current.getAttribute('value') + '"]');
      currentItem.classList.add(this.classSelected);
    }

    area.addEventListener('click', event => {
      if (!element.classList.contains(this.classOpen)) {
        let prevSelect = document.querySelector('.select.--open');

        if (prevSelect) {
          document.querySelector('.select.--open').classList.remove(this.classOpen);
        }
        element.classList.add(this.classOpen);
      } else {
        element.classList.remove(this.classOpen);
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.select')) {
        element.classList.remove(this.classOpen);
      }
    });
    var items = element.querySelectorAll('.' + this.classItem);
    items.forEach(item => {
      item.addEventListener('click', () => {
        if (!item.classList.contains(this.classSelected)) {
          var value = item.getAttribute('data-value');

          if (element.classList.contains('--title-value')) {
            title.innerText = value;
          } else {
            title.innerText = item.innerText;
          }

          options.forEach(option => {
            option.removeAttribute('selected');
          });
          items.forEach(itemsItem => {
            itemsItem.classList.remove(this.classSelected);
          });
          var option = element.querySelector('option[value = "' + value + '"]');
          option.setAttribute('selected', 'selected');
          item.classList.add(this.classSelected);
          element.classList.remove(this.classOpen);
        }
      });
    });

    if (element.getAttribute('data-input')) {
      var inputName = element.getAttribute('data-input-name'),
        inputMods = element.getAttribute('data-input-mods'),
        inputPlaceholder = element.getAttribute('data-input-placeholder');
      var input = document.createElement('div');
      input.classList = 'select__input input';
      var inputWrap = document.createElement('div');
      inputWrap.classList = 'input__wrap';
      var inputArea = document.createElement('input');
      inputArea.classList = 'input__area';

      if (inputMods) {
        input.classList += '' + inputMods;
      }

      if (inputName) {
        inputArea.name += inputName;
      }

      if (inputPlaceholder) {
        inputArea.placeholder = inputPlaceholder;
      }

      drop.prepend(input);
      input.append(inputWrap);
      inputWrap.append(inputArea);
      inputArea.addEventListener('keyup', () => {
        var value = inputArea.value;
        items.forEach(item => {
          var text = item.innerText;

          if (text.indexOf(value) < 0) {
            item.classList.add('--hide');
          } else {
            item.classList.remove('--hide');
          }
        });
      });
    }
  }
}
