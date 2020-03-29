"use strict";var MIN_SKIP=3,MAX_MODULES=57,INTEGER_MATH_SHIFT=8,CENTER_QUORUM=2;function FinderPattern(t,e,r){this.x=t,this.y=e,this.count=1,this.estimatedModuleSize=r,this.__defineGetter__("EstimatedModuleSize",function(){return this.estimatedModuleSize}),this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("X",function(){return this.x}),this.__defineGetter__("Y",function(){return this.y}),this.incrementCount=function(){this.count++},this.aboutEquals=function(t,e,r){if(Math.abs(e-this.y)<=t&&Math.abs(r-this.x)<=t){var i=Math.abs(t-this.estimatedModuleSize);return i<=1||i/this.estimatedModuleSize<=1}return!1}}function FinderPatternInfo(t){this.bottomLeft=t[0],this.topLeft=t[1],this.topRight=t[2],this.__defineGetter__("BottomLeft",function(){return this.bottomLeft}),this.__defineGetter__("TopLeft",function(){return this.topLeft}),this.__defineGetter__("TopRight",function(){return this.topRight})}function FinderPatternFinder(){this.image=null,this.possibleCenters=[],this.hasSkipped=!1,this.crossCheckStateCount=new Array(0,0,0,0,0),this.resultPointCallback=null,this.__defineGetter__("CrossCheckStateCount",function(){return this.crossCheckStateCount[0]=0,this.crossCheckStateCount[1]=0,this.crossCheckStateCount[2]=0,this.crossCheckStateCount[3]=0,this.crossCheckStateCount[4]=0,this.crossCheckStateCount}),this.foundPatternCross=function(t){for(var e=0,r=0;r<5;r++){var i=t[r];if(0==i)return!1;e+=i}if(e<7)return!1;var s=Math.floor((e<<INTEGER_MATH_SHIFT)/7),n=Math.floor(s/2);return Math.abs(s-(t[0]<<INTEGER_MATH_SHIFT))<n&&Math.abs(s-(t[1]<<INTEGER_MATH_SHIFT))<n&&Math.abs(3*s-(t[2]<<INTEGER_MATH_SHIFT))<3*n&&Math.abs(s-(t[3]<<INTEGER_MATH_SHIFT))<n&&Math.abs(s-(t[4]<<INTEGER_MATH_SHIFT))<n},this.centerFromEnd=function(t,e){return e-t[4]-t[3]-t[2]/2},this.crossCheckVertical=function(t,e,r,i){for(var s=this.image,n=qrcode.height,o=this.CrossCheckStateCount,h=t;h>=0&&s[e+h*qrcode.width];)o[2]++,h--;if(h<0)return NaN;for(;h>=0&&!s[e+h*qrcode.width]&&o[1]<=r;)o[1]++,h--;if(h<0||o[1]>r)return NaN;for(;h>=0&&s[e+h*qrcode.width]&&o[0]<=r;)o[0]++,h--;if(o[0]>r)return NaN;for(h=t+1;h<n&&s[e+h*qrcode.width];)o[2]++,h++;if(h==n)return NaN;for(;h<n&&!s[e+h*qrcode.width]&&o[3]<r;)o[3]++,h++;if(h==n||o[3]>=r)return NaN;for(;h<n&&s[e+h*qrcode.width]&&o[4]<r;)o[4]++,h++;if(o[4]>=r)return NaN;var a=o[0]+o[1]+o[2]+o[3]+o[4];return 5*Math.abs(a-i)>=2*i?NaN:this.foundPatternCross(o)?this.centerFromEnd(o,h):NaN},this.crossCheckHorizontal=function(t,e,r,i){for(var s=this.image,n=qrcode.width,o=this.CrossCheckStateCount,h=t;h>=0&&s[h+e*qrcode.width];)o[2]++,h--;if(h<0)return NaN;for(;h>=0&&!s[h+e*qrcode.width]&&o[1]<=r;)o[1]++,h--;if(h<0||o[1]>r)return NaN;for(;h>=0&&s[h+e*qrcode.width]&&o[0]<=r;)o[0]++,h--;if(o[0]>r)return NaN;for(h=t+1;h<n&&s[h+e*qrcode.width];)o[2]++,h++;if(h==n)return NaN;for(;h<n&&!s[h+e*qrcode.width]&&o[3]<r;)o[3]++,h++;if(h==n||o[3]>=r)return NaN;for(;h<n&&s[h+e*qrcode.width]&&o[4]<r;)o[4]++,h++;if(o[4]>=r)return NaN;var a=o[0]+o[1]+o[2]+o[3]+o[4];return 5*Math.abs(a-i)>=i?NaN:this.foundPatternCross(o)?this.centerFromEnd(o,h):NaN},this.handlePossibleCenter=function(t,e,r){var i=t[0]+t[1]+t[2]+t[3]+t[4],s=this.centerFromEnd(t,r),n=this.crossCheckVertical(e,Math.floor(s),t[2],i);if(!isNaN(n)&&(s=this.crossCheckHorizontal(Math.floor(s),Math.floor(n),t[2],i),!isNaN(s))){for(var o=i/7,h=!1,a=this.possibleCenters.length,u=0;u<a;u++){var f=this.possibleCenters[u];if(f.aboutEquals(o,n,s)){f.incrementCount(),h=!0;break}}if(!h){var d=new FinderPattern(s,n,o);this.possibleCenters.push(d),null!=this.resultPointCallback&&this.resultPointCallback.foundPossibleResultPoint(d)}return!0}return!1},this.selectBestPatterns=function(){var t=this.possibleCenters.length;if(t<3)throw"Couldn't find enough finder patterns (found "+t+")";if(t>3){for(var e=0,r=0,i=0;i<t;i++){var s=this.possibleCenters[i].EstimatedModuleSize;e+=s,r+=s*s}var n=e/t;this.possibleCenters.sort(function(t,e){var r=Math.abs(e.EstimatedModuleSize-n),i=Math.abs(t.EstimatedModuleSize-n);return r<i?-1:r==i?0:1});var o=Math.sqrt(r/t-n*n),h=Math.max(.2*n,o);for(i=this.possibleCenters.length-1;i>=0;i--){var a=this.possibleCenters[i];Math.abs(a.EstimatedModuleSize-n)>h&&this.possibleCenters.splice(i,1)}}return this.possibleCenters.length>3&&this.possibleCenters.sort(function(t,e){return t.count>e.count?-1:t.count<e.count?1:0}),new Array(this.possibleCenters[0],this.possibleCenters[1],this.possibleCenters[2])},this.findRowSkip=function(){var t=this.possibleCenters.length;if(t<=1)return 0;for(var e=null,r=0;r<t;r++){var i=this.possibleCenters[r];if(i.Count>=CENTER_QUORUM){if(null!=e)return this.hasSkipped=!0,Math.floor((Math.abs(e.X-i.X)-Math.abs(e.Y-i.Y))/2);e=i}}return 0},this.haveMultiplyConfirmedCenters=function(){for(var t=0,e=0,r=this.possibleCenters.length,i=0;i<r;i++){var s=this.possibleCenters[i];s.Count>=CENTER_QUORUM&&(t++,e+=s.EstimatedModuleSize)}if(t<3)return!1;var n=e/r,o=0;for(i=0;i<r;i++)s=this.possibleCenters[i],o+=Math.abs(s.EstimatedModuleSize-n);return o<=.05*e},this.findFinderPattern=function(t){this.image=t;var e=qrcode.height,r=qrcode.width,i=Math.floor(3*e/(4*MAX_MODULES));i<MIN_SKIP&&(i=MIN_SKIP);for(var s=!1,n=new Array(5),o=i-1;o<e&&!s;o+=i){n[0]=0,n[1]=0,n[2]=0,n[3]=0,n[4]=0;for(var h=0,a=0;a<r;a++)if(t[a+o*qrcode.width])1==(1&h)&&h++,n[h]++;else if(0==(1&h))if(4==h)if(this.foundPatternCross(n)){if(this.handlePossibleCenter(n,o,a))if(i=2,this.hasSkipped)s=this.haveMultiplyConfirmedCenters();else{var u=this.findRowSkip();u>n[2]&&(o+=u-n[2]-i,a=r-1)}else{do{a++}while(a<r&&!t[a+o*qrcode.width]);a--}h=0,n[0]=0,n[1]=0,n[2]=0,n[3]=0,n[4]=0}else n[0]=n[2],n[1]=n[3],n[2]=n[4],n[3]=1,n[4]=0,h=3;else n[++h]++;else n[h]++;if(this.foundPatternCross(n))this.handlePossibleCenter(n,o,r)&&(i=n[0],this.hasSkipped&&(s=this.haveMultiplyConfirmedCenters()))}var f=this.selectBestPatterns();return qrcode.orderBestPatterns(f),new FinderPatternInfo(f)}}qrcode.orderBestPatterns=function(t){function e(t,e){var r=t.X-e.X,i=t.Y-e.Y;return Math.sqrt(r*r+i*i)}var r,i,s,n=e(t[0],t[1]),o=e(t[1],t[2]),h=e(t[0],t[2]);if(o>=n&&o>=h?(i=t[0],r=t[1],s=t[2]):h>=o&&h>=n?(i=t[1],r=t[0],s=t[2]):(i=t[2],r=t[0],s=t[1]),function(t,e,r){var i=e.x,s=e.y;return(r.x-i)*(t.y-s)-(r.y-s)*(t.x-i)}(r,i,s)<0){var a=r;r=s,s=a}t[0]=r,t[1]=i,t[2]=s};