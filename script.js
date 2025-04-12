document.addEventListener('DOMContentLoaded', () => {
    const barContainer = document.getElementById('bar-container');
    const generateArrayBtn = document.getElementById('generate-array');
    const sortBtn = document.getElementById('sort-button');
    const algorithmSelect = document.getElementById('algorithm-select');
    const sizeSlider = document.getElementById('size-slider');
    const speedSlider = document.getElementById('speed-slider');
    const sizeValueSpan = document.getElementById('size-value');
    const speedValueSpan = document.getElementById('speed-value');

    let array = [];
    let arraySize = parseInt(sizeSlider.value);
    let delay = parseInt(speedSlider.value);
    let isSorting = false;
    const MIN_HEIGHT = 10;
    const MAX_HEIGHT = 380; // Max height within the container

    generateNewArray(arraySize);

    generateArrayBtn.addEventListener('click', () => {
        if (isSorting) return;
        generateNewArray(arraySize);
    });

    sizeSlider.addEventListener('input', (e) => {
        if (isSorting) return;
        arraySize = parseInt(e.target.value);
        sizeValueSpan.textContent = arraySize;
        generateNewArray(arraySize);
    });

    speedSlider.addEventListener('input', (e) => {
        delay = parseInt(e.target.value);
        speedValueSpan.textContent = delay;
    });

    sortBtn.addEventListener('click', () => {
        if (isSorting || array.length === 0) return;
        startSort();
    });


    function generateNewArray(size) {
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT + 1)) + MIN_HEIGHT);
        }
        renderBars(array);
        enableControls(); 
    }

    function renderBars(arr, comparingIndices = [], swappingIndices = [], sortedIndices = [], pivotIndex = -1, partitionIndices = []) {
        barContainer.innerHTML = ''; // Clear previous bars
        const containerWidth = barContainer.offsetWidth;
        // Calculate width based on container size and array length, leave small gaps
        const barWidth = Math.max(1, Math.floor((containerWidth / arr.length) * 0.8));
        const barMargin = arr.length > 50 ? (arr.length > 80 ? 0 : 1) : 2; 

        arr.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.margin = `0 ${barMargin}px`;

            // Apply state classes
            if (partitionIndices.includes(index)) {
                bar.classList.add('partition');
            } else if (pivotIndex === index) {
                 bar.classList.add('pivot');
            } else if (comparingIndices.includes(index)) {
                bar.classList.add('comparing');
            } else if (swappingIndices.includes(index)) {
                bar.classList.add('swapping');
            } else if (sortedIndices.includes(index)) {
                 bar.classList.add('sorted');
            }

            barContainer.appendChild(bar);
        });
    }


    // Delay Function (Promise-based for async/await)
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Disable/Enable Controls
    function disableControls() {
        isSorting = true;
        generateArrayBtn.disabled = true;
        sortBtn.disabled = true;
        sizeSlider.disabled = true;
        algorithmSelect.disabled = true;
    }

    function enableControls() {
        isSorting = false;
        generateArrayBtn.disabled = false;
        sortBtn.disabled = false;
        sizeSlider.disabled = false;
        algorithmSelect.disabled = false;
    }

    // Mark all bars as sorted
    async function finalizeSort() {
         const sortedIndices = Array.from(Array(array.length).keys()); 
         for (let i = 0; i < array.length; i++) {
             renderBars(array, [], [], sortedIndices.slice(0, i + 1));
             await sleep(Math.min(20, delay / 5)); 
         }
         enableControls();
    }

    // --- Sorting Logic ---
    async function startSort() {
        disableControls();
        const selectedAlgorithm = algorithmSelect.value;

        switch (selectedAlgorithm) {
            case 'bubble':
                await bubbleSort(array);
                break;
            case 'selection':
                await selectionSort(array);
                break;
            case 'insertion':
                await insertionSort(array);
                break;
            case 'merge':
                await mergeSort(array, 0, array.length - 1);
                break;
            case 'quick':
                 await quickSort(array, 0, array.length - 1);
                break;
        }

        if (isSorting) { 
           await finalizeSort();
        }
    }

    // --- Sorting Algorithms (Visualized) ---

    // Bubble Sort
    async function bubbleSort(arr) {
        const n = arr.length;
        let sortedIndices = [];
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                 if (isSorting === false) return; // Allow stopping
                 renderBars(arr, [j, j + 1], [], sortedIndices);
                 await sleep(delay);

                if (arr[j] > arr[j + 1]) {
                    renderBars(arr, [], [j, j + 1], sortedIndices);
                    await sleep(delay);

                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;

                    renderBars(arr, [], [j, j + 1], sortedIndices);
                    await sleep(delay);
                }
                 renderBars(arr, [], [], sortedIndices);
            }
            sortedIndices.push(n - 1 - i);
            renderBars(arr, [], [], sortedIndices); 
            if (!swapped) break; // Optimization: if no swaps, array is sorted
        }
         sortedIndices = Array.from(Array(n).keys());
         renderBars(arr, [], [], sortedIndices);
    }

    // Selection Sort
    async function selectionSort(arr) {
        const n = arr.length;
        let sortedIndices = [];
        for (let i = 0; i < n - 1; i++) {
             if (isSorting === false) return;
            let minIndex = i;
            renderBars(arr, [minIndex], [], sortedIndices);
            await sleep(delay);

            for (let j = i + 1; j < n; j++) {
                 if (isSorting === false) return;
                renderBars(arr, [minIndex, j], [], sortedIndices);
                await sleep(delay);

                if (arr[j] < arr[minIndex]) {
                    const oldMinIndex = minIndex;
                    minIndex = j;
                     renderBars(arr, [minIndex], [], sortedIndices);
                     await sleep(delay);
                } else {
                     renderBars(arr, [minIndex], [], sortedIndices);
                     await sleep(delay);
                }
            }

            if (minIndex !== i) {
                renderBars(arr, [], [i, minIndex], sortedIndices);
                await sleep(delay);

                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

                renderBars(arr, [], [i, minIndex], sortedIndices);
                await sleep(delay);
            }
            sortedIndices.push(i);
             renderBars(arr, [], [], sortedIndices); 
             await sleep(delay);
        }
         sortedIndices.push(n-1);
         renderBars(arr, [], [], sortedIndices);
    }

    // Insertion Sort
    async function insertionSort(arr) {
        const n = arr.length;
         let sortedIndices = [0]; 
         renderBars(arr, [], [], sortedIndices);
         await sleep(delay);

        for (let i = 1; i < n; i++) {
             if (isSorting === false) return;
            let current = arr[i];
            let j = i - 1;

            renderBars(arr, [i], [], sortedIndices, -1); 
            await sleep(delay);

            renderBars(arr, [i, j], [], sortedIndices, -1);
            await sleep(delay);

            while (j >= 0 && arr[j] > current) {
                 if (isSorting === false) return;
                 renderBars(arr, [], [j, j + 1], sortedIndices, -1);
                 await sleep(delay);

                arr[j + 1] = arr[j];

                renderBars(arr, [], [j, j + 1], sortedIndices, -1);
                await sleep(delay);

                 renderBars(arr, [i], [], sortedIndices, -1); // Keep current highlighted
                 await sleep(delay);

                j--;

                 if (j >= 0) {
                    renderBars(arr, [i, j], [], sortedIndices, -1);
                    await sleep(delay);
                 }
            }
            arr[j + 1] = current;
             sortedIndices = Array.from(Array(i + 1).keys()); 


             renderBars(arr, [], [j + 1], sortedIndices, -1);
             await sleep(delay);
             renderBars(arr, [], [], sortedIndices, -1); 
             await sleep(delay);
        }
         renderBars(arr, [], [], Array.from(Array(n).keys()));
    }

     // --- Merge Sort ---
     async function mergeSort(arr, left, right) {
         if (left >= right) {
             return; 
         }
         if (!isSorting) return;

         const mid = Math.floor((left + right) / 2);

         const partition = Array.from({ length: right - left + 1 }, (_, i) => left + i);
         renderBars(arr, [], [], [], -1, partition);
         await sleep(delay * 2); 

         await mergeSort(arr, left, mid);
         if (!isSorting) return;
         await mergeSort(arr, mid + 1, right);
         if (!isSorting) return;

         await merge(arr, left, mid, right);
         if (!isSorting) return;

          renderBars(arr, [], [], Array.from({ length: right - left + 1 }, (_, i) => left + i));
          await sleep(delay);
     }

     async function merge(arr, left, mid, right) {
         const n1 = mid - left + 1;
         const n2 = right - mid;

         let L = new Array(n1);
         let R = new Array(n2);

         for (let i = 0; i < n1; i++) L[i] = arr[left + i];
         for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

         let i = 0; 
         let j = 0; 
         let k = left; 

         while (i < n1 && j < n2) {
             if (!isSorting) return;
             renderBars(arr, [left + i, mid + 1 + j], [], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
             await sleep(delay);

             if (L[i] <= R[j]) {
                 renderBars(arr, [], [k], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
                 arr[k] = L[i];
                 i++;
             } else {
                 renderBars(arr, [], [k], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
                 arr[k] = R[j];
                 j++;
             }
             renderBars(arr, [], [k], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
             await sleep(delay);
             k++;
         }

         while (i < n1) {
              if (!isSorting) return;
              renderBars(arr, [], [k], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
              await sleep(delay);
             arr[k] = L[i];
              renderBars(arr, [], [k], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
              await sleep(delay);
             i++;
             k++;
         }

         while (j < n2) {
              if (!isSorting) return;
               renderBars(arr, [], [k], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
               await sleep(delay);
             arr[k] = R[j];
              renderBars(arr, [], [k], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
              await sleep(delay);
             j++;
             k++;
         }
          renderBars(arr, [], [], [], -1, Array.from({ length: right - left + 1 }, (_, idx) => left + idx));
           await sleep(delay);
          renderBars(arr); 
          await sleep(delay);
     }


       // --- Quick Sort ---
      async function quickSort(arr, low, high) {
         if (low < high) {
             if (!isSorting) return;
             let pivotIndex = await partition(arr, low, high);
             if (!isSorting) return;

             await quickSort(arr, low, pivotIndex - 1);
             if (!isSorting) return;
             await quickSort(arr, pivotIndex + 1, high);
             if (!isSorting) return;
         }
           if (low === high && low >= 0 && low < arr.length) {
                renderBars(arr, [], [], [low]); 
                await sleep(delay/2);
           }
     }

      async function partition(arr, low, high) {
         let pivotValue = arr[high]; 
         let pivotIndexDisplay = high; 
         let i = low - 1;

          renderBars(arr, [], [], [], pivotIndexDisplay, Array.from({ length: high - low + 1 }, (_, idx) => low + idx));
          await sleep(delay);

         for (let j = low; j < high; j++) {
             if (!isSorting) return i + 1; 

             renderBars(arr, [j], [], [], pivotIndexDisplay, Array.from({ length: high - low + 1 }, (_, idx) => low + idx));
             await sleep(delay);

             if (arr[j] < pivotValue) {
                 i++; 

                 renderBars(arr, [], [i, j], [], pivotIndexDisplay, Array.from({ length: high - low + 1 }, (_, idx) => low + idx));
                 await sleep(delay);

                 [arr[i], arr[j]] = [arr[j], arr[i]];

                  renderBars(arr, [], [i, j], [], pivotIndexDisplay, Array.from({ length: high - low + 1 }, (_, idx) => low + idx));
                  await sleep(delay);
             }
              renderBars(arr, [], [], [], pivotIndexDisplay, Array.from({ length: high - low + 1 }, (_, idx) => low + idx));
              await sleep(delay);
         }

          let finalPivotIndex = i + 1;
          renderBars(arr, [], [finalPivotIndex, high], [], -1, Array.from({ length: high - low + 1 }, (_, idx) => low + idx)); // Highlight swap with pivot (-1 to clear specific pivot color during swap)
          await sleep(delay);

          [arr[finalPivotIndex], arr[high]] = [arr[high], arr[finalPivotIndex]];

           renderBars(arr, [], [], [finalPivotIndex], -1, []); 
           await sleep(delay*2); 

          return finalPivotIndex;
     }


});