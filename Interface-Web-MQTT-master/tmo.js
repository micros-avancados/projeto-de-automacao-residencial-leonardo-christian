(function() {
	window.Main = {};
	Main.Page = (function() {
		var mosq = null;
		function Page() {
			var _this = this;
			mosq = new Mosquitto();

			$('#connect-button').click(function() {
				return _this.connect();
			});
			$('#disconnect-button').click(function() {
				return _this.disconnect();
			});
			$('#subscribe-button').click(function() {
				return _this.subscribe();
			});
			$('#unsubscribe-button').click(function() {
				return _this.unsubscribe();
			});
			
			
			$('#liga-output').click(function() {
				var payload = "L";  
				var TopicPublish = "mcu/temperatura/EnviaSensor";				
				mosq.publish(TopicPublish, payload, 0);
			});

			
			$('#desliga-output').click(function() {
				var payload = "D";  
				var TopicPublish ="mcu/temperatura/EnviaSensor";				
				mosq.publish(TopicPublish, payload, 0);
			});

			mosq.onconnect = function(rc){
				var p = document.createElement("p");
				var topic = "mcu/temperatura/Recebe";
				p.innerHTML = "Conectado ao Broker temperatura!";
				$("#debug").append(p);
				mosq.subscribe(topic, 0);

				var topic = "mcu/saida/Recebe";
				p.innerHTML = "Conectado ao Broker saida!";
				$("#debug").append(p);
				mosq.subscribe(topic, 0);

				var topic = "mcu/temperatura/RecebeSensor";
				p.innerHTML = "Conectado ao Broker temperatura!";
				$("#debug").append(p);
				mosq.subscribe(topic, 0);

				var topic = "mcu/saida/RecebeSensor";
				p.innerHTML = "Conectado ao Broker saida!";
				$("#debug").append(p);
				mosq.subscribe(topic, 0);
				
			};
			mosq.ondisconnect = function(rc){
				var p = document.createElement("p");
				var url = "ws://iot.eclipse.org/ws";
				
				p.innerHTML = "A conexão com o broker foi perdida";
				$("#debug").append(p);				
				mosq.connect(url);
			};
			mosq.onmessage = function(topic, payload, qos){
				var p = document.createElement("p");
				var acao = payload[0];
				
				var saida = payload.includes("saida");

				var temperatura = payload.includes("temperatura");

				if (saida)
				{
					console.log(payload);
				}

				if (temperatura)
				{
					p.innerHTML = payload
					$("#status_io").html(p);
					
					var payload = temperatura;  
					var TopicPublish = "mcu/temperatura/EnviaSensor";				
					mosq.publish(TopicPublish, payload, 0);
					
				}
					
				
				//escreve o estado do output conforme informação recebida
				/*
				if (acao == 'L')
					p.innerHTML = "<center><img src='ligado.png'></center>"
				else
					p.innerHTML = "<center><img src='desligado.png'></center>"
				*/
			};
		}
		Page.prototype.connect = function(){
			var url = "ws://iot.eclipse.org/ws";
			mosq.connect(url);
		};
		Page.prototype.disconnect = function(){
			mosq.disconnect();
		};
		Page.prototype.subscribe = function(){
			var topic = $('#sub-topic-text')[0].value;
			mosq.subscribe(topic, 0);
		};
		Page.prototype.unsubscribe = function(){
			var topic = $('#sub-topic-text')[0].value;
			mosq.unsubscribe(topic);
		};
		
		return Page;
	})();
	$(function(){
		return Main.controller = new Main.Page;
	});
}).call(this);

