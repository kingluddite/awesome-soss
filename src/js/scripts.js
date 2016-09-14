( function ( $, window, document, undefined ) {

  'use strict';

  $( function () {
    $( '.toggle-nav' ).on( 'click', function () {
      $( '.flex-nav ul' ).toggleClass( 'open' );
    } );
  } );

} )( jQuery, window, document );
