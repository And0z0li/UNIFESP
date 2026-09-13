
#include "funcs.h"


Buffer * allocate_buffer(){
	Buffer *buffer = malloc(sizeof(Buffer));
	buffer->carac = malloc(sizeof(char)*256);
	
	return buffer;
} 

void deallocate_buffer(Buffer *buffer){
	free(buffer->carac);
	free(buffer);

} 

void replace_print(Buffer *buffer, int tam,char carac_aux){
	buffer->carac[tam]=carac_aux;
	switch (carac_aux){
		case 'a':
			printf("A");
			break;
		case 'e':
			printf("E");
			break;
		case 'i':
			printf("I");
			break;
		case 'o':
			printf("O");
			break;
		case 'u':
			printf("U");
			break;
		
		default:
		printf("%c",buffer->carac[tam]);
	}

 
} 

get_next_char(Buffer *buffer,){


	
}

