
export function formInit() {
	const form = document.querySelector('.subscribe-footer__form');

	form.addEventListener("submit", formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);

		if (error === 0) {
			form.classList.add('_sending');

			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				form.reset();
				form.classList.remove('_sending');
			} else {
				alert('Ошибка!');
				form.classList.remove('_sending');
			}
		} else {
		
		}
	}

	//Валидация формы
	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('[data-req]');

		formReq.forEach(input => {
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			}
		});
		return error;
	}

	// проверяем на правильность емейл
  function emailTest (input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }

	//Показ ошибки
	function formAddError(input) {
			input.parentElement.classList.add('_error');
	}

	//Удаление ошибки
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
	}

}




