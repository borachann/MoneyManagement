/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ko'] = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: ['មករា','កុម្ភះ','មីនា','មេសា','ឧសាភា','មិថុនា',
		'កក្កដា','សីហា','កញ្ញា','តុលា','វិចិ្ចការ','ធ្នូរ'],
		monthNamesShort: ['មករា','កុម្ភះ','មីនា','មេសា','ឧសាភា','មិថុនា',
		'កក្កដា','សីហា','កញ្ញា','តុលា','វិចិ្ចការ','ធ្នូរ'],
		dayNames: ['អា','ច','អ','ព','ព្រ','សុ','ស'],
		dayNamesShort: ['អា','ច','អ','ព','ព្រ','សុ','ស'],
		dayNamesMin: ['អា','ច','អ','ព','ព្រ','សុ','ស'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: '',
		changeYear: true,
        changeMonth: true
	};
	$.datepicker.setDefaults($.datepicker.regional['ko']);
});