    Transforma todos os caracteres minusculos em maiusculos.
    Uitlizando uma struct de Buffer alocada dinamicamente, com tamanho definido por linha de comando.

maneira para executar o programa: 
    - Valgrind é um tipo de validação utilizada para validar os vazamentos de memória durante a execução do código.
 gcc -o main main.c funcs.c
 valgrind --leak-check=yes ./main  ex1.txt 5