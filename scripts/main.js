$(document).ready(function () {
  new Swiper(".page-banner__inner", {
    slidePerView: 1,
    spaceBetween: 15,
    navigation: {
      nextEl: ".page-banner__next",
      prevEl: ".page-banner__prev",
    },
  });

  $(".header__mobile-hamburger").on("click", function () {
    if ($(this).hasClass("header__mobile-hamburger--active")) {
      $(this).removeClass("header__mobile-hamburger--active");
      $(".header__mob-sidebar").removeClass("header__mob-sidebar--active");
    } else {
      $(this).addClass("header__mobile-hamburger--active");
      $(".header__mob-sidebar").addClass("header__mob-sidebar--active");
    }
  });

  $(".page-qa__item").on("click", function () {
    if ($(this).hasClass("page-qa__item--active")) {
      $(this).removeClass("page-qa__item--active");
    } else {
      $(this).addClass("page-qa__item--active");
    }
  });

  function makeMask() {
    [].forEach.call(
      document.querySelectorAll('[type="tel"]'),
      function (input) {
        var keyCode;
        function mask(event) {
          event.keyCode && (keyCode = event.keyCode);
          var pos = this.selectionStart;
          if (pos < 3) event.preventDefault();
          var matrix = "+7 (___)-___-__-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function (a) {
              return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
            });
          i = new_value.indexOf("_");
          if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i);
          }
          var reg = matrix
            .substr(0, this.value.length)
            .replace(/_+/g, function (a) {
              return "\\d{1," + a.length + "}";
            })
            .replace(/[+()]/g, "\\$&");
          reg = new RegExp("^" + reg + "$");
          if (
            !reg.test(this.value) ||
            this.value.length < 5 ||
            (keyCode > 47 && keyCode < 58)
          )
            this.value = new_value;
          if (event.type == "blur" && this.value.length < 5) this.value = "";
        }
        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);
      }
    );
  }

  makeMask();

  const errorsMsgs = {
    name: {
      empty: "Поле слишком короткое",
    },
    tel: {
      empty: "Вы не заполнили поле телефон",
    },
    email: {
      empty: "Вы не указали почту",
    },
    file: {
      empty: "Вы не добавили файл",
    },
    privacy: {
      empty: "Вы не поставили флаг",
    },
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function validForm(formEl) {
    let isValid = true;
    let errorMessage = "";
    const formInputs = formEl.querySelectorAll("input");

      formInputs.forEach(function (formInput) {
      const formInputValue = formInput.value.trim();
      switch (formInput.getAttribute("type")) {
        case "text":
          if (formInputValue == "" || formInputValue.length < 2) {
            errorMessage += errorsMsgs.name.empty + "\r\n";
            formInput.parentNode.insertAdjacentHTML(
              "beforeend",
              `<span class="page-callback__form-err">${errorsMsgs.name.empty}</span>`
            );
            isValid = false;
          }
          break;
        case "tel":
          if (formInputValue == "" || formInputValue.length < 18) {
            errorMessage += errorsMsgs.tel.empty + "\r\n";
            formInput.parentNode.insertAdjacentHTML(
              "beforeend",
              `<span class="page-callback__form-err">${errorsMsgs.tel.empty}</span>`
            );
            isValid = false;
          }
          break;
        case "email":
          if (formInputValue == "" || !validateEmail(formInputValue)) {
            errorMessage += errorsMsgs.email.empty + "\r\n";
            formInput.parentNode.insertAdjacentHTML(
              "beforeend",
              `<span class="page-callback__form-err">${errorsMsgs.email.empty}</span>`
            );
            isValid = false;
          }
          break;
        case "checkbox":
          if (!formInput.checked) {
            errorMessage += errorsMsgs.privacy.empty + "\r\n";
           
            isValid = false;
          }
          break;
        default:
          break;
      }
    });

    return { errorMessage, isValid };
  }

  function callbackFormInit() {
    const popupForm = document.querySelector(".page-callback__form");

    if (popupForm) {

      const formInputs = popupForm.querySelectorAll("input");
      formInputs.forEach(function (formInput) {
        inputListener(formInput)
      })

      const submitBtn = popupForm.querySelector('[type="submit"]');
      popupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        submitBtn.disabled = true;

        // так же можно прикрутить капчи, проверки на сессию
        const validResult = validForm(popupForm);
       
        if (validResult.isValid && validResult.errorMessage == "") {
          let formData = new FormData(popupForm);
          submitBtn.disabled = false;

          for (var value of formData.values()) {
            console.log(value);
          }
          // fetch("", {
          //   method: "POST",
          //   body: formData,
          // })
          //   .then(function (resJson) {
          //     return resJson.json();
          //   })
          //   .then(function (res) {
          //     // показ статуса
          //   })
          //   .finally(function () {
          //     submitBtn.disabled = false;
          //     popupForm.reset();
          //   });
        } else {
          //  ошибки
          submitBtn.disabled = false;
        }
      });
    }
  }

  callbackFormInit();

  function inputListener(inputEl) {
    
    if (inputEl) {
      inputEl.addEventListener("change", function () {
        const inputParentEl = inputEl.parentNode;
        const errEl = inputParentEl.querySelector(".page-callback__form-err");
        if (errEl) {
          errEl.remove();
        }
      });
      inputEl.addEventListener("input", function () {
        const inputParentEl = inputEl.parentNode;
        const errEl = inputParentEl.querySelector(".page-callback__form-err");
        if (errEl) {
          errEl.remove();
        }
      });
    }
  }


});
