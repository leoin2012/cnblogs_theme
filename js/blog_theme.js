// 侧边导航目录
jQuery(function($) {
	$(document).ready(function() {
		var contentButton = [];
		var contentTop = [];
		var content = [];
		var lastScrollTop = 0;
		var scrollDir = '';
		var itemClass = '';
		var itemHover = '';
		var menuSize = null;
		var stickyHeight = 0;
		var stickyMarginB = 0;
		var currentMarginT = 0;
		var topMargin = 0;
		var vartop = 0;
		$(window).scroll(function(event) {
			var st = $(this).scrollTop();
			if (st > lastScrollTop) {
				scrollDir = 'down';
			} else {
				scrollDir = 'up';
			}
			lastScrollTop = st;
		});
		$.fn.stickUp = function(options) {
			$(this).addClass('stuckMenu');
			var objn = 0;
			if (options != null) {
				for (var o in options.parts) {
					if (options.parts.hasOwnProperty(o)) {
						content[objn] = options.parts[objn];
						objn++;
					}
				}
				if (objn == 0) {
					console.log('error:needs arguments');
				}
				itemClass = options.itemClass;
				itemHover = options.itemHover;
				if (options.topMargin != null) {
					if (options.topMargin == 'auto') {
						topMargin = parseInt($('.stuckMenu').css('margin-top')) + 70;
					} else {
						if (isNaN(options.topMargin) && options.topMargin.search("px") > 0) {
							topMargin = parseInt(options.topMargin.replace("px", ""));
						} else if (!isNaN(parseInt(options.topMargin))) {
							topMargin = parseInt(options.topMargin);
						} else {
							console.log("incorrect argument, ignored.");
							topMargin = 0;
						}
					}
				} else {
					topMargin = 0;
				}
				menuSize = $('.' + itemClass).size();
			}
			stickyHeight = parseInt($(this).height());
			stickyMarginB = parseInt($(this).css('margin-bottom'));
			currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));
			vartop = parseInt($(this).offset().top);
		};
		$(document).on('scroll', function() {
			varscroll = parseInt($(document).scrollTop());
			if (menuSize != null) {
				for (var i = 0; i < menuSize; i++) {
					contentTop[i] = $('#' + content[i] + '').offset().top;

					function bottomView(i) {
						contentView = $('#' + content[i] + '').height() * .4;
						testView = contentTop[i] - contentView;
						if (varscroll > testView) {
							$('.' + itemClass).removeClass(itemHover);
							$('.' + itemClass + ':eq(' + i + ')').addClass(itemHover);
						} else if (varscroll < 50) {
							$('.' + itemClass).removeClass(itemHover);
							$('.' + itemClass + ':eq(0)').addClass(itemHover);
						}
					}
					if (scrollDir == 'down' && varscroll > contentTop[i] - 50 && varscroll < contentTop[i] + 50) {
						$('.' + itemClass).removeClass(itemHover);
						$('.' + itemClass + ':eq(' + i + ')').addClass(itemHover);
					}
					if (scrollDir == 'up') {
						bottomView(i);
					}
				}
			}
			if (vartop < varscroll + topMargin) {
				$('.stuckMenu').addClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position", "fixed");
				$('.isStuck').css({
					top: '0px'
				}, 10, function() {});
			} else {
				$('.stuckMenu').removeClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position", "relative");
			};
		});
	});
});

function loadScroller() {
	if ($("#topics").length > 0) {
		$('#sideBarMain').remove();
		//先获取第一个h标签, 之后循环时作为上一个h标签
		var $ph = $('#cnblogs_post_body :header:eq(0)');
		if ($ph.length > 0) {
			//设置层级为1
			$ph.attr('offset', '1');
			//添加导航目录的内容
			$('#sideBar').append(
				'<div id="sidebar_scroller" class="catListPostArchive sidebar-block"><h3 class="catListTitle">导航目录</h3><ul class="nav"></ul></div>'
			);
			//取当前边栏的宽度
			$('#sidebar_scroller').css('width', ($('#sideBar').width() - 40) + 'px');
			//让导航目录停留在页面顶端
			$('#sidebar_scroller').stickUp();
			//遍历文章里每个h标签
			$('#cnblogs_post_body :header').each(function(i) {
				var $h = $(this);
				//设置h标签的id, 编号从0开始
				$h.attr('id', 'scroller-' + i);
				//比上一个h标签层级小, 级数加1
				if ($h[0].tagName > $ph[0].tagName) {
					$h.attr('offset', parseInt($ph.attr('offset')) + 1);
				} //比上一个h标签层级大, 级数减1
				else if ($h[0].tagName < $ph[0].tagName) {

					var h = parseInt($h[0].tagName.substring(1));
					var ph = parseInt($ph[0].tagName.substring(1));

					var offset = parseInt($ph.attr('offset')) - (ph - h);
					if (offset < 1) {
						offset = 1
					};
					$h.attr('offset', offset);
				} //和上一个h标签层级相等时, 级数不变
				else {
					$h.attr('offset', $ph.attr('offset'));
				}
				//添加h标签的目录内容
				$('#sidebar_scroller ul').append('<li class="scroller-offset' + $h.attr('offset') + '"><a href="#scroller-' +
					i +
					'">' + $h.text() + '</a></li>');
				//最后设置自己为上一个h标签
				$ph = $h;
			});

			//开启滚动监听, 监听所有在.nav类下的li
			$('body').scrollspy();

		}
	}
}

function setPostSideBar() {
	setTimeout(function() {
		loadScroller();
	}, 20);
}

// 设置博文内部表格滚动
function tableScorll() {
	if ($("#topics") != null) {
		$("table").each(function() {
			$(this).wrapAll('<div class="tablebox"></div>')
			$(".tablebox").css('overflow', 'auto');
		});
	}
};

// 设置手机端导航栏样式
function setMobileHeader() {
	var w = document.body.clientWidth;

	if (w <= 361) {
		$('#navList').css('display', 'none');
		$('#header').append(
			'<div class="dropdown">' +
			' <span><i class="fa fa-bars fa-lg"></i></span>' +
			' <div class="dropdown-content">' +
			$("#navList").html() +
			'  </div>' +
			'</div>')

	}
}



// 博文内部代码块复制
function copyCode() {
	if ($("#topics") != null) {
		for (i = 0; i <= $('pre').length; i++) {
			$('pre').eq(i).before('<div class="clipboard-button" id="copy_btn_' + i + ' " data-clipboard-target="#copy_target_' +
				i + '"title="复制代码">复制代码</div>');

			$('pre').eq(i).attr('id', 'copy_target_' + i);
		}
		$('.clipboard-button').css({
			"padding": "4px",
			"border-radius": "2px",
			"text-align": "right",
			"user-select": " none"
		})

		var clipboard = new ClipboardJS('.clipboard-button');
		clipboard.on('success', function(e) {

			e.trigger.innerHTML = '复制成功！';
			setTimeout(function() {
				e.trigger.innerHTML = '复制代码';
			}, 2 * 1000);

			e.clearSelection();
		});

		clipboard.on('error', function(e) {
			e.trigger.innerHTML = '复制失败！';
			setTimeout(function() {
				e.trigger.innerHTML = '复制代码';
			}, 2 * 1000);

			e.clearSelection();
		});
	}
};

// 设置博文内部链接新窗口打开
function blankTarget() {
	if ($("#topics") != null) {
		$('#cnblogs_post_body a[href^="http"]').each(function() {
			$(this).attr('target', '_blank');
		});
	}
}


// 视频解析
function jiexi1() {
	var url = document.getElementById("url").value;
	document.getElementById("iframe_jiexi").src = "https://api.sigujx.com/?url=" + url;
}

function jiexi2() {
	var url = document.getElementById("url").value;
	document.getElementById("iframe_jiexi").src = "https://jx.lache.me/cc/?url=" + url;
}

function jiexi3() {
	var url = document.getElementById("url").value;
	document.getElementById("iframe_jiexi").src = "https://jx.618g.com/?url=" + url;
}

// 修改博文发布信息位置
function changePublishinfo() {
	if ($("#topics") != null) {
		$(function() {
			//延迟1秒加载, 等博客园的侧栏加载完毕, 不然导航目录距离顶部的高度会不对
			setTimeout(function() {
				$(".postDesc").insertBefore($("#cnblogs_post_body"));
				$("#BlogPostCategory").insertBefore($("#cnblogs_post_body"));
				$("#EntryTag").insertBefore($("#cnblogs_post_body"));

			}, 100);
		})
	};
};

// 设置评论区头像
function commentIcon() {
	if ($(".blog_comment_body").length) {
		addImage();
	} else {
		var intervalId = setInterval(function() {
			if ($('.blog_comment_body').length) { //如果存在了
				clearInterval(intervalId); // 则关闭定时器
				commentIcon(); //执行自身
			}
		}, 100);
	}
}

function addImage() {
	var spen_html = "<span class='bot' ></span>\<span class='top'></span>";
	$(".blog_comment_body").append(spen_html);

	$(".blog_comment_body").before(
		"<div class='body_right' style='float: left; margin-right:20px;'><a target='_blank'><img  style='border-radius:50%;'/></a></div>"
	);
	var feedbackCon = $(".feedbackCon").addClass("clearfix");
	for (var i = 0; i < feedbackCon.length; i++) {
		var span = $(feedbackCon[i]).find("span:last")[0].innerHTML || "http://pic.cnitblog.com/face/sample_face.gif";
		$(feedbackCon[i]).find(".body_right img").attr("src", span);
		var href = $(feedbackCon[i]).parent().find(".comment_date").next().attr("href");
		$(feedbackCon[i]).find(".body_right a").attr("href", href);

	}
}

// 设置手机端目录功能栏
function loadMobileContent() {
	var w = document.body.clientWidth;
	if ((w <= 361) && ($('#sidebar_scroller') != null)) {
		$('#cnblogs_post_body').append(
			'<div class="mytoolbar"><ul id="toolbtn"><li><a href="#top"><i class="fa fa-angle-up" aria-hidden="true"></i>返回顶部</a></li><li onclick="showContent()"><i class="fa fa-bars" aria-hidden="true"></i>目录</li><li><a href="#footer"><i class="fa fa-angle-down" aria-hidden="true"></i>返回底部</a></li></ul></div>'
		);
	}
}

function showContent() {

	if ($('#sidebar_scroller').css('display') == 'none') {
		$('#sidebar_scroller').css('display', 'block');
	} else {
		$('#sidebar_scroller').css('display', 'none');
	}
}


// 设置顶部导航栏
function setHeader() {
	$("#header").each(function() {
		$(this).wrapAll('<div class="headbox"></div>')
		$(".headbox").css({
			"width": "100%",
			"height": "50px",
			"line-height": "50px",
			"background-color": "var(--BlockColor)",
		});
	});
}

// 导航栏扩展
function extendNav(mynav) {
	var str = '';
	for (var i = 0; i < mynav.length; i++) {
		str = str + '<li><a id="' + mynav[i].id + '" class="menu" href="' + mynav[i].url + '">' + mynav[i].title +
			'</a></li>';
	}
	$('#navList').append(str);
}

// 设置首页轮播
function loadBanner(mybanner) {
	var str1 = '',
		str2 = '',
		str = '';
	for (var i = 0; i < mybanner.length; i++) {
		str1 = str1 + '<li>' + '<a href="' + mybanner[i].url + 'target=" _blank">' +
			'<img src="' + mybanner[i].img + '" alt="" />' +
			'</a>' +
			'<span class="title">' + mybanner[i].title + '</span>' +
			'</li>';
	}
	for (var i = 2; i <= mybanner.length; i++) {
		str2 = str2 + '<li>' + i + '</li>';
	}




	str = '<div class="comiis_wrapad" id="slideContainer">' +
		'<div id="frameHlicAe" class="frame cl">' +
		'<div class="temp"></div>' +
		'<div class="block">' +
		'<div class="cl">' +
		'<ul class="slideshow" id="slidesImgs">' +
		str1 +
		'</ul>' +
		'</div>' +
		'<div class="slidebar" id="slideBar">' +
		'<ul>' +
		'<li class="on">1</li>' +
		str2 +
		'</ul>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';

	if ($('.day').length > 0) {
		$('.forFlow').prepend($(str)) //首页轮播
	}

	function SlideShow(c) {
		var a = document.getElementById("slideContainer"),
			f = document.getElementById("slidesImgs").getElementsByTagName("li"),
			h = document.getElementById("slideBar"),
			n = h.getElementsByTagName("li"),
			d = f.length,
			c = c || 3000,
			e = lastI = 0,
			j, m;

		function b() {
			m = setInterval(function() {
				e = e + 1 >= d ? e + 1 - d : e + 1;
				g()
			}, c)
		}

		function k() {
			clearInterval(m)
		}

		function g() {
			f[lastI].style.display = "none";
			n[lastI].className = "";
			f[e].style.display = "block";
			n[e].className = "on";
			lastI = e
		}
		f[e].style.display = "block";
		a.onmouseover = k;
		a.onmouseout = b;
		h.onmouseover = function(i) {
			j = i ? i.target : window.event.srcElement;
			if (j.nodeName === "LI") {
				e = parseInt(j.innerHTML, 10) - 1;
				g()
			}
		};
		b()
	};

	if ($('.day').length > 0) {
		SlideShow(3000);
	}

}
// 设置网页tab图标
function setFavio(myprofile) {
	$('head').append($('<link rel="shortcut icon" type="image/x-icon"/>').attr('href', myprofile[0].blogAvatar));
};

// 设置侧边栏公告个人信息
function loadProfile(myprofile) {
	var str = '<div class="myprofile">' +
		'<div class="myprofile-top">' +
		'<a class="avatar" href="https://home.cnblogs.com/u/' + myprofile[0].blogName + '/ ">' +
		'<img src="' + myprofile[0].blogAvatar + '" alt="240">' +
		'</a>' +
		'<div class="profile-info"><a class="nickname" href=" https://home.cnblogs.com/u/' + myprofile[0].blogName + '/">' +
		'</a>' +
		'<p id="mywords"></p>' +
		'</div>' +
		'</div>' +
		'<div class="myprofile-bottom">' +
		'<ul>' +
		'<li><a href="https://home.cnblogs.com/u/' + myprofile[0].blogName + '/" id="myyear">' +
		'</a>' +
		'</li>' +
		'<li><a href="https://home.cnblogs.com/u/' + myprofile[0].blogName + '/followers/" id="myfollower">' +
		'</a>' +
		'</li>' +
		'<li><a href="https://home.cnblogs.com/u/' + myprofile[0].blogName + '/followees/" id="myfollowee">' +
		'</a>' +
		'</li>' +
		'</ul>' +
		'</div>' +
		'<div class="myprofile-bottom">' +
		'<ul>' +
		'<li id="mypost">' +
		'</li>' +
		'<li id="myarticle">' +
		'</li>' +
		'<li id="mycomment">' +
		'</li>' +
		'</ul>' +
		'</div>' +
		'</div>';
	if ($('#blog-news') != null) {
		$('#blog-news').append(str);

		$("#profile_block a").each(function(idx) {
			if (idx == 1) {
				$('#myyear').html('园龄<br>' + $(this).context.innerText);
			}
			if (idx == 2) {
				$('#myfollower').html('粉丝<br>' + $(this).context.innerText);
			}
			if (idx == 3) {
				$('#myfollowee').html('关注<br>' + $(this).context.innerText);
			}
		});
		$('#profile_block').css('display', 'none');
		$('#mywords').html(myprofile[0].blogSign);
		$('#mypost').html($('#stats_post_count').text().replace(/\-/g, "<br>"));
		$('#myarticle').html($('#stats_article_count').text().replace(/\-/g, "<br>"));
		$('#mycomment').html($('#stats-comment_count').text().replace(/\-/g, "<br>"));
		$('.myprofile').append($('#p_b_follow'));
		$('.nickname').html($('#Header1_HeaderTitle').text());
	}
}

// 设置博文底部个性签名
function setSignautre(myprofile) {
	var str = '<h2>作者信息</h2>' +
		'<div id="card">' +
		'<div id="proBody">' +
		'<center>' +
		'<img src="' + myprofile[0].blogAvatar + '">' +
		'<p class="name">' + myprofile[0].blogName + '</p>' +
		'<p class="sign">' + myprofile[0].blogSign + '</p>' +
		'<input type="button" class="contact" value="关注" onclick="' + myprofile[0].blogFollow + ';">' +
		'</center>' +
		'</div>' +
		'<div id="proFooter">' +
		'<ul>' +
		'	<li>' +
		'<a href="http://sighttp.qq.com/msgrd?v=1&amp;uin=' + myprofile[0].QQ + '" target="_blank">' +
		'<i class="fa fa-qq" style="font-size: 1.7rem"></i> &nbsp;&nbsp;&nbsp;&nbsp;Q&nbsp;Q' +
		'&nbsp;&nbsp;&nbsp;&nbsp;' +
		'</a>' +
		'</li>' +
		'<li>' +
		'<a href="' + myprofile[0].Github + '" target="_blank">' +
		'<i class="fa fa-github fa-2x"></i>' +
		'Github' +
		'</a>' +
		'</li>' +
		'<li>' +
		'<a href="' + myprofile[0].WeChat + '" target="_blank">' +
		'<i class="fa fa-weixin fa-2x"></i>' +
		'WeChat' +
		'</a>' +
		'</li>' +
		'</ul>' +
		'</div>' +
		'</div>';

	if ($('#cnblogs_post_body') != null) {
		$('#MySignature').append(str);
	}

}

//运行脚本
function runCode() {
	$(function() {
		$('myscript').each(function() {
			$(this).css('display', 'none');
			eval($(this).text());
		});
	});
}


// 新增/读取 cookie
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires + ";secure; path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}



var Theme = {
	Light: {
		'color': '#141418',
		'TextColor1': '#141418',
		'TextColor2': '#5f5f6b',
		'TextColor3': '#97979f',
		'DividColor': '#e7eaf0',
		'BackgroundColor': '#f4f6fa',
		'BlockColor': '#ffffff'
	},
	Dark: {
		'color': '#cfcecf',
		'TextColor1': '#cfcecf',
		'TextColor2': '#89888c',
		'TextColor3': '#57565a',
		'DividColor': '#323236',
		'BackgroundColor': '#26252a',
		'BlockColor': '#201f25'
	}
}

function changeThemeColor(Light) {
	setCookie('color', Light.color, 30);
	setCookie('TextColor1', Light.TextColor1, 30);
	setCookie('TextColor2', Light.TextColor2, 30);
	setCookie('TextColor3', Light.TextColor3, 30);
	setCookie('DividColor', Light.DividColor, 30);
	setCookie('BackgroundColor', Light.BackgroundColor, 30);
	setCookie('BlockColor', Light.BlockColor, 30);
	$('html').css("color", getCookie("color"));
	document.documentElement.style.setProperty("--TextColor1", getCookie("TextColor1"));
	document.documentElement.style.setProperty("--TextColor2", getCookie("TextColor2"));
	document.documentElement.style.setProperty("--TextColor3", getCookie("TextColor3"));
	document.documentElement.style.setProperty("--DividColor", getCookie("DividColor"));
	document.documentElement.style.setProperty("--BackgroundColor", getCookie("BackgroundColor"));
	document.documentElement.style.setProperty("--BlockColor", getCookie("BlockColor"));
}


// 切换主题
function changeTheme() {
	if ($('html').css('color') == 'rgb(20, 20, 24)') {
		changeThemeColor(Theme.Dark);
	} else {
		changeThemeColor(Theme.Light);
	}
}

function loadThemeColor() {
	if (getCookie("color")==""){
		$('html').css("color", getCookie("#141418"));
		document.documentElement.style.setProperty("--TextColor1", "#141418");
		document.documentElement.style.setProperty("--TextColor2", "#5f5f6b");
		document.documentElement.style.setProperty("--TextColor3", "#97979f");
		document.documentElement.style.setProperty("--DividColor", "#e7eaf0");
		document.documentElement.style.setProperty("--BackgroundColor", "#f4f6fa");
		document.documentElement.style.setProperty("--BlockColor", "#ffffff");
	}
	else{
		$('html').css("color", getCookie("color"));
		document.documentElement.style.setProperty("--TextColor1", getCookie("TextColor1"));
		document.documentElement.style.setProperty("--TextColor2", getCookie("TextColor2"));
		document.documentElement.style.setProperty("--TextColor3", getCookie("TextColor3"));
		document.documentElement.style.setProperty("--DividColor", getCookie("DividColor"));
		document.documentElement.style.setProperty("--BackgroundColor", getCookie("BackgroundColor"));
		document.documentElement.style.setProperty("--BlockColor", getCookie("BlockColor"));
	}
}

// 公告
function loadNewsinfo(news){
	str = '<div class="infocard normal"><p> <i class="fa fa-volume-up fa-2x" aria-hidden="true"></i>'+ news +' </p></div>'
	$('#mainContent').prepend(str);
}

// 捷径
function narrow() {

	var nowText = $('#blog_nav_shortcut').text();

	if (nowText == '打开小组件') {
		$('.shortcut').css({
			'height': 'auto',
			'padding': '20px',
			'margin-bottom': '20px'
		});
		$('#blog_nav_shortcut').text('关闭小组件')
	} else {
		$('.shortcut').css({
			'height': '0',
			'padding': '0px',
			'margin-bottom': '0px'
		});
		$('#blog_nav_shortcut').text('打开小组件')
	}

	return false;
}

function loadShortcut(myHtml) {
	var str = '<div class="shortcut" style="height:0">' + myHtml + '</div>';
	$('#mainContent').prepend(str);
}

/*
MATLAB Highlighter 1.55, a small and lightweight JavaScript library for colorizing your MATLAB syntax.
http://matlabtricks.com/matlab-highlighter
Licensed under the MIT license
Copyright (c) 2013, Zoltan Fegyver
*/
function highlightMATLABCode(d) {
	function g(i) {
		return (i >= "A" && i <= "Z") || (i >= "a" && i <= "z") || (i == ")")
	}

	function m(r, j, i) {
		var s = j.index,
			t;
		while (s >= i) {
			t = r.charAt(--s);
			if (t == "\n") {
				break
			}
			if (t == "'") {
				continue
			} else {
				return !g(t)
			}
		}
		return true
	}

	function a(i) {
		var j = i.length - 1,
			r;
		while (j > 0) {
			r = i.charAt(--j);
			if (r == "\n") {
				return true
			}
			if (r == "%") {
				return false
			}
		}
		return true
	}

	function n(t) {
		var s, u = 0,
			r, v = /(\'[^\'\n]*\')/gi,
			j = [];
		while (s = v.exec(t)) {
			if (m(t, s, u)) {
				var w = t.slice(u, s.index);
				for (var i = j.length - 2; i >= 0; i -= 2) {
					if (w.indexOf("\n") > -1) {
						break
					}
					w = w.concat(j[i])
				}
				if (a(w)) {
					r = s.index + s[1].length;
					j.push(t.slice(u, s.index));
					j.push(t.slice(s.index, r));
					u = r
				}
			}
		}
		j.push(t.slice(u));
		return j
	}

	function b(u, j) {
		var w = '<span class="',
			v = "</span>";
		if (j) {
			return [w, 'matlab-string">', u, v].join("")
		} else {
			var t = [{
				r: /\b('|break|case|catch|classdef|continue|else|elseif|end|for|function|global|if|otherwise|parfor|persistent|return|spmd|switch|try|while|')\b/gi,
				s: "keyword"
			}, {
				r: /\b([0-9]+)\b/gi,
				s: "number"
			}, {
				r: /([(){}\[\]]+)/gi,
				s: "bracket"
			}, {
				r: /(%[^\n]*)/gi,
				s: "comment"
			}];
			for (var r = 0, s = t.length; r < s; r++) {
				u = u.replace(t[r].r, [w, "matlab-", t[r].s, '">$1', v].join(""))
			}
			return u
		}
	}

	function q(u) {
		var w = [],
			s = [];
		if (typeof u === "undefined") {
			u = {
				tagPre: true,
				tagCode: false,
				className: "matlab-code"
			}
		}
		if (typeof u !== "object") {
			w.push(document.getElementById(u))
		} else {
			if (u.tagCode) {
				s.push("code")
			}
			if (u.tagPre) {
				s.push("pre")
			}
			for (var t = 0; t < s.length; t++) {
				var x = document.getElementsByTagName(s[t]);
				for (var r = 0, v = x.length; r < v; r++) {
					if ((u.className == "") || ((x[r].className.toString().length > 0) && ((" " + x[r].className + " ").indexOf(" " +
							u.className + " ") > -1))) {
						w.push(x[r])
					}
				}
			}
		}
		return w
	}
	var p = q(d);
	for (var f = 0, o = p.length; f < o; f++) {
		var c = n(p[f].innerHTML.toString().replace(/<br\s*\/?>/mg, "\n")),
			h = [],
			l = "&nbsp;";
		for (var e = 0, k = c.length; e < k; e++) {
			h.push(b(c[e], e % 2))
		}
		p[f].innerHTML = h.join("").replace(/^[ ]/gm, l).replace(/\n/gm, "<br>").replace(/\t/gm, l + l)
	}
};


// 自定义markdown 
function mymd() {
	var d = document;
	var cnblogs_post_body = d.getElementById('cnblogs_post_body');

	if (cnblogs_post_body != null) {
		var html = d.getElementById('cnblogs_post_body').innerHTML;
		html = md2video(html);
		html = md2music(html);
		d.getElementById('cnblogs_post_body').innerHTML = html;
	}

	// 自定义视频语法
	function md2video(str) {
		var video_str1 = '<div class="video"><iframe src="';
		var video_str2 =
			'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe></div>';
		return str.replace(/\<p\>\{video\}\(([^{}()]+)\)\<\/p\>/g, function(match, $1) {
			return video_str1 + $1 + video_str2
		});
	}
	// 自定义音乐语法
	function md2music(str) {
		var music_str1 = '<div class="music"><iframe src="';
		var music_str2 =
			'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe></div>';
		return str.replace(/\<p\>\{music\}\(([^{}()]+)\)\<\/p\>/g, function(match, $1) {
			return music_str1 + $1 + music_str2
		});
	}

}


/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);