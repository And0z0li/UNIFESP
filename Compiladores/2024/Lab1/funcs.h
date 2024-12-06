#include <stdio.h>
#include <stdlib.h>
#include <string.h>



typedef struct T_Buff {
    int tam;
    char *carac;
} T_Buff;

T_Buff *allocate_buffer(int tam);
void deallocate_buffer(T_Buff *buffer);
void replace_print(char carac[]);
