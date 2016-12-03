import {config} from '../config'

export function generateNoise(squareSize, level, revert) {
    var noiseArr = new Array();
    for(i = 0; i <= 5; i++)
    {
        noiseArr[i] = new Array();

        for(j = 0; j <= 5; j++)
        {
            var height = Math.random();

            if(i == 0 || j == 0 || i == 5 || j == 5)
                height = 1;

            noiseArr[i][j] = height;
        }
    }

    return(flatten(interpolate(noiseArr, squareSize), level,revert));
}

function interpolate(points, squareSize)
{
    var noiseArr = new Array()
    var x = 0;
    var y = 0;
    var nbr = squareSize
    var perc = nbr / 5
    for(i = 0; i < nbr; i++)
    {
        if(i != 0 && i % perc == 0)
            x++;

        noiseArr[i] = new Array();
        for(j = 0; j < nbr; j++)
        {

            if(j != 0 && j % perc == 0)
                y++;

            var mu_x = (i%perc) / perc;
            var mu_2 = (1 - Math.cos(mu_x * Math.PI)) / 2;

            var int_x1     = points[x][y] * (1 - mu_2) + points[x+1][y] * mu_2;
            var int_x2     = points[x][y+1] * (1 - mu_2) + points[x+1][y+1] * mu_2;

            var mu_y = (j%perc) / perc;
            var mu_2 = (1 - Math.cos(mu_y * Math.PI)) / 2;
            var int_y = int_x1 * (1 - mu_2) + int_x2 * mu_2;

            noiseArr[i][j] = int_y;
        }
        y = 0;
    }
    return(noiseArr);
}

function flatten(points, level, revert) {
    var maxVal = 1
    var step = maxVal / level // 0.1
    var noiseArr = new Array()
    for(i = 0; i < points.length; i++)
    {
        noiseArr[i] = new Array()
        for(j = 0; j < points[i].length; j++) {
          for (k = 0; k <= level; k++) {
            var val = Math.round(step * k * 10)/10
            if (val === maxVal) {
              if (revert) noiseArr[i][j] = maxVal;
              else noiseArr[i][j] = level;
              break
            } else if(points[i][j] < val) {
              if (revert) noiseArr[i][j] = (level + 1) - k;
              else noiseArr[i][j] = k;

              break
            }
          }
        }
    }
    return(noiseArr);
}
