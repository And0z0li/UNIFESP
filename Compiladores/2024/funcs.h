#include <stdio.h>
#include <stdlib.h>
#include <string.h>


typedef struct{

	char *carac;
	int tam;
	
}Buffer;



Buffer * allocate_buffer(int tam);
void deallocate_buffer(Buffer *buffer);
void replace_print(Buffer *buffer, int tam,char carac_aux);
