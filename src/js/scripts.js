/* @flow */
'use strict';
( function ( $, window, document, undefined ) {

  $( function () {
    $( '.toggle-nav' ).on( 'click', function () {
      $( '.flex-nav ul' ).toggleClass( 'open' );
    } );
  } );
} )( jQuery, window, document );

// Comment out the following lines if you want to see
// facebook flow working when you run gulp
// also suggest adding lint-flow to atom so you can
// see errors inside atom
// function foo( x: string, y: number ): string {
//   return x.length * y;
// }
//
// foo( 'Hello', 42 );
