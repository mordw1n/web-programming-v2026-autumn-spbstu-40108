export function findMaxSubarraySum(arr, k) {
  if (
    !Array.isArray(arr) ||
    typeof k !== 'number' ||
    k <= 0 ||
    arr.length < k
  ) {
    return null;
  }

  let currentSum = 0;
  for (let i = 0; i < k; i += 1) {
    currentSum += arr[i];
  }

  let maxSum = currentSum;

  for (let i = k; i < arr.length; i += 1) {
    currentSum += arr[i] - arr[i - k];
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }

  return maxSum;
}
