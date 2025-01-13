#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#define maxTam  64
#define numTokens 33



typedef struct T_Buff {
    int linha;
    int nextChar;
    int lastChar;
    char *carac;
} T_Buff;


typedef struct tipoPrint{
    char lexema[maxTam];
    char token [maxTam];
    int linha;
} tipoPrint;

T_Buff *allocate_buffer();
void deallocate_buffer(T_Buff *buffer);
void replace_print(char carac[]);
void get_next_char(char string[],T_Buff *buffer );
bool isLetter(char strg[]);
bool isNumber(char strg[]);
bool isReservedWord( char str[], char tokens[][maxTam]);
void montaTipoPrint( char lexema[],char token[], int linha);
void printaToken(tipoPrint  *token);

