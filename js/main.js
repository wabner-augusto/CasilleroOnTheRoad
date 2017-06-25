$(document).ready(function() {

	/*Lightbox*/
	$('a.sim').on('click', function() {
		$('.lightbox').fadeOut();
	});
	
	$('a.nao').on('click', function() {
		$('.erro').fadeIn();
		$('.texto').hide();
		$('.botoes').fadeOut();
	});


	/* clique no horário
	//$('.horarios ul').on('click', function(e) {console.log('clicou em ', e.target)});
	$('#temp_horarios ul li a').on('click', function(e) { alert('clicou no <a>');
		e.preventDefault();
		console.log($(this));
		$(this).addClass('on');
		var quando = $(this).data('quando');
		var id_evento = $(this).data('id_evento');
		//e.preventDefault();
		//Jogo.seleciona_horario();
	});
	*/
	

	// lista os dias disponíveis
	var dadosCalendario = Jogo.lista_dias();
    var SelectedDates = dadosCalendario[0]; //console.log('SelectedDates', SelectedDates);
    var SeletedText = dadosCalendario[1];
    /*
    SeletedText[new Date('10/05/2016')] = '<h4>Título do Evento1</h4><p>Aqui vai um texto</p>';
    SeletedText[new Date('10/06/2016')] = '<h4>Título do Evento1</h4><p>Aqui vai um texto</p>';
    SeletedText[new Date('11/07/2016')] = '<h4>Título do Evento1</h4><p>Aqui vai um texto</p>'; 
	*/
	
	
	
    $('#datepicker').datepicker({
		dateFormat: 'dd/mm/yy',
		dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    	dayNamesMin: ['DOM','SEG','TER','QUA','QUI','SEX','SAB','DOM'],
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
    	monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    	monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
		altField: "#data",
      	altFormat: "yy-mm-dd",
      	onSelect: function() {
			Jogo.seleciona_dia();
      	},
        beforeShowDay: function(date) {
            var Highlight = SelectedDates[date];
            var HighlighText = SeletedText[date]; 
            if (Highlight) {
                return [true, "highlighted", HighlighText];
            }
            else {
                return [true, '', ''];
            }

        },
        onChangeMonthYear: function(year, month, inst) {
			/*
			$( '.agenda .ui-datepicker-calendar' ).tooltip("option", "content", function () {
        		console.log('UPDATE tooltip');
			    return 'teste'; //$(this).prop('title');
			});
			*/
		}
    });
	

	/* Tooltip */
	function tooltipInit() {
		//console.log('tooltipInit');
		$( '.agenda' ).tooltip({
			content: function () {
				return $(this).prop('title');
			},
			position: {
			my: "center bottom-15",
			at: "center top",
			using: function( position, feedback ) {
			  $( this ).css( position );
			  $( "<div>" )
				.addClass( "arrow" )
				.addClass( feedback.vertical )
				.addClass( feedback.horizontal )
				.appendTo( this );
			}
		  }
		});
	}
	
	tooltipInit();
	
	
	/* Scroll do menu */
	$('.scroll-to-link').on('click', function(){
		var index = $(this).attr('href').substr(1);
		$('body, html').animate({'scrollTop':$('.scroll-to-block[data-id="'+index+'"]').offset().top}, 500);
		return false;
	});

	/*$('.highlighted').on('click', function(){
		$('body, html').animate({'scrollTop':$('#horarios_scroll').offset().top}, 500);
		return false;
	});*/
});













Jogo = {

	lista_dias: function() {
		//$('.lightbox').hide();

	    var dias = {};
	    var baloes = {};

		var parametros  = "metodo=lista_dias";
			
		$.ajax({type:"GET", datatype:'json', url:endereco_padrao_ajax, data:parametros, async: false, success:function(retorno) {
			var dados = eval(Utils.limpa_retorno_ajax(retorno));
			var erro = dados[0];
			var mensagem_retorno = dados[1];
			console.log('lista_dias', dados[1]);

			if(erro==0) { 
				$.each(dados[1], function(k, v) {
					dias[new Date(v[1])] = new Date(v[1]);
					baloes[new Date(v[1])] = '<h4>' + v[2] + '</h4><p>' + v[3] + '</p>';
				});
			} else {
				alert(mensagem_retorno);
				return false;
			}
		}});	

	    return [dias, baloes];
	},


	seleciona_horario: function(e, elemento, id_evento, quando) { 
		e.preventDefault();
		$('#horario_escolhido').val(quando);
		$('#id_evento').val(id_evento);

		// marca o item clicado
		$('div.horarios ul li').removeClass('on');
		console.log($(elemento));
		$(elemento).parents('li').addClass('on');
	},


	seleciona_dia: function() {
		// busca os horários disponíveis no dia
		Jogo.lista_horarios($('#data').val());

		// TODO: fazer o scroll subir, pra ficar claro que a lista foi atualizada
	},



	lista_horarios: function(quando) {//alert(quando);
		var parametros  = "metodo=lista_horarios";
			parametros += "&quando=" + quando;
			parametros += "&modo=1";
			
		$.ajax({type:"GET", datatype:'json', url:endereco_padrao_ajax, data:parametros, success:function(retorno) {
			var dados = eval(Utils.limpa_retorno_ajax(retorno));
			var erro = dados[0];
			var mensagem_retorno = dados[1];
			var id_evento = dados[2];
			//console.log('horários', dados);
			if(erro==0) { 
				$('#id_evento').val(id_evento);
				$('div.horarios').html('<ul>');
				$.each(dados[1], function(k, v) {
					$('.data-select .data').text(quando.substr(quando.length - 2));
					$('div.horarios ul').append('<li><a href="#" onclick="Jogo.seleciona_horario(event, this, ' + dados[2] + ', \'' + quando + ' ' + v + '\')"><span class="titulo">CasilleroOnTheRoad - </span><span class="hora">' + v + ' PM</span></a></li>');	
					$('#grupo_horarios').slideDown('fast', function() {
						//location.href = "#grupo_horarios";
						document.querySelector('#grupo_horarios').scrollIntoView({ 
						  behavior: 'smooth' 
						});
					});

					//$('body, html').animate({'scrollTop':$('#horarios_scroll').offset().top}, 500);
					
				});
			} else {
				if(mensagem_retorno!==null) {
					alert(mensagem_retorno);
				}
				return false;
			}
		}});	

		return false;
	},



	submete: function() {
		$('.alert').fadeOut();
		$('.loading').fadeIn();
		var parametros  = "metodo=inscreve_jogador";
			parametros += "&quando=" + $('#horario_escolhido').val();
			parametros += "&id_evento=" + $('#id_evento').val();
			parametros += "&nome=" + $('#jogador_nome').val();
			parametros += "&email=" + $('#jogador_email').val();
			parametros += "&idade=" + $('#jogador_idade').val();
			
		$.ajax({type:"GET", datatype:'json', url:endereco_padrao_ajax, data:parametros, success:function(retorno) {
			var dados = eval(Utils.limpa_retorno_ajax(retorno));
			var erro = dados[0];
			var mensagem_retorno = dados[1];

			$('.loading').fadeOut();
			$('.alert').html(mensagem_retorno);
			$('.alert').fadeIn();

			if(erro==0) { 
				// SUCESSO
				$('div.horarios ul li.on').remove();
				$('#cadastro')[0].reset();
			}

			/*if(erro==0) { 
				alert(mensagem_retorno);
			} else {
				alert(mensagem_retorno);
			}*/
		}});	

		return false;
	}
};



/*_____________________________________*/


Utils = {
	limpa_retorno_ajax: function(retorno) {
		retorno=retorno.replace(/\+/g," ");
		return unescape(retorno);
	}

};