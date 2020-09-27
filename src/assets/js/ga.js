(function() {
  var color_size, colors, crossover, dec2hex, error_range_hue, error_range_sv, gen, getBaseColor, getRGBCSS, getRandomColor, hsv2rgb, mutate, mutate_prob, mutate_range_hue, palettaOff, palettaOn, prevent_overflow, rand, rgb2css, rgb2hsv, seed, shuffle;

  colors = [];

  color_size = 12;

  mutate_prob = 0.05;

  mutate_range_hue = 30;

  error_range_hue = 10;

  error_range_sv = 0.2;

  gen = function(selectedColorID) {
    var i, j, _i, _j;
    while (colors.length < color_size) {
      colors.push(crossover());
    }
    for (i = _i = 2; 2 <= color_size ? _i < color_size : _i > color_size; i = 2 <= color_size ? ++_i : --_i) {
      for (j = _j = 0; _j < 2; j = ++_j) {
        if (Math.random() < mutate_prob) {
          colors[i] = mutate(colors[i], j);
        }
      }
    }
    palettaOn(selectedColorID);
    return colors = colors.slice(0, 1);
  };

  crossover = function() {
    var h, s, v;
    h = parseInt(colors[rand(2)][0]) + rand(error_range_hue) - error_range_hue / 2;
    s = parseFloat(colors[rand(2)][1]) + Math.random() * error_range_sv - error_range_sv / 2.0;
    v = parseFloat(colors[rand(2)][2]) + Math.random() * error_range_sv - error_range_sv / 2.0;
    return prevent_overflow([h, s, v]);
  };

  mutate = function(c, position) {
    var h, s, v;
    h = c[0];
    s = c[1];
    v = c[2];
    if (position === 0) {
      h = parseInt(c[0]) + rand(mutate_range_hue) - mutate_range_hue / 2;
    } else if (position === 1) {
      s = Math.random();
    } else if (position === 2) {
      v = Math.random();
    }
    return prevent_overflow([h, s, v]);
  };

  $(function() {
    var $box;
    FastClick.attach(document.body);
    $(".palette-inner").mason({
      itemSelector: ".box",
      ratio: 1.1,
      sizes: [[1, 1]],
      columns: [[0, 400, 3], [400, 800, 4], [800, 1000, 6]],
      layout: "fluid",
      gutter: 4
    });
    palettaOff();
    $box = $(".box");
    $box.on({
      mouseenter: function() {
        return $(this).css("box-shadow", "0 0 20px rgba(0,0,0,0.4) inset");
      },
      mouseleave: function() {
        return $box.css("box-shadow", "0 0 10px rgba(0,0,0,0.4) inset");
      }
    });
    $box.on("click", function(e) {
      colors.unshift([$(this).find(".hue").text(), $(this).find(".chroma").text(), $(this).find(".brightness").text()]);
      if (colors.length === 1) {
        return seed(this.id);
      } else {
        return gen(this.id);
      }
    });
    return $("button#reset-button").on("click", function(e) {
      return palettaOff();
    });
  });

  seed = function(colorID) {
    var $color_id, $reset_btn;
    $reset_btn = $("button#reset-button");
    $reset_btn.fadeIn(300);
    $reset_btn.css("background-color", getRGBCSS(colors[0]));
    $color_id = $("#" + colorID);
    return $(".box").each(function(i) {
      var $color_dom, hsv, hue, rgb;
      if (colorID !== "color" + i) {
        hue = parseInt(colors[0][0]) + rand(40) - 20;
        hsv = getRandomColor(hue);
        rgb = getRGBCSS(hsv);
        $color_dom = $("#color" + i);
        $color_dom.css("background-color", getRGBCSS(hsv));
        $color_dom.find(".rgb").attr("data-clipboard-text", rgb.split("#").pop());
        $color_dom.find(".rgb").text(rgb);
        $color_dom.find(".hue").text(hsv[0]);
        $color_dom.find(".chroma").text(hsv[1]);
        $color_dom.find(".brightness").text(hsv[2]);
        if (hsv[2] > 0.70 && hsv[1] < 0.30) {
          return $color_dom.find(".rgb").css("color", "#131516");
        } else {
          return $color_dom.find(".rgb").css("color", "#ffffff");
        }
      }
    });
  };

  palettaOn = function(colorID) {
    console.log(colorID);
    return $(".box").each(function(i) {
      var $color_dom, hsv, rgb;
      if (colorID !== "color" + i) {
        hsv = colors[i];
        rgb = getRGBCSS(hsv);
        $color_dom = $("#color" + i);
        $color_dom.css("background-color", getRGBCSS(hsv));
        $color_dom.find(".rgb").attr("data-clipboard-text", rgb.split("#").pop());
        $color_dom.find(".rgb").text(rgb);
        $color_dom.find(".hue").text(hsv[0]);
        $color_dom.find(".chroma").text(hsv[1]);
        $color_dom.find(".brightness").text(hsv[2]);
        if (hsv[2] > 0.70 && hsv[1] < 0.30) {
          return $color_dom.find(".rgb").css("color", "#131516");
        } else {
          return $color_dom.find(".rgb").css("color", "#ffffff");
        }
      }
    });
  };

  palettaOff = function() {
    var $color_dom, clip, colorCount, colorIDs, hsv, i, rgb, _i, _j;
    colors = [];
    $("button#reset-button").hide();
    colorIDs = [];
    colorCount = $(".box").length;
    for (i = _i = 0; 0 <= colorCount ? _i < colorCount : _i > colorCount; i = 0 <= colorCount ? ++_i : --_i) {
      colorIDs.push(i);
    }
    colorIDs.sort(function() {
      return Math.random() - Math.random();
    });
    $(".box").each(function(i) {
      $(this).empty();
      $(this).attr("id", "color" + colorIDs[i]);
      $(this).append("<span class=\"rgb\" data-clipboard-text=\"000000\" data-original-title=\"Click to Copy\">#000000</span>");
      $(this).append("<p class=\"hue\">0</p>");
      $(this).append("<p class=\"chroma\">0</p>");
      return $(this).append("<p class=\"brightness\">0</p>");
    });
    for (i = _j = 0; 0 <= colorCount ? _j < colorCount : _j > colorCount; i = 0 <= colorCount ? ++_j : --_j) {
      hsv = getBaseColor(i, colorCount);
      rgb = getRGBCSS(hsv);
      $color_dom = $("#color" + i);
      $color_dom.css("background-color", getRGBCSS(hsv));
      $color_dom.find(".rgb").attr("data-clipboard-text", rgb.split("#").pop());
      $color_dom.find(".rgb").text(rgb);
      $color_dom.find(".hue").text(hsv[0]);
      $color_dom.find(".chroma").text(hsv[1]);
      $color_dom.find(".brightness").text(hsv[2]);
    }
    clip = new ZeroClipboard($(".box").find(".rgb"), {
      moviePath: "/static/custom/flash/ZeroClipboard.swf"
    });
    clip.on("complete", function(client, args) {
      var $notify_message;
      $notify_message = $(".notify-message");
      $notify_message.text("Copied " + args.text + " to your clip board");
      return $notify_message.stop().fadeIn(400).delay(1000).fadeOut(700);
    });
    clip.on("mouseover", function(client) {
      return $(this).tooltip("show");
    });
    return clip.on("mouseout", function(client) {
      return $(this).tooltip("hide");
    });
  };

  getBaseColor = function(i, count) {
    var h, s, v;
    h = i / count * 360;
    s = 0.8;
    v = 0.8;
    return [h, s, v];
  };

  getRandomColor = function(hue) {
    var s, v;
    s = Math.random();
    v = Math.random();
    return [hue, s, v];
  };

  getRGBCSS = function(hsv) {
    var rgb;
    rgb = hsv2rgb(hsv[0], hsv[1], hsv[2]);
    return rgb2css(rgb[0], rgb[1], rgb[2]);
  };

  hsv2rgb = function(h, s, v) {
    var f, hi, p, q, rgb, t;
    while (h < 0) {
      h += 360;
    }
    h %= 360;
    if (+s === 0) {
      v *= 255;
      return [v, v, v];
    }
    hi = +(h / 60 >> 0);
    f = h / 60 - hi;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    rgb = [1, 1, 1];
    if (hi === 0) {
      rgb = [v, t, p];
    } else if (hi === 1) {
      rgb = [q, v, p];
    } else if (hi === 2) {
      rgb = [p, v, t];
    } else if (hi === 3) {
      rgb = [p, q, v];
    } else if (hi === 4) {
      rgb = [t, p, v];
    } else if (hi === 5) {
      rgb = [v, p, q];
    }
    rgb[0] = rgb[0] * 255 >> 0;
    rgb[1] = rgb[1] * 255 >> 0;
    rgb[2] = rgb[2] * 255 >> 0;
    return rgb;
  };

  rgb2css = function(r, g, b) {
    if (typeof r === "object") {
      g = r[1];
      b = r[2];
      r = r[0];
    }
    return "#" + dec2hex(r, 2) + dec2hex(g, 2) + dec2hex(b, 2);
  };

  dec2hex = function(n, beam) {
    var hex, i, m, _i;
    hex = "";
    for (i = _i = 0; 0 <= beam ? _i < beam : _i > beam; i = 0 <= beam ? ++_i : --_i) {
      m = n & 0xf;
      hex = "0123456789abcdef".charAt(m) + hex;
      n -= m;
      n >>= 4;
    }
    return hex.slice(-2);
  };

  rgb2hsv = function(s) {
    var hsv, i, max, min, rgb, _i, _ref;
    if (s.length !== 6) {
      return "#00000";
    }
    rgb = [0, 0, 0];
    rgb[0] = parseInt(s.substring(0, 2), 16);
    rgb[1] = parseInt(s.substring(2, 4), 16);
    rgb[2] = parseInt(s.substring(4, 6), 16);
    max = 0;
    min = 256;
    for (i = _i = 0, _ref = rgb.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (max < rgb[i]) {
        max = rgb[i];
      }
      if (min > rgb[i]) {
        min = rgb[i];
      }
    }
    hsv = [0, 0, 0];
    if (max === min) {
      hsv[0] = 0;
    } else if (max === rgb[0]) {
      hsv[0] = (60 * (rgb[1] - rgb[2]) / (max - min) + 360) % 360;
    } else if (max === rgb[1]) {
      hsv[0] = (60 * (rgb[2] - rgb[0]) / (max - min)) + 120;
    } else {
      if (max === rgb[2]) {
        hsv[0] = (60 * (rgb[0] - rgb[1]) / (max - min)) + 240;
      }
    }
    if (max === 0) {
      hsv[1] = 0;
    } else {
      hsv[1] = 255 * ((max - min) / max);
    }
    hsv[2] = max;
    return hsv;
  };

  rand = function(n) {
    return Math.floor(Math.random() * n);
  };

  shuffle = function(array) {
    var i, j, tmp, x, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      x = array[_i];
      i = rand(array.length - 1);
      j = rand(array.length - 1);
      tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  };

  prevent_overflow = function(c) {
    var h, s, v;
    h = c[0];
    s = c[1];
    v = c[2];
    if (h > 360) {
      h -= 360;
    } else if (h < 0) {
      h += 360;
    }
    if (s > 1.0) {
      s = 1.09;
    } else if (s < 0.0) {
      s = 0.0;
    }
    if (v > 1.0) {
      v = 0.1;
    } else if (v < 0.0) {
      v = 0.0;
    }
    return [h, s, v];
  };

}).call(this);