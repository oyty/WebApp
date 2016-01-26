var isNavHover=false;

//focus img player
var t = n = 0;
var count = 0;

function g(obj){return document.getElementById(obj);}
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");if(arr=document.cookie.match(reg)){return unescape(decodeURI(arr[2]));}else{return "";}
}
function setCommentForm(name,email,url){
	if(g("author")!=null)g("author").value=name;
	if(g("email")!=null)g("email").value=email;
	if(g("url")!=null)g("url").value=url;
}
function checkComment(){
	var cm=g('comment').value;
	if(cm==""){alert("妈妈说发评论是要先写点字的！");return false}
	if(g('author') && g('email')){
		if(g('author').value=="" ||g('email').value==""){
			alert("嘿嘿，昵称和Email都要写上哦……");return false;
		}
	}
	var re =/[\u4E00-\u9FA5]{1,}/ig;
	var r = cm.match(re);
	if(r==null || r.length<=0){
		alert("为了促进世界和平与社会和谐，你至少要写一个中文字的说……");
		return false;
	}else{
		re=/下载|下載|地址|怎么下|怎样下|哪下|哪里下|那下|那里下|下不了|求连接|求链接|连接在哪|链接在哪|种子/;
		r = cm.match(re);
		if(r.length>0){
			if(confirm("请问你是正在找下载地址吗？")){
				var msg="好吧，请给 abcdef 发送一封邮件，我会回复给你的。";msg=msg.replace("ef","qq.com");msg=msg.replace("cd","ftcom+");msg=msg.replace("ab","iplayso");msg=msg.replace("+","@");alert(msg);
				return false;
			}else{
				if(confirm("不是找下载的话，那么，继续发表这评论？")){
					return true;
				}else{
					return false;
				}
			}
		}
	}
	return true;
}
function commentHotkey(){
	if(g('comment')==null)return;
	g('comment').onkeydown = function (moz_ev)	{
		var ev = null;
		if (window.event){
			ev = window.event;
		}else{
			ev = moz_ev;
		}
		if (ev != null && ev.ctrlKey && ev.keyCode == 13)
		{
			document.getElementById('submit').click();
		}
	}
}

function copy_code(text) {
  if (window.clipboardData) {
    window.clipboardData.setData("Text", text)
	alert("已经成功复制到剪贴板！");
  } else {
	var x=prompt('你的浏览器可能不能正常复制\n请你手动进行：',text);
  }
  //return false;
}

function isMobile(){
	var ua=navigator.userAgent.toLowerCase();
	if (ua.indexOf('iphone') != -1)return "iphone";
	if (ua.indexOf('ipod') != -1)return "ipod";
	if (ua.indexOf('ipad') != -1) return "ipad";
	if (ua.indexOf('android') != -1) return "android";
	return false;
}

function shareto(id){

	if (typeof(shareto_img)=='undefined'){
		var pic="";
	}else{
		var pic=shareto_img;
	}

	//if(pic==""){
		var tqq_pic=pic;
		var imgArr=new Array();
		$('.entry-content img').each(function(index) {
			imgArr[index]=$(this).attr("src");
		});
		if(imgArr){
			if(tqq_pic!=""){tqq_pic=tqq_pic+"|";}
			tqq_pic=tqq_pic+imgArr.join("|");
		}
	//}

	var url=encodeURIComponent(document.location.href);
	var title=encodeURIComponent(document.title);
	if(id=="fav"){
		addBookmark(document.title);
		return;
	}else if(id=="qzone"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'QZone', 1]);
		window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url);
		return;
	}else if(id=="twitter"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Twitter', 1]);
		window.open('http://twitter.com/home?status='+title+encodeURIComponent(' ')+url,'_blank');
		return;
	}else if(id=="sina"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'SinaT', 1]);
		//window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&source=bookmark','_blank');
		//window.open("http://v.t.sina.com.cn/share/share.php?url="+url+"&appkey=610475664&title="+title+"&pic="+pic,"_blank","width=615,height=505");
		window.open("http://service.weibo.com/share/share.php?url="+url+"&appkey=610475664&title="+title+"&pic="+pic+"&ralateUid=1642980755","_blank","width=615,height=505");
		return;
	}else if(id=="qqshuqian"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'QQShuqian', 1]);
		window.open('http://shuqian.qq.com/post?from=3&jumpback=2&noui=1&uri='+url+'&title='+title,'_blank','width=930,height=570,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');
		return;
	}else if(id=="baidu"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Baidu', 1]);
		window.open('http://cang.baidu.com/do/add?it='+title+'&iu='+url+'&fr=ien#nw=1','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
		return;
	}else if(id=="googlebuzz"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'GoogleBuzz', 1]);
		window.open('http://www.google.com/buzz/post?url='+url+'&imageurl='+pic,'_blank');
		return;
	}else if(id=="douban"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Douban', 1]);
		var d=document,e=encodeURIComponent,s1=window.getSelection,s2=d.getSelection,s3=d.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',r='http://www.douban.com/recommend/?url='+e(d.location.href)+'&title='+e(d.title)+'&sel='+e(s)+'&v=1',x=function(){if(!window.open(r,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330'))location.href=r+'&r=1'};
		if(/Firefox/.test(navigator.userAgent)){setTimeout(x,0)}else{x()}
		return;
	}else if(id=="renren"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'RenRen', 1]);
		window.open('http://www.connect.renren.com/share/sharer?url='+url+'&title='+title,'_blank','resizable=no');
		return;
	}else if(id=="xianguo"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'XianGuo', 1]);
		window.open('http://xianguo.com/service/submitdigg/?link='+url+'&title='+title,'_blank');
		return;
	}else if(id=="digu"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Digu', 1]);
		window.open('http://www.diguff.com/diguShare/bookMark_FF.jsp?title='+title+'&url='+url,'_blank','width=580,height=310');
		return;
	}else if(id=="mail"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Mail', 1]);
		window.open('mailto:?subject='+title+'&body='+encodeURIComponent('这是我看到了一篇很不错的文章，分享给你看看！\r\n\r\n')+title+encodeURIComponent('\r\n')+url);
		return;
	}else if(id=="tqq"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'TQQ', 1]);
		var tqq_appkey = encodeURI("468235b5feec4c5a9b02e4fbe679fa52");
		window.open('http://v.t.qq.com/share/share.php?appkey='+tqq_appkey+'&title='+title+'&site=http://www.iplaysoft.com&pic='+tqq_pic+'&url='+url+encodeURI(" (来自@xtremforce)"),'_blank','width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
		return;
	}
}

function ShareButtons(){
	document.write('<div class="social_share">');
	document.write('<a class="sharebutton" id="share_qzone" href="javascript:shareto(\'qzone\');" title="分享到QQ空间"></a>');
	document.write('<a class="sharebutton" id="share_sina" href="javascript:shareto(\'sina\');" title="分享到新浪微博"></a>');
	document.write('<a class="sharebutton" id="share_tqq" href="javascript:shareto(\'tqq\');" title="分享到 QQ 腾讯微博"></a>');
	document.write('<a class="sharebutton" id="share_qqshuqian" href="javascript:shareto(\'qqshuqian\');" title="收藏到QQ书签"></a>');
	document.write('<a class="sharebutton" id="share_twitter" href="javascript:shareto(\'twitter\');" title="分享到Twitter"></a>');
	document.write('<a class="sharebutton" id="share_renren" href="javascript:shareto(\'renren\');" title="分享到人人网"></a>');
	document.write('<a class="sharebutton" id="share_baidu" href="javascript:shareto(\'baidu\');" title="收藏到 - 百度搜藏"></a>');
	document.write('<a class="sharebutton" id="share_googlebuzz" href="javascript:shareto(\'googlebuzz\');" title="分享到 Google Buzz"></a>');
	document.write('<a class="sharebutton" id="share_douban" href="javascript:shareto(\'douban\');" title="分享到豆瓣"></a>');
	//document.write('<a class="sharebutton" id="share_xianguo" href="javascript:shareto(\'xianguo\');" title="分享到鲜果网"></a>');
	document.write('<a class="sharebutton" id="share_digu" href="javascript:shareto(\'digu\');" title="分享到嘀咕"></a>');
	document.write('<a class="sharebutton" id="share_mail" href="javascript:shareto(\'mail\');" title="发送邮件分享给朋友"></a>');
	document.write('</div>');
}


function addBookmark(title){
    var url = parent.location.href;
    if (window.sidebar) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(title, url,"");
    } else if(document.all) { // IE Favorite
        window.external.AddFavorite( url, title);
    } else if(window.opera) { // Opera 7+
        return false; // do nothing
    } else { 
         alert('请按 Ctrl + D 为Chrome浏览器添加书签!');
    }
}

function shffleArray(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
}
 

$(document).ready(function(){
/*
if($("#postlist img")) {
	$("#postlist img").lazyload({
		 placeholder:"http://www.iplaysoft.com/plus/images/grey.gif",       
		 effect:"fadeIn"
	 });
}

if($(".entry-content img")){
	$(".entry-content img").lazyload({
		 placeholder:"http://www.iplaysoft.com/plus/images/grey.gif",       
		 effect:"fadeIn"
	 });
}
*/

//nav sub menu
$('.nav_sub,.nav_sub_div').hover(
	function() {
		if(isNavHover==false ){$('.nav_sub_div').hide();}//fadeOut(500);}
		isNavHover=true;
		$(this).children('.nav_sub_div').fadeIn(500);
	},
	function() {
		setTimeout(
			function () {
			if(!isNavHover){
				$('.nav_sub_div').hide();//fadeOut(500);
			}}
		,750);
		isNavHover=false;
	}
);

//1st post show
$('#section_show_post').hover(
	function() {
		$("#post_show_link_l,#post_show_link_r").stop(true,true);
		$("#post_show_link_l,#post_show_link_r").fadeIn();
	},
	function() {
		$("#post_show_link_l,#post_show_link_r").stop(true,true);
		$("#post_show_link_l,#post_show_link_r").fadeOut();
	}
);

$("#post_show_link_l,#post_show_link_r").click(function(){
	// if($(this).attr("rel")=="0")return;
	 $.ajax({
	   type: "POST",
	   url: "/plus/api/ajax_getposts.php",
	   data: "type=post_show&post_show_id="+$(this).attr('rel'),
	   error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert ("通信失败...");
		},
		beforeSend:function(){
		 $("#show_post_entry").html('<div id="post_show_loading"><img src="/plus/images/loading.gif" /><br/><br/>主人稍等耶，我给你老人家找文章去...</div>');
		},
	   success: function(msg){
		 $("#show_post_entry").hide();
		 $("#show_post_entry").html(msg);
		 $("#show_post_entry").fadeIn();
	   }
	 });
});

//Hot Tab Index
var isTabRndHover;
var isTabDivHover;
isTabRndHover=true;isTabDivHover=false;
$("#hot_tab_year_view,#hot_tab_month_view,#hot_tab_year,#hot_tab_month,#hot_tab_rnd,#hot_tab_comment,#hot_tab_new").click(function(){
	 $("#hot_tab_list").html('<div class="hot_tab_loading"><img src="/plus/images/loading.gif" /></div>');
	 $(".current_tab").removeClass("current_tab");
	 $(this).addClass("current_tab");
	 if($(this).attr("id")=="hot_tab_rnd"){isTabRndHover=true;}else{isTabRndHover=false;}
	 if($(this).attr("id")=="hot_tab_new"){
		$("#hot_tab_list").load("/plus/static_files/newposts_for_hotab.html");
	 } else
	{
		$("#hot_tab_list").load("/plus/api/ajax_getposts.php",{"type":$(this).attr("id")});
	}
	 return false; 
});
$("#hot_tab_list").mouseover(function(){isTabDivHover=true;})
$("#hot_tab_list").mouseout(function(){isTabDivHover=false;})

		
/*setInterval(function() {
	if(isTabRndHover&&(!isTabDivHover)){  
		$("#hot_tab_list").html('<div class="hot_tab_loading"><img src="'+themeUrl+'/images/loading.gif" /></div>');
		$("#hot_tab_list").load(themeUrl+"/js/ajax.php",{"type":"hot_tab_rnd"});
	}
} ,8000)
*/

$("#hot_tab_ctl_l,#hot_tab_ctl_r").click(function(){
alert("囧rz..  这个小东西真的什么功能都没有的，别再点啦……");
});

$('.comment_body').hover(
	function() {
		$(this).find('.commentmetadata').stop(true,true).show();
	},
	function() {
		$(this).find('.commentmetadata').stop(true,true).hide();
	}
);


$('.entry').hover(
	function() {
		$(this).find('.meta_view_link').stop(true,true).fadeIn();
	},
	function() {
		$(this).find('.meta_view_link').stop(true,true).fadeOut();
	}
);

$(".entry-content a[href='"+window.location.href+"']").addClass("selflink")
$('.selflink').click(function() {return false;});
$('#content>div>.entry-banner>img').wrap("<a title='分享到微博' href=\"javascript:shareto('sina');\"></a>");


//回到顶部按钮
if($(window).width()>=1060 && $('#footer').length){
	var showDistance = 500;//距离浏览器顶端多少距离开始显示goToTop按钮，这个距离也可以修改，但不能超过浏览器默认宽度，为了兼容不同分辨率的浏览器，我建议在这里设置值为1；
	var goToTopButton = "<div id='goToTop'><a href='#'>回到顶部</a></div>";//定义一个变量，方便后面加入在html元素标签中插入这个goToTop按钮的标签
	$("#footer").append(goToTopButton);//在container的div里插入我们前面定义好的html标签元素

	if($('#main').length){
		var goToTop_left=$("#main").offset().left+$("#main").width()+25;
		$("#goToTop").css("right","none");
		$("#goToTop").css("left",goToTop_left+"px");
	}

	if($(window).scrollTop() < showDistance) {
		$("#goToTop").hide();//滚动条距离顶端的距离小于showDistance是隐藏goToTop按钮
	}
	$(window).scroll(function(){
		if($(this).scrollTop() < showDistance) {//当window的垂直滚动条距顶部距离小于showDistance设置的值 时
			$("#goToTop").fadeOut("slow");//goToTop按钮淡出
		} else {
			$("#goToTop").fadeIn("slow");//反之按钮淡入
		}
	});
	 //给go to top按钮绑定一个click事件      
	$("#goToTop a").click(function(){
		$("html,body").animate({scrollTop:0},"slow");//慢慢回到页面顶部
		return false;
	});
}


});