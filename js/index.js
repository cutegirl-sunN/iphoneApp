var app = angular.module("contain", []);

app.controller("mainCtrl", ["$scope",
	function($scope) {
		$scope.color = ['orange', 'purple', 'blue', 'green', 'grey', 'red', 'yellow'];
		$scope.colors=["p","g","b","y","gr","r","o"]
		$scope.cu=0;
		if(localStorage._r){
			$scope.list=JSON.parse(localStorage._r)
		}else{
			$scope.list=[
//				{id:101,
//				name:"吃饭",
//				theme:"orange",
//				todos:[
//					{id:1,name:"玩儿",state:0}
//				]}
			];
		}
		
//		$scope.list = [{
//			id: 100,
//			name: "提醒",
//			theme: "orange",
//		}, {
//			id: 101,
//			name: "新列表",
//			theme: "purple",
//		}];
		$scope.delete=function(){
			$scope.list.splice($scope.cu,1)
		}
		$scope.colorlist=[
		{color:"p"},{color:"g"},{color:"b"},{color:"y"},{color:"gr"},{color:"r"},{color:"o"}
		]
		//添加
		$scope.addList = function() {
			var len = $scope.list.length;
			var max=maxId()
			var index = len % 7;
			var v = {
				id: maxId()+1,
				name: "新列表" + (len + 1),
				theme: $scope.color[index],
				todos:[]
			};
			$scope.list.push(v)
		}
		//计算已完成的数量
		$scope.count=function(){
			var r=0;
			$scope.list[$scope.cu].todos.forEach(function(v,i){
				console.log(2)
				if(v.state===1){
					r++
				}
			});
			return r;
		}
		//计算未完成的数量
		$scope.count2=function(){
			var r=0;
			$scope.list[$scope.cu].todos.forEach(function(v,i){
				if(v.state===0){
					r++
				}
			});
			return r;
		}
		//点击未完成三角
		$scope.dian2=function(){
			$('.dian2').toggleClass("list-block");
			$('.nr').toggleClass('nr-none');
		}
		
		//点击已完成三角
		$scope.dian=function(){
			$('.dian').toggleClass("list-block2");
			$('.wclist').toggleClass('wclist-none');
		}
		//清除已完成
		$scope.clear=function(){
			var newarr=[];
			$scope.list[$scope.cu].todos.forEach(function(v,i){
				if(v.state===0){
					newarr.push(v);
				}
			});
			$scope.list[$scope.cu].todos=newarr;
		}
		
		//	选项里边的取消与完成函数
		$scope.cancel=function(){
			var hidden=$(".chosebox");
			hidden.hide();
		}
		
		
		//	将lists数据当中的数据存转换为localStorage认识的字符串格式并存储到localStorage当中
		$scope.save2local=function(){
			localStorage._r=JSON.stringify($scope.list);
		}
		//  获取lists数组当中的最大的那个id，并将max返回
		function maxId(){
			var max=-Infinity;
			for(var i=0;i<$scope.list.length;i++){
				var v=$scope.list[i]
				if(v.id>max){
					max=v.id;
				}
			}
			return (max === -Infinity) ? 101:max;
		}
		
		
		//颜色选择
//		$scope.color=function(e){
//			e.preventDefault();
//			e.StopIteration();
//			$(".color").toggleClass("click");
//			return false;
//		}
	}
])
app.directive("myUl", [
	function() {
		return {
			restrict: "A",
			replace: true,
			template: "<ul class='tixing'><div ng-transclude></div></ul>",
			transclude: true,
			link: function($scope, el) {
				$(el).on("keyup",":input",false)
				$(el).on("click", "li", function() {
					$(el).find("li").removeClass('active');
					$(this).addClass('active');
					var self=this;
					$scope.$apply(function(){
						$scope.cu=$(self).index()
					})
				})
				$(".pad input").on("keyup",false)
				$(el).on("keyup","input",false)
				$(document).on("keyup", function(e) {
					if (e.keyCode === 8) {
						var index = $(".active").index();
						if (index === -1) {
								return
							}
						$scope.$apply(function(){
								$scope.list.splice(index, 1)
								$scope.save2local();
						})
						
					}
				})
			}
		}
	}
])
//添加一个自定义属性butto
app.directive("myButton",[function(){
	return{
		restrict:"A",
		replace:true,
		template:"<div class='chose {{list[cu].theme}}' >选项<div ng-transclude></div></div>",
		transclude:true,
		link:function($scope,el){
			//组织冒泡
			$(document).on("keyup",":input",false)
			$(el).on("click",function(){
				$('.chosebox').toggle();
				return false;
			})
			
			$(".chosebox").on("click",false);
			$(document).on("click",function(){
				$(".chosebox").hide(); 
			})
		}
	}
}])




app.directive("block",[function(){
	return{
		restrict:"AE",
		template:'<div class="new"><div class="row-divider-top"></div><div class="row-divider-bottom"></div><label for="" class="text">新项目...</label></div></div>',
		replace:true,
		link:function($scope,el){
			
			var obj=$(".item-view");
			$(el).on("click",function(){
//				console.log(1)
				obj.css("display","block");
				$(".item-view input").focus()
//				$(".item-view").toggle()
				return false;
			})
			obj.on("click",false)
//			$(".item-view").on("click",false)
			$(document).on("click",function(){
				obj.css("display","none");
////				$(".item-view").hide()
			})
			
		}
		
	}
	
	
}])