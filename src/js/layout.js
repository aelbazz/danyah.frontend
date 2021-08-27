$(function () {
    function animateValue(element) {
        let end = element.data('counter'),
            start = 0,
            duration = 3000;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.html(Math.floor(progress * (end - start) + start));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
        $(element).addClass("counter-done")
    }

    $(window).on("scroll", function () {
        if ($(window).scrollTop() < 80) {
            $("body").removeClass("is-sticky_header");
        } else {
            $("body").addClass("is-sticky_header");
        }
    });
    counterAnimate()
    $(window).on("scroll", function () {
        counterAnimate();
    });

    function counterAnimate() {
        if ($(window).scrollTop() > 940) {
            $('.counter_number_digits:not(.counter-done)').each((idx, elem) => {
                animateValue($(elem))
            })
        }
    }
})