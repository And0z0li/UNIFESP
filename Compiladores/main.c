
#include "funcs.h"


// gcc main.c funcs.c -o exec.o 
// ./exec.o aa.txt 100
// valgrind --leak-check=yes ./exec.o main.c 100
int main( int argc, char *argv[] ){

	Buffer *buffzin;
	int param2,int_aux=0;
	char carac_aux;
	
	if(argc != 3){
		printf("Numero de parametros invalido!\n");
		exit(1);
	}
	
	FILE* fp = fopen(argv[1], "r");
	
	if(fp == NULL){
		printf("ERRO!\n");
		exit(1);
	}	
	
	param2 = atoi(argv[2]);
	
	
	
	buffzin=allocate_buffer(param2);

	printf("%d \n",param2);
	//char string[param2];
	//gets(string,param2,fp); // puxando uma string com  tam=20	

	carac_aux=fgetc(fp);
	while (carac_aux != EOF ){
		//printf("?\n");
		if(int_aux!= param2){

			replace_print(buffzin,int_aux,carac_aux);

			int_aux++;
		}else int_aux=0;

		carac_aux=fgetc(fp);
	}


	deallocate_buffer(buffzin);
	fclose(fp);		
   	return 0;
} 
