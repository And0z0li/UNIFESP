#include "funcs.h"

T_Buff *allocate_buffer(int tam){
    T_Buff *buffer = malloc(sizeof(T_Buff));
    buffer->carac  = malloc(tam*sizeof(char));
    buffer->tam    = tam;
    return buffer ;
}

void deallocate_buffer(T_Buff *buffer){
	free(buffer->carac);
	free(buffer);

} 

void replace_print( char carac[]){
    int i=0;
   
    
    while(carac[i]!= '\0'){
        char UPPER=carac[i];
        if(UPPER > 96 && UPPER < 123)
            printf("%c",UPPER-32);
        else
        printf("%c",UPPER);
        i++;
    }
}