    window.onload= function(){
       change.init() ;
    }
    var ss = 'SELECT tba1.* \n'+
             '     , tba1.a \n'+
             '     , tba2.b \n'+
             '     , tba2.a \n'+
             '     , tba1.a \n'+
             '     , nvl(tba1.table_under,"") \n'+
             '     , nvl(tba1.table_under,"") \n'+
             '     , nvl(tba1.table_under,"") \n'+
             '     , nvl(tba1.table_under,"") \n'+
             '     , nvl(tba1.table_under,"") \n'+
             '     , nvl(tba1.table_under,"") \n'+
             '     , nvl(tba1.table_under,"") \n'+
             '     , nvl(tba1.table_under,tba.table_under) \n'+
             '  FROM ( \n'+
             '       SELECT TB4.CD_NM \n'+
             '            , TB4.CD_CODE \n'+
             '            , TB5.SMPP1 \n'+
             '            , TB5.SMPP1 \n'+
             '         FROM TBL_SMPPE002 TB4 \n'+
             '            , TBL_SMPPE003 TB5 \n'+
             '        WHERE 1=1 \n'+
             '          AND TB4.CD_NM = NVL(1,2) \n'+
             '          AND TB4.A = (SELECT T.T1 \n'+
             '          AND            FROM TB_TEST T) \n'+
             '       ) tba \n'+
             '     , TB_SMPPE001 tba1 \n'+
             '     , TB_SMPCO007 tba2'

    var change = {
        init: function(){
            this.draw();
            this.reload();
        },
        reload: function(){
            this.columns = [];
            this.tableNames= [];
            this._data = [];
            this._arr = [];
            this._bracesData.index =[]
            this._bracesData.data =[]
        },
        draw: function(){
            //create button.click = change.analyze
            let $button = document.createElement('button');
            $button.addEventListener('click',function(){change.analyze()});
            $button.textContent = 'click';
            
            document.body.append(document.createElement('div'));
            document.body.querySelector('div').appendChild($button);

            //create textarea.id = draw
            let $div_draw = document.createElement('div');
            $div_draw.id = 'draw';
            $div_draw.style.float ='left';

            let $text_query = document.createElement('textarea');
            $text_query.id = 'query';
            $text_query.cols ='50';
            $text_query.rows='50';

            $div_draw.appendChild($text_query);
            document.body.append($div_draw);

            let $rt = document.createElement('textarea');
            $rt.id = 'rt';
            $rt.cols ='50';
            $rt.rows='50';

            document.body.append($rt);
            //임시 테스트
            document.querySelector('textarea').textContent = ss;
        },
        analyze : function(){
            //data reset
            this.reload();
            console.log('this.Array Empty!');
            let $query = document.querySelector('#query').value;

            //coulmn list
            $query = $query.split(' ').join('$space;&nbsp;$space;')
                           .split(')').join('$space;)$space;')
                           .split('(').join('$space;($space;')
                           .split(',').join('$space;,$space;')
                           .split('>').join('$space;>$space;')
                           .split('<').join('$space;<$space;')
                           .split('=').join('$space;=$space;')
            let $arr = $query.split('$space;')
            $query =this.ArrayisEmptyCheck($arr);
            $arr = [];
            //쿼리 배열로 정리
            for(x in $query){
                //index, data array insert
                $arr.push([x,$query[x]])                
                
                //tableCoulmns add Logic
                let $cl = $query[x].split('.');
                if($cl.length>1){
                    //coulmns Add
                    this.columns.push($query[x]);
                }
            }

            //괄호 찾아서 배열로 저장
            this.braces($arr)

            //-----jsonData로 테이블 정리시작------
            this.columns = this.ArrayisEmptyCheck(this.columns,'overlap');//담고 비우기
            //임시로 담을 어레이생성
            let arr=[];
            for(x in this.columns){
                arr.push(this.columns[x].split('.'))
            }//중복제거
            this.columns = arr;
            arr = this.ArrayisEmptyCheck(arr,'overlap2',0);//담고 비우기
            //컬럼 배열로 나눠서 넣기
            //Array에 jsonObject로 변형하여 예쁘게 담기
            for(x in arr){
                let frm = new Object();
                let frm2 = []
                frm.tableAs = arr[x]
                for(c in this.columns){
                    if(arr[x]==this.columns[c][0]){
                        frm2.push(this.columns[c][1])
                    }
            }
                frm.columns = frm2  
                this._data.push(frm)
            }
            //테이블 이름 찾기 시작!
            for(x in this._arr){
                let arr = this._arr[x].array
                for(h in this._data){
                    let tableAs = this._data[h].tableAs
                    for(c in arr){
                        if(tableAs ==arr[c][1]){
                            if(arr[c-1][1]=='FROM'||arr[c-1][1]==','){
                                this._data[h].tableName = 'subTable_'+arr[c][1]
                            }else{
                                this._data[h].tableName = arr[parseInt(c)-1][1]
                            }
                        }

                    }
                }
            }

            this.result()

        },
        ArrayisEmptyCheck: function(arr, flag, index){
            //빈값체크
            let chk_arr =[];
            if(flag==null){
                for(x in arr){
                    if(arr[x].length>0){
                        chk_arr.push(arr[x])
                    }
                }
                return chk_arr
            }else if (flag=='overlap'){
                //1차원 배열 중복제거
                var itemsFound = {};
                for(var i = 0, l = arr.length; i < l; i++) {
                    var stringified = JSON.stringify(arr[i]);
                    if(itemsFound[stringified]) { continue; }
                    chk_arr.push(arr[i]);
                    itemsFound[stringified] = true;
                }
                return chk_arr;
            }else if (flag=='overlap2'){
                //2차월 배열 중복제거
                var itemsFound = {};
                for(var i = 0, l = arr.length; i < l; i++) {
                    var stringified = JSON.stringify(arr[i][index]);
                    if(itemsFound[stringified]) { continue; }
                    chk_arr.push(arr[i][index]);
                    itemsFound[stringified] = true;
                }
                return chk_arr;

            }else{
                for(x in arr){
                    if(arr[x]!=flag && arr[x].length>0){
                        chk_arr.push(arr[x])
                    }
                }
                return chk_arr
            }
        },
        //괄호 데이터 추출하여 배열에 저장
        braces : function($query){
            let qi =[];
            let qo=[];
            var cnt =0;
            for(x in $query){
                if($query[x][1]=='('){
                    qi.push([cnt++, x, $query[x][0]])
                    var flag=true
                    xs = 0;
                    x++;
                    for(var xj = x; xj<$query.length; xj++){
                        if(flag==true && $query[xj][1]==')'){
                            f_flag = false
                            for(xc in qo){
                                if($query[xj][0]==qo[xc][1]){
                                    cnt--;
                                    f_flag=true
                                }
                            }
                            if(!f_flag){
                                flag=false
                                xs = xj
                                qo.push([--cnt, xj, $query[xj][0]])
                            }
                        }else if(flag==true&&$query[xj][1]=='('){
                            cnt++
                        }
                    }
                }
            }

            qi.sort(function(a, b) { 
                return  b[0] - a[0]; 
            });
            qo.sort(function(a, b) { 
                return  b[0] - a[0];  
            });

            //괄호데이터 배열로 정렬
            for(var x =0; x<qo.length;x++){
                let frm = [];
                var len = qo[x][1]+1

                let obj = new Object();
                obj.str = qi[x][1]
                obj.end = qo[x][1]

                for(var i = parseInt(qi[x][1]);i<len;i++){
                    if($query[i][1]==''||$query[i][1]=='&nbsp;'||$query[i][1]=='\n'||$query[i][1]=='undefined'){
                    }else if($query[i].length>1){
                        frm.push([i,$query[i].pop()])
                    }
                }
                //빈값 스페이스 엔터 제거하고, 두번째값이 select일경우 from
                obj.array = frm
                this._arr.push(obj)
            }
            //괄호 데이터가 제거된 데이터
            let obj = new Object();
                obj.str = 0
                obj.end = 0              
            let frm = [];

            for(var i =0; i< $query.length;i++){
                if($query[i][1]==''||$query[i][1]=='&nbsp;'||$query[i][1]=='\n'||$query[i][1]=='undefined'){
                }else if($query[i].length>1){
                        frm.push([i,$query[i].pop()])

                }
            }
            obj.array = frm;
            this._arr.push(obj)

        },
        result : function(){

            let html = '';
            for(x in this._data){
                let $tb = this._data[x]
                html += '------------------------------------\n'
                html += '테이블 : ' + $tb.tableName +' AS '+$tb.tableAs +'\n'
                html += '-columns-\n'
                for(c in $tb.columns){
                    if($tb.columns[c]!='*'){
                        html += c+': ' + $tb.columns[c] +'\n'
                    }
                }
                html += '\n'
            }
            console.log(html)
            document.getElementById('rt').remove();
            let $rt = document.createElement('textarea');
            $rt.id = 'rt';
            $rt.cols ='50';
            $rt.rows='50';
            document.body.append($rt);

            document.getElementById('rt').textContent = ''
            document.getElementById('rt').textContent = html;
        },
        tableNames:[],
        columns: [],
        _data : [],
        _arr : [],
        _bracesData: {
            index: [],
            data : []

        },
        _docu: {
            init : function(){console.log('this.function first draw')}
            ,reload : function(){console.log('this.function reset')}
            ,analyze : function(){console.log('query draws in the HTML is analyze')}
            ,draw : function(){console.log('draw HTML')}
        }

    }




        //consolt.log 찍기
        var msg = {
            error : function(){
                console.log("에러발생");
                console.trace();
            },
            notInfo : function(param){
                console.log(param + '정보가 존재하지 않습니다.');
            }
        }   