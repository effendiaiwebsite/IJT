#!/bin/bash

echo "Checking content quality across all exams..."
echo ""

for exam_dir in public/data/tutorials/*/; do
    exam=$(basename "$exam_dir")

    # Count total tutorials
    total=$(find "$exam_dir" -name "tutorials.json" 2>/dev/null | wc -l)

    if [ $total -eq 0 ]; then
        continue
    fi

    # Count tutorials with only 1 slide (placeholder content)
    one_slide=0
    for tut in $(find "$exam_dir" -name "tutorials.json" 2>/dev/null); do
        slides=$(jq -r '.slides | length' "$tut" 2>/dev/null)
        if [ "$slides" = "1" ]; then
            one_slide=$((one_slide + 1))
        fi
    done

    percentage=$((one_slide * 100 / total))

    if [ $percentage -gt 80 ]; then
        echo "$exam: $one_slide/$total tutorials (${percentage}%) are placeholders (1 slide only)"
    fi
done
