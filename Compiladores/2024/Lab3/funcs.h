#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#define maxTam  64



typedef struct T_Buff {
    int linha;
    int nextChar;
    char *carac;
} T_Buff;

T_Buff *allocate_buffer();
void deallocate_buffer(T_Buff *buffer);
void replace_print(char carac[]);
void get_next_char(char string[],T_Buff *buffer );
