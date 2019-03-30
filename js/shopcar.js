
    (function ($) {
        $(document).ready(function () {
            var curLoginStatus = false;
            var limitGoodsNums = $('input[name=limitGoodsNums]').val();

            function loginCallback(argument) {
                if (!$('input[name=sceneAreaOpen]').val()) {
                    return false;
                }
                curLoginStatus = true;
                var cakeNums = $('input[name=cakeNums]').val();
                if (Cookie.read('fromLogin')) {
                    // 直接进入结算页面
                    Cookie.write('fromLogin', '', {
                        duration: -30,
                        domain: '.21cake.com'
                    });
                    cakeNums > 0 && checkSceneArea(true);
                }
                $('.situational-select-pop li,.situational-select-pop .select-dont').click(function () {
                    var name = $(this).data('name');
                    var key = 'scene_area_' + Cookie.read('L[member]');
                    Cookie.write(key, name, {
                        duration: 30,
                        domain: '.21cake.com'
                    });
                    window.location.href = '/cart-checkout.do';
                });
            }

            function checkSceneArea(loginStatus) {
                if (!$('input[name=sceneAreaOpen]').val()) {
                    return false;
                }
                if (!Cookie.read('L[member]')) {
                    return false;
                }
                var sceneAreaCanShow = false;
                var key = 'scene_area_' + Cookie.read('L[member]');
                switch (Cookie.read(key)) {
                    case "needless":
                        sceneAreaCanShow = false;
                        break;
                    case "birth":
                    case "party":
                    default:
                        loginStatus && $('.situational-select-pop').show();
                        sceneAreaCanShow = true;
                }
                return sceneAreaCanShow;
            }

            window.loginCallback = loginCallback;
            var form = {};
            form.cityId = cache.getCurrentCity();
            form.channel = 'pc';
            form.position = 'cart_bottom,cart_banner,cart_suggest';
            api.getJsonp('Advertisement.show', '1.0', form, function (res) {
                if (res.status !== 'ok') {
                    return false;
                }
                var html = '';
                if (res.data.hasOwnProperty('cart_suggest')) {
                    html = '';
                    for (var i in res.data.cart_suggest) {
                        if (res.data.cart_suggest.hasOwnProperty(i)) {
                            var goods = res.data.cart_suggest[i];
                            html += '<li>';
                            html += '<img src="' + goods.img_url + '" alt="' + goods.name + '"/>';
                            html += '<div class="right-title">';
                            html += '<h5>' + goods.name + '</h5>';
                            if(parseFloat(goods.mktprice) > parseFloat(goods.price)){
                                html += '<span><span style="text-decoration: line-through;color: #B2B2B2;font-size: 13px;display: inline;margin-right: 4px;">¥' + number_format(goods.mktprice, 2) + '</span>' + '¥' + number_format(goods.price, 2) + '/' + goods.spec + '</span>';
                            }else{
                                html += '<span>¥' + number_format(goods.price, 2) + '/' + goods.spec + '</span>';
                            }
                            html += '<a href="#" class="action-add-to-cart" name="action-add-to-cart_' + goods.product_id + '" data-product_id="' + goods.product_id + '" title="加入购物车"><i></i></a>';
                            html += '</div>';
                            html += '</li>';
                        }
                    }
                    if (html) {
                        var tablewareList = $('.tableware-list');
                        if (tablewareList.length) {
                            tablewareList.find('ul').prepend(html);
                        } else {
                            html = '<tr><td colspan="7" class="tableware-list"><ul>' + html + '</ul></td></tr>';
                            $('.tbody-ul table').append(html);
                        }
                    }
                }
                if (res.data.hasOwnProperty('cart_banner')) {
                    html = '';
                    for (var i in res.data.cart_banner) {
                        if (res.data.cart_banner.hasOwnProperty(i)) {
                            var goods = res.data.cart_banner[i];
                            html = '<a href="' + goods.href + '" target="' + goods.target + '">';
                            html += '<img src="' + goods.img_url + '" alt="' + goods.name + '">';
                            html += '</a>';
                        }
                    }
                    if (html) {
                        $('.cart-banner').html(html).show();
                    }
                }
                if (res.data.hasOwnProperty('cart_bottom')) {
                    html = '';
                    for (var i in res.data.cart_bottom) {
                        if (res.data.cart_bottom.hasOwnProperty(i)) {
                            var goods = res.data.cart_bottom[i];
                            html += '<li>';
                            html += '<a href="' + goods.href + '" target="' + goods.target + '">';
                            html += '<img src="' + Global.staticDomain + goods.img_url + '" alt="' + goods.name + '">';
                            html += '</a>';
                            html += '</li>';
                        }
                    }
                    if (html) {
                        $('.details-recommend .recommend-list').html(html);
                        $('.details-recommend').show();
                    }
                }
            });
            var saleOffProducts = [];
            $('.goods-floridian').each(function () {
                saleOffProducts.push($(this).data('name'));
            });
            if (saleOffProducts.length > 0) {
                popUpWindow({
                    title: '商品：' + saleOffProducts.join('、') + '已售罄，请删除！',
                    popType: 3,
                    callback: function () {
                        $.ajaxSetup({async: false});
                        $('.goods-floridian').each(function () {
                            CAKE.cart.ajax.remove($(this).data('indent'), function () {

                            });
                        });
                        window.location.reload();
                    }
                });
                return false;
            }

            /** 加减商品数量 */
            $('div.quantity-update').each(function () {
                var minusBtn = $('input.minus', this);
                var plusBtn = $('input.plus', this);
                var quantityInput = $('input.quantity', this);
                var dataSet = quantityInput.data();
                var quantity = parseInt(quantityInput.val());

                // 加价购产品初始化商品数量
                var priceMarkup = $(this).parents('tr');
                addPriceMarkup(quantity, $(this));

                minusBtn.click(function (e) {
                    e.preventDefault();
                    quantityInput.val(quantity - 1).trigger('change');

                    //加价购产品 数量
                    var text = parseInt(priceMarkup.next('tr').find('span.quantity').text()) - 1;
                    addPriceMarkup(text, $(this));
                    return false;
                });
                quantityInput.change(function () {
                    if (this.value <= 0 || this.value > 99) {
                        alert('购买数量少于1或大于99');
                        this.value = quantity;
                        return;
                    }
                    var _quantity = parseInt(this.value);
                    minusBtn.prop('disabled', false);
                    plusBtn.prop('disabled', false);
                    if (_quantity <= 1) {
                        minusBtn.prop('disabled', true);
                    }
                    if (_quantity >= 99) {
                        plusBtn.prop('disabled', true);
                    }
                    CAKE.cart.ajax.update(dataSet['indent'], _quantity, function (response) {
                        if (response.hasOwnProperty('status') && response['status'] == 'ok') {
                            quantity = _quantity;
                            $('#total_amount_' + dataSet['indent']).html('¥' + number_format(dataSet.price * quantity, 2));
                            window.cartAmount();
                            checkGiftNums();
                        } else {
                            quantityInput.val(quantity);
                            popUpWindow({
                                title: response['message'],
                                popType: 2
                            });
                        }
                    });
                    setTimeout(refreshTotal, 1E3);
                });
                plusBtn.click(function (e) {
                    e.preventDefault();
                    quantityInput.val(quantity + 1).trigger('change');

                    // 加价购产品 数量
                    var text = parseInt(priceMarkup.next('tr').find('span.quantity').text()) + 1;
                    addPriceMarkup(text, $(this));
                    return false;
                });
            });

            // 加价购产品数量 总价计算
            function addPriceMarkup(quantity, T) {
                if (T.parents('tr').hasClass('price-markup')) {
                    var priceMarkup = T.parents('tr');
                    var priceMarkupId = priceMarkup.attr('id');
                    var priceMarkupgoods = priceMarkup.siblings('tr[id^=' + priceMarkupId + ']');
                    priceMarkupgoods.find('div.quantity-update span').each(function (index, el) {
                        $(this).text(quantity);
                        var price = (parseFloat($(this).attr('data-price')) * quantity).toFixed(2);
                        $(this).parents('.price-markup-number').siblings('.money').text('¥' + price);
                        // $(this).trigger('change')
                    });
                }
            }

            function checkGiftNums() {
                var giftFreeCombination = $('.gift_free_combination');
                if (giftFreeCombination.length == 0) {
                    return true;
                }
                var freeCombination = $('.free_combination');
                if (freeCombination.length == 0) {
                    return true;
                }
                var currentNums = 0;
                $('.free_combination_quantity').map(function () {
                    currentNums += parseInt($(this).val());
                });
                if (currentNums < limitGoodsNums) {
                    giftFreeCombination.remove();
                    return true;
                }
                var giftNums = parseInt(currentNums / limitGoodsNums);
                if (giftNums > 0) {
                    giftFreeCombination.find('.gift_free_combination_quantity').val(giftNums);
                    return true;
                }
            }

            /** 配件加入购物车 */
            $('.tbody-ul table').on('click', 'a.action-add-to-cart', function (e) {
                e.preventDefault();
                var productId = $(this).data('product_id');
                addCartTrack(productId);
                var analysisForm = {};
                analysisForm.name = $(this).attr('name');
                analysisForm.tag = '-';
                analysisForm.divName = $(this).attr('name');
                analysisForm.url = '-';
                analysis.action('clickbond', analysisForm);
                CAKE.cart.ajax.add(productId, 1, function () {
                    window.location.reload();
                });
                return false;
            });

            $('tr.cart-object-item td.delete > a').click(function (e) {
                e.preventDefault();
                var indent = $(this).data('indent');
                CAKE.cart.ajax.remove(indent, function () {
                    checkNum();
                });
                $('#' + indent).remove();
                return false;
            });
            $('tr.price-markup-title td.delete > a').click(function (e) {
                e.preventDefault();
                var indent = $(this).data('indent');
                CAKE.cart.ajax.remove(indent, function () {
                    checkNum();
                });
                $('[data-indent="' + indent + '"]').remove();
                return false;
            })
            function checkNum() {
                if ($('input:hidden[name^="birthday_card"]').length == 0) {
                    $('.tableware-list .tableware-row').remove();
                }
                if ($('.scene_area').length == 0) {
                    $('input[name=cakeNums]').val(0);
                }
                CAKE.cart.ajax.amount(function (response) {
                    if (CAKE.responseSuccess(response) && response['data']['amount'] > 0) {
                        $('#cart-count-icon').html('<i></i><span>' + response['data']['amount'] + '</span>');
                        refreshTotal();
                    } else {
                        var html = '<div class="cart-not-pro">\
                                                <img src="' + Global.staticDomain + '/themes/site/img/cartempty.png"/>\
                                                <span>您的购物车里还没有商品</span>\
                                                <a href="/">去购物 >></a>\
                                            </div>';
                        $('.cart-area').remove();
                        $('.content-box').prepend(html);
                        $('#cart-count-icon').html('<i></i>');
                    }
                });
                checkGiftNums();
            }

            /** 生日牌 */
            $('div.select-birthday').each(function () {
                var self = this;
                var maxNum = $(self).data('num');
                var maxWords = maxNum ? maxNum : CAKE.cart.getMaxWord(parseFloat($(self).data('spec')));
                var birthCardInput = $(this).find('input[name^=birthday_card]');
                var birthdayCardName = birthCardInput.attr('name');
                var birthdayCardValue = $.cookie(birthdayCardName);
                if (birthdayCardValue) {
                    $(this).find('div.action-birthday_card').html(birthdayCardValue + '<i></i>');
                    birthCardInput.val(birthdayCardValue);
                    $('.select-birthday div').addClass('active');
                }
                // var birthdayCardText = $(this).find('input').val();
                //    if(birthdayCardText != ''){
                //     $('ul.action-birthday-options li', self).each(function(){
                //         if($(this).text() == birthdayCardText){
                //             actionBirthdayCard.html($(this).text() + '<i></i>');
                //             $('.select-birthday div').addClass('active');
                //         }
                //     })
                //    }
                $('div.action-birthday_card', self).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('ul.action-birthday-options', self).show();
                    return false;
                });

                $('ul.action-birthday-options > li.birthday-card-option', self).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).addClass('active').siblings('li').removeClass("active");
                    $('.select-birthday div').addClass('active');
                    $('ul.action-birthday-options', self).hide();
                    var content = this.innerHTML;
                    $('input[name^=birthday_card]', self).val(content);
                    $('div.action-birthday_card', self).html(content + '<i></i>');
                    var birthdayCardInput = $('input[name^=birthday_card]', self);
                    $.cookie(birthdayCardInput.attr('name'), birthdayCardInput.val());
                    return false;
                });

                $('ul.action-birthday-options > li.brith_card_by_self').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).hide().next().show();
                    return false;
                });
                $('li.action-input-container input[type=text]', self).click(function (e) {
                    e.stopPropagation();
                }).attr('placeholder', '可输入' + (maxWords / 2) + '个汉字或' + maxWords + '个字符');
                $('input.action-birth-card-btn', self).click(function (e) {
                    e.stopPropagation();
                    var content = $(this).prev().val();
                    if (strCheck.hasEmoji(content)) {
                        popUpWindow({
                            title: '生日牌不可含有特殊字符',
                            popType: 2
                        });
                        return false;
                    }
                    if (CAKE.cart.countLength(content) > maxWords) {
                        alert('生日牌最多只能填写' + (maxWords / 2) + '个汉字或' + maxWords + '个字符');
                        return;
                    }
                    $(this).prev().val('');
                    $('input[name^=birthday_card]', self).val(content);
                    $('div.action-birthday_card', self).html(content + '<i></i>');
                    $('ul.action-birthday-options', self).hide();
                    var birthdayCardInput = $('input[name^=birthday_card]', self);
                    $.cookie(birthdayCardInput.attr('name'), birthdayCardInput.val());
                });
            });
            $(document).click(function () {
                $('ul.action-birthday-options').hide();
            });
            var hasEmptyBirthdayCard = false;
            $('#action-submit-btn').click(function (e) {
                $('input:hidden[name^="birthday_card"]').each(function () {
                    if (this.value != '') {
                        $.cookie(this.name, this.value);
                    }
                });
                var cakeNums = $('input[name=cakeNums]').val();
                if (curLoginStatus && checkSceneArea(false) && cakeNums > 0) {
                    $('.situational-select-pop').show();
                    return false;
                }
                window.location.href = '/cart-checkout.do' + location.search;
            });

            $('a.cart-submit-empty').click(function (e) {
                e.preventDefault();
                CAKE.cart.ajax.clear(function () {
                    window.location.reload();
                });
                return false;
            });
            refreshTotal();
        });

        function refreshTotal() {
            var tpl = new Template('<li>商品金额：¥ {cost_item}</li> <!--<li>配送费：¥ {cost_freight}</li>--> <li>活动优惠：¥ {pmt_amount}</li>');
            CAKE.cart.ajax.total(function (response) {
                var cost_freight = parseFloat(response['data']['order_detail']['cost_freight']);
                var cost_item = parseFloat(response['data']['order_detail']['cost_item']);
                var args = {
                    "cost_item": number_format(cost_item, 2),
                    "cost_freight": number_format(cost_freight, 2),
                    "pmt_amount": number_format(parseFloat(response['data']['order_detail']['pmt_amount']), 2)
                };

                /*if (cost_freight > 0 && cost_item < 100) {
                 $('#cost-freight-tip').html('满¥ 100免配送费，还差¥' + number_format((100 - cost_item), 2) + '元，<a href="/">去加购 >></a> ');
                 } else {
                 $('#cost-freight-tip').html('订单已满￥100元,享免费配送服务');
                 }*/

                $('ul.cart-total-detail').html(tpl.format(args));
                var totalAmount = parseFloat(response['data']['order_detail']['total_amount']);
                $('div.cart-total').html('<span>合计：¥<span>' + number_format(totalAmount - cost_freight, 2) + '</span></span>')
            }, '2019 - 02 - 15');
        }

        $('.cart-banner a').click(function () {
            var _index = $(this).parent('li').index();
            var analysisForm = {};
            analysisForm.name = 'cart-banner';
            analysisForm.tag = '-';//$(this).children('img').attr('alt');
            analysisForm.divName = 'cart-banner';
            analysisForm.url = $(this).attr('href');
            analysis.action('cartBannerClick', analysisForm);
        });
        $('.recommend-list a').click(function () {
            var _index = $(this).parent('li').index();
            var analysisForm = {};
            analysisForm.name = 'cart-recommend-' + _index;
            analysisForm.tag = '-';//$(this).children('img').attr('alt');
            analysisForm.divName = 'cart-recommend';
            analysisForm.url = $(this).attr('href');
            analysis.action('cartRecommendClick', analysisForm);
        });
        // $("tr[id^='goods_46']").find('.exchange-text').show();
    })(jQuery);


    // 加价购
    $('tr.price-markup-title').prev('tr').find('td,a').css('border', 'none');
    $('tr.price-markup-title').next('tr').find('td').css('border', 'none');
    var priceSize = $('.price-markup').size() + 1;
    //$('tr.price-markup-title').find('td.delete').attr('rowspan',priceSize);
    if (priceSize <= 1) {
        $('.tableware-list').parent('tr').prev('tr').find('td,a').css('border', 'none');
    }
//    活动与公告
    function noticeDisplay() {
        var form2 = {};
        form2.type = 'notice';
        form2.position = 'cart';
        form2.channel = 'pc';
        api.getJsonp('Notice.show', '1.0', form2, function (res) {
            if (res.status == 'ok') {
                var data = res.data;
                if (data.hasOwnProperty('notice') && data['notice'].length > 0) {
                    var html = '';
                    $.each(data.notice, function (index, val) {
                        if(this.image!==''){
                            html+='<li><p><img src="'+this.image+'" /><span>'+this.title+'</span>'
                        }else{
                            html+='<li><p><img src="/themes/site/img/notic.png"/><span>'+this.title+'</span>'
                        }
                        if(this.link=='' || this.subTitle ==''){
                            html+='</p></li>'
                        }else{
                            html+='<a href="'+this.link+'">'+this.subTitle+'>></a></p></li>'
                        }
                        $('#cart-events-box').html(html);
                        cartEvent();
                    })
                }
            }
        })
    }
    noticeDisplay();

