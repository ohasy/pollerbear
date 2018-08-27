// var host_url = "http://192.168.43.195:3000/"
var host_url = "http://192.168.1.30:3000/"
var width = '100%';
var height = '100%';
$(document).ready(function(){

  $('.sidenav').sidenav();

  $("#voted").hide();
  $("#share-link-block").hide();
    console.log("doc ready");

  //   $('#question').validate({
  //     // rules, options, etc.,
  //     onfocusout: function(element) {
  //         // "eager" validation
          
  //         this.element(element);  
  //     }
  
  // });
          $(".add-question").on('click',function(e){
            e.preventDefault();
            console.log("add ques");
            var win = window.open(host_url+'poll', '_blank');
              if (win) {
                  //Browser has allowed it to be opened
                  win.focus();
              } else {
                  //Browser has blocked it
                  alert('Please allow popups for this website');
              }
          })

          $(".share-poll").on('click',function(e){
            e.preventDefault();
            //alert(navigator.share);
            console.log("share");
            if (navigator.share) {
              navigator.share({
                  title: 'Web Fundamentals',
                  text: 'Check out Web Fundamentals — it rocks!',
                  url: 'https://developers.google.com/web',
              })
                .then(() => console.log('Successful share'))
                .catch((error) => {
                  var poll_id = $("form[name='vote-form']").attr('id');
                  $("#share-link-input").val(host_url+"poll/"+poll_id);
                  $("#share-link-block").show();
                });
            }
            else {
              var poll_id = $("form[name='vote-form']").attr('id');
              $("#share-link-input").val(host_url+"poll/"+poll_id);
              $("#share-link-block").show();
                
            }
            
          })
          
          $("#copy-button").on('click',function(e){
                $("#share-link-input").focus();
                $("#share-link-input").select();
                document.execCommand("copy");
          })


          $("#addOption").on('click',function(e){

            var option ='<div class="row input-field col s12"><input id="choice" type="text" class="validate"><label for="choice">Answer 1</label></div>'
            e.preventDefault();
            $(option)
            // .attr("id", "myfieldid")
            // .attr("name", "myfieldid")
            .appendTo(".choices");
          })

           $("#submit_poll").on('click',function(e){
            e.preventDefault();
            var question = $("#question").val();
            if(isEmpty(question)){
              $(".question-block span").attr('data-error','This field can not be left empty');
              $(".question-block input").addClass('invalid');

              console.log("empty",question);
            }
            else{
              console.log("submit",question);
              var url = host_url+'poll/add';
              var choicesArray = [];
              $( ".form_poll" ).children(".choices").children('.input-field').children('#choice').each(function() {
                var currentVal = $( this ).val()
                choicesArray.push({text:currentVal})
              });

              console.log("choice array",choicesArray)


              
              var dataObject = {
                question:question,
                choices:JSON.stringify(choicesArray)
              }
              console.log("dataObject",dataObject);
              $.post(url,dataObject).always().then(function(data){
                console.log('done',data);
                console.log("data id",data._id)
                try {
                  window.location.replace(host_url+'poll/' + data._id);
                }
                catch (e){
                  window.location = host_url + 'poll/' + data._id;
                }
               
                // $.get('http://localhost:3000/poll/'+data._id).always().then(function(data){
                //     console.log("data get",data);
                // }).catch(function(err){
                //   console.log("err get",err);
                // })

              }).catch(function(err){
                console.log('err',err.responseJSON);
              })
              
              
              // function(data){

              // })
              // console.log("process",url);
            }

            
          })


          //on answer page


          $(".vote-button").on('click',function(e){
            e.preventDefault();
            console.log("voted clickd");
            var choice_id = $("input:radio[name='vote-input']:checked").attr('id');
            var poll_id = $("form[name='vote-form']").attr('id');
            //alert("choice"+checkedValue,"form"+pollId);
            var reqObject ={
              poll_id:poll_id,
              choice_id:choice_id
            }
            console.log("req",reqObject);
            $.post(host_url+'poll/vote',reqObject).always().then(function(data){
              
              $("#voted p").html("You have successfully voted").addClass('green-text').removeClass('red-text');
              $("#voted").show();
              ///* to instantly update the votes below ...
              if(data.choices && data.choices.length > 0){
                  data.choices.forEach(function(item,index){
                        $(".collection-item").each(function(indexHTML,itemHTML){
                          if($(this).attr('id') == item._id){
                            $(this).children('span').text(item.votes);
                          }

                          
                        })
                  })
              }
              //*/
              // $(".collection-item").each(function(indexHTML,itemHTML){
              //   console.log("werid stuff",$(this).attr("id"));
              //   //console.log("werid stuff votes",$(this).children('span').text("hu"));
              //   //console.log("indxex",indexHTML,"itemm",itemHTML);
              //   console.log("item clicked before loop",$(this).attr('id'));
              //   //console.log("itemHTML ID",$(itemHTML).attr("id"))
              //   if(data.choices && data.choices.length > 0 ){
              //     data.choices.forEach(function(item,index){
              //       console.log("item",item,"\n","index:",index);
              //       console.log("item clicked",$(this).attr('id'));
              //        if($(this).attr('id') == item._id){
              //         $(this).children('span').text("wht")
              //        // $(itemHTML).attr("votes",item.votes);
              //        // $(this).attr('votes',item.votes);
              //        }
              //        else{
              //         $(this).children('span').text("wht")
              //        }
              //     })
              //   }
              // })

            //   var source = $("body").html();
            //   var template = Handlebars.compile(source);
            //   console.log("body",source);
            //   $('body').html(template({data}));
            //               // $(".vote-input").each(function(index){
            // //   console.log(index+':'+(this).val())
            // // })
            //experimental ---->
              setTimeout(function(){
                var divPosition = $('#votes-collection').offset();
                $('html, body').animate({scrollTop: divPosition.top}, "slow");
              },1000);

            }).catch(function(err){
              if(err.responseText == "You have already voted"){
                $("#voted p").html("You have already voted").addClass('red-text').removeClass('green-text');
                $("#voted").show();
              }

              console.log("err",err);
            })
            // $(".vote-input").each(function(index){
            //   console.log(index+':'+(this).val())
            // })
          })

          // var options = {
          //   title: {
          //     text: "People Voted"
          //   },
          //   data: [{
          //       type: "pie",
          //       startAngle: 45,
          //       showInLegend: "true",
          //       legendText: "{label}",
          //       indexLabel: "{label} ({y})",
          //       yValueFormatString:"#,##0.#"%"",
          //       dataPoints: [
          //         { label: "Organic", y: 36 },
          //         { label: "Email Marketing", y: 31 },
          //         { label: "Referrals", y: 7 },
          //         { label: "Twitter", y: 7 },
          //         { label: "Facebook", y: 6 },
          //         { label: "Google", y: 10 },
          //         { label: "Others", y: 3 }
          //       ]
          //   }]
          // };
          // $("#chartContainer").CanvasJSChart(options);
          // $(window).on("throttledresize", function (event) {
          //   width = '100%';
          //   height = '100%';
          // });
          // google.charts.load("current", {packages:["corechart"]});
          // google.charts.setOnLoadCallback(drawChart);
          // function drawChart() {
          //   var data = google.visualization.arrayToDataTable([
          //     ['Task', 'Hours per Day'],
          //     ['Work',     11],
          //     ['Eat',      2],
          //     ['Commute',  2],
          //     ['Watch TV', 2],
          //     ['Sleep',    7]
          //   ]);


    
          //   var options = {
          //     title: 'Poll report',
          //     pieHole: 0.4,
          //     width: 'auto',
          //     height: 'auto',
          //   };
    
          //   var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
          //   chart.draw(data, options);
          // }     


          $(".refresh-button").on('click',function(e){
            e.preventDefault();
            var poll_id = $("form[name='vote-form']").attr('id');
            console.log("poll_id",poll_id);
            $.post(host_url+'poll/'+poll_id,{json:true}).always().then(function(data){
              if(data.choices && data.choices.length > 0){
                data.choices.forEach(function(item,index){
                      $(".collection-item").each(function(indexHTML,itemHTML){
                        if($(this).attr('id') == item._id){
                          $(this).children('span').text(item.votes);
                        }
                      })
                })
            }
            plot2.replot();
            plot1.replot();
              console.log("data",data);
            })
          })
          
          //plotting --- >
          var data1 = [[['a', 210],['b ', 111], ['c', 74], ['d', 72],['e', 49]]];
          var toolTip1 = ['Red Delicious Apples', 'Parson Brown Oranges', 'Cavendish Bananas', 'Albaranzeuli Nero Grapes', 'Green Anjou Pears'];
       
          var plot1 = jQuery.jqplot('chartdiv', 
              data1,
              {
                  title: ' ', 
                  seriesDefaults: {
                      shadow: false, 
                      renderer: jQuery.jqplot.PieRenderer, 
                      rendererOptions: { padding: 2, sliceMargin: 2, showDataLabels: true }
                  },
                  legend: {
                      show: true,
                      location: 'e',
                      fontSize: 11,
                      width:40,
                      renderer: $.jqplot.EnhancedPieLegendRenderer,
                      rendererOptions: {
                          numberColumns: 1,
                          toolTips: toolTip1
                      }
                  },
              }
          );
        
        
          // plot 2
        $.jqplot.config.enablePlugins = true;
        var s1 = [2, 6, 7, 10];
        var ticks = ['a', 'b', 'c', 'd'];
        //  plot1.replot()
        var plot2 = $.jqplot('chartdiv2', [s1], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            animateReplot:!$.jqplot.use_excanvas,
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
          //   axesDefaults: {
          //     tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
          //     tickOptions: {
          //       angle: -30,
          //       fontSize: '10pt'
          //     }
          // },
          axes: {
            xaxis: {
              renderer: $.jqplot.CategoryAxisRenderer,
              ticks:ticks
            }
          },
            highlighter: { show: false }
        });
     
        $('#chartdiv2').bind('jqplotDataClick', 
            function (ev, seriesIndex, pointIndex, data) {
                $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
            }
        );
});




