#include "funcs.h"

T_Buff *allocate_buffer(){
    T_Buff *buffer = malloc(sizeof(T_Buff));
    buffer->carac  = malloc(256*sizeof(char));
    buffer->nextChar = 0;
    buffer->linha = 0;
    return buffer ;
}

void deallocate_buffer(T_Buff *buffer){
	free(buffer->carac);
	free(buffer);

} 
void get_next_char(char string[],T_Buff *buffer ){
    buffer->carac=string;

    printf("char : %c\n",buffer->carac[buffer->nextChar]);
    buffer->nextChar++;
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