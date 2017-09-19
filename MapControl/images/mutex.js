/**
*                                Author: Vladimir Novick 
*                                       ( http://www.linkedin.com/in/vladimirnovick , vlad.novick@gmail.com )
* 
*   Wednesday, 10 February 2010 12:46:53 
*/// mutex.js
function ObjMutex() {this.objMutex = new Object();this.add = function(k,o){ this.objMutex[k] = o; }
this.remove = function( k ){ delete this.objMutex[k]; }
this.get = function( k ){ return k==null ? null : this.objMutex[k]; }
this.first = function( ){ return this.get( this.nextKey( ) ); }
this.next = function( k ){ return this.get( this.nextKey(k) ); }
this.nextKey = function( k ){ for (i in this.objMutex) {if (!k) return i;if (k==i) k=null;}
return null;}
}
function Mutex( a, b ) {if (!Mutex.Wait) Mutex.Wait = new ObjMutex();Mutex.SLICE = function( d, e ) {Mutex.Wait.get(d).attempt( Mutex.Wait.get(e) );}
this.attempt = function( f ) {for (var j=f; j; j=Mutex.Wait.next(j.c.id)) {if (j.enter || (j.number && (j.number < this.number ||
(j.number == this.number && j.c.id < this.c.id) ) ) )
return setTimeout("Mutex.SLICE("+this.c.id+","+j.c.id+")",10);}
this.c[ this.methodID ](); this.number = 0; Mutex.Wait.remove( this.c.id );}
this.c = a;this.methodID = b;Mutex.Wait.add( this.c.id, this ); this.enter = true;this.number = (new Date()).getTime();this.enter = false;this.attempt( Mutex.Wait.first() );}
