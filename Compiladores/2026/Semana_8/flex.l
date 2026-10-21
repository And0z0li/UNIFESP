%{
#include <stdlib.h>
#include <stdio.h>

#define NUM        0
#define ID         1
#define ELSE       2
#define IF         3
#define INT        4
#define RETURN     5
#define VOID       6
#define WHILE      7

#define ADD        8
#define SUB        9
#define MUL        10
#define DIV        11

#define LT         12
#define LE         13
#define GT         14
#define GE         15
#define EQ         16
#define NE         17
#define ASSIGN     18

#define SEMI       19
#define COMMA      20
#define L_PAR      21
#define R_PAR      22
#define L_COL      23
#define R_COL      24
#define LKEY       25
#define RKEY       26

#define END        27
#define ERR        28

#define CMT_START  29
#define CMT_END    30
#define LN         31
%}

DIGITO  [0-9]
LETRA   [a-zA-Z]

%%

"else"          return ELSE;
"if"            return IF;
"int"           return INT;
"return"        return RETURN;
"void"          return VOID;
"while"         return WHILE;

{DIGITO}+       return NUM;
{LETRA}+        return ID;

"/*"            return CMT_START;
"*/"            return CMT_END;

"+"             return ADD;
"-"             return SUB;
"*"             return MUL;
"/"             return DIV;

"<="            return LE;
"<"             return LT;
">="            return GE;
">"             return GT;
"=="            return EQ;
"!="            return NE;
"="             return ASSIGN;

";"             return SEMI;
","             return COMMA;
"("             return L_PAR;
")"             return R_PAR;
"["             return L_COL;
"]"             return R_COL;
"{"             return LKEY;
"}"             return RKEY;

[ \t]+        ; /* \t => TAB e \n => Quebra de Linha */
"\n"            return LN;

<<EOF>>         return END;

.               return ERR;

%%

int main(int argc, char *argv[])
{
    int token;
    int i;
    int qtd_tokens = 0;
    int lendo_comentario = 0;
    int buf[300];

    FILE *f_in = NULL;

    if (argc == 2)
    {
        if ((f_in = fopen(argv[1], "r")))
            yyin = f_in;
        else
        {
            perror(argv[0]);
            return 1;
        }
    }
    else
    {
        yyin = stdin;
    }

    while ((token = yylex()) != END)
    {
        /* Encontrou o inicio de um comentario */
        if (token == CMT_START)
        {
            lendo_comentario = 1;
            continue;
        }

        /* Enquanto estiver dentro do comentario, ignora qlqr tokens exceto CMT_END e CMT_START*/
        if (lendo_comentario)
        {
            if (token == CMT_END)
            {
                lendo_comentario = 0;
            }
            else if (token == CMT_START)
            {
                /* ERRO: comentarios nao podem ser aninhados */
            }

            continue;
        }

        /* Fechou comentario sem abrir */
        if (token == CMT_END)
            token = ERR;

        if (qtd_tokens >= 300)
        {
            fprintf(stderr, "ERRO: quantidade maxima de tokens excedida.\n");

            if (f_in != NULL)
                fclose(f_in);

            return 1;
        }

        buf[qtd_tokens] = token;
        qtd_tokens++;
    }

    /*
     * Chegou ao fim do arquivo com a flag lendo_comentario
     * ainda ativa, pq o comentario nao foi fechado.
     */
    if (lendo_comentario)
    {
        if (qtd_tokens >= 300)
        {
            fprintf(stderr, "ERRO: quantidade maxima de tokens excedida.\n");

            if (f_in != NULL)
                fclose(f_in);

            return 1;
        }

        buf[qtd_tokens] = ERR;
        qtd_tokens++;
    }

    for (i = 0; i < qtd_tokens; i++)
    {
        switch (buf[i])
        {
            case NUM:    printf("NUM ");    break;
            case ID:     printf("ID ");     break;
            case ELSE:   printf("ELSE ");   break;
            case IF:     printf("IF ");     break;
            case INT:    printf("INT ");    break;
            case RETURN: printf("RETURN "); break;
            case VOID:   printf("VOID ");   break;
            case WHILE:  printf("WHILE ");  break;

            case ADD:    printf("+ ");      break;
            case SUB:    printf("- ");      break;
            case MUL:    printf("* ");      break;
            case DIV:    printf("/ ");      break;

            case LT:     printf("< ");      break;
            case LE:     printf("<= ");     break;
            case GT:     printf("> ");      break;
            case GE:     printf(">= ");     break;
            case EQ:     printf("== ");     break;
            case NE:     printf("!= ");     break;
            case ASSIGN: printf("= ");      break;

            case SEMI:   printf("; ");      break;
            case COMMA:  printf(", ");      break;
            case L_PAR:  printf("( ");      break;
            case R_PAR:  printf(") ");      break;
            case L_COL:  printf("[ ");      break;
            case R_COL:  printf("] ");      break;
            case LKEY:   printf("{ ");      break;
            case RKEY:   printf("} ");      break;

            case ERR:    printf("ERR ");    break;
            case LN:     printf("\n");      break;
        }
    }

    printf("\n");

    fclose(f_in);

    return 0;
}