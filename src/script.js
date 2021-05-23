document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#form');
    const loader = document.querySelector('.loader');
    const formHandler = (event) => {
        event.preventDefault();
        const captchaField = event.target.elements['captcha'];
        if (!captchaField.value) return;
        const req = fetch('/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ captcha: captchaField.value }),
        });
        req.then((data) => {
            if (!data.ok) {
                loadCaptcha();
            } else {
                alert('Красава, ввел капчу верно :)');
                loadCaptcha();
            }
        });
    };

    function Captcha({ selector, width, height }) {
        this.$el = document.querySelector(`${selector}`);
        this.ctx = this.$el.getContext('2d');
        this.width = width;
        this.height = height;
        this.init();
    }

    Captcha.prototype.init = function () {
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.ctx.font = '24px Tahoma';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    };

    Captcha.prototype.getEl = function () {
        return this.$el;
    };

    Captcha.prototype.draw = function (text) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeText(
            text,
            this.$el.clientWidth / 2,
            this.$el.clientHeight / 2
        );
    };

    const captcha = new Captcha({
        selector: '#captcha',
        width: 177,
        height: 80,
    });

    function loadCaptcha() {
        captcha.getEl().style.display = 'none';
        loader.style.display = 'block';
        const req = fetch('/captcha');
        req.then((data) => {
            return data.json();
        }).then((data) => {
            if (data.text) {
                setTimeout(() => {
                    captcha.getEl().style.display = 'block';
                    captcha.draw(data.text);
                    loader.style.display = 'none';
                }, 1000);
            }
        });
    }
    loadCaptcha();

    form.addEventListener('submit', formHandler);
});
