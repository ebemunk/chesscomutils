'use strict';

/*
 * Copyright (c) 2013, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

/* minified license below  */

/*! Copyright (c) 2013, Jeff Hlywa (jhlywa@gmail.com)
 *  Released under the BSD license
 *  https://github.com/jhlywa/chess.js/blob/master/LICENSE
 */

var Chess = function(fen) {

  /* jshint indent: false */

  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var SYMBOLS = 'pnbrqkPNBRQK';

  var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14,  18, 33, 31,  14],
    b: [-17, -15,  17,  15],
    r: [-16,   1,  16,  -1],
    q: [-17, -16, -15,   1,  17, 16, 15,  -1],
    k: [-17, -16, -15,   1,  17, 16, 15,  -1]
  };

  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  };

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  };

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_3 = 5;
  var RANK_4 = 4;
  var RANK_5 = 3;
  var RANK_6 = 2;
  var RANK_7 = 1;
  var RANK_8 = 0;

  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var ROOKS = {
    w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
    b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
  };

  var board = new Array(128);
  var kings = {w: EMPTY, b: EMPTY};
  var turn = WHITE;
  var castling = {w: 0, b: 0};
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }

  function clear() {
    board = new Array(128);
    kings = {w: EMPTY, b: EMPTY};
    turn = WHITE;
    castling = {w: 0, b: 0};
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    header = {};
    update_setup(generate_fen());
  }

  function reset() {
    load(DEFAULT_POSITION);
  }

  function load(fen) {
    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;
    var valid = SYMBOLS + '12345678/';

    if (!validate_fen(fen).valid) {
      return false;
    }

    clear();

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = (piece < 'a') ? WHITE : BLACK;
        put({type: piece.toLowerCase(), color: color}, algebraic(square));
        square++;
      }
    }

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }

    ep_square = (tokens[3] === '-') ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true;
  }

  function validate_fen(fen) {
    var errors = {
       0: 'No errors.',
       1: 'FEN string must contain six space-delimited fields.',
       2: '6th field (move number) must be a positive integer.',
       3: '5th field (half move counter) must be a non-negative integer.',
       4: '4th field (en-passant square) is invalid.',
       5: '3rd field (castling availability) is invalid.',
       6: '2nd field (side to move) is invalid.',
       7: '1st field (piece positions) does not contain 8 \'/\'-delimited rows.',
       8: '1st field (piece positions) is invalid [consecutive numbers].',
       9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
    };

    /* 1st criterion: 6 space-seperated fields? */
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
      return {valid: false, error_number: 1, error: errors[1]};
    }

    /* 2nd criterion: move number field is a integer value > 0? */
    if (isNaN(tokens[5]) || (parseInt(tokens[5], 10) <= 0)) {
      return {valid: false, error_number: 2, error: errors[2]};
    }

    /* 3rd criterion: half move counter is an integer >= 0? */
    if (isNaN(tokens[4]) || (parseInt(tokens[4], 10) < 0)) {
      return {valid: false, error_number: 3, error: errors[3]};
    }

    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return {valid: false, error_number: 4, error: errors[4]};
    }

    /* 5th criterion: 3th field is a valid castle-string? */
    if( !/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return {valid: false, error_number: 5, error: errors[5]};
    }

    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return {valid: false, error_number: 6, error: errors[6]};
    }

    /* 7th criterion: 1st field contains 8 rows? */
    var rows = tokens[0].split('/');
    if (rows.length !== 8) {
      return {valid: false, error_number: 7, error: errors[7]};
    }

    /* 8th criterion: every row is valid? */
    for (var i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      var sum_fields = 0;
      var previous_was_number = false;

      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) {
            return {valid: false, error_number: 8, error: errors[8]};
          }
          sum_fields += parseInt(rows[i][k], 10);
          previous_was_number = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return {valid: false, error_number: 9, error: errors[9]};
          }
          sum_fields += 1;
          previous_was_number = false;
        }
      }
      if (sum_fields !== 8) {
        return {valid: false, error_number: 10, error: errors[10]};
      }
    }

    /* everything's okay! */
    return {valid: true, error_number: 0, error: errors[0]};
  }

  function generate_fen() {
    var empty = 0;
    var fen = '';

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        var color = board[i].color;
        var piece = board[i].type;

        fen += (color === WHITE) ?
                 piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    var epflags = (ep_square === EMPTY) ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
  }

  function set_header(args) {
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' &&
          typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1];
      }
    }
    return header;
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return;

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = fen;
      header['FEN'] = '1';
    } else {
      delete header['SetUp'];
      delete header['FEN'];
    }
  }

  function get(square) {
    var piece = board[SQUARES[square]];
    return (piece) ? {type: piece.type, color: piece.color} : null;
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false;
    }

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false;
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false;
    }

    var sq = SQUARES[square];
    board[sq] = {type: piece.type, color: piece.color};
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }

    update_setup(generate_fen());

    return true;
  }

  function remove(square) {
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }

    update_setup(generate_fen());

    return piece;
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
    };

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to]) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
        move.captured = PAWN;
    }
    return move;
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (board[from].type === PAWN &&
         (rank(to) === RANK_8 || rank(to) === RANK_1)) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]));
          }
      } else {
       moves.push(build_move(board, from, to, flags));
      }
    }

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = {b: RANK_7, w: RANK_2};

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;
    var single_square = false;

    /* do we want legal moves? */
    var legal = (typeof options !== 'undefined' && 'legal' in options) ?
                options.legal : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return [];
      }
    }

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue;
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;

          if (board[square] != null &&
              board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              add_move(board, moves, i, square, BITS.CAPTURE);
              break;
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if ((!single_square) || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from + 2;

        if (board[castling_from + 1] == null &&
            board[castling_to]       == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from + 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us] , castling_to,
                   BITS.KSIDE_CASTLE);
        }
      }

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from - 2;

        if (board[castling_from - 1] == null &&
            board[castling_from - 2] == null &&
            board[castling_from - 3] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from - 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us], castling_to,
                   BITS.QSIDE_CASTLE);
        }
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves;
    }

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i]);
      }
      undo_move();
    }

    return legal_moves;
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   */
  function move_to_san(move) {
    var output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O';
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O';
    } else {
      var disambiguator = get_disambiguator(move);

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator;
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += 'x';
      }

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase();
      }
    }

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
      } else {
        output += '+';
      }
    }
    undo_move();

    return output;
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue;

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) { blocked = true; break; }
          j += offset;
        }

        if (!blocked) return true;
      }
    }

    return false;
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  }

  function in_check() {
    return king_attacked(turn);
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0;
  }

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0;
  }

  function insufficient_material() {
    var pieces = {};
    var bishops = [];
    var num_pieces = 0;
    var sq_color = 0;

    for (var i = SQUARES.a8; i<= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2;
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece) {
        pieces[piece.type] = (piece.type in pieces) ?
                              pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
        }
        num_pieces++;
      }
    }

    /* k vs. k */
    if (num_pieces === 2) { return true; }

    /* k vs. kn .... or .... k vs. kb */
    else if (num_pieces === 3 && (pieces[BISHOP] === 1 ||
                                 pieces[KNIGHT] === 1)) { return true; }

    /* kb vs. kb where any number of bishops are all on the same color */
    else if (num_pieces === pieces[BISHOP] + 2) {
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) { return true; }
    }

    return false;
  }

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    var moves = [];
    var positions = {};
    var repetition = false;

    while (true) {
      var move = undo_move();
      if (!move) break;
      moves.push(move);
    }

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      var fen = generate_fen().split(' ').slice(0,4).join(' ');

      /* has the position occurred three or move times */
      positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        repetition = true;
      }

      if (!moves.length) {
        break;
      }
      make_move(moves.pop());
    }

    return repetition;
  }

  function push(move) {
    history.push({
      move: move,
      kings: {b: kings.b, w: kings.w},
      turn: turn,
      castling: {b: castling.b, w: castling.w},
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number
    });
  }

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    board[move.to] = board[move.from];
    board[move.from] = null;

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = {type: move.promotion, color: us};
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag) {
          castling[us] ^= ROOKS[us][i].flag;
          break;
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag) {
          castling[them] ^= ROOKS[them][i].flag;
          break;
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }

    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn);
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) { return null; }

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;

    var us = turn;
    var them = swap_color(turn);

    board[move.from] = board[move.to];
    board[move.from].type = move.piece;  // to undo any promotions
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = {type: move.captured, color: them};
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = {type: PAWN, color: them};
    }


    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }

    return move;
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move) {
    var moves = generate_moves();

    var from = move.from;
    var to = move.to;
    var piece = move.piece;

    var ambiguities = 0;
    var same_rank = 0;
    var same_file = 0;

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from;
      var ambig_to = moves[i].to;
      var ambig_piece = moves[i].piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) {
          same_rank++;
        }

        if (file(from) === file(ambig_from)) {
          same_file++;
        }
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from);
      }
      /* if the moving piece rests on the same file, use the rank symbol as the
       * disambiguator
       */
      else if (same_file > 0) {
        return algebraic(from).charAt(1);
      }
      /* else use the file symbol */
      else {
        return algebraic(from).charAt(0);
      }
    }

    return '';
  }

  function ascii() {
    var s = '   +------------------------+\n';
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |';
      }

      /* empty piece */
      if (board[i] == null) {
        s += ' . ';
      } else {
        var piece = board[i].type;
        var color = board[i].color;
        var symbol = (color === WHITE) ?
                     piece.toUpperCase() : piece.toLowerCase();
        s += ' ' + symbol + ' ';
      }

      if ((i + 1) & 0x88) {
        s += '|\n';
        i += 8;
      }
    }
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s;
  }

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4;
  }

  function file(i) {
    return i & 15;
  }

  function algebraic(i){
    var f = file(i), r = rank(i);
    return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE;
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1;
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move);
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;

    return move;
  }

  function clone(obj) {
    var dupe = (obj instanceof Array) ? [] : {};

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe;
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    var moves = generate_moves({legal: false});
    var nodes = 0;
    var color = turn;

    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1);
          nodes += child_nodes;
        } else {
          nodes++;
        }
      }
      undo_move();
    }

    return nodes;
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function() {
                /* from the ECMA-262 spec (section 12.6.4):
                 * "The mechanics of enumerating the properties ... is
                 * implementation dependent"
                 * so: for (var sq in SQUARES) { keys.push(sq); } might not be
                 * ordered correctly
                 */
                var keys = [];
                for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                  if (i & 0x88) { i += 7; continue; }
                  keys.push(algebraic(i));
                }
                return keys;
              })(),
    FLAGS: FLAGS,

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen) {
      return load(fen);
    },

    reset: function() {
      return reset();
    },

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options);
      var moves = [];

      for (var i = 0, len = ugly_moves.length; i < len; i++) {

        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (typeof options !== 'undefined' && 'verbose' in options &&
            options.verbose) {
          moves.push(make_pretty(ugly_moves[i]));
        } else {
          moves.push(move_to_san(ugly_moves[i]));
        }
      }

      return moves;
    },

    in_check: function() {
      return in_check();
    },

    in_checkmate: function() {
      return in_checkmate();
    },

    in_stalemate: function() {
      return in_stalemate();
    },

    in_draw: function() {
      return half_moves >= 100 ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
    },

    insufficient_material: function() {
      return insufficient_material();
    },

    in_threefold_repetition: function() {
      return in_threefold_repetition();
    },

    game_over: function() {
      return half_moves >= 100 ||
             in_checkmate() ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
    },

    validate_fen: function(fen) {
      return validate_fen(fen);
    },

    fen: function() {
      return generate_fen();
    },

    pgn: function(options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      var newline = (typeof options === 'object' &&
                     typeof options.newline_char === 'string') ?
                     options.newline_char : '\n';
      var max_width = (typeof options === 'object' &&
                       typeof options.max_width === 'number') ?
                       options.max_width : 0;
      var result = [];
      var header_exists = false;

      /* add the PGN header headerrmation */
      for (var i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' \"' + header[i] + '\"]' + newline);
        header_exists = true;
      }

      if (header_exists && history.length) {
        result.push(newline);
      }

      /* pop all of history onto reversed_history */
      var reversed_history = [];
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      var moves = [];
      var move_string = '';
      var pgn_move_number = 1;

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        var move = reversed_history.pop();

        /* if the position started with black to move, start PGN with 1. ... */
        if (pgn_move_number === 1 && move.color === 'b') {
          move_string = '1. ...';
          pgn_move_number++;
        } else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string);
          }
          move_string = pgn_move_number + '.';
          pgn_move_number++;
        }

        move_string = move_string + ' ' + move_to_san(move);
        make_move(move);
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(move_string);
      }

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result);
      }

      /* history should be back to what is was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ');
      }

      /* wrap the PGN output at max_width */
      var current_width = 0;
      for (var i = 0; i < moves.length; i++) {
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {

          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop();
          }

          result.push(newline);
          current_width = 0;
        } else if (i !== 0) {
          result.push(' ');
          current_width++;
        }
        result.push(moves[i]);
        current_width += moves[i].length;
      }

      return result.join('');
    },

    load_pgn: function(pgn, options) {
      function mask(str) {
        return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
      }

      /* convert a move from Standard Algebraic Notation (SAN) to 0x88
       * coordinates
      */
      function move_from_san(move) {
        var to, from, flags = BITS.NORMAL, promotion;
        var parse = move.match(/^([NBKRQ])?([abcdefgh12345678][12345678]?)?(x)?([abcdefgh][12345678])(=?[NBRQ])?/);
        if (move.slice(0, 5) === 'O-O-O') {
          from = kings[turn];
          to = from - 2;
          flags = BITS.QSIDE_CASTLE;
        } else if (move.slice(0, 3) === 'O-O') {
          from = kings[turn];
          to = from + 2;
          flags = BITS.KSIDE_CASTLE;
        } else if (parse && parse[1]) {
          // regular moves
          var piece = parse[1].toLowerCase();
          if (parse[3]) {
            // capture
            flags = BITS.CAPTURE;
          }
          to = SQUARES[parse[4]];
          for (var j = 0, len = PIECE_OFFSETS[piece].length; j < len; j++) {
            var offset = PIECE_OFFSETS[piece][j];
            var square = to;

            while (true) {
              square += offset;
              if (square & 0x88) break;

              var b = board[square];
              if (b) {
                if (b.color === turn && b.type === piece && (!parse[2] || algebraic(square).indexOf(parse[2]) >= 0)) {
                  from = square;
                }
                break;
              }

              /* break, if knight or king */
              if (piece === 'n' || piece === 'k') break;
            }
          }
        } else if (parse) {
          // pawn move
          if (parse[3]) {
            // capture
            to = SQUARES[parse[4]];
            for (var j = 2; j < 4; j++) {
              var square = to - PAWN_OFFSETS[turn][j];
              if (square & 0x88) continue;

              if (board[square] != null &&
                  board[square].color === turn &&
                  algebraic(square)[0] === parse[2]) {
                from = square;
              }
            }
            if (board[to]) {
              flags = BITS.CAPTURE;
            } else {
              flags = BITS.EP_CAPTURE;
            }
          } else {
            // normal move
            to = SQUARES[move.slice(0,2)];
            var c = to - PAWN_OFFSETS[turn][0],
                b = board[c];
            if (b && b.type === PAWN && b.color === turn) {
              from = c;
            } else {
              c = to - PAWN_OFFSETS[turn][1];
              b = board[c];
              if (b && b.type === PAWN && b.color === turn) {
                from = c;
                flags = BITS.BIG_PAWN;
              }
            }
          }
          // promotion?
          if (parse[5]) {
            if(typeof parse[5][1] == 'undefined') {
              promotion = parse[5][0].toLowerCase();
            } else {
              promotion = parse[5][1].toLowerCase();
            }
          }
        }
        if (from >=0 && to >=0 && flags) {
          return build_move(board, from, to, flags, promotion);
        } else if (move.length > 0) {
          /* alert(move); // error in PGN, or in parsing. */
        }
      }

      function get_move_obj(move) {
        return move_from_san(trim(move));
      }

      function has_keys(object) {
        var has_keys = false;
        for (var key in object) {
          has_keys = true;
        }
        return has_keys;
      }

      function parse_pgn_header(header, options) {
        var newline_char = (typeof options === 'object' &&
                            typeof options.newline_char === 'string') ?
                            options.newline_char : '\r?\n';
        var header_obj = {};
        var headers = header.split(newline_char);
        var key = '';
        var value = '';

        for (var i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');
          if (trim(key).length > 0) {
            header_obj[key] = value;
          }
        }

        return header_obj;
      }

      var newline_char = (typeof options === 'object' &&
                          typeof options.newline_char === 'string') ?
                          options.newline_char : '\r?\n';
        var regex = new RegExp('^(\\[(.|' + mask(newline_char) + ')*\\])' +
                               '(' + mask(newline_char) + ')*' +
                               '1.(' + mask(newline_char) + '|.)*$', 'g');

      /* get header part of the PGN file */
      var header_string = pgn.replace(regex, '$1');

      /* no info part given, begins with moves */
      if (header_string[0] !== '[') {
        header_string = '';
      }

     reset();

      /* parse PGN header */
      var headers = parse_pgn_header(header_string, options);
      for (var key in headers) {
        set_header([key, headers[key]]);
      }

      /* delete header to get the moves */
      var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' ');

      /* delete comments */
      ms = ms.replace(/(\{[^}]+\})+?/g, '');

      /* delete move numbers */
      ms = ms.replace(/\d+\./g, '');


      /* trim and get array of moves */
      var moves = trim(ms).split(new RegExp(/\s+/));

      /* delete empty entries */
      moves = moves.join(',').replace(/,,+/g, ',').split(',');
      var move = '';

      for (var half_move = 0; half_move < moves.length - 1; half_move++) {
        move = get_move_obj(moves[half_move]);

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
          return false;
        } else {
          make_move(move);
        }
      }

      /* examine last move */
      move = moves[moves.length - 1];
      if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') {
          set_header(['Result', move]);
        }
      }
      else {
        move = get_move_obj(move);
        if (move == null) {
          return false;
        } else {
          make_move(move);
        }
      }
      return true;
    },

    header: function() {
      return set_header(arguments);
    },

    ascii: function() {
      return ascii();
    },

    turn: function() {
      return turn;
    },

    move: function(move) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */
      var move_obj = null;
      var moves = generate_moves();

      if (typeof move === 'string') {
        /* convert the move string to a move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move === move_to_san(moves[i])) {
            move_obj = moves[i];
            break;
          }
        }
      } else if (typeof move === 'object') {
        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move.from === algebraic(moves[i].from) &&
              move.to === algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)) {
            move_obj = moves[i];
            break;
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null;
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move;
    },

    undo: function() {
      var move = undo_move();
      return (move) ? make_pretty(move) : null;
    },

    clear: function() {
      return clear();
    },

    put: function(piece, square) {
      return put(piece, square);
    },

    get: function(square) {
      return get(square);
    },

    remove: function(square) {
      return remove(square);
    },

    perft: function(depth) {
      return perft(depth);
    },

    square_color: function(square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square];
        return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? 'light' : 'dark';
      }

      return null;
    },

    history: function(options) {
      var reversed_history = [];
      var move_history = [];
      var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                     options.verbose);

      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
        } else {
          move_history.push(move_to_san(move));
        }
        make_move(move);
      }

      return move_history;
    }

  };
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess;;
 /*!
 * jQuery Simulate v@VERSION - simulate browser mouse and keyboard events
 * https://github.com/jquery/jquery-simulate
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: @DATE
 */

;(function( $, undefined ) {

var rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/;

$.fn.simulate = function( type, options ) {
        return this.each(function() {
                new $.simulate( this, type, options );
        });
};

$.simulate = function( elem, type, options ) {
        var method = $.camelCase( "simulate-" + type );

        this.target = elem;
        this.options = options;

        if ( this[ method ] ) {
                this[ method ]();
        } else {
                this.simulateEvent( elem, type, options );
        }
};

$.extend( $.simulate, {

        keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
        },

        buttonCode: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
        }
});

$.extend( $.simulate.prototype, {

        simulateEvent: function( elem, type, options ) {
                var event = this.createEvent( type, options );
                this.dispatchEvent( elem, type, event, options );
        },

        createEvent: function( type, options ) {
                if ( rkeyEvent.test( type ) ) {
                        return this.keyEvent( type, options );
                }

                if ( rmouseEvent.test( type ) ) {
                        return this.mouseEvent( type, options );
                }
        },

        mouseEvent: function( type, options ) {
                var event, eventDoc, doc, body;
                options = $.extend({
                        bubbles: true,
                        cancelable: (type !== "mousemove"),
                        view: window,
                        detail: 0,
                        screenX: 0,
                        screenY: 0,
                        clientX: 1,
                        clientY: 1,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        button: 0,
                        relatedTarget: undefined
                }, options );

                if ( document.createEvent ) {
                        event = document.createEvent( "MouseEvents" );
                        event.initMouseEvent( type, options.bubbles, options.cancelable,
                                options.view, options.detail,
                                options.screenX, options.screenY, options.clientX, options.clientY,
                                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                                options.button, options.relatedTarget || document.body.parentNode );

                        // IE 9+ creates events with pageX and pageY set to 0.
                        // Trying to modify the properties throws an error,
                        // so we define getters to return the correct values.
                        if ( event.pageX === 0 && event.pageY === 0 && Object.defineProperty ) {
                                eventDoc = event.relatedTarget.ownerDocument || document;
                                doc = eventDoc.documentElement;
                                body = eventDoc.body;

                                Object.defineProperty( event, "pageX", {
                                        get: function() {
                                                return options.clientX +
                                                        ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                                                        ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                                        }
                                });
                                Object.defineProperty( event, "pageY", {
                                        get: function() {
                                                return options.clientY +
                                                        ( doc && doc.scrollTop || body && body.scrollTop || 0 ) -
                                                        ( doc && doc.clientTop || body && body.clientTop || 0 );
                                        }
                                });
                        }
                } else if ( document.createEventObject ) {
                        event = document.createEventObject();
                        $.extend( event, options );
                        // standards event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ff974877(v=vs.85).aspx
                        // old IE event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ms533544(v=vs.85).aspx
                        // so we actually need to map the standard back to oldIE
                        event.button = {
                                0: 1,
                                1: 4,
                                2: 2
                        }[ event.button ] || event.button;
                }

                return event;
        },

        keyEvent: function( type, options ) {
                var event;
                options = $.extend({
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        keyCode: 0,
                        charCode: undefined
                }, options );

                if ( document.createEvent ) {
                        try {
                                event = document.createEvent( "KeyEvents" );
                                event.initKeyEvent( type, options.bubbles, options.cancelable, options.view,
                                        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                                        options.keyCode, options.charCode );
                        // initKeyEvent throws an exception in WebKit
                        // see: http://stackoverflow.com/questions/6406784/initkeyevent-keypress-only-works-in-firefox-need-a-cross-browser-solution
                        // and also https://bugs.webkit.org/show_bug.cgi?id=13368
                        // fall back to a generic event until we decide to implement initKeyboardEvent
                        } catch( err ) {
                                event = document.createEvent( "Events" );
                                event.initEvent( type, options.bubbles, options.cancelable );
                                $.extend( event, {
                                        view: options.view,
                                        ctrlKey: options.ctrlKey,
                                        altKey: options.altKey,
                                        shiftKey: options.shiftKey,
                                        metaKey: options.metaKey,
                                        keyCode: options.keyCode,
                                        charCode: options.charCode
                                });
                        }
                } else if ( document.createEventObject ) {
                        event = document.createEventObject();
                        $.extend( event, options );
                }

                if ( !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() ) || (({}).toString.call( window.opera ) === "[object Opera]") ) {
                        event.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
                        event.charCode = undefined;
                }

                return event;
        },

        dispatchEvent: function( elem, type, event ) {
                if ( elem.dispatchEvent ) {
                        elem.dispatchEvent( event );
                } else if ( elem.fireEvent ) {
                        elem.fireEvent( "on" + type, event );
                }
        },

        simulateFocus: function() {
                var focusinEvent,
                        triggered = false,
                        element = $( this.target );

                function trigger() {
                        triggered = true;
                }

                element.bind( "focus", trigger );
                element[ 0 ].focus();

                if ( !triggered ) {
                        focusinEvent = $.Event( "focusin" );
                        focusinEvent.preventDefault();
                        element.trigger( focusinEvent );
                        element.triggerHandler( "focus" );
                }
                element.unbind( "focus", trigger );
        },

        simulateBlur: function() {
                var focusoutEvent,
                        triggered = false,
                        element = $( this.target );

                function trigger() {
                        triggered = true;
                }

                element.bind( "blur", trigger );
                element[ 0 ].blur();

                // blur events are async in IE
                setTimeout(function() {
                        // IE won't let the blur occur if the window is inactive
                        if ( element[ 0 ].ownerDocument.activeElement === element[ 0 ] ) {
                                element[ 0 ].ownerDocument.body.focus();
                        }

                        // Firefox won't trigger events if the window is inactive
                        // IE doesn't trigger events if we had to manually focus the body
                        if ( !triggered ) {
                                focusoutEvent = $.Event( "focusout" );
                                focusoutEvent.preventDefault();
                                element.trigger( focusoutEvent );
                                element.triggerHandler( "blur" );
                        }
                        element.unbind( "blur", trigger );
                }, 1 );
        }
});



/** complex events **/

function findCenter( elem ) {
        var offset,
                document = $( elem.ownerDocument );
        elem = $( elem );
        offset = elem.offset();

        return {
                x: offset.left + elem.outerWidth() / 2 - document.scrollLeft(),
                y: offset.top + elem.outerHeight() / 2 - document.scrollTop()
        };
}

$.extend( $.simulate.prototype, {
        simulateDrag: function() {
                var i = 0,
                        target = this.target,
                        options = this.options,
                        center = findCenter( target ),
                        x = Math.floor( center.x ),
                        y = Math.floor( center.y ),
                        dx = options.dx || 0,
                        dy = options.dy || 0,
                        moves = options.moves || 3,
                        coord = { clientX: x, clientY: y };

                this.simulateEvent( target, "mousedown", coord );

                for ( ; i < moves ; i++ ) {
                        x += dx / moves;
                        y += dy / moves;

                        coord = {
                                clientX: Math.round( x ),
                                clientY: Math.round( y )
                        };

                        this.simulateEvent( document, "mousemove", coord );
                }

                this.simulateEvent( target, "mouseup", coord );
                this.simulateEvent( target, "click", coord );
        }
});

})( jQuery );;
/*global define:false */
/**
 * Copyright 2013 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.4.5
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            93: 'meta',
            224: 'meta'
        },

        /**
         * mapping for special characters so they can support
         *
         * this dictionary is only used incase you want to bind a
         * keyup or keydown event to one of these keys
         *
         * @type {Object}
         */
        _KEYCODE_MAP = {
            106: '*',
            107: '+',
            109: '-',
            110: '.',
            111 : '/',
            186: ';',
            187: '=',
            188: ',',
            189: '-',
            190: '.',
            191: '/',
            192: '`',
            219: '[',
            220: '\\',
            221: ']',
            222: '\''
        },

        /**
         * this is a mapping of keys that require shift on a US keypad
         * back to the non shift equivelents
         *
         * this is so you can use keyup events with these keys
         *
         * note that this will only work reliably on US keyboards
         *
         * @type {Object}
         */
        _SHIFT_MAP = {
            '~': '`',
            '!': '1',
            '@': '2',
            '#': '3',
            '$': '4',
            '%': '5',
            '^': '6',
            '&': '7',
            '*': '8',
            '(': '9',
            ')': '0',
            '_': '-',
            '+': '=',
            ':': ';',
            '\"': '\'',
            '<': ',',
            '>': '.',
            '?': '/',
            '|': '\\'
        },

        /**
         * this is a list of special strings you can use to map
         * to modifier keys when you specify your keyboard shortcuts
         *
         * @type {Object}
         */
        _SPECIAL_ALIASES = {
            'option': 'alt',
            'command': 'meta',
            'return': 'enter',
            'escape': 'esc',
            'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
        },

        /**
         * variable to store the flipped version of _MAP from above
         * needed to check if we should use keypress or not when no action
         * is specified
         *
         * @type {Object|undefined}
         */
        _REVERSE_MAP,

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        _callbacks = {},

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        _directMap = {},

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        _sequenceLevels = {},

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        _resetTimer,

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        _ignoreNextKeyup = false,

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        _ignoreNextKeypress = false,

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        _nextExpectedAction = false;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {
        _MAP[i + 96] = i;
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * resets all sequence counters except for the ones passed in
     *
     * @param {Object} doNotReset
     * @returns void
     */
    function _resetSequences(doNotReset) {
        doNotReset = doNotReset || {};

        var activeSequences = false,
            key;

        for (key in _sequenceLevels) {
            if (doNotReset[key]) {
                activeSequences = true;
                continue;
            }
            _sequenceLevels[key] = 0;
        }

        if (!activeSequences) {
            _nextExpectedAction = false;
        }
    }

    /**
     * finds all callbacks that match based on the keycode, modifiers,
     * and action
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event|Object} e
     * @param {string=} sequenceName - name of the sequence we are looking for
     * @param {string=} combination
     * @param {number=} level
     * @returns {Array}
     */
    function _getMatches(character, modifiers, e, sequenceName, combination, level) {
        var i,
            callback,
            matches = [],
            action = e.type;

        // if there are no events related to this keycode
        if (!_callbacks[character]) {
            return [];
        }

        // if a modifier key is coming up on its own we should allow it
        if (action == 'keyup' && _isModifier(character)) {
            modifiers = [character];
        }

        // loop through all callbacks for the key that was pressed
        // and see if any of them match
        for (i = 0; i < _callbacks[character].length; ++i) {
            callback = _callbacks[character][i];

            // if a sequence name is not specified, but this is a sequence at
            // the wrong level then move onto the next match
            if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                continue;
            }

            // if the action we are looking for doesn't match the action we got
            // then we should keep going
            if (action != callback.action) {
                continue;
            }

            // if this is a keypress event and the meta key and control key
            // are not pressed that means that we need to only look at the
            // character, otherwise check the modifiers as well
            //
            // chrome will not fire a keypress if meta or control is down
            // safari will fire a keypress if meta or meta+shift is down
            // firefox will fire a keypress if meta or control is down
            if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                // when you bind a combination or sequence a second time it
                // should overwrite the first one.  if a sequenceName or
                // combination is specified in this call it does just that
                //
                // @todo make deleting its own method?
                var deleteCombo = !sequenceName && callback.combo == combination;
                var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                if (deleteCombo || deleteSequence) {
                    _callbacks[character].splice(i, 1);
                }

                matches.push(callback);
            }
        }

        return matches;
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * actually calls the callback function
     *
     * if your callback function returns false this will use the jquery
     * convention - prevent default and stop propogation on the event
     *
     * @param {Function} callback
     * @param {Event} e
     * @returns void
     */
    function _fireCallback(callback, e, combo, sequence) {

        // if this event should not happen stop here
        if (Mousetrap.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
            return;
        }

        if (callback(e, combo) === false) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            if (e.stopPropagation) {
                e.stopPropagation();
            }

            e.returnValue = false;
            e.cancelBubble = true;
        }
    }

    /**
     * handles a character key event
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event} e
     * @returns void
     */
    function _handleKey(character, modifiers, e) {
        var callbacks = _getMatches(character, modifiers, e),
            i,
            doNotReset = {},
            maxLevel = 0,
            processedSequenceCallback = false;

        // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
        for (i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].seq) {
                maxLevel = Math.max(maxLevel, callbacks[i].level);
            }
        }

        // loop through matching callbacks for this key event
        for (i = 0; i < callbacks.length; ++i) {

            // fire for all sequence callbacks
            // this is because if for example you have multiple sequences
            // bound such as "g i" and "g t" they both need to fire the
            // callback for matching g cause otherwise you can only ever
            // match the first one
            if (callbacks[i].seq) {

                // only fire callbacks for the maxLevel to prevent
                // subsequences from also firing
                //
                // for example 'a option b' should not cause 'option b' to fire
                // even though 'option b' is part of the other sequence
                //
                // any sequences that do not match here will be discarded
                // below by the _resetSequences call
                if (callbacks[i].level != maxLevel) {
                    continue;
                }

                processedSequenceCallback = true;

                // keep a list of which sequences were matches for later
                doNotReset[callbacks[i].seq] = 1;
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                continue;
            }

            // if there were no sequence matches but we are still here
            // that means this is a regular match so we should fire that
            if (!processedSequenceCallback) {
                _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
            }
        }

        // if the key you pressed matches the type of sequence without
        // being a modifier (ie "keyup" or "keypress") then we should
        // reset all sequences that were not matched by this event
        //
        // this is so, for example, if you have the sequence "h a t" and you
        // type "h e a r t" it does not match.  in this case the "e" will
        // cause the sequence to reset
        //
        // modifier keys are ignored because you can have a sequence
        // that contains modifiers such as "enter ctrl+space" and in most
        // cases the modifier key will be pressed before the next key
        //
        // also if you have a sequence such as "ctrl+b a" then pressing the
        // "b" key will trigger a "keypress" and a "keydown"
        //
        // the "keydown" is expected when there is a modifier, but the
        // "keypress" ends up matching the _nextExpectedAction since it occurs
        // after and that causes the sequence to reset
        //
        // we ignore keypresses in a sequence that directly follow a keydown
        // for the same character
        var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
        if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
            _resetSequences(doNotReset);
        }

        _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
    }

    /**
     * handles a keydown event
     *
     * @param {Event} e
     * @returns void
     */
    function _handleKeyEvent(e) {

        // normalize e.which for key events
        // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
        if (typeof e.which !== 'number') {
            e.which = e.keyCode;
        }

        var character = _characterFromEvent(e);

        // no character found then stop
        if (!character) {
            return;
        }

        // need to use === for the character check because the character can be 0
        if (e.type == 'keyup' && _ignoreNextKeyup === character) {
            _ignoreNextKeyup = false;
            return;
        }

        Mousetrap.handleKey(character, _eventModifiers(e), e);
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * called to set a 1 second timeout on the specified sequence
     *
     * this is so after each key press in the sequence you have 1 second
     * to press the next key before you have to start over
     *
     * @returns void
     */
    function _resetSequenceTimer() {
        clearTimeout(_resetTimer);
        _resetTimer = setTimeout(_resetSequences, 1000);
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * binds a key sequence to an event
     *
     * @param {string} combo - combo specified in bind call
     * @param {Array} keys
     * @param {Function} callback
     * @param {string=} action
     * @returns void
     */
    function _bindSequence(combo, keys, callback, action) {

        // start off by adding a sequence level record for this combination
        // and setting the level to 0
        _sequenceLevels[combo] = 0;

        /**
         * callback to increase the sequence level for this sequence and reset
         * all other sequences that were active
         *
         * @param {string} nextAction
         * @returns {Function}
         */
        function _increaseSequence(nextAction) {
            return function() {
                _nextExpectedAction = nextAction;
                ++_sequenceLevels[combo];
                _resetSequenceTimer();
            };
        }

        /**
         * wraps the specified callback inside of another function in order
         * to reset all sequence counters as soon as this sequence is done
         *
         * @param {Event} e
         * @returns void
         */
        function _callbackAndReset(e) {
            _fireCallback(callback, e, combo);

            // we should ignore the next key up if the action is key down
            // or keypress.  this is so if you finish a sequence and
            // release the key the final key will not trigger a keyup
            if (action !== 'keyup') {
                _ignoreNextKeyup = _characterFromEvent(e);
            }

            // weird race condition if a sequence ends with the key
            // another sequence begins with
            setTimeout(_resetSequences, 10);
        }

        // loop through keys one at a time and bind the appropriate callback
        // function.  for any key leading up to the final one it should
        // increase the sequence. after the final, it should reset all sequences
        //
        // if an action is specified in the original bind call then that will
        // be used throughout.  otherwise we will pass the action that the
        // next key in the sequence should match.  this allows a sequence
        // to mix and match keypress and keydown events depending on which
        // ones are better suited to the key provided
        for (var i = 0; i < keys.length; ++i) {
            var isFinal = i + 1 === keys.length;
            var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
            _bindSingle(keys[i], wrappedCallback, action, combo, i);
        }
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys,
            key,
            i,
            modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    /**
     * binds a single keyboard combination
     *
     * @param {string} combination
     * @param {Function} callback
     * @param {string=} action
     * @param {string=} sequenceName - name of sequence if part of sequence
     * @param {number=} level - what part of the sequence the command is
     * @returns void
     */
    function _bindSingle(combination, callback, action, sequenceName, level) {

        // store a direct mapped reference for use with Mousetrap.trigger
        _directMap[combination + ':' + action] = callback;

        // make sure multiple spaces in a row become a single space
        combination = combination.replace(/\s+/g, ' ');

        var sequence = combination.split(' '),
            info;

        // if this pattern is a sequence of keys then run through this method
        // to reprocess each pattern one key at a time
        if (sequence.length > 1) {
            _bindSequence(combination, sequence, callback, action);
            return;
        }

        info = _getKeyInfo(combination, action);

        // make sure to initialize array if this is the first time
        // a callback is added for this key
        _callbacks[info.key] = _callbacks[info.key] || [];

        // remove an existing match if there is one
        _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

        // add this call back to the array
        // if it is a sequence put it at the beginning
        // if not put it at the end
        //
        // this is important because the way these are processed expects
        // the sequence ones to come first
        _callbacks[info.key][sequenceName ? 'unshift' : 'push']({
            callback: callback,
            modifiers: info.modifiers,
            action: info.action,
            seq: sequenceName,
            level: level,
            combo: combination
        });
    }

    /**
     * binds multiple combinations to the same callback
     *
     * @param {Array} combinations
     * @param {Function} callback
     * @param {string|undefined} action
     * @returns void
     */
    function _bindMultiple(combinations, callback, action) {
        for (var i = 0; i < combinations.length; ++i) {
            _bindSingle(combinations[i], callback, action);
        }
    }

    // start!
    _addEvent(document, 'keypress', _handleKeyEvent);
    _addEvent(document, 'keydown', _handleKeyEvent);
    _addEvent(document, 'keyup', _handleKeyEvent);

    var Mousetrap = {

        /**
         * binds an event to mousetrap
         *
         * can be a single key, a combination of keys separated with +,
         * an array of keys, or a sequence of keys separated by spaces
         *
         * be sure to list the modifier keys first to make sure that the
         * correct key ends up getting bound (the last key in the pattern)
         *
         * @param {string|Array} keys
         * @param {Function} callback
         * @param {string=} action - 'keypress', 'keydown', or 'keyup'
         * @returns void
         */
        bind: function(keys, callback, action) {
            keys = keys instanceof Array ? keys : [keys];
            _bindMultiple(keys, callback, action);
            return this;
        },

        /**
         * unbinds an event to mousetrap
         *
         * the unbinding sets the callback function of the specified key combo
         * to an empty function and deletes the corresponding key in the
         * _directMap dict.
         *
         * TODO: actually remove this from the _callbacks dictionary instead
         * of binding an empty function
         *
         * the keycombo+action has to be exactly the same as
         * it was defined in the bind method
         *
         * @param {string|Array} keys
         * @param {string} action
         * @returns void
         */
        unbind: function(keys, action) {
            return Mousetrap.bind(keys, function() {}, action);
        },

        /**
         * triggers an event that has already been bound
         *
         * @param {string} keys
         * @param {string=} action
         * @returns void
         */
        trigger: function(keys, action) {
            if (_directMap[keys + ':' + action]) {
                _directMap[keys + ':' + action]({}, keys);
            }
            return this;
        },

        /**
         * resets the library back to its initial state.  this is useful
         * if you want to clear out the current keyboard shortcuts and bind
         * new ones - for example if you switch to another page
         *
         * @returns void
         */
        reset: function() {
            _callbacks = {};
            _directMap = {};
            return this;
        },

       /**
        * should we stop this event before firing off callbacks
        *
        * @param {Event} e
        * @param {Element} element
        * @return {boolean}
        */
        stopCallback: function(e, element) {

            // if the element has the class "mousetrap" then no need to stop
            if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }

            // stop for input, select, and textarea
            return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
        },

        /**
         * exposes _handleKey publicly so it can be overwritten by extensions
         */
        handleKey: _handleKey
    };

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose mousetrap as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(Mousetrap);
    }
}) (window, document);;
(function() {
	/* jshint -W110, -W043 */
	/* jshint unused: false */
	/* global $: true, CC: true, Chess: true, console: true, body: true, cometd: true, Mousetrap: true */
	"use strict";

	$.extend(CC, {
		// classify opening given an array of moves from the SCID opening book
		classify_opening: function(moves) {
			var game = new Chess(); //used to get FEN for every move
			var movetext = ''; //used to directly search by move order
			var op_moves, op_fen;
			$.each(moves, function(i, v) {
				//write move number
				if(i === 0) {
					movetext += '1.';
				} else if(i % 2 === 0) {
					movetext += (i/2)+1 + '.';
				}
				movetext += v + ' '; //append move text

				game.move(v);

				//assign only if found
				var cur_opening = CC.openings[movetext.trim()];
				if(cur_opening) {
					op_moves = cur_opening;
				}

				var cur_fen = CC.openings[CC.openings_fen[game.fen()]];
				if(cur_fen) {
					op_fen = cur_fen;
				}
			});
			return {
				moves: op_moves,
				fen: op_fen
			};
		},
		// get the opening of the game that has a visible notation window
		get_opening: function(override_cache) {
			var notation = $('div[id^="notation_"]:visible');
			if(!notation.length) { //clear if no visible notation
				$('#ccutils_opening_moves').text('Notation window not visible.');
				$('#ccutils_opening_fen').text('');
				return;
			}

			if(notation.length > 1) { //cannot support pop-out at this time
				$('#ccutils_opening_moves').text('Cannot run when games popped-out.');
				$('#ccutils_opening_fen').text(':(');
				return;
			}

			//check if we have this game in cache
			//get game id (either #g=<value> or #a=<value> in URL)
			var game_id = window.location.hash.replace(/#(g|a)=/, '');

			if(CC.analyzed_games_cache[game_id] &&
				CC.analyzed_games_cache[game_id].count > 4 &&
				CC.analyzed_games_cache[game_id].opening != 'N/A' &&
				CC.analyzed_games_cache[game_id].num_moves > 16 &&
				!override_cache) {
				$('#ccutils_opening_moves').text(CC.analyzed_games_cache[game_id].opening);
				$('#ccutils_opening_fen').text(CC.analyzed_games_cache[game_id].fen);
				return;
			}
			var moves = [];
			//to handle analysis tabs as well, we check both notationVertical and notationHorizontal
			var notations;
			notations = notation.find('.notationVertical');
			if(notations.length) {
				notations.each(function(i, v) {
					$(v).find('.gotomove').each(function(ii, n) {
						moves.push($(n).text());
					});
				});
			} else {
				notations = notation.find('.notationHorizontal');
				if(notations.length) {
					notations.each(function(i, v) {
						$(v).find('.gotomove').each(function(ii, n) {
							//strip out move numbers in horizontal variation
							var regx = $(n).text().match(/\d*\.\s*(.*)/);
							if(regx) {
								moves.push(regx[1]);
							} else {
								moves.push($(n).text());
							}
						});
					});
				}
			}

			var opening = CC.classify_opening(moves);
			
			//construct opening moves texts
			var new_opening_text, new_fen_text;
			if(opening.moves) {
				new_opening_text = 'Opening: ' + opening.moves.eco + ': ' + ' ' + opening.moves.name + ' (' + opening.moves.moves + ')';
			} else {
				new_opening_text = 'N/A';
			}

			if(opening.fen) {
				new_fen_text = 'Position: ' + opening.fen.eco + ': ' + ' ' + opening.fen.name + ' (' + opening.fen.moves + ')';
			} else {
				new_fen_text = 'N/A';
			}

			//count how many times weve seen the same output
			var count = 1;
			//if samea opening is already in cache, increment count
			if(CC.analyzed_games_cache[game_id] &&
				CC.analyzed_games_cache[game_id].opening == new_opening_text &&
				CC.analyzed_games_cache[game_id].fen == new_fen_text) {
				count = CC.analyzed_games_cache[game_id].count + 1;
			}

			//put to cache
			CC.analyzed_games_cache[game_id] = {
				'opening': new_opening_text,
				'fen': new_fen_text,
				'count': count,
				'num_moves': moves.length
			};

			//write text to green bar
			if($('#ccutils_opening_moves').text() != new_opening_text) {
				$('#ccutils_opening_moves').text(new_opening_text);
			}

			if($('#ccutils_opening_fen').text() != new_fen_text) {
				$('#ccutils_opening_fen').text(new_fen_text);
			}

			return opening;
		},
		//subscribe to /game/* to refresh opening checker
		//and /service/game to flush cache
		opening_refresh: function() {
			//run the opening checker
			//every move comes in the /game/<id> channel, so don't rely on the timer
			CC.game_all_channel = cometd.addListener("/game/*", function(msg) { CC.get_opening(msg); });
		},
		//flash keyboard icon for feedback
		flash_keyboard_icon: function() {
			$('#ccutils_keyboard_icon')
				.animate({opacity: 1}, 100)
				.animate({opacity: 0.3}, 100);
		},
		//announce opening for the current active window
		announce_opening: function() {
			var opening = CC.get_opening(true);
			if(!opening) { return; }

			var announce_text;

			if(opening.moves.name == opening.fen.name) {
				announce_text = 'Opening: (' + opening.moves.eco + ') ' + opening.moves.name + ' (' + (opening.moves.moves.match(/\s/g).length + 1) + '-ply)';
			} else {
				announce_text = 'Position: (' + opening.fen.eco + ') ' + opening.fen.name + ' (' + (opening.fen.moves.match(/\s/g).length + 1) + '-ply), transposed from Opening: (' + opening.moves.eco + ') ' + opening.moves.name;
			}

			$('.chatInputGameWrapper input[id^=chatInput_]:visible').first().val(announce_text);
			$('.chatInputGameWrapper button[id^=chatInputButton_]').click();
			CC.flash_keyboard_icon();
			CC.last_chat = Math.round(new Date().getTime() / 1000) + 5;
		}
	});

	//timer to classify openings
	CC.opening_checker = setInterval(CC.get_opening, 5000);
	CC.analyzed_games_cache = {};
	setInterval(function() {
		CC.analyzed_games_cache = {};
	}, 300000); //remove cache every 5 minutes

	//subscribe to /game/*
	CC.opening_refresh();

	//ui additions
	var div_wrapper = $('<div/>')
		.attr('id', 'ccutils_wrapper')
		.css({
			'position': 'fixed',
			'top': 35,
			'z-index': 9,
			'color': 'white',
			'height': '28px',
			'width': '100%'
		})
		.appendTo(body);

	var div_opening = $('<div/>')
		.attr('id', 'ccutils_opening')
		.css({
			'background-color': '#6a943f',
			'margin': '0px 5px',
			'height': '100%',
			'border-radius': '5px 5px 0px 0px',
			'border-top': '1px solid #799e52',
			'border-bottom': '1px solid #4c7637',
			'padding-left': '5px'
		})
		.appendTo(div_wrapper)
		.click(CC.get_opening);

	var div_opening_moves = $('<p/>')
		.attr({
			'id': 'ccutils_opening_moves',
			'title': 'Opening classification according to the move order.'
		})
		.css({
			'font-size': '12px',
			'line-height': '14px',
		})
		.appendTo(div_opening);

	var div_opening_fen = $('<p/>')
		.attr({
			'id': 'ccutils_opening_fen',
			'title': 'Opening classification according to the game position.'
		})
		.css({
			'font-size': '12px',
			'line-height': '14px'
		})
		.appendTo(div_opening);

	var keyboard_icon = $('<div/>')
		.attr('id', 'ccutils_keyboard_icon')
		.css({
			'background-image': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACEUlEQVRYhe3WMUhVURgH8N8xEZGIBgmRiKjFJFpqiIoWy6GhNVocm4qWkJpEJGoLXJormhtU2iKCBhscKiJaopJKCbEQCTFPw/2eXV/vYQ96vOV9l8O9/+/7zjn/+53/PeemLGuldbR09jaBNoE2AXRWHpJ0CuM40MT51nAPk1legVTZiJL0GMN400QCe9CDoSy/oFQB7MUKTuJnkwhMYBS7K45aGliP1oGNLK+V8HpgkOW1wOXcjarc6tgWqyfCM/iCa4EvYwHnk9SLKcwmqTdJxyM2kaQO3Im+A5G7gIf1StJZx7+MOXwO/DXwkkJI77AYlVmJ2IfIfR94NcbfhZ31CMhx4RW+oydwR6WVcrbFVbF+ZMyE71bg4UpezQokaRBXSngmy9MYwaEk3cUP3MAnTCbpNC4k6UFU4DoO1n3zsHpLsB+X/NHIEqZxVqGPRwpBjeA1JnEk+syG7yIGov96owSeVLFfjvtVdCvWfwNHS4PfD5LfFOs/hK6IrTZKoBt9mM/yfJL6knSiFN9XTk5SeffsD3IvFYI9pqjgYs2ZaokQ5xRiGY/YaOBG2mHFzpcx1ZAIFZ/ZGJ4GfhZ4O9uBX1GBRcUnOoa39TrUItCFj7gNSepSqHruHwjUsvI4f81XdsxjEM/V2DL/k/UpqlIR9RYCNxVv38zjeElxHG+euJvHcaus5X9EbQJtAm0CvwEi8Mhr8HnPPAAAAABJRU5ErkJggg==')",
			'position': 'fixed',
			'top': 34,
			'right': 10,
			'z-index': 9,
			'height': 32,
			'width': 32,
			'opacity': 0.3
		})
		.attr('title', ' \
Key Bindings:\n \
  "shift+c s" Seek Game\n \
  "shift+c d" Offer Draw\n \
  "shift+c r" Resign\n \
  "shift+c shift+r" Clean Refresh\n \
  "shift+c shift+a" Announce Opening')
		.appendTo(body);

	//key bindings - check until Mousetrap becomes available
	var checkmousetrap = setInterval(function() {
		if(Mousetrap) {
			clearInterval(checkmousetrap);

			//create seek
			Mousetrap.bind('shift+c s', function() {
				CC.flash_keyboard_icon();
				$('#new_game_pane_create_button').click();
			});

			//offer draw
			Mousetrap.bind('shift+c d', function() {
				if(!$('input[id^=b-draw]:visible').get(0)) {
					return;
				}
				CC.flash_keyboard_icon();
				$('input[id^=b-draw]:visible').click();
			});

			//resign
			Mousetrap.bind('shift+c r', function() {
				if(!$('input[id^=b-resign-abort]:visible').get(0)) {
					return;
				}
				CC.flash_keyboard_icon();
				$('input[id^=b-resign-abort]:visible').click();
			});

			//close all game tabs & refresh
			Mousetrap.bind('shift+c shift+r', function() {
				CC.flash_keyboard_icon();
				$('.nowrapTabStrip .dijitTabCloseButton').click();
				setTimeout(function() {
					window.location = 'http://live.chess.com/live';
				}, 350);
			});

			//announce opening
			Mousetrap.bind('shift+c shift+a', function() {
				CC.announce_opening();
			});
		}
	}, 300);
})();;
(function() {
	/* jshint -W110 */
	/* jshint unused: false */
	/* global $: true, CC: true, Chess: true, console: true, body: true, cometd: true */
	"use strict";

	$.extend(CC, {
		//square mappings for encoded moves string
		decode: {
			'a':'a1', 'i':'a2', 'q':'a3', 'y':'a4', 'G':'a5', 'O':'a6', 'W':'a7', '4':'a8',
			'b':'b1', 'j':'b2', 'r':'b3', 'z':'b4', 'H':'b5', 'P':'b6', 'X':'b7', '5':'b8',
			'c':'c1', 'k':'c2', 's':'c3', 'A':'c4', 'I':'c5', 'Q':'c6', 'Y':'c7', '6':'c8',
			'd':'d1', 'l':'d2', 't':'d3', 'B':'d4', 'J':'d5', 'R':'d6', 'Z':'d7', '7':'d8',
			'e':'e1', 'm':'e2', 'u':'e3', 'C':'e4', 'K':'e5', 'S':'e6', '0':'e7', '8':'e8',
			'f':'f1', 'n':'f2', 'v':'f3', 'D':'f4', 'L':'f5', 'T':'f6', '1':'f7', '9':'f8',
			'g':'g1', 'o':'g2', 'w':'g3', 'E':'g4', 'M':'g5', 'U':'g6', '2':'g7', '!':'g8',
			'h':'h1', 'p':'h2', 'x':'h3', 'F':'h4', 'N':'h5', 'V':'h6', '3':'h7', '?':'h8'
		},
		//promotion mappings for encoded moves
		promotions: {
			'{': [-1, 'q'], //capture to queen on prev file
			'~':[0, 'q'], //move to queen (same file)
			'}':[1, 'q'], //capture to queen on next file
			'(':[-1, 'n'], //capture to knight on prev file
			'^':[0, 'n'], //move to knight (same file)
			')':[1, 'n'], //capture to knight on next file
			'[':[-1, 'r'], //capture to rook on prev file
			'_':[0, 'r'], //move to rook
			']':[1, 'r'], //capture to rook on next file
			'@':[-1, 'b'], //capture to bishop on prev file
			'#':[0, 'b'], //move to bishop
			'$':[1, 'b'] //capture to bishop on next file
		},
		//decodes moves from encoded game
		decode_moves: function(moves) {
			var game = new Chess();
			var is_white = true;
			for(var i=0; i<moves.length-1; i+=2) {
				var from = moves[i];
				from = CC.decode[from];

				var to = moves[i+1];
				var promotion = '';
				var direction = (is_white ? 1 : -1); //pawn movement direction in the file

				if(to in CC.promotions) {
					promotion = CC.promotions[to][1];
					var to_file = String.fromCharCode(from.charCodeAt(0) + (CC.promotions[to][0]));
					var to_rank = String.fromCharCode(from.charCodeAt(1) + (direction));
					to = to_file + to_rank;
				} else {
					to = CC.decode[to];
				}

				game.move({from: from, to: to, promotion: promotion}); //make the move
				is_white = !is_white;

				/* quick test for move output details
				console.log(is_white, {from: from, to: to, promotion: promotion});
				console.log(game.move({from: from, to: to, promotion: promotion}));
				console.log(game.ascii());
				console.log('-------------');
				*/
			}
			return game;
		},
		//handler for /service/game messages
		listen: function(msg, filename) {
			//console.log('msg', msg);
			/*
			TODO: keep track of game_times/better way to get time controls for game
			if(msg.data.game.time) {
				game_times[msg.data.game.id] = {time: msg.data.game.time, count: 0};

				$.each(games, function(key, value) {
					if(key in game_times) {
						console.log('write ', key);
					} else {
						game_times[key].count++;
						console.log('time not found for ', key);
					}
				});
				console.log('game_times ', game_times);
			}
			*/

			if(msg.data.game.status == 'finished') { //found a finished game
				var game = CC.decode_moves(msg.data.game.moves); //decode moves
				var game_opening = CC.classify_opening(game.history()); //classify opening

				//prepare PGN headers

				//date
				var date = new Date();
				var month = date.getMonth()+1;
				var day = date.getDate();

				var date_str = date.getFullYear() + '.' +
					((''+month).length<2 ? '0' : '') + month + '.' +
					((''+day).length<2 ? '0' : '') + day;

				//game result
				var result;
				var loser = false, winner = false;
				if(msg.data.game.results[0] == 'win') {
					result = '1-0';
					winner = 0;
					loser = 1;
				} else if(msg.data.game.results[1] == 'win') {
					result = '0-1';
					winner = 1;
					loser = 0;
				} else {
					result = '1/2-1/2';
				}

				//termination
				var termination;
				switch(msg.data.game.results[loser]) {
					case 'resigned':
						termination = msg.data.game.players[winner].uid + ' won by resignation.';
						break;
					case 'timeout':
						termination = msg.data.game.players[winner].uid + ' won on time.';
						break;
					case 'checkmated':
						termination = msg.data.game.players[winner].uid + ' won by checkmate.';
						break;
					case 'abandoned':
						termination = msg.data.game.players[winner].uid + ' won - game abandoned.';
						break;
					case 'agreed':
						termination = 'Game drawn by agreement.';
						break;
					case 'stalemate':
						termination = 'Game drawn by stalemate.';
						break;
					case 'repetition':
						termination = 'Game drawn by repetition.';
						break;
					case 'insufficient':
						termination = 'Game drawn - insufficient material.';
						break;
				}

				//write PGN headers to the game object
				game.header(
					'Event', 'Live Chess',
					'Site', 'Chess.com',
					'Date', date_str,
					'White', msg.data.game.players[0].uid,
					'Black', msg.data.game.players[1].uid,
					'Result', result,
					'WhiteElo', msg.data.ratings[0],
					'BlackElo', msg.data.ratings[1],
					//'TimeControl', '1|0',
					'Termination', termination,
					'ECO', game_opening.moves.eco,
					'Opening', game_opening.moves.name,
					//non-standard, using to store openings from FEN
					'Position', game_opening.fen.eco + ': ' + game_opening.fen.name
				);

				//console.log('pgn', game.pgn());
				
				//put game into games list
				//games[msg.data.game.id] = game;
				//console.log('games ', games);
				
				//send to writer for file output
				$.ajax({
					url: 'http://localhost/chesscomutils/write.php',
					type: 'post',
					data: {'pgn': game.pgn(), 'filename': filename}
				});
			}
		},
		//subscribe to /service/game
		toggle_pgn_capture: function() {
			/* quick test moves function
			var g = decodeMoves("mCZJCK6ZpF1LKTXHFNWGT2YI2)0KoEIAEMAsMUHzU3zr3@ri?Ui}NVsjV3j(3^GykAyqAIqiIQarQYi_Y)KCnDCv7Svnemn$SY87YSZS!SrcmectembdmtdftsJBsrBtU95Qhgfg");
			console.log(g.pgn());
			return;
			*/
			if($('#ccutils_capture').hasClass('saving')) { //turn off
				$('#ccutils_capture')
				.html('Capture PGN: Off')
				.removeClass('saving')
				.css('color', 'white');

				cometd.unsubscribe(CC.service_game_channel);
			} else { //turn on
				$('#ccutils_capture')
				.html('Capture PGN: On')
				.addClass('saving')
				.css('color', 'green');

				/*cometd.subscribe('/service/*', function(msg) {
					console.log(msg);
				});
				return;*/
				/**
				 * subscribe to cometd /service/game channel. this channel seems to be used for transmitting
				 * "EndGame" packets which have information about the game that has ended (that the user was viewing).
				 *
				 * the Time Control for the game seems to be sent in a different packet, usually AFTER the game is over.
				 * this doesn't seem to be the case for your own games though. for now, Time Control is ignored.
				 *
				 * subscribe to this channel and start listening for finished games, parse moves and send request to
				 * local write.php for file output
				 */
				CC.service_game_channel = cometd.subscribe(
					'/service/game', CC.listen
				);
			}
		}
	});

	//capture button on the menu
	var a_capture = $('<a/>')
		.html('Capture PGN: Off')
		.attr({
			'href': '#',
			'id': 'ccutils_capture',
			'title': 'Capture all finished games in the PGN file.'
		})
		.addClass('bold')
		.click(CC.toggle_pgn_capture);

	$('#top_bar_settings')
		.append($('<li/>')
		.append(a_capture));

	$('#ccutils_capture').click();
})();